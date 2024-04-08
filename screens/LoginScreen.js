import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState,useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase/config";
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (user) {
        // User is logged in
        navigation.replace('HomeScreen');
      } else {
        // No user is logged in
        await AsyncStorage.setItem('isLoggedIn', 'false');
        // Prevent navigation to 'Login' to avoid loop, since we're already on the login screen
      }
    });
  
    // Cleanup function
    return () => unsubscribe();
  }, []);
  
  
  const handleLogin = async () => {
    if (!email || !password) {
      setLoginError("Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // On successful login:
      await AsyncStorage.setItem('isLoggedIn', 'true');
      setIsLoading(false);
      navigation.replace("HomeScreen");
    } catch (error) {
      setIsLoading(false);
      setLoginError(error.message); // Simplified error handling
    }
  };
  
  if (isLoading) {
    return (
      <View style={{  flexDirection: "row",
      justifyContent: "space-around",
      padding: 10,    flex: 1,
      justifyContent: "center",}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
   
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center",justifyContent:"center", marginTop:50 }}
    >
      <View style={{}}>
        <Text style={{fontSize:24, }}>
          COSTICO
        </Text>
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 12,
              color: "#041E42",
            }}
          >
            Login In to your Account
          </Text>
        </View>

        <View style={{ marginTop: 50 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#D0D0D0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <MaterialIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="gray"
            />

            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: email ? 16 : 16,
              }}
              placeholder="enter your Email"
            />
          </View>
        </View>

        <View style={{ marginTop: 0 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#D0D0D0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <AntDesign
              name="lock1"
              size={24}
              color="gray"
              style={{ marginLeft: 8 }}
            />

            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: password ? 16 : 16,
              }}
              placeholder="enter your Password"
            />
          </View>
        </View>
        {loginError ? (
        <Text style={{color:'red',textAlign:'center'}}>{loginError}</Text>
      ) : null}
        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
       
           <Pressable
          onPress={handleLogin}
          style={{
            width: 200,
            backgroundColor: "#FEBE10",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 15,
            marginTop:10,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Login
          </Text>
        </Pressable>

          {/* <Text>Keep me logged in</Text>

          <Text style={{ color: "#007FFF", fontWeight: "500" }}>
            Forgot Password
          </Text> */}
        </View>

        <View style={{ marginTop: 80 }} />

       
        <Pressable
          onPress={() => navigation.navigate("Request")}
          style={{ marginTop: 15 }}
        >
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
            Don't have an account? 
          </Text>
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
            Request for membership
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("checkRequest")}
          style={{ marginTop: 15 }}
        >
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
            OR 
          </Text>
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
            Check Membership Request
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
