import { useState } from 'react';
import { Star, CheckCircle, XCircle, PhoneCall } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FlexRow, FlexCol, Typography, GlassCard, CallButton } from './common';
import { ImageContainer, CardImage, RatingBadge, DeliveryStatus } from './RestaurantCard.styles';

const RestaurantCard = ({ restaurant, onClickDetails }) => {
  const { t } = useTranslation()
  const defaultPlaceholder = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80&blur=50'
  
  // Free Generic Image Proxy CDN (Weserv) to optimize raw links to lower size & Webp format
  const optimizeImageUrl = (url) => {
    if (!url || url.includes('link-hinh-anh-bi-loi')) return defaultPlaceholder;
    if (url.includes('images.weserv.nl')) return url;
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=400&q=80&output=webp`;
  }

  const [imgSrc, setImgSrc] = useState(optimizeImageUrl(restaurant.image_url));

  const handleError = () => {
    // Elegant fallback placeholder food image if original link is broken
    setImgSrc(defaultPlaceholder); 
  };

  return (
    <GlassCard clickable marginBottom="1rem" onClick={() => onClickDetails && onClickDetails(restaurant)}>
      <ImageContainer>
        <CardImage src={imgSrc} alt={restaurant.name} onError={handleError} />
        <RatingBadge>
          <Star size={14} fill="#fbbf24" color="#fbbf24" />
          {restaurant.rating}
        </RatingBadge>
      </ImageContainer>
      
      <FlexCol padding="1rem" gap="0.5rem" fullWidth>
        <Typography size="1.1rem" weight={600} color="text-primary">
          {restaurant.name}
        </Typography>
        
        <Typography size="0.875rem" color="text-secondary" noWrap ellipsis fullWidth style={{ width: '100%' }}>
          {restaurant.address}
        </Typography>

        <FlexRow justify="space-between" align="center" fullWidth margin="0.5rem 0 0 0">
          <DeliveryStatus available={restaurant.has_delivery}>
            {restaurant.has_delivery ? (
              <><CheckCircle size={14} /> {t('card.delivery')}</>
            ) : (
              <><XCircle size={14} /> {t('card.eatIn')}</>
            )}
          </DeliveryStatus>
          
          <FlexRow gap="0.5rem">
            <CallButton 
              href={`tel:${restaurant.phone}`} 
              onClick={(e) => e.stopPropagation()}
            >
              <PhoneCall size={14} /> {t('card.call')}
            </CallButton>
          </FlexRow>
        </FlexRow>
      </FlexCol>
    </GlassCard>
  );
};

export default RestaurantCard;
