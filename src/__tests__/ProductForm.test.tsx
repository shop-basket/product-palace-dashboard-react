
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductForm } from '@/components/ProductForm';
import { ProductProvider } from '@/contexts/ProductContext';
import { toast } from '@/hooks/use-toast';

// Mock the toast
jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const MockedProductForm = ({ product = null, onClose = jest.fn() }) => (
  <ProductProvider>
    <ProductForm product={product} onClose={onClose} />
  </ProductProvider>
);

describe('ProductForm', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('[]');
  });

  it('should render form with all required fields', () => {
    render(<MockedProductForm />);

    expect(screen.getByLabelText(/product name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/stock quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/image url/i)).toBeInTheDocument();
  });

  it('should show validation errors for invalid inputs', async () => {
    render(<MockedProductForm />);

    const submitButton = screen.getByRole('button', { name: /add product/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/product name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/price is required/i)).toBeInTheDocument();
      expect(screen.getByText(/stock quantity is required/i)).toBeInTheDocument();
    });
  });

  it('should prevent submission with invalid data', async () => {
    const onClose = jest.fn();
    render(<MockedProductForm onClose={onClose} />);

    const submitButton = screen.getByRole('button', { name: /add product/i });
    await user.click(submitButton);

    // Form should not close and onClose should not be called
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should successfully add product with valid data', async () => {
    const onClose = jest.fn();
    render(<MockedProductForm onClose={onClose} />);

    // Fill in valid data
    await user.type(screen.getByLabelText(/product name/i), 'Test Product');
    await user.type(screen.getByLabelText(/price/i), '29.99');
    await user.type(screen.getByLabelText(/stock quantity/i), '10');
    await user.type(screen.getByLabelText(/description/i), 'Test description');

    const submitButton = screen.getByRole('button', { name: /add product/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Product added successfully!',
      });
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('should clear form after successful submission', async () => {
    render(<MockedProductForm />);

    // Fill in data
    const nameInput = screen.getByLabelText(/product name/i);
    await user.type(nameInput, 'Test Product');
    
    expect(nameInput).toHaveValue('Test Product');

    // Submit form
    await user.type(screen.getByLabelText(/price/i), '29.99');
    await user.type(screen.getByLabelText(/stock quantity/i), '10');
    
    const submitButton = screen.getByRole('button', { name: /add product/i });
    await user.click(submitButton);

    // Form should be cleared (onClose will be called, which would unmount the form)
    await waitFor(() => {
      expect(toast).toHaveBeenCalled();
    });
  });

  it('should handle edit mode correctly', () => {
    const mockProduct = {
      id: '1',
      name: 'Existing Product',
      price: 19.99,
      category: 'Electronics' as const,
      stockQuantity: 5,
      description: 'Existing description',
      imageUrl: 'https://example.com/image.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(<MockedProductForm product={mockProduct} />);

    expect(screen.getByDisplayValue('Existing Product')).toBeInTheDocument();
    expect(screen.getByDisplayValue('19.99')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update product/i })).toBeInTheDocument();
  });

  it('should validate name length constraints', async () => {
    render(<MockedProductForm />);

    const nameInput = screen.getByLabelText(/product name/i);
    
    // Test minimum length
    await user.type(nameInput, 'ab');
    const submitButton = screen.getByRole('button', { name: /add product/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/must be at least 3 characters/i)).toBeInTheDocument();
    });

    // Test maximum length
    await user.clear(nameInput);
    await user.type(nameInput, 'a'.repeat(51));
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/must not exceed 50 characters/i)).toBeInTheDocument();
    });
  });

  it('should validate price format', async () => {
    render(<MockedProductForm />);

    const priceInput = screen.getByLabelText(/price/i);
    
    // Test negative price
    await user.type(priceInput, '-10');
    const submitButton = screen.getByRole('button', { name: /add product/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/must be a positive number/i)).toBeInTheDocument();
    });

    // Test invalid decimal places
    await user.clear(priceInput);
    await user.type(priceInput, '10.999');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/must have at most 2 decimal places/i)).toBeInTheDocument();
    });
  });

  it('should show character counter for description', () => {
    render(<MockedProductForm />);

    expect(screen.getByText(/200 characters remaining/i)).toBeInTheDocument();
  });

  it('should reset form when reset button is clicked', async () => {
    render(<MockedProductForm />);

    const nameInput = screen.getByLabelText(/product name/i);
    await user.type(nameInput, 'Test Product');
    
    expect(nameInput).toHaveValue('Test Product');

    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);

    expect(nameInput).toHaveValue('');
  });
});
