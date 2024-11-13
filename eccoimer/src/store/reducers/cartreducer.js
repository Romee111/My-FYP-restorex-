// cartReducer.js
const initialState = {
    cartItems: []
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const existingItemIndex = state.cartItems.findIndex(item => item._id === action.payload._id);

            if (existingItemIndex >= 0) {
                // Update the quantity of the existing item
                const updatedCartItems = [...state.cartItems];
                updatedCartItems[existingItemIndex].quantity = action.payload.quantity;
                return {
                    ...state,
                    cartItems: updatedCartItems
                };
            } else {
                // Add new item to the cart
                return {
                    ...state,
                    cartItems: [...state.cartItems, action.payload]
                };
            }

        case 'REMOVE_FROM_CART':
            // console.log("Removing item from cart:", action.payload);
            // debugger
            return {
                ...state,
                cartItems: state.cartItems.filter(item => item._id !== action.payload)
            };

        case 'UPDATE_QUANTITY':
            
            return {
                ...state,
                cartItems: state.cartItems.map((item) =>
                    item._id === action.payload.id
                        ? { ...item, quantity: item.quantity +  Number(action.payload.quantityChange) }
                        : item
                )
            };
            case 'CLEAR_CART':
                return {
                    ...state,
                    cartItems: [], // Empty the cart
                };
          
         
            
        default:
            return state;
    }
    
};

export default cartReducer;


// cartReducer.js
// const initialState = {
//     cartItems: []
// };

// const cartReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case 'ADD_TO_CART':
//             const existingItemIndex = state.cartItems.findIndex(item => item._id === action.payload._id);

//             if (existingItemIndex >= 0) {
//                 // Update the quantity of the existing item
//                 const updatedCartItems = [...state.cartItems];
//                 updatedCartItems[existingItemIndex].quantity = action.payload.quantity;
//                 return {
//                     ...state,
//                     cartItems: updatedCartItems
//                 };
//             } else {
//                 // Add new item to the cart
//                 return {
//                     ...state,
//                     cartItems: [...state.cartItems, action.payload]
//                 };
//             }

//         default:
//             return state;
//     }
// };


// export default cartReducer;


//id==_id
//action.[ayload ] = undefined


// cart FE
// Place Order 


