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
      const itemPresent = state.cart.find(item => item.id === action.payload.id);
      if (itemPresent) {
        itemPresent.quantity++;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload.id);
    },
    incrementQuantity: (state, action) => {
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
