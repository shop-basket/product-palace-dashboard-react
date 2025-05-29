
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Package } from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';

export const Header: React.FC = () => {
  const { state, openFormModal, deleteSelectedProducts, clearSelection } = useProducts();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Dashboard</h1>
              <p className="text-sm text-gray-600">
                {state.filteredProducts.length} of {state.products.length} products
                {state.selectedProducts.length > 0 && (
                  <span className="ml-2 text-blue-600">
                    ({state.selectedProducts.length} selected)
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {state.selectedProducts.length > 0 && (
              <>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={deleteSelectedProducts}
                >
                  Delete Selected ({state.selectedProducts.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSelection}
                >
                  Clear Selection
                </Button>
              </>
            )}
            <Button
              onClick={() => openFormModal()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
