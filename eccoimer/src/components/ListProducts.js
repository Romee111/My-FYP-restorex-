import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom'; // To get the search query from the URL
import { useSearchProducts } from '../hooks/useSearchProducts'; // Custom hook for fetching products
import ProductCard from './ProductCard';

const ListProducts = () => {
  const { query } = useParams(); // Get the query parameter from the URL
  const { searchResults, loading, getSearch } = useSearchProducts();

  // Fetch the products when the component mounts or when the query changes
  useEffect(() => {
    if (query) {
      getSearch(query); // Call the API to get search results
    }
  }, [query]);

  if (loading) {
    return <p className="text-center mt-10">Loading search results...</p>; // Display loading message
  }

  if (!searchResults || searchResults.length === 0) {
    return <p className="text-center mt-10">No products found for "{query}"</p>; // Handle no products found
  }

  return (
    <section className="container mx-auto py-12">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Search Results for "{query}"
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {searchResults.map((product) => (
          <ProductCard
          id={product._id}
            key={product._id} // Unique identifier for each product
            title={product.title} // Product name
            price={product.price} // Product price
            image={product.images} // Assuming the API returns the product images
          />
        ))}
      </div>
    </section>
  );
};

export default ListProducts;
