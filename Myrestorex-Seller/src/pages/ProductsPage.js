// src/pages/ProductsPage.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import AddProductModal from './AddProductModal';

const API_KEY = 'b0d3c83fda71caff078b'; // Replace with your actual API key
const API_SECRET = 'b2893d5c88b25af6ef4e58fadb4be3afd89af090dce647247f818699819d00ae'; // Replace with your actual API secret
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5YmUyNTI4Ni1iMDQ0LTRjYzYtYWE3Ni1hZDgzZGY5YTVkNDgiLCJlbWFpbCI6ImVodGFzaGFtLnNweXJlc3luY0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjBkM2M4M2ZkYTcxY2FmZjA3OGIiLCJzY29wZWRLZXlTZWNyZXQiOiJiMjg5M2Q1Yzg4YjI1YWY2ZWY0ZTU4ZmFkYjRiZTNhZmQ4OWFmMDkwZGNlNjQ3MjQ3ZjgxODY5OTgxOWQwMGFlIiwiZXhwIjoxNzU4Nzc0MzY3fQ.i-UnCaUnIoKd_S19krFwqOxEKUcAA7XWfrtUEfn2VEA'; // Replace with your actual JWT token if using
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    quantity: '',
    imageCover: '',
  });

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

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
  const uploadImageToPinata = async (file) => {
    setIsUploading(true);
    const base64File = await fileToBase64(file);
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

    const byteString = atob(base64File);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: 'image/png' });
    const form = new FormData();
    form.append('file', blob, 'image.png');

    try {
      const response = await axios.post(url, form, {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {
          pinata_api_key: API_KEY,
          pinata_secret_api_key: API_SECRET,
          Authorization: `Bearer ${JWT}`,
        },
      });
      setIsUploading(false);
      return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    } catch (error) {
      console.error("Failed to upload to Pinata:", error);
      setIsUploading(false);
      throw error;
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Extract base64
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e, imageType) => {
    const { files } = e.target;
    if (files.length > 0) {
      try {
        const imageUrl = await uploadImageToPinata(files[0]);
        setSelectedProduct((prevProduct) => ({
          ...prevProduct,
          [imageType]: imageUrl,
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };
  // Add a new product
  const handleAddProduct = async (product) => {
    console.log("Received product in parent:", product); // Log the product data received from the modal
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:3000/api/v1/products/addProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });
  
      if (response.ok) {
        fetchProducts();
      } else {
        console.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };
  

  // Update an existing product
  const handleUpdateProduct = async () => {
    const token = localStorage.getItem('token');

    // Create an object with only the editable fields
    const updatedProductData = {
      title: selectedProduct.title,
      description: selectedProduct.description,
      price: selectedProduct.price,
      quantity: selectedProduct.quantity,
      imgCover: selectedProduct.imgCover,
      // color: selectedProduct.color,
      size: selectedProduct.size,
    };

    try {
      const response = await fetch(`http://localhost:3000/api/v1/products/updateProduct/${selectedProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProductData),
      });

      if (response.ok) {
        fetchProducts(); // Refresh product list
        setShowEditModal(false); // Close the modal
        setSelectedProduct(null); // Reset selected product
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  const EditProductModal = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
        <h3 className="text-xl font-semibold mb-4">Edit Product</h3>
        
        {/* Editable Fields */}
         
        <input
          type="text"
          placeholder="Title"
          value={selectedProduct.title}
          onChange={(e) => setSelectedProduct({ ...selectedProduct, title: e.target.value })}
          className="w-full px-3 py-2 border rounded mb-4"
        />
        <textarea
          placeholder="Description"
          value={selectedProduct.description}
          onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
          className="w-full px-3 py-2 border rounded mb-4"
        />
        <input
          type="number"
          placeholder="Price"
          value={selectedProduct.price}
          onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
          className="w-full px-3 py-2 border rounded mb-4"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={selectedProduct.quantity}
          onChange={(e) => setSelectedProduct({ ...selectedProduct, quantity: e.target.value })}
          className="w-full px-3 py-2 border rounded mb-4"
        />

        {/* Image Upload */}
        <label className="block mb-2 text-gray-700">Cover Image</label>
        <input
          type="file"
          onChange={(e) => handleImageUpload(e, 'imgCover')}
          className="w-full px-3 py-2 border rounded mb-4"
        />
        {selectedProduct.imgCover && (
          <img src={selectedProduct.imgCover} alt="Cover" className="w-full h-32 object-cover rounded mb-4" />
        )}

        <input
          type="text"
          placeholder="Colors (comma separated)"
          value={selectedProduct.color.join(', ')}
          onChange={(e) => setSelectedProduct({ ...selectedProduct, color: e.target.value.split(',').map((color) => color.trim()) })}
          className="w-full px-3 py-2 border rounded mb-4"
        />
        <input
          type="text"
          placeholder="Sizes (comma separated)"
          value={selectedProduct.size.join(', ')}
          onChange={(e) => setSelectedProduct({ ...selectedProduct, size: e.target.value.split(',').map((size) => size.trim()) })}
          className="w-full px-3 py-2 border rounded mb-4"
        />

        <div className="flex justify-end">
          <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mr-2">Cancel</button>
          <button onClick={handleUpdateProduct} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save Changes</button>
        </div>
      </div>
    </div>
  );

  // Delete a product
  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/v1/products/deleteProduct/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchProducts();
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Products</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Product
        </button>
      </div>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
            <img
              src={product.imageCover || product.images[0]}
              alt={product.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.title}</h3>
              <p className="text-gray-700 mt-2">${product.price.toFixed(2)}</p>
              <p className="text-gray-500 mt-1">In Stock: {product.quantity}</p>
            </div>
            <div className="p-4 flex justify-between">
              <button
                onClick={() => {
                  setSelectedProduct(product);
                  setShowEditModal(true);
                }}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteProduct(product._id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAddProduct={handleAddProduct}
        />
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && <EditProductModal />}
    </div>
  );
};

export default ProductsPage;
