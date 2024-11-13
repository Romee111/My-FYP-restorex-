import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchProducts } from "../hooks/useSearchProducts"; // Import the search hook
import Logo from "../assets/images/reslogo.png";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useProducts } from '../hooks/useProducts';
import axios from 'axios';
const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { suggestions, getSuggestions } = useSearchProducts(); // Use the hook to get suggestions
  const [showSuggestions, setShowSuggestions] = useState(false); // State to show/hide suggestions
  const dropdownRef = useRef(null); // Reference to dropdown for click detection
  const [showCart, setShowCart] = useState(false); // State to toggle cart modal
  const [cartItems, setCartItems] = useState([]); // State to manage cart items from local storage
  const { products, loading , heavyProducts } = useProducts();
  const [showCategories, setShowCategories] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.user_id;
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:2900/getCart/getCart', { params: { userId } });
        setCartItems(response.data.addtocart);
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
      }
    };

    fetchCartItems();
  }, []);
  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     const updatedCartItems = JSON.parse(localStorage.getItem("cart")) || [];
  //     setCartItems(updatedCartItems);
  //   };

  //   window.addEventListener("storage", handleStorageChange);

  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, []);

  // Handle search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery}`); // Redirect to search results page with the query
      setShowSuggestions(false); // Hide suggestions after search
    }
  };

  // Handle input change for search bar
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      getSuggestions(query); // Fetch suggestions when the user types
      setShowSuggestions(true); // Show suggestions when input is entered
    } else {
      setShowSuggestions(false); // Hide suggestions if input is cleared
    }
  };

  // Close suggestions when clicking outside the search dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false); // Hide suggestions when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title); // Set the search input to the clicked suggestion
    navigate(`/search/${suggestion.title}`); // Redirect to the search results page
    setShowSuggestions(false); // Hide suggestions after clicking
  };

  // Toggle cart visibility
  const toggleCartVisibility = () => {
    setShowCart(!showCart);
  };
  const addToCart = async (newItem) => {
    try {
      const response = await axios.post('http://localhost:3000/restorex/carts/addProductToCart', newItem);
      if (response.data.success) {
        setCartItems([...cartItems, newItem]);
        console.log('Item added to cart successfully:', response.data);
      } else {
        console.error('Failed to add item to cart:', response.data.message);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };
  // Remove an item from the cart
  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/restorex/carts/removeProductFromCart/${productId}`, {
        data: { userId, productId }
      });
      if (response.data.success) {
        const updatedCart = cartItems.filter((item) => item.product_id._id !== productId);
        setCartItems(updatedCart);
        console.log('Item removed from cart:', response.data);
      } else {
        console.error('Failed to remove item from cart:', response.data.message);
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };
const uniqueCategories = heavyProducts.reduce((acc, product) => {
  // debugger
    const categoryName = product?.category?.name;
    if (categoryName && !acc.includes(categoryName)) {
      acc.push(categoryName);
    }
    return acc;
  }, []);
  return (
    <nav className="bg-[#001F3F] text-white relative">
    <div className="container mx-auto flex items-center justify-between py-4">
      <div className="w-24">
        <Link to="/">
          <div className="w-24">
            <img src={Logo} alt="Logo" />
          </div>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative items-center">
        <form onSubmit={handleSearch} className="flex w-full relative">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={handleInputChange} // Update search query on input change
            className="px-4 py-2 text-black w-[500px] rounded-l-lg outline-none" // Rounded corners for left side
            onFocus={() => setShowSuggestions(true)} // Show suggestions when input is focused
          />
          <button
            type="submit"
            style={{ backgroundColor: '#001f3f', color: 'white', border:'1px solid white' }}
            className="bg-blue-700 px-4 py-2 rounded-r-lg hover:bg-blue-950"
          >
            Search
          </button>
        </form>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul
            ref={dropdownRef}
            className="absolute bg-white border mt-2 w-full z-10 text-black rounded-lg shadow-lg"
          >
            {suggestions.map((suggestion) => (
              <li
                key={suggestion._id}
                onClick={() => handleSuggestionClick(suggestion)} // Handle suggestion click
                className="px-4 py-3 cursor-pointer hover:bg-blue-100 transition-all duration-200 ease-in-out"
              >
                {suggestion.title} {/* Display the suggestion name */}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center relative">
        {/* Shopping Cart Icon */}
        <div
          className="relative cursor-pointer"
          onClick={toggleCartVisibility}
        >
          <FaShoppingCart size={30} className="text-white" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full px-2 py-1 text-xs font-bold">
              {cartItems.length}
            </span>
          )}
        </div>

        {/* User Icon */}
        <div className="icon text-white text-xl space-x-8 ml-4">
          <FaUser />
        </div>

        {/* Cart Modal */}
        {showCart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-black">
            <div className="bg-white w-[80%] h-[70%] p-6 rounded-lg shadow-lg relative">
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                onClick={toggleCartVisibility}
              >
                &times;
              </button>
              <h3 className="text-lg font-bold">Shopping Cart</h3>

              {/* Cart Items Display */}
              {cartItems.length > 0 ? (
                <ul className="mt-4">
                  {cartItems.map((item) => (
                    <li
                      key={item.product_id}
                      className="flex justify-between items-center py-2 border-b"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          className="w-[104px]"
                          src={item.images[0]} // Assuming images is an array
                          alt={item.name}
                        />
                        <span>{item.title}</span>
                      </div>
                      <span>${item.price.toFixed(2)}</span>
                      {/* Remove from cart */}
                      <button
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                        onClick={() => removeFromCart(item.product_id)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm mt-2">Your cart is empty.</p>
              )}

              {/* Checkout Button */}
              <Link to="/order">
                <button className="w-full bg-blue-600 text-white py-2 mt-4 rounded-lg hover:bg-blue-700 transition">
                  Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Navigation Links */}
    <div>
      <div className="flex items-center space-x-20 justify-center pb-4">
        <Link className="hover:underline" to="/">
          Home
        </Link>
        <div className="relative group">
    <button className="hover:underline">
      Categories
    </button>

    {/* Dropdown Menu - visible on hover */}
    <div className="absolute bg-white text-black p-4 rounded shadow-lg z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 group-hover:block">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {uniqueCategories.map((category, index) => (
            <li key={index}>
              <Link
                to={`/category/${category}`}
                className="hover:text-blue-700 transition"
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
        <a href="#" className="hover:underline">
          Brands
        </a>
        <Link to="/sellersignup" className="hover:underline">
          Become a Seller
        </Link>
        <a href="#" className="hover:underline">
          Help & Support
        </a>
      </div>
    </div>
  </nav>
  );
};

export default Navbar;
