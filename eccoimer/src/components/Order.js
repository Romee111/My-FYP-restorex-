import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeFromCart } from '../store/actions/cartaction';
import { FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';

function Order() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.user_id; // Extract the user_id

    const [cartItems, setCartItems] = useState([]);

    // Fetch cart items from localStorage based on user_id
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`http://localhost:2900/getCart/getCart`); // Use userId to get cart
                setCartItems(response.data.addtocart); // Assuming the backend returns the cart in 'addtocart'
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        if (userId) {
            fetchCartItems(); // Fetch the cart items only if user is logged in
        }
    }, [userId]);

    const handleRemoveFromCart = async (product_id) => {
        try {
            // Remove the item from the backend
            await axios.delete(`http://localhost:2900/addtoCart/deleteCart/${product_id}`, {
                data: { userId } // Pass the userId in the request body
            });

            // Remove the item from cartItems state
            const updatedCartItems = cartItems.filter(item => item.product_id._id !== product_id);
            setCartItems(updatedCartItems);

            // Optionally, update the Redux store
            // dispatch(removeFromCart(product_id));
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const [form, setForm] = useState({
        name: '',
        address: '',
        email: '',
        city: '',
        country: '',
        phone: '',
        zip: ''
    });

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="container mx-auto py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Order Summary Section */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-3xl font-semibold mb-6">Order Summary</h2>
                    <div className="p-4 bg-gray-100 rounded-lg">
                        {cartItems.length === 0 ? (
                            <p>No items in the cart.</p>
                        ) : (
                            <ul>
                                {cartItems.map((item) => (
                                    <li key={item.product_id} className="flex justify-between items-center my-2">
                                        <div className="flex items-center space-x-4">
                                            <img className='w-[104px]' src={item.product_id.images} alt="" />
                                            <span>{item.product_id.name}</span>
                                        </div>
                                        <div className='gap-2 flex'>
                                            <span>${(item.product_id.price).toFixed(2)}</span>
                                            <button onClick={() => handleRemoveFromCart(item.product_id._id)}>
                                                <FaTrashAlt className="text-red-600 hover:text-red-800" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="mt-4 text-xl font-semibold">
                            Total: <span className="font-bold text-2xl">${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* User Details Section */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-3xl font-semibold mb-6">Shipping Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-bold text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={form.name}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                                placeholder="Enter your name"
                            />
                        </div>

                        {/* Address */}
                        <div className="mb-4 col-span-2">
                            <label htmlFor="address" className="block text-sm font-bold text-gray-700">Address</label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                value={form.address}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                                placeholder="Enter your address"
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={form.email}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                                placeholder="Enter your email"
                            />
                        </div>

                        {/* City */}
                        <div className="mb-4">
                            <label htmlFor="city" className="block text-sm font-bold text-gray-700">City</label>
                            <input
                                type="text"
                                name="city"
                                id="city"
                                value={form.city}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                                placeholder="Enter your city"
                            />
                        </div>

                        {/* Country */}
                        <div className="mb-4">
                            <label htmlFor="country" className="block text-sm font-bold text-gray-700">Country</label>
                            <input
                                type="text"
                                name="country"
                                id="country"
                                value={form.country}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                                placeholder="Enter your country"
                            />
                        </div>

                        {/* Phone */}
                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-sm font-bold text-gray-700">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                id="phone"
                                value={form.phone}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                                placeholder="Enter your phone"
                            />
                        </div>

                        {/* Zip Code */}
                        <div className="mb-4">
                            <label htmlFor="zip" className="block text-sm font-bold text-gray-700">ZIP Code</label>
                            <input
                                type="text"
                                name="zip"
                                id="zip"
                                value={form.zip}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                                placeholder="Enter your ZIP Code"
                            />
                        </div>
                    </div>
                    <a href="https://www.jazzcash.com.pk/">
                        <button className="w-full bg-blue-600 text-white py-3 mt-4 rounded-md hover:bg-blue-700 transition">
                            Proceed to Payment
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Order;
