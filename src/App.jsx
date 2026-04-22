import { useState, useMemo, useEffect } from 'react'
import { Search, X, Globe, Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  AppContainer, MainContent, ListSection,
  HeaderContainer, FlexRow, Typography, SearchBarWrapper,
  SearchInput, FilterScroll, ChipButton, FlexCol,
  ModalOverlay, ModalContent, CloseButton,
  LoadingSpinner, ToastContainer, ToastItem,
  TabContainer, TabItem
} from './components/common'
import RestaurantCard from './components/RestaurantCard'
import AdminModal from './components/AdminModal'
import LoginModal from './components/LoginModal'
import NewsTab from './components/NewsTab'
import { supabase } from './supabaseClient'

function App() {
  const { t, i18n } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('Tất cả')
  const [activeTab, setActiveTab] = useState('explorer')
  const [detailedRestaurant, setDetailedRestaurant] = useState(null) // Modal detail state
  const [isAdminOpen, setIsAdminOpen] = useState(false) // Admin modal state
  const [isLoginOpen, setIsLoginOpen] = useState(false) // Login modal state
  const [isMenuOpen, setIsMenuOpen] = useState(false) // Mobile Menu Toggle

  const [restaurantsDataset, setRestaurantsDataset] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [userSession, setUserSession] = useState(null)
  const [toasts, setToasts] = useState([])

  const categories = ['Tất cả', 'Có giao hàng', 'Bún/Phở', 'Ăn vặt', 'Cơm', 'Lẩu/Nướng']

  // Helper to show toast notifications
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Toggle Language Handler
  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('en') ? 'vi' : 'en'
    i18n.changeLanguage(nextLang)
  }

  // Fetch Supabase Backend Data on Mount
  useEffect(() => {
    async function fetchFromSupabase() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('id, name, image_url, category, has_delivery, rating, address, description, openTime, closeTime, is_active')
          .eq('is_active', true);

        if (error || !data || data.length === 0) {
          console.warn('Connection error or empty table.', error);
          showToast(t('list.noResults'), 'warn');
          setRestaurantsDataset([]);
        } else {
          setRestaurantsDataset(data);
        }
      } catch (err) {
        showToast('System Error: ' + err.message, 'error');
        setRestaurantsDataset([]);
      } finally {
        setIsLoading(false);
      }
    }

    // Check initial user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserSession(session);
    });

    // Listen to changes in auth state
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUserSession(session);
      }
    );

    fetchFromSupabase();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Filter restaurants
  const filteredRestaurants = useMemo(() => {
    return restaurantsDataset.filter(rest => {
      const matchSearch = rest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rest.category.toLowerCase().includes(searchQuery.toLowerCase());

      let matchFilter = true;
      if (activeFilter === 'Có giao hàng') {
        matchFilter = rest.has_delivery;
      } else if (activeFilter !== 'Tất cả') {
        matchFilter = rest.category === activeFilter;
      }

      return matchSearch && matchFilter;
    });
  }, [searchQuery, activeFilter, restaurantsDataset]);

  const handleOpenDetails = (rest) => {
    setDetailedRestaurant(rest);
  }

  return (
    <AppContainer>
      {/* Header */}
      <HeaderContainer style={{ justifyContent: 'space-between', padding: '1rem' }}>
        <FlexRow gap="0.5rem">
          <Typography size="1.25rem" weight={700}>{t('header.title')}</Typography>
        </FlexRow>

        {/* Actions Group (Menu Button) */}
        <FlexRow gap="0.5rem" className="view-toggle" style={{ position: 'relative' }}>
          <ChipButton 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ padding: '0.4rem 0.6rem', border: 'none', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span style={{ fontSize: '1.1rem' }}>{i18n.language.startsWith('en') ? '🇺🇸' : '🇻🇳'}</span>
            <Menu size={20} color="var(--text-primary)" />
          </ChipButton>

          {/* Combined Dropdown Menu */}
          {isMenuOpen && (
            <div style={{ position: 'absolute', top: '120%', right: '0', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', minWidth: '180px', zIndex: 100, overflow: 'hidden' }}>
              {/* Language Toggle Item */}
              <button 
                onClick={() => { toggleLanguage(); setIsMenuOpen(false); }}
                style={{ padding: '0.75rem 1rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', textAlign: 'left', cursor: 'pointer', color: 'var(--text-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem' }}
              >
                <Globe size={18} />
                {i18n.language.startsWith('en') ? 'Tiếng Việt' : 'English'}
              </button>

              {userSession ? (
                <>
                  <button
                    onClick={() => { setIsAdminOpen(true); setIsMenuOpen(false); }}
                    style={{ padding: '0.75rem 1rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', textAlign: 'left', cursor: 'pointer', color: 'var(--primary-color)', fontWeight: 600 }}
                  >
                    + {t('admin.title')}
                  </button>
                  <button
                    onClick={() => { supabase.auth.signOut(); setIsMenuOpen(false); }}
                    style={{ padding: '0.75rem 1rem', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--text-primary)', fontWeight: 500 }}
                  >
                    {t('auth.logout')}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setIsLoginOpen(true); setIsMenuOpen(false); }}
                  style={{ padding: '0.75rem 1rem', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--text-primary)', fontWeight: 600 }}
                >
                  {t('auth.login')}
                </button>
              )}
            </div>
          )}
        </FlexRow>
      </HeaderContainer>

      {/* Navigation Tabs */}
      <TabContainer>
        <TabItem active={activeTab === 'explorer'} onClick={() => setActiveTab('explorer')}>
          Khám phá
        </TabItem>
        <TabItem active={activeTab === 'news'} onClick={() => setActiveTab('news')}>
          Tin tức
        </TabItem>
      </TabContainer>

      {/* Main Content Area */}
      <MainContent>
        {activeTab === 'explorer' ? (
          <ListSection mobileHidden={false} style={{ maxWidth: '100%', borderRight: 'none', minWidth: '100%' }}>
          <FlexCol padding="1rem" style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', boxShadow: 'var(--shadow-sm)' }}>
            <SearchBarWrapper style={{ width: '100%', boxSizing: 'border-box' }}>
              <Search size={20} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
              <SearchInput
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchBarWrapper>

            <FilterScroll style={{ width: '100%' }}>
              {categories.map(cat => (
                <ChipButton
                  key={cat}
                  active={activeFilter === cat}
                  onClick={() => setActiveFilter(cat)}
                >
                  {t(`categories.${cat}`)}
                </ChipButton>
              ))}
            </FilterScroll>

            <Typography size="0.875rem" color="text-muted" margin="1rem 0 0 0">
              {t('list.showingResults', { count: filteredRestaurants.length })}
            </Typography>
          </FlexCol>

          {/* List Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0', gap: '1rem' }}>
                <LoadingSpinner />
                <Typography color="text-muted" weight={600}>{t('list.connecting')}</Typography>
              </div>
            ) : filteredRestaurants.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {filteredRestaurants.map(rest => (
                  <RestaurantCard
                    key={rest.id}
                    restaurant={rest}
                    onClickDetails={handleOpenDetails}
                  />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <p>{t('list.noResults')}</p>
              </div>
            )}
          </div>
        </ListSection>
        ) : (
          <NewsTab />
        )}
      </MainContent>

      {/* Detail Modal */}
      {detailedRestaurant && (
        <ModalOverlay onClick={() => setDetailedRestaurant(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <FlexRow justify="space-between" align="center" margin="0 0 1rem 0">
              <Typography size="1.25rem" weight={700}>{t('modal.details')}</Typography>
              <CloseButton onClick={() => setDetailedRestaurant(null)}>
                <X size={24} />
              </CloseButton>
            </FlexRow>

            <img
              src={detailedRestaurant.image_url}
              alt={detailedRestaurant.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}
              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80&blur=50' }}
            />

            <Typography size="1.5rem" weight={700} margin="0 0 0.5rem 0">{detailedRestaurant.name}</Typography>
            <Typography color="text-secondary" margin="0 0 1rem 0">{detailedRestaurant.address}</Typography>

            <FlexCol gap="0.5rem" margin="0 0 1rem 0">
              <Typography size="1rem">
                <span style={{ fontWeight: 600 }}>{t('modal.openTime')}</span> {detailedRestaurant.openTime} - {detailedRestaurant.closeTime}
              </Typography>
              <Typography size="1rem">
                <span style={{ fontWeight: 600 }}>{t('modal.phone')}</span> {detailedRestaurant.phone}
              </Typography>
            </FlexCol>

            <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
              <Typography weight={600} margin="0 0 0.5rem 0">{t('modal.description')}</Typography>
              <Typography>{detailedRestaurant.description}</Typography>
            </div>

            <FlexRow justify="flex-end" margin="1.5rem 0 0 0">
              <a
                href={`tel:${detailedRestaurant.phone}`}
                className="btn-primary"
                style={{ textDecoration: 'none' }}
              >
                {t('modal.buyNow')}
              </a>
            </FlexRow>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Admin Interface Modal */}
      {isAdminOpen && userSession && (
        <AdminModal
          onClose={() => setIsAdminOpen(false)}
          onSuccess={(newRest) => {
            setRestaurantsDataset(prev => [newRest, ...prev]);
          }}
        />
      )}

      {/* Login Modal */}
      {isLoginOpen && !userSession && (
        <LoginModal onClose={() => setIsLoginOpen(false)} />
      )}

      {/* Global Toast Notifications */}
      <ToastContainer>
        {toasts.map(toast => (
          <ToastItem key={toast.id} type={toast.type}>
            {toast.message}
          </ToastItem>
        ))}
      </ToastContainer>
    </AppContainer>
  )
}

export default App
