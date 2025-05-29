
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';

interface EmptyStateProps {
  type: 'no-products' | 'no-results';
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  const { openFormModal, clearFilters } = useProducts();

  if (type === 'no-products') {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Plus className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No products yet
        </h3>
        <p className="text-gray-600 mb-6">
          Get started by adding your first product to the catalog.
        </p>
        <Button onClick={() => openFormModal()} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Product
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <Search className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No products found
      </h3>
      <p className="text-gray-600 mb-6">
        Try adjusting your search terms or filters to find what you're looking for.
      </p>
      <Button onClick={clearFilters} variant="outline">
        Clear Filters
      </Button>
    </div>
  );
};
