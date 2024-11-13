// src/pages/ProductsPage.js
import { useEffect, useState } from 'react';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/products/getAllProducts');
        const data = await response.json();

        if (data.message === "success") {
          setProducts(data.getAllProducts || []);
        } else {
          console.error("Failed to fetch products:", data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Products</h2>
      <div className="overflow-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Product ID</th>
              <th className="py-3 px-6 text-left">Product Name</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">Stock</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {products.map((product) => (
              <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{product._id}</td>
                <td className="py-3 px-6 text-left">{product.title}</td>
                <td className="py-3 px-6 text-left">${product.price.toFixed(2)}</td>
                <td className="py-3 px-6 text-left">{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsPage;
