import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const PaymentMethodScreen = () => {
  const [cardDetails, setCardDetails] = useState();
  const { confirmPayment } = useStripe();

  const handlePayOnPickup = () => {
    Alert.alert("Payment Method", "Pay on Pickup selected.");
  };

  const handleStripePayment = async () => {
    if (!cardDetails?.complete) {
      Alert.alert("Payment Method", "Please enter complete card details.");
      return;
    }

    // Replace 'your_client_secret_from_backend' with the actual client secret from your backend
    const clientSecret = 'your_client_secret_from_backend';

    const { paymentIntent, error } = await confirmPayment(clientSecret, {
      type: 'Card',
      billingDetails: {}, // Add billing details here
    });

    if (error) {
      Alert.alert("Payment Error", error.message);
    } else if (paymentIntent) {
      Alert.alert("Payment Success", `Payment successful: ${paymentIntent.id}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Payment Method</Text>

      <Animated.View entering={FadeIn} exiting={FadeOut}>
        <TouchableOpacity style={styles.payButton} onPress={handlePayOnPickup}>
          <Text style={styles.buttonText}>Pay on Pickup</Text>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.sectionTitle}>Or pay with card:</Text>
      <CardField
        onCardChange={(card) => setCardDetails(card)}
        style={styles.cardField}
      />

      <Animated.View entering={FadeIn} exiting={FadeOut}>
        <TouchableOpacity style={styles.payButton} onPress={handleStripePayment}>
          <Text style={styles.buttonText}>Pay with Stripe</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
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
});
