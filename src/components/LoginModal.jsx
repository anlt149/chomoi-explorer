import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import styled from 'styled-components';
import { ModalOverlay, ModalContent, CloseButton, FlexRow, FlexCol, Typography, ChipButton } from './common';
import { supabase } from '../supabaseClient';

const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-primary);
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  outline: none;
  font-family: var(--font-base);

  &:focus {
    border-color: var(--primary-color);
  }
`;

const LoginModal = ({ onClose }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        alert(t('admin.error') + error.message);
      } else {
        // Successful login, onAuthStateChange in App.jsx will trigger automatically
        onClose();
      }
    } catch (err) {
      alert(t('admin.error') + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose} style={{ zIndex: 2000 }}>
      <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <FlexRow justify="space-between" align="center" margin="0 0 1.5rem 0">
          <Typography size="1.25rem" weight={700}>{t('auth.login')}</Typography>
          <CloseButton onClick={onClose} disabled={isLoading}>
            <X size={24} />
          </CloseButton>
        </FlexRow>

        <AuthForm onSubmit={handleLogin}>
          <FormGroup>
            <Label>{t('auth.email')}</Label>
            <Input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              disabled={isLoading}
            />
          </FormGroup>

          <FormGroup>
            <Label>{t('auth.password')}</Label>
            <Input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              disabled={isLoading}
            />
          </FormGroup>

          <FlexRow justify="flex-end" margin="1.5rem 0 0 0" gap="1rem">
            <ChipButton type="button" onClick={onClose} disabled={isLoading}>
              {t('auth.cancel')}
            </ChipButton>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? '...' : t('auth.signIn')}
            </button>
          </FlexRow>
        </AuthForm>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LoginModal;
