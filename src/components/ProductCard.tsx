
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Product } from '@/types/product';
import { useProducts } from '@/contexts/ProductContext';
import { formatCurrency } from '@/utils/currency';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({ product }) => {
  const { state, openFormModal, openDeleteDialog, toggleProductSelection } = useProducts();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const isSelected = state.selectedProducts.includes(product.id);
  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity < 5;

  const getStockBadge = () => {
    if (isOutOfStock) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (isLowStock) {
      return <Badge variant="secondary">Low Stock ({product.stockQuantity})</Badge>;
    }
    return <Badge variant="default" className="bg-green-100 text-green-800">In Stock ({product.stockQuantity})</Badge>;
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className={`group transition-all duration-200 hover:shadow-lg ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => toggleProductSelection(product.id)}
            className="mt-1"
          />
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openFormModal(product)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openDeleteDialog(product)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden relative">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          {!imageError && product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-gray-400 text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
                  📦
                </div>
                <p className="text-sm">No Image</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-gray-900">
            {truncateText(product.name, 30)}
          </h3>
          
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(product.price)}
            </p>
            {getStockBadge()}
          </div>

          <p className="text-sm text-gray-600">
            Category: {product.category}
          </p>

          {product.description && (
            <p className="text-sm text-gray-600">
              {truncateText(product.description, 80)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';
