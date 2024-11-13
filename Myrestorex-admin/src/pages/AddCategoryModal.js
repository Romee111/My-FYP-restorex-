import { XIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const API_KEY = 'b0d3c83fda71caff078b'; // Replace with your actual API key
const API_SECRET = 'b2893d5c88b25af6ef4e58fadb4be3afd89af090dce647247f818699819d00ae'; // Replace with your actual API secret
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5YmUyNTI4Ni1iMDQ0LTRjYzYtYWE3Ni1hZDgzZGY5YTVkNDgiLCJlbWFpbCI6ImVodGFzaGFtLnNweXJlc3luY0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjBkM2M4M2ZkYTcxY2FmZjA3OGIiLCJzY29wZWRLZXlTZWNyZXQiOiJiMjg5M2Q1Yzg4YjI1YWY2ZWY0ZTU4ZmFkYjRiZTNhZmQ4OWFmMDkwZGNlNjQ3MjQ3ZjgxODY5OTgxOWQwMGFlIiwiZXhwIjoxNzU4Nzc0MzY3fQ.i-UnCaUnIoKd_S19krFwqOxEKUcAA7XWfrtUEfn2VEA'; // Replace with your actual JWT token if using

const AddCategoryModal = ({ onClose, onSave }) => {
  const [categoryData, setCategoryData] = useState({
    name: "",
    imageUrl: "", // Store the IPFS URL of the uploaded image
  });
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setIsUploading(true);

      // Convert file to base64
      const base64File = await fileToBase64(file);

      // Upload to Pinata
      try {
        const pinataResponse = await uploadImageToPinata(base64File);
        if (pinataResponse) {
          const imageHash = pinataResponse.IpfsHash;
          const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageHash}`;
          setCategoryData({ ...categoryData, imageUrl });
        }
      } catch (error) {
        console.error("Error uploading image to IPFS:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Extract base64 from the data URL
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadImageToPinata = async (base64File) => {
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  
    // Convert base64 to binary
    const byteString = atob(base64File); // Decode base64 string
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
  
    const blob = new Blob([uint8Array], { type: 'image/png' }); // Create a blob from the binary data
    const form = new FormData();
    form.append('file', blob, 'image.png'); // Add the blob to the form
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: form,
        headers: {
          pinata_api_key: API_KEY,
          pinata_secret_api_key: API_SECRET,
          Authorization: `Bearer ${JWT}`,
        },
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to upload to Pinata:", error);
      throw error;
    }
  };
  

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:3000/restorex/categories/addCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: categoryData.name,
          Image: categoryData.imageUrl, // Send the IPFS URL in the payload
        }),
      });

      if (response.ok) {
        const result = await response.json();
        onSave(result.newCategory);
        onClose();
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Add New Category</h3>
          <button onClick={onClose}>
            <XIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={categoryData.name}
              onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Upload Image</label>
            <div
              {...getRootProps()}
              className="border-dashed border-2 border-gray-300 p-4 rounded text-center cursor-pointer"
            >
              <input {...getInputProps()} />
              {isUploading ? (
                <p>Uploading image...</p>
              ) : categoryData.imageUrl ? (
                <p>Image uploaded successfully!</p>
              ) : isDragActive ? (
                <p>Drop the image here...</p>
              ) : (
                <p>Drag & drop an image here, or click to select</p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-300 rounded hover:bg-gray-400">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" disabled={isUploading || !categoryData.imageUrl}>
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
