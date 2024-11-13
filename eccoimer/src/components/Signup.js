import React, { useState } from 'react';
import { useRegister } from '../hooks/useRegister'; // Import the custom hook
import Logo from "../assets/images/reslogo.png"
import { useNavigate } from 'react-router-dom';
const SignUp = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    country: '',
    city: '',
    pincode: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    image: null,
  });
  const { register, loading, error } = useRegister();
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if the passwords match
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Send form data to the API using the register hook
    const response = await register(form);

    if (response) {
      alert('Registration successful');
      navigate('/login');
      // Optionally, redirect the user to another page
    }
  };

  return (
    <div className="flex bg-white my-10">
      {/* Left side with logo */}
      <div className="w-1/2 flex justify-center items-center ">
        <img src={Logo} alt="Logo" className="w-96" />
      </div>

      {/* Right side with form */}
      <div className="w-1/2 flex justify-start items-center ">
        <form
          className="bg-white p-8 rounded-lg shadow-lg w-96"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-[#001F3F]">
            SIGN UP RESTOREX
          </h2>

          {error && <p className="text-red-600">{error}</p>} {/* Display error message */}
          {loading && <p className="text-blue-600">Loading...</p>} {/* Display loading message */}

          {/* First Name and Last Name */}
          <div className="mb-4 flex space-x-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="First name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="Last name"
                required
              />
            </div>
          </div>

          {/* Address1 */}
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address1"
              value={form.address1}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Address"
              required
            />
          </div>

          {/* Address2 */}
          <div className="mb-4">
            <label className="block text-gray-700">Address2</label>
            <input
              type="text"
              name="address2"
              value={form.address2}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Address2"
            />
          </div>

          {/* Country and City */}
          <div className="mb-4 flex space-x-4">
            <div>
              <label className="block text-gray-700">Country</label>
              <select
                name="country"
                value={form.country}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                required
              >
                <option value="">Select Country</option>
                {/* Add more countries here */}
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">State</label>
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="State"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">City</label>
              <select
                name="city"
                value={form.city}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                required
              >
                <option value="">Select City</option>
                {/* Add more cities here */}
                <option value="New York">New York</option>
                <option value="Toronto">Toronto</option>
              </select>
            </div>
          </div>

          {/* Pincode */}
          <div className="mb-4">
            <label className="block text-gray-700">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={form.pincode}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Pincode"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Email ID"
              required
            />
          </div>

          {/* Password and Confirm Password */}
          <div className="mb-4 flex space-x-4">
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="Password"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="Confirm Password"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="+1"
              required
            />
          </div>

          {/* Upload Image */}
          <div className="mb-4">
            <label className="block text-gray-700">Upload Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 mt-4 rounded-lg hover:bg-blue-900 transition"
            disabled={loading} // Disable the button while loading
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
