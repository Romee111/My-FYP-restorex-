import React from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from './ProductCard';
const categories = [
  'Foundations', 'T-Shirts', 'Jeans Pants', 'Medicare Bottles', 'Perfumes', 'Skincare',
  // Add more categories as needed
];

const CategoryMenu = () => {
  const {products, heavyproducts, loading } = useProducts();
  
  if (loading) {
    return <p>Loading products...</p>; // Loading message while waiting for the API
  }
 
  return (
    <section className="container mx-auto py-12">
      <h2 className="text-2xl font-bold mb-6">Most Rated</h2>
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
      {products.slice(0, 8).map(product => (
          <ProductCard

            key={product._id} // Unique identifier for each product
            title={product.categories} // Product name
            price={product.price} // Product price
            image={product.images[0]} // Product image URL
            description={product.description}
            stock={product.quantity}
            id={product._id}
          />
        ))}
          {heavyproducts?.map((product, index) => (
          <div key={index} id={ product._id} className="text-center">
            <div className="icon bg-gray-100 p-4 rounded-lg shadow-md">
              <img src={product.image} alt="category" />
            </div>
            {}
            <p className="mt-2 text-sm">{product?.category?.name}</p>
          </div>
      ))} 
      </div>
    </section>
  );
};

export default CategoryMenu;
