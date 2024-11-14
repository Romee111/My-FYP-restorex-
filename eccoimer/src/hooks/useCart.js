import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../store/actions/cartaction';

const useCart = () => {
  const dispatch = useDispatch();

  // Add item to cart
  const addCart = async (item) => {
    try {
      // Retrieve existing cart from local storage
      const existingCartItems = JSON.parse(localStorage.getItem('cart')) || [];

      // Check if item already exists in the cart
      const existingItemIndex = existingCartItems.findIndex(cartItem => cartItem.product_id === item.product_id);

      if (existingItemIndex >= 0) {
        // If item already exists, update the quantity
        existingCartItems[existingItemIndex].quantity += item.quantity;
      } else {
        // If item is new, add it to the cart
        existingCartItems.push(item);
      }

      // Save updated cart to local storage
      localStorage.setItem('cart', JSON.stringify(existingCartItems));

      // Sync with backend
      const response = await axios.post('http://localhost:3000/restorex/carts/addProductToCart', item);
      const data = response.data;

      // Dispatch action to add item to Redux store
      dispatch(addToCart(data));

      console.log('Cart after addition:', existingCartItems); // Log updated cart
    } catch (err) {
      console.error('Error adding item to cart:', err);
    }
  };

  // Remove item from cart
  const removeCart = async (id) => {
    try {
      // Retrieve existing cart from local storage
      const existingCartItems = JSON.parse(localStorage.getItem('cart')) || [];

      // Remove item from the cart
      const updatedCartItems = existingCartItems.filter(item => item.product_id !== id);

      // Save updated cart to local storage
      localStorage.setItem('cart', JSON.stringify(updatedCartItems));

      // Sync with backend
      await axios.delete(`http://localhost:3000/restorex/carts/removeProductFromCart/${id}`);

      // Dispatch action to remove item from Redux store
      dispatch(removeFromCart(id));

      console.log('Cart after removal:', updatedCartItems); // Log updated cart
    } catch (err) {
      console.error('Error removing item from cart:', err);
    }
  };
  const getCart = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/restorex/carts/getLoggedUserCart`);
      const data = response.data.addtocart; // Assuming addtocart contains the cart items

      // Save the cart data to local storage
      localStorage.setItem('cart', JSON.stringify(data));

      // Dispatch action to add items to Redux store
      data.forEach((item) => {
        dispatch(addToCart(item));
      });

      return data;
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  return { addCart, removeCart,getCart };
};

export default useCart;
