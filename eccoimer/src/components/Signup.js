import React, { useState } from "react";
import { useRegister } from "../hooks/useRegister";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",  // Set role to "user" by default for simple users
    isActive: true,
    city: "",
    street: "",
    phone: ""
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register(formData);
      alert("User registered successfully!");
      // navigate("/LoginModal"); // Redirect to the user's dashboard or desired page
    } catch (err) {
      console.error("Error registering user:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-2xl">
        <div className="bg-[#001F3F] p-6 text-center text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome to User Signup</h1>
          <p>Join our platform today!</p>
        </div>

        <form className="p-8 space-y-4" onSubmit={handleSubmit}>
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

export default SignupPage;
