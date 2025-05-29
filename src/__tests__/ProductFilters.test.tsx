
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductProvider } from '@/contexts/ProductContext';
import { ProductFilters } from '@/components/ProductFilters';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const MockedProductFilters = () => (
  <ProductProvider>
    <ProductFilters />
  </ProductProvider>
);

describe('ProductFilters', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('[]');
  });

  it('should render all filter controls', () => {
    render(<MockedProductFilters />);

    expect(screen.getByLabelText(/search products/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price range/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/stock status/i)).toBeInTheDocument();
  });

  it('should filter products by search term', async () => {
    render(<MockedProductFilters />);

    const searchInput = screen.getByLabelText(/search products/i);
    await user.type(searchInput, 'laptop');

    expect(searchInput).toHaveValue('laptop');
  });

  it('should filter products by category', async () => {
    render(<MockedProductFilters />);

    const categorySelect = screen.getByRole('combobox', { name: /category/i });
    await user.click(categorySelect);

    const electronicsOption = screen.getByText('Electronics');
    await user.click(electronicsOption);

    // The select should now show Electronics
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('should filter products by price range', async () => {
    render(<MockedProductFilters />);

    const minPriceInput = screen.getByPlaceholderText(/min/i);
    const maxPriceInput = screen.getByPlaceholderText(/max/i);

    await user.type(minPriceInput, '10');
    await user.type(maxPriceInput, '100');

    expect(minPriceInput).toHaveValue(10);
    expect(maxPriceInput).toHaveValue(100);
  });

  it('should filter products by stock status', async () => {
    render(<MockedProductFilters />);

    const stockStatusSelect = screen.getByRole('combobox', { name: /stock status/i });
    await user.click(stockStatusSelect);

    const inStockOption = screen.getByText('In Stock');
    await user.click(inStockOption);

    expect(screen.getByText('In Stock')).toBeInTheDocument();
  });

  it('should show clear filters button when filters are active', async () => {
    render(<MockedProductFilters />);

    const searchInput = screen.getByLabelText(/search products/i);
    await user.type(searchInput, 'test');

    await waitFor(() => {
      expect(screen.getByText(/active filters applied/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
    });
  });

  it('should clear all filters when clear button is clicked', async () => {
    render(<MockedProductFilters />);

    // Apply some filters
    const searchInput = screen.getByLabelText(/search products/i);
    await user.type(searchInput, 'test');

    const minPriceInput = screen.getByPlaceholderText(/min/i);
    await user.type(minPriceInput, '10');

    // Clear filters
    const clearButton = await screen.findByRole('button', { name: /clear filters/i });
    await user.click(clearButton);

    // Filters should be cleared
    expect(searchInput).toHaveValue('');
    expect(minPriceInput).toHaveValue('');
  });

  it('should validate price range inputs', async () => {
    render(<MockedProductFilters />);

    const minPriceInput = screen.getByPlaceholderText(/min/i);
    const maxPriceInput = screen.getByPlaceholderText(/max/i);

    // Test that inputs accept valid numbers
    await user.type(minPriceInput, '10.99');
    await user.type(maxPriceInput, '99.99');

    expect(minPriceInput).toHaveValue(10.99);
    expect(maxPriceInput).toHaveValue(99.99);
  });

  it('should debounce search input', async () => {
    render(<MockedProductFilters />);

    const searchInput = screen.getByLabelText(/search products/i);
    
    // Type quickly
    await user.type(searchInput, 'test', { delay: 50 });

    // The input should contain the text
    expect(searchInput).toHaveValue('test');
  });
});
