// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useProducts } from '../hooks/useProducts';
// import { useSubCategories } from '../hooks/useSubCategories';
// import axios from 'axios';

// const CategoryPage = () => {
//   const { categoryName } = useParams(); // Get the category from the URL
//   const { products, loading: productsLoading } = useProducts(); 
//   const { listSubCategories } = useSubCategories();
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [activeSubcategory, setActiveSubcategory] = useState('');
//   const [categoryId, setCategoryId] = useState(null); // Placeholder for category ID
//   const [subcategoriesLoading, setSubcategoriesLoading] = useState(true);
//   useEffect(() => {
//     if (!productsLoading && products.length > 0) {
//       // Filter products based on the category name and set category ID
//       const filtered = products.filter(
//         product => product?.category_id?.name.toLowerCase() === categoryName?.toLowerCase()
//       );
//       if (filtered.length > 0) {
//         setFilteredProducts(filtered);
//         setCategoryId(filtered[0]?.category_id?._id); // Set the category ID from the filtered products
//       }
//     }
//   }, [productsLoading, products, categoryName]);

//   // Fetch subcategories using the category ID
//   useEffect(() => {
//     const fetchSubcategories = async () => {
//       if (categoryId) {
//         try {
//           const subCatData = await listSubCategories(categoryId); // Pass category ID to fetch subcategories
//           setSubcategories(subCatData);
//           setSubcategoriesLoading(false); // Subcategories fetched
//         } catch (error) {
//           console.error('Error fetching subcategories:', error);
//           setSubcategoriesLoading(false); // Stop loading in case of error
//         }
//       }
//     };

//     if (categoryId) {
//         fetchSubcategories();
//       }
//   }, [categoryId, listSubCategories]);

//   // Filter products by subcategory
//   const filterBySubcategory = (subcategory) => {
//     setActiveSubcategory(subcategory);
//     if (subcategory === 'All') {
//       // Show all products in the category
//       setFilteredProducts(products.filter(
//         product => product?.category_id?.name.toLowerCase() === categoryName?.toLowerCase()
//       ));
//     } else {
//       // Filter by subcategory
//       setActiveSubcategory(subcategory);
//       const filtered = products.filter(
//         product =>
//           product.category_id?.name?.toLowerCase() === categoryName?.toLowerCase() &&
//           product?.subcategory_id?.name === subcategory
//       );
//       setFilteredProducts(filtered);
//     }
//   };

//   if (productsLoading || subcategoriesLoading) {
//     return <p>Loading...</p>;
//   }

//   if (filteredProducts.length === 0) {
//     return <p>No products found for {categoryName}</p>;
//   }

//   return (
//     <section className="container mx-auto py-12">
//     {/* Subcategory Bar */}
//     <div className="bg-gray-200 py-3 mb-6">
//       <div className="container mx-auto flex justify-center space-x-4">
//         <button
//           className={`px-4 py-2 ${activeSubcategory === '' ? 'bg-blue-600 text-white' : 'bg-white'} rounded`}
//           onClick={() => filterBySubcategory('All')}
//         >
//           All
//         </button>
//         {subcategories.map((subcategory, index) => (
//           <button
//             key={index}
//             className={`px-4 py-2 ${activeSubcategory === subcategory.name ? 'bg-blue-600 text-white' : 'bg-white'} rounded`}
//             onClick={() => filterBySubcategory(subcategory.name)}
//           >
//             {subcategory.name}
//           </button>
//         ))}
//       </div>
//     </div>

//     <h2 className="text-2xl font-bold mb-6">{categoryName} Products</h2>
//     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
//       {filteredProducts.map(product => (
//         <div key={product._id} id={product._id} className="text-center bg-white p-4 rounded-lg shadow-md">
//           <div className="icon bg-gray-100 p-4 rounded-lg">
//             <img src={product.images[0]} alt={product.name} className="w-full h-48 object-contain"/>
//           </div>
//           <p className="mt-2 text-sm">{product.name}</p>
//           <p className="mt-1 font-bold">${product.price}</p>
//         </div>
//       ))}
//     </div>
//   </section>
//   );
// };

// export default CategoryPage;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useSubCategories } from '../hooks/useSubCategories';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const { heavyProducts, products, loading: productsLoading } = useProducts();
  const { listSubCategories } = useSubCategories();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [activeSubcategory, setActiveSubcategory] = useState('All');
  const [categoryId, setCategoryId] = useState(null);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(true);

  useEffect(() => {
    // debugger
    if (!productsLoading && heavyProducts.length > 0) {
      const filtered = heavyProducts.filter(
        product => product?.category?.name.toLowerCase() === categoryName?.toLowerCase()
      );
      if (filtered.length > 0) {
        debugger
        setFilteredProducts(filtered);
        setCategoryId(filtered[0]?.category?._id);
      }
    }
  }, [productsLoading, heavyProducts, categoryName]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (categoryId) {
        try {
          debugger
          const subCatData = await listSubCategories(categoryId);
          setSubcategories(subCatData);
        } catch (error) {
          console.error('Error fetching subcategories:', error);
        } finally {
          setSubcategoriesLoading(false);
        }
      }
    };
    fetchSubcategories();
  }, [categoryId, listSubCategories]);

  const filterBySubcategory = (subcategory) => {
    setActiveSubcategory(subcategory);
    if (subcategory === 'All') {
      setFilteredProducts(products.filter(
        product => product?.category_id?.name.toLowerCase() === categoryName?.toLowerCase()
      ));
    } else {
      const filtered = products.filter(
        product =>
          product.category_id?.name?.toLowerCase() === categoryName?.toLowerCase() &&
          product?.subcategory_id?.name === subcategory
      );
      setFilteredProducts(filtered);
    }
  };

  if (productsLoading || subcategoriesLoading) {
    return <p>Loading...</p>;
  }

  if (filteredProducts.length === 0) {
    return <p>No products found for {categoryName}</p>;
  }

  return (
    <section className="container mx-auto py-12">
      <div className="bg-gray-200 py-3 mb-6">
        <div className="container mx-auto flex justify-center space-x-4">
          <button
            className={`px-4 py-2 ${activeSubcategory === 'All' ? 'bg-blue-600 text-white' : 'bg-white'} rounded`}
            onClick={() => filterBySubcategory('All')}
          >
            All
          </button>
          {subcategories.map((subcategory) => (
            <button
              key={subcategory._id}
              className={`px-4 py-2 ${activeSubcategory === subcategory.name ? 'bg-blue-600 text-white' : 'bg-white'} rounded`}
              onClick={() => filterBySubcategory(subcategory.name)}
            >
              {subcategory.name}
            </button>
          ))}
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">{categoryName} Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredProducts.map(product => (
          <div key={product._id} className="text-center bg-white p-4 rounded-lg shadow-md">
            <div className="icon bg-gray-100 p-4 rounded-lg">
              <img src={product.images[0]} alt={product.name} className="w-full h-48 object-contain" />
            </div>
            <p className="mt-2 text-sm">{product.name}</p>
            <p className="mt-1 font-bold">${product.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryPage;
