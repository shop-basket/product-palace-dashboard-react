
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Product, ProductCategory, ProductFormData } from '@/types/product';
import { useProducts } from '@/contexts/ProductContext';
import { validateProductForm } from '@/utils/validation';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

const categories: ProductCategory[] = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other'];

const initialFormData: ProductFormData = {
  name: '',
  price: '',
  category: 'Electronics',
  stockQuantity: '',
  description: '',
  imageUrl: '',
};

export const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
  const { addProduct, updateProduct } = useProducts();
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<ProductFormData>>({});
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
    } else {
      setFormData(initialFormData);
    }
  }, [product]);

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validation = validateProductForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const productData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        stockQuantity: parseInt(formData.stockQuantity),
        description: formData.description.trim() || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
      };

      if (product) {
        updateProduct({ ...product, ...productData });
      } else {
        addProduct(productData);
      }

      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(product ? {
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stockQuantity: product.stockQuantity.toString(),
      description: product.description || '',
      imageUrl: product.imageUrl || '',
    } : initialFormData);
    setErrors({});
  };

  const remainingChars = 200 - formData.description.length;

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter product name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="0.00"
              className={errors.price ? 'border-red-500' : ''}
            />
            {errors.price && (
              <p className="text-sm text-red-600 mt-1">{errors.price}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value: ProductCategory) => handleInputChange('category', value)}
            >
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-600 mt-1">{errors.category}</p>
            )}
          </div>

          {/* Stock Quantity */}
          <div>
            <Label htmlFor="stockQuantity">Stock Quantity *</Label>
            <Input
              id="stockQuantity"
              type="number"
              min="0"
              value={formData.stockQuantity}
              onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
              placeholder="0"
              className={errors.stockQuantity ? 'border-red-500' : ''}
            />
            {errors.stockQuantity && (
              <p className="text-sm text-red-600 mt-1">{errors.stockQuantity}</p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={errors.imageUrl ? 'border-red-500' : ''}
            />
            {errors.imageUrl && (
              <p className="text-sm text-red-600 mt-1">{errors.imageUrl}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter product description (optional)"
              maxLength={200}
              rows={3}
              className={errors.description ? 'border-red-500' : ''}
            />
            <div className="flex justify-between mt-1">
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
              <p className={`text-sm ml-auto ${remainingChars < 20 ? 'text-orange-600' : 'text-gray-500'}`}>
                {remainingChars} characters remaining
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
