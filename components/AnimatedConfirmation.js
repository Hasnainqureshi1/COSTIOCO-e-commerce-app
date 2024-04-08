import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';

const AnimatedConfirmation = ({ visible, onCheckQRCodePress }) => {
  const [opacity] = useState(new Animated.Value(1)); // Initial opacity is 0

  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } else {
      // Reset to invisible (optional, depending on your use case)
      opacity.setValue(0);
    }
  }, [visible, opacity]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text style={styles.confirmationText}>Your order has been received!</Text>
      
      <LottieView source={require('../assets/orderconfirm.json')} autoPlay loop />

      <TouchableOpacity style={styles.button} onPress={onCheckQRCodePress}>
        <Text style={styles.buttonText}>Check QR Code</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  confirmationText: {
    fontSize: 18,
    marginBottom: 20,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default AnimatedConfirmation;
