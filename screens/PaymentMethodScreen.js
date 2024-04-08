import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, Image, Alert } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const PaymentMethodScreen = () => {
  const [cardDetails, setCardDetails] = useState();

  // Dummy product data
  const products = [
    { id: '1', name: 'Product 1', price: '$10', image: 'https://via.placeholder.com/150' },
    { id: '2', name: 'Product 2', price: '$15', image: 'https://via.placeholder.com/150' },
    // Add more products as needed
  ];

  const renderProduct = ({ item }) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
    </View>
  );

  const handlePayOnPickup = () => {
    Alert.alert("Payment Method", "Pay on Pickup selected.");
  };

  const handleStripePayment = async () => {
    if (!cardDetails?.complete) {
      Alert.alert("Payment Method", "Please enter complete card details.");
      return;
    }
    // Payment logic goes here
  };

  return (
    <SafeAreaView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Order</Text>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        numColumns={2}
        style={styles.productsList}
      />
      <Animated.View entering={FadeIn} exiting={FadeOut}>
        <TouchableOpacity style={styles.payButton} onPress={handlePayOnPickup}>
          <Text style={styles.buttonText}>Pay on Pickup</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.payButton} onPress={handleStripePayment}>
          <Text style={styles.buttonText}>Pay with Card</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default PaymentMethodScreen;
const styles = StyleSheet.create({
 container: {
   flexGrow: 1,
   justifyContent: 'flex-start',
   alignItems: 'center',
   paddingTop: 20,
   paddingBottom: 50,
   marginTop:40,
 },
 title: {
   fontSize: 22,
   fontWeight: '600',
   marginBottom: 30,
   color: '#333',
 },
 payButton: {
   backgroundColor: '#6200ee',
   paddingVertical: 12,
   paddingHorizontal: 25,
   borderRadius: 30,
   marginVertical: 10,
   width: 250,
   alignItems: 'center',
 },
 buttonText: {
   color: '#ffffff',
   fontSize: 18,
   fontWeight: '500',
 },
 cardField: {
   width: '90%',
   height: 50,
   marginVertical: 30,
 },
 sectionTitle: {
   fontSize: 18,
   color: '#555',
   marginBottom: 10,
 },
 productsList: {
  flexGrow: 0, // This prevents the FlatList from growing and taking up all space
  marginTop: 10,
  marginBottom: 20,
},
productContainer: {
  flex: 1,
  margin: 5,
  alignItems: 'center',
  backgroundColor: '#f9f9f9',
  borderRadius: 5,
  padding: 10,
  elevation: 2, // Add shadow for Android
  shadowColor: '#000', // Add shadow for iOS
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
},
productImage: {
  width: 100,
  height: 100,
  marginBottom: 5,
},
productName: {
  fontSize: 14,
  fontWeight: 'bold',
  marginBottom: 5,
},
productPrice: {
  fontSize: 14,
},
payButton: {
  backgroundColor: '#6200ee',
  paddingVertical: 12,
  paddingHorizontal: 25,
  borderRadius: 30,
  marginVertical: 10,
  alignItems: 'center',
  width: '80%', // Make the button take 80% of container width
  alignSelf: 'center', // Center the button horizontally
},
buttonText: {
  color: '#ffffff',
  fontSize: 18,
  fontWeight: '500',
},
});
