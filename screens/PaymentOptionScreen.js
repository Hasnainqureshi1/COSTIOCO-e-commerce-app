import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView,Modal, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedConfirmation from '../components/AnimatedConfirmation';
import OrderScreen from './OrderScreen';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { auth, firestore } from '../firebase/config';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import PaymentForm from '../components/PaymentForm';
import { StripeProvider } from '@stripe/stripe-react-native';

const PaymentMethodScreen = () => {
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false);
 const [showStripeModal, setShowStripeModal] = useState(false);
 const [showConfirmation, setShowConfirmation] = useState(false);

 
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);
  const cart = useSelector((state) => state.cart.cart);
  // console.log("Cart data ",cart)
  const total = cart
  ?.map((item) => item.price * item.quantity)
  .reduce((curr, prev) => curr + prev, 0);
  const totalItems = cart
  ?.map((item) =>  item.quantity++)
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
    user_id: userId, // Pass the current user's ID
  };

  // Save the order to Firestore
  try {
    const docRef = await addDoc(collection(firestore, "orders"), order);
    console.log("Order ID: ", docRef.id); // Successfully saved order
  } catch (error) {
    console.error("Error creating order: ", error);
  }
}
};



  useEffect(() => {
    if (showConfirmation) {
      // Override hardware back button on Android
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true // Ignore the back button event
      );

      // Return the cleanup function
      return () => backHandler.remove();
    }
  }, [showConfirmation]);
  const handlePayOnPickup = () => {
    setSelectedPaymentOption('payOnPickup');
    // Additional logic for pay on pickup
  };

  const handleStripePayment = () => {
    setSelectedPaymentOption('stripe');
    setShowStripeModal(true); // Assuming you want to show a modal for Stripe
  };

  const handleConfirmStripePayment = () => {
    // Perform Stripe payment processing here and close the modal
    alert('Stripe payment confirmed.');
    setShowStripeModal(false);
  };

  const handleConfirmPayment = () => {
    if (selectedPaymentOption === 'payOnPickup') {
      setShowConfirmation(true);
      createOrdersForSellers(cart,User)
       // Additional logic for confirming the order

      // Perform necessary action for Pay on Pickup
    } else if (selectedPaymentOption === 'stripe') {
      setShowStripeModal(true); // Show Stripe modal for further confirmation
    }
  };

  // Dynamic style for selected option
  const getOptionStyle = (optionName) => ({
    ...styles.paymentOption,
    backgroundColor: selectedPaymentOption === optionName ? '#ffcd27' : '#FFF',
  });

 //  dsfksd
 const confirmOrder = () => {
  setShowConfirmation(true);
 
};

if (showConfirmation) {
 
  
  // Only show the animated confirmation screen if confirmation is true
  return (
    <OrderScreen/>
  );
}
 
 
 
  return (
   <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Purchase Now</Text>

      {/* Payment Options */}
      {/* <TouchableOpacity
        style={getOptionStyle('payOnPickup')}
        onPress={handlePayOnPickup}>
        <Text style={styles.paymentText}>Pay on Pickup</Text>
      </TouchableOpacity> */}
<StripeProvider
  publishableKey='pk_test_51P1llfFZvvbxFtlIbgtzDdHqpWkJjVBjO3UJrF11x9i6XEHTwi5dJumw9cCv4W635H7UBKZCDjJLwPwoXRDIYXy600zXgPGtRd'
>


      <TouchableOpacity
        style={styles.payButton}
        onPress={() => setModalVisible(true)}>
          <PaymentForm closeModal={() => setModalVisible(false)} />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalView}>
          <PaymentForm closeModal={() => setModalVisible(false)} />
        </View>
      </Modal>
      </StripeProvider>
     
{/* Render Confirm Button based on selection */}
{selectedPaymentOption && (
        <TouchableOpacity style={styles.placeOrderButton} onPress={handleConfirmPayment}>
          <Text style={styles.placeOrderText}>Confirm Payment</Text>
        </TouchableOpacity>
      )}
 
    
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#eeeeee',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paymentOption: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  paymentText: {
    textAlign: 'center',
  },
  paymentOption: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#ffb923',
    borderRadius: 5,
  },
  paymentText: {
    fontSize: 18,
  },
  summary: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 5,
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e31837',
  },
  placeOrderButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ff4500',
    borderRadius: 5,
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
 
  paymentText: { color: 'white' },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // Position the modal at the bottom half of the screen
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default PaymentMethodScreen;
