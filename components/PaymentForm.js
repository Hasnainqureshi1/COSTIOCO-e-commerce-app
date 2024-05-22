// CheckoutForm.js
import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Text,
  Alert,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import { useDispatch, useSelector } from "react-redux";
import { auth, firestore } from "../firebase/config";
import { Timestamp, addDoc, collection, doc, setDoc } from "firebase/firestore";
import OrderScreen from "../screens/OrderScreen";
import { useNavigation } from "@react-navigation/native";
import { cleanCart } from "../redux/CartReducer";
const PaymentForm = ({ totalItem, totalPayment, groupedItems }) => {
  const stripe = useStripe();
  const [User, setUser] = useState();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  let orderIds = [];
 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user.uid);
    });

    return () => unsubscribe();
  }, []);


  
  const cart = useSelector((state) => state.cart.cart);
  console.log("Cart data ", cart);
  const total = cart
    ?.map((item) => item.price * item.quantity)
    .reduce((curr, prev) => curr + prev, 0);
  const totalItems = cart
    ?.map((item) => item.quantity++)
    .reduce((curr, prev) => curr + prev, 0);

  const createOrdersForSellers = async (cartItems, userId) => {
    // Group cart items by seller_id
    const ordersBySeller = cartItems.reduce((acc, item) => {
      const sellerOrders = acc[item.seller_id] || [];
      sellerOrders.push({
        prod_id: item.id, // Ensure you have productId in your cart item structure
        quantity: item.quantity,
        sold_price: parseFloat(item.price), // Ensure price is in the correct format
      });
      acc[item.seller_id] = sellerOrders;
      return acc;
    }, {});

    // Create an order for each seller
    for (const [seller_id, products] of Object.entries(ordersBySeller)) {
      const order = {
        order_date: Timestamp.fromDate(new Date()), // Use Firebase Timestamp for the order date
        products, // Array of products
        seller_id,
        status: "pending",
        user_id: userId,
        payment: "paid",
      };

      // Save the order to Firestore
      try {
        // Instead of addDoc, directly create a document reference with a specific ID
        const docRef = doc(collection(firestore, "orders"));
        order.id = docRef.id; // Set the document's ID in the order object
        await setDoc(docRef, order); // Save the order with the included ID
        console.log("Order ID: ", docRef.id); // Successfully saved order
        orderIds.push(docRef.id);
      } catch (error) {
        console.error("Error creating order: ", error);
      }
    }
    console.log(orderIds);
  };

  const handlePayPress = async () => {
    console.log(totalItem);
    try {
      const response = await fetch(
        "https://8395-59-103-119-73.ngrok-free.app/api/stripe/create-payment-intent",
        {
          method: "POST",
          body: JSON.stringify({
            totalPayment: totalPayment,
            totalItem,
          }),

          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        return Alert.alert(data.message);
      }
      const clientSecret = data.clientSecret;
      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "COSTICO",
      });
      if (initSheet.error) return Alert.alert(initSheet.error.message);
      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret,
      });
      if (presentSheet.error) return Alert.alert(presentSheet.error.message);
      Alert.alert("Payment completed successfully");
      createOrdersForSellers(cart, User);
      dispatch(cleanCart(cart));
      navigation.navigate("OrderScreen", { orderIds: orderIds });

      //  fpxQTeRMlsjxInaXocTL
      // 0cmrRGBy08gkKm3iIWiD
    } catch (error) {
      console.error("Unexpected error:", error);
      Alert.alert("Unexpected Error", "An unexpected error occurred.");
    }
  };

  return (
    <View>
      <Text
        onPress={handlePayPress}
        style={{
          textAlign: "center",
          color: "#fff",
          fontSize: 20,

          fontWeight: "bold",
          paddingVertical: 15,
          paddingHorizontal: 30,
        }}
        title="Place Order"
      >
        Place Order
      </Text>
    </View>
  );
};

export default PaymentForm;
