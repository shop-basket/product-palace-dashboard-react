
import { ProductCategory } from '@/types/product';

export interface ProductFormData {
  name: string;
  price: string;
  category: ProductCategory | '';
  stockQuantity: string;
  description: string;
  imageUrl: string;
}

export interface FormErrors {
  name?: string;
  price?: string;
  category?: string;
  stockQuantity?: string;
  description?: string;
  imageUrl?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormErrors;
}

export const validateProductForm = (data: ProductFormData): ValidationResult => {
  const errors: FormErrors = {};

  // Name validation
  if (!data.name.trim()) {
    errors.name = 'Product name is required';
  } else if (data.name.trim().length < 3) {
    errors.name = 'Product name must be at least 3 characters';
  } else if (data.name.trim().length > 50) {
    errors.name = 'Product name must not exceed 50 characters';
  }

  // Price validation
  if (!data.price) {
    errors.price = 'Price is required';
  } else {
    const price = parseFloat(data.price);
    if (isNaN(price) || price <= 0) {
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
  if (!data.stockQuantity) {
    errors.stockQuantity = 'Stock quantity is required';
  } else {
    const quantity = parseInt(data.stockQuantity);
    if (isNaN(quantity) || quantity < 0) {
      errors.stockQuantity = 'Stock quantity must be a non-negative integer';
    }
  }

  // Description validation (optional but with length limit)
  if (data.description && data.description.length > 200) {
    errors.description = 'Description must not exceed 200 characters';
  }

  // Image URL validation (optional but must be valid URL if provided)
  if (data.imageUrl && data.imageUrl.trim()) {
    try {
      new URL(data.imageUrl.trim());
    } catch {
      errors.imageUrl = 'Please enter a valid URL';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export interface PriceRangeValidationResult {
  isValid: boolean;
  error?: string;
}

export const validatePriceRange = (minPrice: string, maxPrice: string): PriceRangeValidationResult => {
  // If both are empty, validation passes
  if (!minPrice && !maxPrice) {
    return { isValid: true };
  }

  // Validate min price
  if (minPrice) {
    const min = parseFloat(minPrice);
    if (isNaN(min) || min < 0) {
      return { isValid: false, error: 'Minimum price must be a positive number' };
    }
  }

  // Validate max price
  if (maxPrice) {
    const max = parseFloat(maxPrice);
    if (isNaN(max) || max < 0) {
      return { isValid: false, error: 'Maximum price must be a positive number' };
    }
  }

  // Check if min is greater than max
  if (minPrice && maxPrice) {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (min > max) {
      return { isValid: false, error: 'Minimum price cannot be greater than maximum price' };
    }
  }

  return { isValid: true };
};
