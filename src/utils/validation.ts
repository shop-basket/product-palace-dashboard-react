
import { ProductFormData } from '@/types/product';

interface ValidationResult {
  isValid: boolean;
  errors: Partial<ProductFormData>;
}

export const validateProductForm = (data: ProductFormData): ValidationResult => {
  const errors: Partial<ProductFormData> = {};

  // Name validation
  if (!data.name.trim()) {
    errors.name = 'Product name is required';
  } else if (data.name.trim().length < 3) {
    errors.name = 'Product name must be at least 3 characters';
  } else if (data.name.trim().length > 50) {
    errors.name = 'Product name must not exceed 50 characters';
  }

  // Price validation
  if (!data.price.trim()) {
    errors.price = 'Price is required';
  } else {
    const price = parseFloat(data.price);
    if (isNaN(price) || price < 0) {
      errors.price = 'Price must be a positive number';
    } else if (!/^\d+(\.\d{1,2})?$/.test(data.price)) {
      errors.price = 'Price must have at most 2 decimal places';
    }
  }

  // Category validation
  if (!data.category) {
    errors.category = 'Category is required';
  }

  // Stock quantity validation
  if (!data.stockQuantity.trim()) {
    errors.stockQuantity = 'Stock quantity is required';
  } else {
    const stock = parseInt(data.stockQuantity);
    if (isNaN(stock) || stock < 0) {
      errors.stockQuantity = 'Stock quantity must be a non-negative integer';
    } else if (!Number.isInteger(stock)) {
      errors.stockQuantity = 'Stock quantity must be a whole number';
    }
  }

  // Description validation (optional)
  if (data.description && data.description.length > 200) {
    errors.description = 'Description must not exceed 200 characters';
  }

  // Image URL validation (optional)
  if (data.imageUrl && data.imageUrl.trim()) {
    try {
      new URL(data.imageUrl);
    } catch {
      errors.imageUrl = 'Please enter a valid URL';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validatePriceRange = (min: string, max: string): { isValid: boolean; error?: string } => {
  if (!min && !max) return { isValid: true };

  const minPrice = min ? parseFloat(min) : -Infinity;
  const maxPrice = max ? parseFloat(max) : Infinity;

  if (min && (isNaN(minPrice) || minPrice < 0)) {
    return { isValid: false, error: 'Minimum price must be a positive number' };
  }

  if (max && (isNaN(maxPrice) || maxPrice < 0)) {
    return { isValid: false, error: 'Maximum price must be a positive number' };
  }

  if (minPrice > maxPrice) {
    return { isValid: false, error: 'Minimum price cannot be greater than maximum price' };
  }

  return { isValid: true };
};
