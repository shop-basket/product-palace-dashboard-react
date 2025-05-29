
import React from 'react';
import { ProductProvider } from '@/contexts/ProductContext';
import { Header } from '@/components/Header';
import { ProductFilters } from '@/components/ProductFilters';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductFormModal } from '@/components/ProductFormModal';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const ProductDashboard: React.FC = () => {
  return (
    <ErrorBoundary>
      <ProductProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8 space-y-6">
            <ProductFilters />
            <ProductGrid />
          </main>
          <ProductFormModal />
          <DeleteConfirmDialog />
          <Toaster />
        </div>
      </ProductProvider>
    </ErrorBoundary>
  );
};
