import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
const API_KEY = 'b0d3c83fda71caff078b'; // Replace with your actual API key
const API_SECRET = 'b2893d5c88b25af6ef4e58fadb4be3afd89af090dce647247f818699819d00ae'; // Replace with your actual API secret
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5YmUyNTI4Ni1iMDQ0LTRjYzYtYWE3Ni1hZDgzZGY5YTVkNDgiLCJlbWFpbCI6ImVodGFzaGFtLnNweXJlc3luY0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjBkM2M4M2ZkYTcxY2FmZjA3OGIiLCJzY29wZWRLZXlTZWNyZXQiOiJiMjg5M2Q1Yzg4YjI1YWY2ZWY0ZTU4ZmFkYjRiZTNhZmQ4OWFmMDkwZGNlNjQ3MjQ3ZjgxODY5OTgxOWQwMGFlIiwiZXhwIjoxNzU4Nzc0MzY3fQ.i-UnCaUnIoKd_S19krFwqOxEKUcAA7XWfrtUEfn2VEA'; // Replace with your actual JWT token if using
const AddProductModal = ({ onClose, onAddProduct }) => {
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    imgCover: '',
    images: [],
    price: '',
    color: [],
    size: [],
    category: '',
    subcategory: '',
    brand: ''
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [brandOption, setBrandOption] = useState('existing'); // 'existing' or 'new'
  const [newBrand, setNewBrand] = useState({
    name: '',
    image: '',
  });
  const [newBrandId, setNewBrandId] = useState(null);
  const [isAddingBrand, setIsAddingBrand] = useState(false);
//   useEffect(() => {
//     // Fetch categories, subcategories, and brands from the backend when the modal opens
//     fetchCategories();
//     fetchBrands();
//   }, [fetchCategories]);

  useEffect(() => {
    // Fetch categories when the modal opens
    const fetchCategories = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3000/restorex/categories/getALLCategories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data.getAllCategories || []); // Adjust based on your API response structure
        setLoadingCategories(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoadingCategories(false);
      }
    };
    const fetchBrands = async () => {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get('http://localhost:3000/restorex/brands/getAllBrands', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setBrands(response.data.getAllBrands || []);
          setLoadingBrands(false);
        } catch (error) {
          console.error("Error fetching brands:", error);
          setLoadingBrands(false);
        }
      };
    fetchCategories();
    fetchBrands();
  }, []);

