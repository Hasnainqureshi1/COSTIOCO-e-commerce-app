import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./redux/CartReducer";
import { saveCartToStorage } from "./components/storage";

const store = configureStore({
    reducer: {
      cart: CartReducer,
      // other reducers...
    },
  });
  // Subscribe to store updates
// Subscribe to store updates to save the cart state
store.subscribe(() => {
    const cart = store.getState().cart.cart;
    
    saveCartToStorage(cart);
  });
  
  export default store;
