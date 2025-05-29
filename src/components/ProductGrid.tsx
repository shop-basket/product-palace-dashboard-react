
import React from 'react';
import { ProductCard } from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ProductGridSkeleton';
import { EmptyState } from '@/components/EmptyState';
import { useProducts } from '@/contexts/ProductContext';

export const ProductGrid: React.FC = () => {
  const { state } = useProducts();

  if (state.loading) {
    return <ProductGridSkeleton />;
  }

  if (state.products.length === 0) {
    return <EmptyState type="no-products" />;
  }

  if (state.filteredProducts.length === 0) {
    return <EmptyState type="no-results" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {state.filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