//   useEffect(() => {
//     // Automatically set the brand when newBrandId changes
//     if (newBrandId) {
//       setNewProduct((prevProduct) => ({
//         ...prevProduct,
//         brand: newBrandId,
//       }));
//       onAddProduct(newProduct);
//       onClose();
//     }
//   }, [newBrandId]);
  const fetchSubcategories = async (categoryId) => {
    setLoadingSubcategories(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:3000/restorex/categories/${categoryId}/subcategories/getALLSubCategories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubcategories(response.data.getAllSubCategories || []);
      setLoadingSubcategories(false);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setLoadingSubcategories(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setNewProduct({ ...newProduct, category: categoryId, subcategory: '' });
    fetchSubcategories(categoryId);
  };

//   const handleSubmit = async () => {
//     console.log("Submitting product:", newProduct); // Check product data before submission
//     await onAddProduct(newProduct); // Assuming onAddProduct is async
//     onClose();
//   };
  const handleFieldChange = (field, value) => {
    setNewProduct({ ...newProduct, [field]: value });
  };
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Extract base64
      reader.onerror = (error) => reject(error);
    });
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
  const handleBrandOptionChange = (option) => {
    setBrandOption(option);
    if (option === 'existing') {
      setNewProduct({ ...newProduct, brand: '' });
    }
  };
 
  
  const handleImageUpload = async (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      try {
        const imageUrl = await uploadImageToPinata(files[0]);
        setNewProduct((prevProduct) => ({
          ...prevProduct,
          imgCover: imageUrl,
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };
  const handleMultipleImagesUpload = async (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      setIsUploading(true);
      try {
        const imageUrls = await Promise.all(
          Array.from(files).map(file => uploadImageToPinata(file))
        );
        setNewProduct((prevProduct) => ({
          ...prevProduct,
          images: [...prevProduct.images, ...imageUrls],
        }));
      } catch (error) {
        console.error("Error uploading images:", error);
      }
      setIsUploading(false);
    }
  };
  const handleSubmit = async () => {
    try {
      if (brandOption === 'new') {
        // Check if the brand already exists
        const brandExists = brands.some(
          (brand) => brand.name.toLowerCase() === newBrand.name.trim().toLowerCase()
        );
        if (brandExists) {
          alert('Brand already exists. Please select it from the list.');
          return;
        }
  
        // Add the new brand
        const addedBrand = await addNewBrand(newBrand);
        if (addedBrand) {
          // Update brands list and automatically set the new brand for newProduct
          setBrands((prevBrands) => [...prevBrands, addedBrand]);
          // Directly set newProduct with the added brand ID
          const updatedProduct = {
            ...newProduct,
            brand: addedBrand._id,
          };
          onAddProduct(updatedProduct); // Call onAddProduct with the updated product
          onClose();
        } else {
          alert('Failed to add new brand.');
          return;
        }
      } else {
        // If using an existing brand, proceed directly to add the product
        onAddProduct(newProduct);
        onClose();
      }
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };
  
  useEffect(() => {
    if (newBrandId) {
      // Set the new brand in the product and call onAddProduct
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        brand: newBrandId,
      }));
  
      onAddProduct(newProduct); // Call the add product function with updated product data
      onClose(); // Close the modal
    }
  }, [newBrandId]);
  const addNewBrand = async (brandData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/brands/addBrand',
        { name: brandData.name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data && response.data.addBrand) {
        return response.data.addBrand;
      } else {
        console.error('Failed to add brand:', response.data);
        return null;
      }
    } catch (error) {
      console.error('Error adding brand:', error);
      return null;
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md h-[650px] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
        <input
          type="text"
          placeholder="Title"
          value={newProduct.title}
          onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
          className="w-full px-3 py-2 border rounded mb-4"
        />
        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          className="w-full px-3 py-2 border rounded mb-4"
        />
        {/* Dropdown for Category */}
         {/* Loading indicator */}
         {loadingCategories ? (
          <p>Loading categories...</p>
        ) : (
          <select
            value={newProduct.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        )}

        {/* Dropdown for Subcategory */}
         {/* Subcategory Dropdown */}
         {loadingSubcategories ? (
          <p>Loading subcategories...</p>
        ) : (
          <select
            value={newProduct.subcategory}
            onChange={(e) => handleFieldChange('subcategory', e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
            disabled={!newProduct.category} // Disable if no category is selected
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        )}

        {/* Dropdown for Brand */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Brand</label>
          <div className="flex items-center mb-2">
            <label className="mr-4">
              <input
                type="radio"
                name="brandOption"
                value="existing"
                checked={brandOption === 'existing'}
                onChange={() => handleBrandOptionChange('existing')}
              />{' '}
              Existing Brand
            </label>
            <label>
              <input
                type="radio"
                name="brandOption"
                value="new"
                checked={brandOption === 'new'}
                onChange={() => handleBrandOptionChange('new')}
              />{' '}
              Add New Brand
            </label>
          </div>

          {brandOption === 'existing' && (
            <>
              {loadingBrands ? (
                <p>Loading brands...</p>
              ) : (
                <select
                  value={newProduct.brand}
                  onChange={(e) =>
                    handleFieldChange('brand', e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              )}
            </>
          )}

          {brandOption === 'new' && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="Brand Name"
                value={newBrand.name}
                onChange={(e) =>
                  setNewBrand({ ...newBrand, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded mb-2"
              />
              {/* <input
                type="file"
                onChange={(e) => handleImageUpload(e, 'brandImage')}
                className="w-full px-3 py-2 border rounded mb-2"
              />
              {isUploading && <p>Uploading brand image...</p>}
              {newBrand.image && (
                <img
                  src={newBrand.image}
                  alt="Brand"
                  className="w-full h-32 object-cover rounded mb-2"
                />
              )} */}
            </div>
          )}
        </div>

        {/* Additional fields for images, price, colors, and sizes */}
        <div className="mb-4">
          <label className="block text-gray-700">Cover Image</label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="w-full px-3 py-2 border rounded"
          />
          {isUploading && <p>Uploading image...</p>}
          {newProduct.imgCover && (
            <img src={newProduct.imgCover} alt="Cover" className="mt-2 w-full h-32 object-cover rounded" />
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Additional Images</label>
          <input
            type="file"
            multiple
            onChange={handleMultipleImagesUpload}
            className="w-full px-3 py-2 border rounded"
          />
          {isUploading && <p>Uploading images...</p>}
          <div className="grid grid-cols-3 gap-2 mt-2">
            {newProduct.images.map((url, index) => (
              <img key={index} src={url} alt={`Image ${index + 1}`} className="w-full h-32 object-cover rounded" />
            ))}
          </div>
        </div>
        <input
          type="text"
          placeholder="Payment URL"
          value={newProduct.payment_URL}
          onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
          className="w-full px-3 py-2 border rounded mb-4"
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
          className="w-full px-3 py-2 border rounded mb-4"
        />
        <input
          type="text"
          placeholder="Colors (comma separated)"
          value={newProduct.color.join(', ')}
          onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value.split(',').map(color => color.trim()) })}
          className="w-full px-3 py-2 border rounded mb-4"
        />
        <input
          type="text"
          placeholder="Sizes (comma separated)"
          value={newProduct.size.join(', ')}
          onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value.split(',').map(size => size.trim()) })}
          className="w-full px-3 py-2 border rounded mb-4"
        />

        <div className="flex justify-end">
          <button
            onClick={onClose}
            style={{backgroundColor:"#001f3f", Color:"white"}}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{backgroundColor:"#001f3f", Color:"white"}}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
