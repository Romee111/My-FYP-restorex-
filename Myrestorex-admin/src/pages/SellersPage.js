// src/pages/SellersPage.js
import { useEffect, useState } from 'react';
import { TrashIcon, PlusIcon, PencilIcon, XIcon } from '@heroicons/react/outline';
import EditSellerModal from './EditSellerModal';
import axios from 'axios';
const API_KEY = 'b0d3c83fda71caff078b'; // Replace with your actual API key
const API_SECRET = 'b2893d5c88b25af6ef4e58fadb4be3afd89af090dce647247f818699819d00ae'; // Replace with your actual API secret
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5YmUyNTI4Ni1iMDQ0LTRjYzYtYWE3Ni1hZDgzZGY5YTVkNDgiLCJlbWFpbCI6ImVodGFzaGFtLnNweXJlc3luY0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjBkM2M4M2ZkYTcxY2FmZjA3OGIiLCJzY29wZWRLZXlTZWNyZXQiOiJiMjg5M2Q1Yzg4YjI1YWY2ZWY0ZTU4ZmFkYjRiZTNhZmQ4OWFmMDkwZGNlNjQ3MjQ3ZjgxODY5OTgxOWQwMGFlIiwiZXhwIjoxNzU4Nzc0MzY3fQ.i-UnCaUnIoKd_S19krFwqOxEKUcAA7XWfrtUEfn2VEA'; // Replace with your actual JWT token if using
const SellersPage = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'seller', // Set default role to seller
    addresses: [
      {
        city: '',
        street: '',
        phone: '',
      }
    ],
    sellerInfo: {
      businessName: '',
      businessAddress: '',
      businessType: '',
      taxIdNumber: '',
      bankAccountNumber: '',
      bankName: '',
      accountHolderName: '',
      branchCode: '',
      documents: {
        idCardNumber: '',
        idImage1: '',
        idImage2: '',
      }
    }
  });
  const uploadImageToPinata = async (file) => {
    setIsUploading(true);
    const base64File = await fileToBase64(file);
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

    // Convert base64 to binary for the upload
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
  const handleImageUpload = async (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      try {
        const imageUrl = await uploadImageToPinata(files[0]);
        setNewUser((prevUser) => ({
          ...prevUser,
          sellerInfo: {
            ...prevUser.sellerInfo,
            documents: {
              ...prevUser.sellerInfo.documents,
              [name]: imageUrl,
            },
          },
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };
  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:3000/api/v1/users/getAllUsers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("Fetched users data:", data);
        // Filter out only users with role "seller"
        const filteredUsers = data.data ? data.data.filter(user => {
            const hasId = user._id !== undefined;
            console.log(`User ID present for ${user.name}:`, hasId);
            return user.role === 'seller' && hasId;
          }) : [];
          
          console.log("Filtered users with role 'seller':", filteredUsers);
          
          setUsers(filteredUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name.startsWith('addresses.')) {
      const field = name.split('.')[1];
      setNewUser((prevUser) => ({
        ...prevUser,
        addresses: [{ ...prevUser.addresses[0], [field]: value }],
      }));
    } else if (name.startsWith('sellerInfo.documents.')) {
      const field = name.split('.')[2];
      setNewUser((prevUser) => ({
        ...prevUser,
        sellerInfo: {
          ...prevUser.sellerInfo,
          documents: { ...prevUser.sellerInfo.documents, [field]: value },
        },
      }));
    } else if (name.startsWith('sellerInfo.')) {
      const field = name.split('.')[1];
      setNewUser((prevUser) => ({
        ...prevUser,
        sellerInfo: { ...prevUser.sellerInfo, [field]: value },
      }));
    } else {
      setNewUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };
  


  // Submit the add user form
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
  
    // Log the newUser payload to inspect it before sending
    console.log("Submitting new user data:", newUser);
  
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/v1/users/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });
  
      if (response.ok) {
        const createdUser = await response.json();
        setUsers((prevUsers) => [...prevUsers, createdUser.user]);
        // Reset form state after successful submission
        setNewUser({
          name: '',
          email: '',
          password: '',
          role: 'seller',
          addresses: [{ city: '', street: '', phone: '' }],
          sellerInfo: {
            businessName: '',
            businessAddress: '',
            businessType: '',
            taxIdNumber: '',
            bankAccountNumber: '',
            bankName: '',
            accountHolderName: '',
            branchCode: '',
            documents: {
              idCardNumber: '',
              idImage1: '',
              idImage2: '',
            },
          },
        });
        setShowModal(false);
      } else {
        const errorData = await response.json();
        console.error("Failed to create user:", errorData.message);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  
  const handleDelete = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/v1/users/deleteUser/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter(user => user._id !== userId)); // Remove deleted user from list
        console.log("User deleted successfully");
      } else {
        const errorData = await response.json();
        console.error("Failed to delete user:", errorData.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  const handleEditClick = (user) => {
    console.log("Editing user:", user);
    setSelectedSeller(user);
    setShowEditModal(true);
  };

  const handleUpdateSeller = async (sellerId, sellerInfo) => {
    const token = localStorage.getItem('token');
  
    const updatedSellerPayload = {
      sellerInfo, // Send only the updated sellerInfo object
    };
  
    try {
      const response = await fetch(`http://localhost:3000/api/v1/users/updateUser/${sellerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedSellerPayload),
      });
  
      if (response.ok) {
        const updatedUserResponse = await response.json();
        console.log("Updated user response from server:", updatedUserResponse);
  
        // Update users list with the updated seller info
        const updatedUser = updatedUserResponse.updateUser;
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user))
        );
        setShowEditModal(false); // Close the edit modal
      } else {
        const errorData = await response.json();
        console.error("Failed to update user:", errorData.message);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/v1/users/getAllUsers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Fetched users data:", data);
  
      const filteredUsers = data.data ? data.data.filter(user => {
        const hasId = user._id !== undefined;
        console.log(`User ID present for ${user.name}:`, hasId);
        return user.role === 'seller' && hasId;
      }) : [];
      
      console.log("Filtered users with role 'seller':", filteredUsers);
      
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };
  
  // Reuse fetchUsers in useEffect and after update
  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Sellers</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Seller
        </button>
      </div>
      <div className="overflow-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">No.</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Buisness Name</th>
              <th className="py-3 px-6 text-center"> businessAddress  </th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
          {users.filter(user => user?._id).map((user, index) => (
              <tr key={user?._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{index + 1}</td>
                <td className="py-3 px-6 text-left">{user.name}</td>
                <td className="py-3 px-6 text-left">{user.email}</td>
                <td className="py-3 px-6 text-left">{user?.sellerInfo?.businessName}</td>
                <td className="py-3 px-6 text-center">
                  <button className="text-blue-500 hover:text-blue-700 mr-2">
                    <PencilIcon onClick={() => handleEditClick(user)} className="h-5 w-5 inline" />
                  </button>
                  <button onClick={() => handleDelete(user._id)} className="text-red-500 hover:text-red-700">
                    <TrashIcon className="h-5 w-5 inline" />
                  </button>
                </td>
              </tr>
             // Render nothing if user is undefined or missing _id
            ))}
          </tbody>
        </table>
      </div>
      {showEditModal && (
        <EditSellerModal
          seller={selectedSeller}
          onSubmit={handleUpdateSeller}
          onClose={() => setShowEditModal(false)}
        />
      )}
      {/* Add Seller Modal */}
      {showModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="bg-white rounded-lg p-6 h-[560px] overflow-y-auto"> {/* Increased width */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Add New Seller</h3>
        <button onClick={() => setShowModal(false)}>
          <XIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
        </button>
      </div>
      <form onSubmit={handleAddUserSubmit} className="grid grid-cols-2 gap-4"> {/* 2-column grid */}
        {/* User Info */}
        <div className="col-span-2">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={newUser.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        {/* Address Info */}
        <div>
          <label className="block text-gray-700">City</label>
          <input
            type="text"
            name="addresses.city"
            value={newUser.addresses[0].city}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Street</label>
          <input
            type="text"
            name="addresses.street"
            value={newUser.addresses[0].street}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Phone</label>
          <input
            type="tel"
            name="addresses.phone"
            value={newUser.addresses[0].phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        {/* Seller Info */}
        <div>
          <label className="block text-gray-700">Business Name</label>
          <input
            type="text"
            name="sellerInfo.businessName"
            value={newUser.sellerInfo.businessName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Business Address</label>
          <input
            type="text"
            name="sellerInfo.businessAddress"
            value={newUser.sellerInfo.businessAddress}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Business Type</label>
          <input
            type="text"
            name="sellerInfo.businessType"
            value={newUser.sellerInfo.businessType}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Tax ID Number</label>
          <input
            type="text"
            name="sellerInfo.taxIdNumber"
            value={newUser.sellerInfo.taxIdNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Bank Account Number</label>
          <input
            type="text"
            name="sellerInfo.bankAccountNumber"
            value={newUser.sellerInfo.bankAccountNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Bank Name</label>
          <input
            type="text"
            name="sellerInfo.bankName"
            value={newUser.sellerInfo.bankName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Account Holder Name</label>
          <input
            type="text"
            name="sellerInfo.accountHolderName"
            value={newUser.sellerInfo.accountHolderName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Branch Code</label>
          <input
            type="text"
            name="sellerInfo.branchCode"
            value={newUser.sellerInfo.branchCode}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
  <label className="block text-gray-700">ID Card Number</label>
  <input
    type="text"
    name="sellerInfo.documents.idCardNumber"
    value={newUser.sellerInfo.documents.idCardNumber}
    onChange={handleChange}
    className="w-full px-3 py-2 border rounded"
    required
  />
</div>
<div>
                <label className="block text-gray-700">ID Image 1</label>
                <input
                  type="file"
                  name="idImage1"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                {isUploading && <p>Uploading...</p>}
              </div>
              <div>
                <label className="block text-gray-700">ID Image 2</label>
                <input
                  type="file"
                  name="idImage2"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                {isUploading && <p>Uploading...</p>}
              </div>

        <div className="col-span-2 flex justify-end">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 mr-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Seller
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default SellersPage;
