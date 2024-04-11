import { createSlice } from "@reduxjs/toolkit";
// Call this function after dispatching any cart action
const updateCartInStorage = async (cart) => {
  try {
    const jsonValue = JSON.stringify(cart);
    await AsyncStorage.setItem('@cart', jsonValue);
  } catch (e) {
    console.log("Error saving cart", e);
  }
};
export const CartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    favorites: [], // New field for favorites
  },
  reducers: {
    addToCart: (state, action) => {
      // Assuming each product item has a unique 'id' and belongs to a 'seller_id'
      const { id, seller_id } = action.payload;
      const itemIndex = state.cart.findIndex(item => item.id === id && item.seller_id === seller_id);
    
      if (itemIndex !== -1) {
        // If the product already exists in the cart from the same seller, increase its quantity
        state.cart[itemIndex].quantity++;
      } else {
        // If the product is not in the cart, add it as a new item
        state.cart.push({ ...action.payload, quantity: 1 });
      }
    },
    
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload.id);
    },
    incrementQuantity: (state, action) => {
      console.log("underneath is cart id .........................")
      // console.log(item.id)
      const item = state.cart.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity++;
      }
    },
    decrementQuantity: (state, action) => {
      const item = state.cart.find(item => item.id === action.payload.id);
      if (item && item.quantity > 1) {
        item.quantity--;
      } else {
        state.cart = state.cart.filter(item => item.id !== action.payload.id);
      }
    },
    cleanCart: (state) => {
      state.cart = [];
    },
    // New reducer methods for favorites
    addToFavorites: (state, action) => {
      const isFavorited = state.favorites.find(item => item.id === action.payload.id);
      if (!isFavorited) {
        state.favorites.push(action.payload);
      }
    },
    removeFromFavorites: (state, action) => {
      state.favorites = state.favorites.filter(item => item.id !== action.payload.id);
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },
  },
});

// Export the new actions
export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  cleanCart,
  addToFavorites,
  removeFromFavorites,
  setCart,
} = CartSlice.actions;

export default CartSlice.reducer;
