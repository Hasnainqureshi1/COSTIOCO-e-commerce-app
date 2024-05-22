import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import CheckRequest from "../screens/CheckRequest";
import RequestScreen from "../screens/RequestScreen";
import SetPasswordScreen from "../screens/SetPasswordScreen";
import HomeScreen from "../screens/HomeScreen";
import CategoryScreen from "../screens/CategoryScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RequestScreen";
// import HomeScreen from "../screens/HomeScreen";
// import ProductInfoScreen from "../screens/ProductInfoScreen";
 
// import CartScreen from "../screens/CartScreen";
// import ProfileScreen from "../screens/ProfileScreen";
import ConfirmationScreen from "../screens/ConfirmationScreen";
import OrderScreen from "../screens/OrderScreen";
import ProfileScreen from './../screens/ProfileScreen';
import CartScreen from './../screens/CartScreen';
import ProductInfoScreen from "../screens/ProductInfoScreen";
import Search from "../components/Search";
import ShopScreen from "../screens/ShopScreen";
import PaymentMethodScreen from "../screens/PaymentMethodScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import PaymentOptionsScreen from "../screens/PaymentOptionScreen";
import OrderHistory from "../screens/OrderHistory";
import YourAccountScreen from "../screens/YourAccountScreen";
import UserReviews from "../screens/UserReviews";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  function BottomTabs() {
    return (
      
      <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FEBE10",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: true,
        tabBarStyle: { paddingBottom: 5, paddingTop: 5, height: 60, ...styles.shadow }, // Apply shadow styles here
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: "Cart",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="shoppingcart" color={color} size={size} />
          ),
        }}
      />
      </Tab.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Request"
          component={RequestScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="checkRequest"
          component={CheckRequest}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SetPasswordScreen"
          component={SetPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={BottomTabs}
          options={{
            headerShown: true,
            headerTitle:'COSTCO'
            // headerTitle: () => <Search />,
            // Adjust other header options as needed
          }}
        />
        <Stack.Screen
          name="CategoryScreen"
          component={CategoryScreen}
          options={{
            headerShown: true,
            headerTitle:'',
            headerTitleAlign: 'center',
            // headerTitle: () => <Search />,
            // Adjust other header options as needed
          }}
        />
        
         <Stack.Screen
          name="Info"
          component={ProductInfoScreen}
          options={{
            headerShown: true,
            headerTitle:'Product Details',
            headerTitleAlign: 'center',
            // headerTitle: () => <Search />,
            // Adjust other header options as needed
          }}
        />
         <Stack.Screen
          name="Shop"
          component={ShopScreen}
          options={{
            headerShown: true,
            headerTitle:'Shop ',
            headerTitleAlign: 'center',
            // headerTitle: () => <Search />,
            // Adjust other header options as needed
          }}
        />
         
         <Stack.Screen
          name="Confirm"
          component={CheckoutScreen}
          options={{
            headerShown: false,
    
          }}
        />
         <Stack.Screen
          name="Payment"
          component={PaymentOptionsScreen}
          options={{
            headerShown: false,
    
          }}
        />
         <Stack.Screen
          name="OrderScreen"
          component={OrderScreen}
          options={{
            headerShown: false,
    
          }}
        />
         <Stack.Screen
          name="OrderHistory"
          component={OrderHistory}
          options={{
            headerShown: true,
            headerTitle:"Order History"
    
          }}
        />
         <Stack.Screen
          name="YourAccountScreen"
          component={YourAccountScreen}
          options={{
            headerShown: true,
            headerTitle:"Your Account Details",
    
          }}
        />
         <Stack.Screen
          name="UserReviews"
          component={UserReviews}
          options={{
            headerShown: true,
            headerTitle:"Reviews",
    
          }}
        />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
