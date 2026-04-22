import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Calendar } from 'lucide-react';
import {
  ListSection,
  FlexCol,
  FlexRow,
  Typography,
  LoadingSpinner,
  GlassCard
} from './common';

const RSS_URLS = [
  'https://news.google.com/rss/search?q=Ch%E1%BB%A3+M%E1%BB%9Bi+An+Giang&hl=vi&gl=VN&ceid=VN:vi',
  'https://news.google.com/rss/search?q=An+Giang+site:vnexpress.net&hl=vi&gl=VN&ceid=VN:vi',
  'https://news.google.com/rss/search?q=An+Giang+site:tinhte.vn&hl=vi&gl=VN&ceid=VN:vi',
  'https://news.google.com/rss/search?q=An+Giang+site:tuoitre.vn&hl=vi&gl=VN&ceid=VN:vi'
];

export default function NewsTab({ onScroll, scrollRef, isHeaderCollapsed }) {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const fetchPromises = RSS_URLS.map(async (rss) => {
          try {
            const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rss)}`;
            const res = await fetch(API_URL);
            const data = await res.json();
            return data.status === 'ok' ? data.items : [];
          } catch (err) {
            console.error('Fetch error for', rss, err);
            return [];
          }
        });

        const results = await Promise.all(fetchPromises);
        const combined = results.flat();

        // Dedup by link
        const uniqueNews = [];
        const seenLinks = new Set();
        for (const item of combined) {
          if (!seenLinks.has(item.link)) {
            seenLinks.add(item.link);
            uniqueNews.push(item);
          }
        }

        // Sort by publication date
        uniqueNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        
        setNews(uniqueNews);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const stripHtml = (html) => {
    if (!html) return '';
    try {
      const tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    } catch {
      return html.replace(/<[^>]+>/g, '');
    }
  };

  const getSource = (title, description) => {
    // Attempt to extract source from title (e.g., "... - VietnamBiz")
    const parts = title.split(' - ');
    if (parts.length > 1) {
      return parts.pop();
    }
    return '';
  };

  const cleanTitle = (title) => {
    const parts = title.split(' - ');
    if (parts.length > 1) {
      parts.pop();
      return parts.join(' - ');
    }
    return title;
  };

  return (
    <ListSection mobileHidden={false} style={{ maxWidth: '100%', minWidth: '100%', borderRight: 'none' }}>
      <FlexCol padding="1rem" style={{ 
        borderBottom: '1px solid var(--border-color)', 
        backgroundColor: 'var(--bg-secondary)', 
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.3s ease',
        marginTop: isHeaderCollapsed ? '-100px' : '0',
        opacity: isHeaderCollapsed ? 0 : 1,
        pointerEvents: isHeaderCollapsed ? 'none' : 'auto'
      }}>
        <Typography size="1.25rem" weight={700}>Tin tức Chợ Mới, An Giang</Typography>
        <Typography size="0.875rem" color="text-muted" margin="0.5rem 0 0 0">
          Cập nhật tin tức mới nhất từ Google News
        </Typography>
      </FlexCol>

      <div 
        ref={scrollRef}
        onScroll={onScroll}
        style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', scrollBehavior: 'smooth' }}
      >
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0', gap: '1rem' }}>
            <LoadingSpinner />
            <Typography color="text-muted" weight={600}>Đang tải tin tức...</Typography>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            <Typography color="error">Đã xảy ra lỗi: {error}</Typography>
          </div>
        ) : news.length > 0 ? (
          news.map((item, idx) => {
            const rawDescText = stripHtml(item.description);
            // Since Google News description usually just repeats the title inside an <a> and adds the source, we refine it.
            // But sometimes it has actual snippets. Let's just display it truncated safely to give it more body.
            const snippet = rawDescText.length > 80 ? rawDescText.substring(0, 80) + '...' : rawDescText;
            const source = getSource(item.title, item.description);
            const title = cleanTitle(item.title);

            return (
            <GlassCard key={idx} clickable onClick={() => window.open(item.link, '_blank', 'noopener,noreferrer')} style={{ flexShrink: 0, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'stretch' }}>
              <Typography weight={700} size="1.1rem" style={{ lineHeight: '1.4' }}>
                {title}
              </Typography>
              
              <Typography size="0.9rem" color="text-secondary" style={{ lineHeight: '1.5' }}>
                {snippet}
              </Typography>

              <FlexRow justify="space-between" align="center" margin="0.5rem 0 0 0">
                <FlexRow gap="0.5rem" style={{ color: 'var(--text-muted)' }}>
                  <Calendar size={14} />
                  <Typography size="0.8rem" color="text-muted">{formatDate(item.pubDate)} {source ? `• ${source}` : ''}</Typography>
                </FlexRow>

                <FlexRow gap="0.5rem">
                  <ExternalLink size={14} color="var(--primary-color)" />
                  <Typography size="0.85rem" color="primary-color" weight={600}>Xem</Typography>
                </FlexRow>
              </FlexRow>
            </GlassCard>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            <Typography>Không có tin tức nào mới.</Typography>
          </div>
        )}
      </div>
    </ListSection>
  );
}
