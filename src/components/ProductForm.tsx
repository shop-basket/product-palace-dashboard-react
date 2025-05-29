
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Alert,
  Grid,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { Product, ProductCategory } from '@/types/product';
import { useProducts } from '@/contexts/ProductContext';
import { validateProductForm } from '@/utils/validation';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

interface FormData {
  name: string;
  price: string;
  category: ProductCategory | '';
  stockQuantity: string;
  description: string;
  imageUrl: string;
}

interface FormErrors {
  name?: string;
  price?: string;
  category?: string;
  stockQuantity?: string;
  description?: string;
  imageUrl?: string;
}

const categories: ProductCategory[] = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other'];

export const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
  const { addProduct, updateProduct } = useProducts();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: '',
    category: '',
    stockQuantity: '',
    description: '',
    imageUrl: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        stockQuantity: product.stockQuantity.toString(),
        description: product.description || '',
        imageUrl: product.imageUrl || '',
      });
    }
  }, [product]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateProductForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const productData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        category: formData.category as ProductCategory,
        stockQuantity: parseInt(formData.stockQuantity),
        description: formData.description.trim() || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
      };

      if (product) {
        updateProduct(product.id, productData);
      } else {
        addProduct(productData);
      }

      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        stockQuantity: product.stockQuantity.toString(),
        description: product.description || '',
        imageUrl: product.imageUrl || '',
      });
    } else {
      setFormData({
        name: '',
        price: '',
        category: '',
        stockQuantity: '',
        description: '',
        imageUrl: '',
      });
    }
    setErrors({});
  };

  const descriptionLength = formData.description.length;
  const maxDescriptionLength = 200;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Product Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Price"
            type="number"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            error={!!errors.price}
            helperText={errors.price}
            inputProps={{ min: 0, step: 0.01 }}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.category} required>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              label="Category"
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
            {errors.category && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, mx: 1.75 }}>
                {errors.category}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Stock Quantity"
            type="number"
            value={formData.stockQuantity}
            onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
            error={!!errors.stockQuantity}
            helperText={errors.stockQuantity}
            inputProps={{ min: 0 }}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Image URL"
            value={formData.imageUrl}
            onChange={(e) => handleInputChange('imageUrl', e.target.value)}
            error={!!errors.imageUrl}
            helperText={errors.imageUrl}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={!!errors.description}
            helperText={
              errors.description || 
              `${descriptionLength}/${maxDescriptionLength} characters`
            }
          />
        </Grid>

        {Object.keys(errors).length > 0 && (
          <Grid item xs={12}>
            <Alert severity="error">
              Please fix the errors above before submitting.
            </Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              type="button"
              variant="outlined"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button
              type="button"
              variant="outlined"
              startIcon={<Cancel />}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
