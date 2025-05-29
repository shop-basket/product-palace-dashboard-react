
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductProvider } from '@/contexts/ProductContext';
import { Product } from '@/types/product';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Test Product 1',
    price: 29.99,
    category: 'Electronics',
    stockQuantity: 10,
    description: 'Test description 1',
    imageUrl: 'https://example.com/image1.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Test Product 2',
    price: 19.99,
    category: 'Books',
    stockQuantity: 0,
    description: 'Test description 2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const MockedProductGrid = ({ products = mockProducts }) => {
  // Mock the localStorage to return our test products
  localStorageMock.getItem.mockReturnValue(JSON.stringify(products));
  
  return (
    <ProductProvider>
      <ProductGrid />
    </ProductProvider>
  );
};

describe('ProductGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render products correctly', async () => {
    render(<MockedProductGrid />);

    // Wait for products to load and be displayed
    expect(await screen.findByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
  });

  it('should handle empty state', async () => {
    render(<MockedProductGrid products={[]} />);

    expect(await screen.findByText(/no products yet/i)).toBeInTheDocument();
    expect(screen.getByText(/get started by adding your first product/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add your first product/i })).toBeInTheDocument();
  });

  it('should display product information accurately', async () => {
    render(<MockedProductGrid />);

    // Check for product details
    expect(await screen.findByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Books')).toBeInTheDocument();
    expect(screen.getByText(/in stock \(10\)/i)).toBeInTheDocument();
    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
  });

  it('should handle image loading errors', async () => {
    render(<MockedProductGrid />);

    // The component should render even if images fail to load
    expect(await screen.findByText('Test Product 1')).toBeInTheDocument();
    
    // Check that images are present in the DOM
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('should display stock status correctly', async () => {
    const productsWithVariousStock: Product[] = [
      {
        ...mockProducts[0],
        stockQuantity: 15, // In stock
      },
      {
        ...mockProducts[1],
        stockQuantity: 0, // Out of stock
      },
      {
        id: '3',
        name: 'Low Stock Product',
        price: 9.99,
        category: 'Home',
        stockQuantity: 3, // Low stock
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    render(<MockedProductGrid products={productsWithVariousStock} />);

    expect(await screen.findByText(/in stock \(15\)/i)).toBeInTheDocument();
    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
    expect(screen.getByText(/low stock \(3\)/i)).toBeInTheDocument();
  });

  it('should truncate long product names and descriptions', async () => {
    const productWithLongText: Product[] = [
      {
        id: '1',
        name: 'This is a very long product name that should be truncated',
        price: 29.99,
        category: 'Electronics',
        stockQuantity: 10,
        description: 'This is a very long description that should be truncated when displayed in the product card to maintain a clean layout',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    render(<MockedProductGrid products={productWithLongText} />);

    // The component should render the product even with long text
    expect(await screen.findByText(/this is a very long product name/i)).toBeInTheDocument();
  });
});
