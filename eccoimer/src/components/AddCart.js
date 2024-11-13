
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function AddCart({ show, handleClose, product }) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.user_id;

  // Fetch cart items from local storage when component mounts
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:2900/getCart/getCart', { params: { userId } });
        setCartItems(response.data.cartItems || []);
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
      }
    };

    fetchCartItems();
  }, [userId]);

  // Function to add items to cart
  const addToCart = async (newItem) => {
    try {
      const response = await axios.post('http://localhost:2900/addtocart/createCart', newItem);
      if (response.data.success) {
        // If the API call is successful, update the cart items state
        setCartItems([...cartItems, newItem]);
        console.log('Item added to cart successfully:', response.data);
      } else {
        console.error('Failed to add item to cart:', response.data.message);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  // Increment quantity and add item to cart
  const handleIncrement = async () => {
    if (quantity < product.instock) {
      const updatedQuantity = quantity + 1;
      setQuantity(updatedQuantity);

      const updatedProduct = {
        product_id: product._id,
        user_id: userId,
        name: product.name,
        price: product.price,
        images: product.images, // Make sure the product images are added
        quantity: updatedQuantity,
      };

      addToCart(updatedProduct); // Add the item to cart
      console.log(`Added to cart: ${product.name} with quantity ${updatedQuantity}`);
    } else {
      alert('You have reached the maximum available stock.');
    }
  };

  // Decrement quantity and update cart
  const handleDecrement = async () => {
    if (quantity > 1) {
      const updatedQuantity = quantity - 1;
      setQuantity(updatedQuantity);

      const updatedProduct = {
        product_id: product._id,
        user_id: userId,
        name: product.name,
        price: product.price,
        images: product.images, // Make sure the product images are added
        quantity: updatedQuantity,
      };

      addToCart(updatedProduct); // Update the item in cart
      console.log(`Decreased quantity: ${product.name} to ${updatedQuantity}`);
    }
  };

  const handleCheckout = () => {
    navigate('/order'); // Navigate to checkout page
    handleClose(); // Close the cart modal
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-[800px] p-6 rounded-lg shadow-lg relative">
        <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-900" onClick={handleClose}>
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>

        {product ? (
          <div className="flex items-center space-x-4 mb-4 justify-between">
            <img src={product.images[0]} alt={product.name} className="w-24 h-24 object-cover rounded-md shadow" />
            <div className="flex justify-between space-x-6 items-center">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">${product.price.toFixed(2)}</p>
              {/* Increment and Decrement */}
              <div className="flex items-center mt-2">
                <button onClick={handleDecrement} className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400" disabled={quantity <= 1}>
                  -
                </button>
                <span className="px-4">{quantity}</span>
                <button onClick={handleIncrement} className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400" disabled={quantity >= product.instock}>
                  +
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>No items in the cart yet!</p>
        )}

        <div className="flex justify-center items-center mt-6">
          <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCart;
