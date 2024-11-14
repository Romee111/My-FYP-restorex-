import { useState, useEffect } from 'react';
import axios from 'axios';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [heavyProducts, setHeavyProducts] = useState([]);
  
  const [loading, setLoading] = useState(true);

  const getProducts = async () => {
    try {
   
      const response = await axios.get('http://localhost:3000/api/v1/products/getAllProducts');
      
       console.log(response.data.getAllProducts,"Live products");
        const data = response.data.getAllProducts.slice(0,10) ;// Get the first 12 products
      console.log(data , "We are products")
   
      setProducts(data);
    } catch (err) {
      console.log('Error fetching products:', err);
    } finally {
      setLoading(false); // Whether success or failure, stop loading
    }
  };
  const getpopulatedProducts = async () => {
    try {
      
     
      const response = await axios.get('http://localhost:3000/api/v1/products/getProducts');
      debugger
      const data = response.data.getProducts ;// Get the first 12 products
      console.log(data , "We are products")
    
      setHeavyProducts(data);
    } catch (err) {
      console.log('Error fetching products:', err);
    } finally {
      setLoading(false); // Whether success or failure, stop loading
    }
  };

  useEffect(() => {
    getProducts();
    getpopulatedProducts(); // Call API when the component mounts
  }, []);

  return { products, loading , heavyProducts };
}
