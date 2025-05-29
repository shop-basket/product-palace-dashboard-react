
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProductForm } from '@/components/ProductForm';
import { useProducts } from '@/contexts/ProductContext';

export const ProductFormModal: React.FC = () => {
  const { state, closeFormModal } = useProducts();

  return (
    <Dialog open={state.isFormModalOpen} onOpenChange={closeFormModal}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {state.editingProduct ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
        </DialogHeader>
        <ProductForm
          product={state.editingProduct}
          onClose={closeFormModal}
        />
      </DialogContent>
    </Dialog>
  );
};
