import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Missing Supabase configuration variables.");
  console.log("💡 Ensure you have SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env or .env.local file.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Uses Overpass API (OpenStreetMap) to find restaurants.
 * This is 100% free and requires no API keys.
 */
async function crawlRestaurants() {
  console.log("🚀 Starting crawl for restaurants in Cho Moi, An Giang (Using OpenStreetMap)...");

  // Overpass QL query: Find nodes/ways tagged 'amenity=restaurant' in Cho Moi, An Giang
  const query = `
    [out:json][timeout:25];
    area["name"="Chợ Mới"]->.searchArea;
    (
      node["amenity"="restaurant"](area.searchArea);
      way["amenity"="restaurant"](area.searchArea);
      node["amenity"="cafe"](area.searchArea);
      way["amenity"="cafe"](area.searchArea);
      node["amenity"="fast_food"](area.searchArea);
      way["amenity"="fast_food"](area.searchArea);
    );
    out body;
    >;
    out skel qt;
  `;

  const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(overpassUrl);
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

    // Upsert using 'name' as the unique identifier
    // Note: This assumes names are unique enough. In a real app, we might want to combine name + address.
    const { data, error } = await supabase
      .from('restaurants')
      .upsert(upsertData, { 
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
