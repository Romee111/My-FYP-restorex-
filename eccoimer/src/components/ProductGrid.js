import React from 'react';
import ProductCard from './ProductCard';
import { useProducts } from '../hooks/useProducts'; // Import the useProducts hook

const ProductGrid = () => {
  const { products, loading } = useProducts(); // Use the hook to get products and loading state

  if (loading) {
    return <p>Loading products...</p>; // Loading message while waiting for the API
  }

  return (
    <section className="container mx-auto py-12">
      <h2 className="text-2xl font-bold mb-6">Just For You</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map(product => (
          <ProductCard
            key={product._id} // Unique identifier for each product
            title={product.name} // Product name
            price={product.price} // Product price
            image={product.images} // Product image URL
            description={product.description}
            stock={product.quantity}
            id={product._id}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
