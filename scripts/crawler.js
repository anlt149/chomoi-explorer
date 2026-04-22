import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Missing Supabase configuration variables.");
  console.error(`- SUPABASE_URL is ${SUPABASE_URL ? 'set' : 'MISSING'}`);
  console.error(`- SUPABASE_SERVICE_ROLE_KEY is ${SUPABASE_SERVICE_KEY ? 'set' : 'MISSING'}`);
  console.log("💡 Ensure you have named them exactly SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your GitHub Secrets (Settings > Secrets and variables > Actions > Repository secrets).");
  console.log("⚠️ If you added them as 'Variables' instead of 'Secrets', they won't be picked up by the secrets. namespace in the workflow.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Uses Overpass API (OpenStreetMap) to find restaurants.
 * This is 100% free and requires no API keys.
 */
async function crawlRestaurants() {
  console.log("🚀 Starting crawl for restaurants in Cho Moi, An Giang (Using OpenStreetMap)...");

  // Overpass QL query: Find nodes within 20km of Chợ Mới center (10.4633, 105.4628)
  const query = `
    [out:json][timeout:50];
    (
      node["amenity"~"restaurant|cafe|fast_food|food_court"](around:20000, 10.4633, 105.4628);
      way["amenity"~"restaurant|cafe|fast_food|food_court"](around:20000, 10.4633, 105.4628);
    );
    out body;
    >;
    out skel qt;
  `;

  const overpassUrl = `https://overpass-api.de/api/interpreter`;

  console.log(`Sending request to Overpass API...`);

  try {
    const response = await axios.post(overpassUrl, `data=${encodeURIComponent(query)}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'ChoMoiExplorerCrawler/1.0 (Automated sync script)'
      }
    });
    const elements = response.data.elements.filter(el => el.tags && el.tags.name);

    console.log(`📡 Found ${elements.length} results from OpenStreetMap.`);

    const upsertData = elements.map(el => {
      const tags = el.tags;
      return {
        name: tags.name,
        address: tags["addr:full"] || tags["addr:street"] || "Chợ Mới, An Giang",
        rating: 4.0, // Default rating for new entries
        category: tags.amenity === 'cafe' ? 'Cafe' :
          tags.amenity === 'fast_food' ? 'Thức ăn nhanh' :
            'Quán ăn',
        is_active: true,
        description: tags.description || `Quán ăn tại khu vực Chợ Mới.`
      };
    });

    // Deduplicate by name to prevent Postgres "cannot affect row a second time" error
    const uniqueUpsertData = [];
    const seenNames = new Set();
    upsertData.forEach(item => {
      if (!seenNames.has(item.name)) {
        seenNames.add(item.name);
        uniqueUpsertData.push(item);
      }
    });

    console.log(`🧹 Deduplicated to ${uniqueUpsertData.length} unique restaurants.`);

    // Upsert using 'name' as the unique identifier
    // Note: This assumes names are unique enough. In a real app, we might want to combine name + address.
    const { data, error } = await supabase
      .from('restaurants')
      .upsert(uniqueUpsertData, {
        onConflict: 'name', // Using Name as the match key
        ignoreDuplicates: false
      });

    if (error) {
      // If 'name' doesn't have a unique constraint, upsert might still insert duplicates.
      // We are proceeding with the user's "no extra columns" request.
      console.error("❌ Error during upsert:", error.message);
      if (error.message.includes("column \"name\" does not have a unique constraint")) {
        console.warn("⚠️ Warning: To prevent duplicates, you should add a UNIQUE constraint to the 'name' column in Supabase.");
      }
    } else {
      console.log(`✅ Successfully synced ${upsertData.length} restaurants to Supabase.`);
    }

  } catch (error) {
    console.error("❌ Error during crawl:", error.message);
  }
}

crawlRestaurants();
