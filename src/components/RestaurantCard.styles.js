import styled from 'styled-components';
import { FlexRow } from './common';

export const ImageContainer = styled.div`
  height: 140px;
  overflow: hidden;
  position: relative;
`;

export const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const RatingBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(0,0,0,0.6);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  backdrop-filter: blur(4px);
  font-size: 0.875rem;
  font-weight: 600;
`;

export const DeliveryStatus = styled(FlexRow)`
  color: ${props => props.available ? 'var(--success-color)' : 'var(--text-muted)'};
  font-size: 0.875rem;
`;
