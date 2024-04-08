import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveCartToStorage = async (cart) => {
  try {
    const jsonValue = JSON.stringify(cart);
    await AsyncStorage.setItem('@cart', jsonValue);
  } catch (e) {
    console.log("Error saving cart to storage", e);
  }
};

export const loadCartFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@cart');
   
 
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log("Error loading cart from storage", e);
    return null;
  }
};
