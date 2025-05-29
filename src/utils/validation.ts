
import { ProductCategory } from '@/types/product';

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

export const validateProductForm = (data: FormData): FormErrors => {
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

  return errors;
};
