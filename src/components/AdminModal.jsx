import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import styled from 'styled-components';
import { ModalOverlay, ModalContent, CloseButton, FlexRow, FlexCol, Typography, ChipButton } from './common';
import { supabase } from '../supabaseClient';

const AdminForm = styled.form`
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

const TextArea = styled.textarea`
  padding: 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  outline: none;
  resize: vertical;
  min-height: 80px;
  font-family: var(--font-base);

  &:focus {
    border-color: var(--primary-color);
  }
`;

const Select = styled.select`
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

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  color: var(--text-primary);
`;

const AdminModal = ({ onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    image_url: '',
    category: 'Tất cả',
    has_delivery: false,
    address: '',
    description: '',
    openTime: '06:00',
    closeTime: '22:00'
  });

  const categories = ['Bún/Phở', 'Ăn vặt', 'Cơm', 'Lẩu/Nướng'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Default Rating for new submissions
    const newRestaurant = {
      ...formData,
      rating: 0.0
    };

    try {
      const { data, error } = await supabase
        .from('restaurants')
        .insert([newRestaurant])
        .select();

      if (error) {
        alert(t('admin.error') + error.message);
      } else {
        alert(t('admin.success'));
        if (onSuccess) {
          // Pass the new data back so App.jsx can append it to the UI
          onSuccess(data[0] || newRestaurant);
        }
        onClose();
      }
    } catch (err) {
      alert(t('admin.error') + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose} style={{ zIndex: 2000 }}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <FlexRow justify="space-between" align="center" margin="0 0 1rem 0">
          <Typography size="1.25rem" weight={700}>{t('admin.addRestaurant')}</Typography>
          <CloseButton onClick={onClose} disabled={isSubmitting}>
            <X size={24} />
          </CloseButton>
        </FlexRow>

        <AdminForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label>{t('admin.name')}</Label>
            <Input required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Quán Sinh Viên" />
          </FormGroup>

          <FlexRow gap="1rem" fullWidth>
            <FormGroup style={{ flex: 1 }}>
              <Label>{t('admin.phone')}</Label>
              <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. 0912345678" />
            </FormGroup>
            <FormGroup style={{ flex: 1 }}>
              <Label>{t('admin.category')}</Label>
              <Select name="category" value={formData.category} onChange={handleChange}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </FormGroup>
          </FlexRow>

          <FormGroup>
            <Label>{t('admin.imageUrl')}</Label>
            <Input name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://..." />
          </FormGroup>

          <FormGroup>
            <Label>{t('admin.address')}</Label>
            <Input required name="address" value={formData.address} onChange={handleChange} />
          </FormGroup>

          <FlexRow gap="1rem" fullWidth>
            <FormGroup style={{ flex: 1 }}>
              <Label>{t('admin.openTime')}</Label>
              <Input type="time" name="openTime" value={formData.openTime} onChange={handleChange} />
            </FormGroup>
            <FormGroup style={{ flex: 1 }}>
              <Label>{t('admin.closeTime')}</Label>
              <Input type="time" name="closeTime" value={formData.closeTime} onChange={handleChange} />
            </FormGroup>
          </FlexRow>

          <FormGroup>
            <Label>{t('admin.description')}</Label>
            <TextArea name="description" value={formData.description} onChange={handleChange} />
          </FormGroup>

          <FormGroup style={{ marginTop: '0.5rem' }}>
            <CheckboxLabel>
              <Input type="checkbox" name="has_delivery" checked={formData.has_delivery} onChange={handleChange} style={{ width: 'auto' }} />
              {t('admin.hasDelivery')}
            </CheckboxLabel>
          </FormGroup>

          <FlexRow justify="flex-end" margin="1rem 0 0 0" gap="1rem">
            <ChipButton type="button" onClick={onClose} disabled={isSubmitting}>
              {t('admin.cancel')}
            </ChipButton>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isSubmitting}
              style={{ opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? '...' : t('admin.submit')}
            </button>
          </FlexRow>
        </AdminForm>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AdminModal;
