import styled, { keyframes, css } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const slideIn = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: var(--bg-primary);
`;

export const MainContent = styled.main`
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
  
  /* Mobile First Structure */
  flex-direction: column;

  /* Desktop View */
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

export const ListSection = styled.section`
  flex: 1;
  display: ${props => props.mobileHidden ? 'none' : 'flex'};
  flex-direction: column;
  background-color: var(--bg-primary);
  width: 100%;
  overflow: hidden;
  min-height: 0;
  
  @media (min-width: 768px) {
    display: flex; /* Always visible on desktop */
    max-width: 450px;
    min-width: 350px;
    border-right: 1px solid var(--border-color);
    z-index: 10;
  }
`;

export const MapSection = styled.section`
  flex: 1;
  position: relative;
  display: ${props => props.mobileHidden ? 'none' : 'block'};
  background-color: #e5e7eb;
  
  @media (min-width: 768px) {
    display: block; /* Always visible on desktop */
    flex: 2;
  }
`;

export const FlexRow = styled.div`
  display: flex;
  align-items: ${props => props.align || 'center'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => props.gap || '0.5rem'};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  margin: ${props => props.margin || '0'};
  padding: ${props => props.padding || '0'};
`;

export const FlexCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.align || 'flex-start'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => props.gap || '0'};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  margin: ${props => props.margin || '0'};
  padding: ${props => props.padding || '0'};
  flex: ${props => props.flex || 'none'};
`;

export const Typography = styled.p`
  margin: ${props => props.margin || '0'};
  font-size: ${props => props.size || '1rem'};
  color: ${props => props.color ? `var(--${props.color})` : 'var(--text-primary)'};
  font-weight: ${props => props.weight || 400};
  white-space: ${props => props.noWrap ? 'nowrap' : 'normal'};
  overflow: ${props => props.ellipsis ? 'hidden' : 'visible'};
  text-overflow: ${props => props.ellipsis ? 'ellipsis' : 'clip'};
  text-align: ${props => props.align || 'left'};
`;

export const GlassCard = styled.div`
  background: rgba(var(--bg-secondary), 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-bottom: ${props => props.marginBottom || '0'};
  
  &:hover {
    ${props => props.clickable && `
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    `}
  }
`;

export const HeaderContainer = styled.header`
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--bg-secondary);
  z-index: 50;
`;

export const SearchBarWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-full);
  padding: 0.5rem 1rem;
`;

export const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  color: var(--text-primary);
  width: 100%;
  font-size: 1rem;
`;

export const FilterScroll = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ChipButton = styled.button`
  white-space: nowrap;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border-radius: var(--radius-full);
  border: 1px solid;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  
  background-color: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-primary)'};
  border-color: ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};

  &:hover {
    background-color: ${props => props.active ? 'var(--primary-hover)' : 'var(--bg-tertiary)'};
  }
`;

export const CallButton = styled.a`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: var(--primary-color);
  color: white;
  padding: ${props => props.padding || '0.4rem 0.8rem'};
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;

  &:hover {
    background-color: var(--primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  position: relative;
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: var(--radius-md);
  
  &:hover {
    color: var(--text-primary);
    background-color: var(--bg-tertiary);
  }
`;

export const LoadingSpinner = styled.div`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border: 3px solid var(--bg-tertiary);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin: ${props => props.margin || '0 auto'};
`;

export const ToastContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: none;
`;

export const ToastItem = styled.div`
  background: ${props => props.type === 'error' ? '#ef4444' : props.type === 'warn' ? '#f59e0b' : 'var(--bg-secondary)'};
  color: ${props => props.type ? 'white' : 'var(--text-primary)'};
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  animation: ${slideIn} 0.3s ease-out;
  pointer-events: auto;
  min-width: 250px;
  justify-content: center;
`;

export const TabContainer = styled.div`
  display: flex;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  width: 100%;
`;

export const TabItem = styled.button`
  flex: 1;
  padding: 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: ${props => props.active ? '700' : '500'};
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-muted)'};
  border-bottom: 2px solid ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--primary-color);
    background-color: var(--bg-tertiary);
  }
`;
