import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_QUANTITY, CLEAR_CART   } from "../../store/actions/constant"

// Action to add an item to the cart
export const addToCart = (product, quantity) => {
    return {
        type: ADD_TO_CART,
        payload: {
            ...product,
            quantity: quantity || 1, // Default quantity to 1 if not provided
        }
    };
};

// Action to remove an item from the cart
export const removeFromCart = (id) => {
    return {
        type: REMOVE_FROM_CART,
        payload:  id 
    };
};
export const clearCart = () => {
    return {
        type: CLEAR_CART  
    };
}

// Action to update the quantity of an item in the cart
export const updateQuantity = (id, quantityChange) => {
    const parsedQuantity = Number(quantityChange);
    console.log(typeof parsedQuantity, parsedQuantity); // Check the type and value
    return {
        type: UPDATE_QUANTITY,
        payload: { id, quantityChange: parsedQuantity }
    };
    };
