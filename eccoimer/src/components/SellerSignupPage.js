import React, { useState } from "react";
import { useRegister } from "../hooks/useRegister";
import { useNavigate } from "react-router-dom";

const SellerSignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "seller",
    isActive: true,
    city: "",
    street: "",
    phone: "",
    businessName: "",
    businessAddress: "",
    businessType: "",
    taxIdNumber: "",
    bankAccountNumber: "",
    bankName: "",
    accountHolderName: "",
    branchCode: "",
    idCardNumber: "",
    idImage1: null,
    idImage2: null
  });

  const { register, loading, error } = useRegister();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Using FormData to include file data
    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        submitData.append(key, formData[key]);
      }
    });

    try {
      await register(formData);
      alert("Seller registered successfully!");
      window.location.href = "http://localhost:3002";
   // Redirect to seller panel
    } catch (err) {
      console.error("Error registering seller:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-2xl">
        <div className="bg-[#001F3F] p-6 text-center text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome to Seller Signup</h1>
          <p>Join our platform and start selling today!</p>
        </div>

        <form className="p-8 space-y-4" onSubmit={handleSubmit} encType="multipart/form-data">
          {error && <p className="text-red-600">{error}</p>}
          {loading && <p className="text-blue-600">Loading...</p>}

          {/* Name and Email */}
          <div className="flex gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-1/2 p-2 border border-gray-300 rounded"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-1/2 p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Password and Phone */}
          <div className="flex gap-4">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-1/2 p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              required
              className="w-1/2 p-2 border border-gray-300 rounded"
            />
          </div>

          {/* City and Street */}
          <div className="flex gap-4">
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              required
              className="w-1/2 p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="Street"
              required
              className="w-1/2 p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Business Details */}
          <div className="flex gap-4">
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Business Name"
              required
              className="w-1/2 p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="businessAddress"
              value={formData.businessAddress}
              onChange={handleChange}
              placeholder="Business Address"
              required
              className="w-1/2 p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              placeholder="Business Type"
              required
              className="w-1/2 p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="taxIdNumber"
              value={formData.taxIdNumber}
              onChange={handleChange}
              placeholder="Tax ID Number"
              required
              className="w-1/2 p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Bank Details */}
          <div className="flex gap-4">
            <input
              type="text"
              name="bankAccountNumber"
              value={formData.bankAccountNumber}
              onChange={handleChange}
              placeholder="Bank Account Number"
              required
              className="w-1/2 p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              placeholder="Bank Name"
              required
              className="w-1/2 p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              name="accountHolderName"
              value={formData.accountHolderName}
              onChange={handleChange}
              placeholder="Account Holder Name"
              required
              className="w-1/2 p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="branchCode"
              value={formData.branchCode}
              onChange={handleChange}
              placeholder="Branch Code"
              required
              className="w-1/2 p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Documents */}
          <div className="flex gap-4">
            <input
              type="text"
              name="idCardNumber"
              value={formData.idCardNumber}
              onChange={handleChange}
              placeholder="ID Card Number"
              required
              className="w-1/2 p-2 border border-gray-300 rounded"
            />
            {/* <input
              type="file"
              name="idImage1"
              onChange={handleFileChange}
              required
              className="w-1/2 p-2 border border-gray-300 rounded"
            /> */}
          </div>
          {/* <div className="flex gap-4">
            <input
              type="file"
              name="idImage2"
              onChange={handleFileChange}
              required
              className="w-1/2 p-2 border border-gray-300 rounded"
            />
          </div> */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#001F3F] text-white p-2 rounded hover:bg-blue-800"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerSignupPage;
