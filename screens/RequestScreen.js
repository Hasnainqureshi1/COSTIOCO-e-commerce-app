import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  KeyboardAvoidingView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {collection, query,addDoc, where, getDocs, Timestamp } from "firebase/firestore";
import { app, firestore } from "../firebase/config";

const RequestScreen = () => {
  const [email, setEmail] = useState("");
  const [number, setphone] = useState("");
  const [name, setName] = useState("");
  const [avg_salary, setAvgSalary] = useState("");
  const [city, setCity] = useState("");
  const [occupation, setOccupation] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();
  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !number.trim() || !avg_salary.trim() || !city.trim() || !occupation.trim()) {
      setResponseMessage("All fields are required.");
      return; // Stop the function if any field is empty
    }
  
    setIsLoading(true);
  
 
  
    // Query for documents where 'email' field matches the provided email
    const usersRef = collection(firestore, "membership_request");
    const q = query(usersRef, where("email", "==", email));
    try {
      const querySnapshot = await getDocs(q);
    
      if (querySnapshot.docs.length > 0) {
        // Email already exists in Firestore, so show a message and stop the registration process
        setResponseMessage("An account with this email already exists.");
        setTimeout(() => {
          setResponseMessage('')
        }, 3000);
        setIsLoading(false);
        return;
      }
    
      // Get the current date as a Firestore Timestamp
      const currentDate = Timestamp.now();
    
      // Email does not exist, proceed with adding the new document
      const userDoc = {
        name: name,
        email: email,
        number: number,
        avg_salary: parseInt(avg_salary, 10), // Ensuring avg_salary is stored as an integer
        city: city,
        date: currentDate, // Using the current Firestore Timestamp
        occupation: occupation,
        role: "member",
        status: "Pending"
      };
    
      // Add the new document to Firestore
      await addDoc(usersRef, userDoc);
    
      // Update UI or state as needed after successful addition
      setResponseMessage("Your registration request has been successfully submitted.");
      setTimeout(() => {
        setResponseMessage('')
      }, 4000);
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding document: ", error);
      setResponseMessage("Failed to submit your registration request.");
      setTimeout(() => {
        setResponseMessage('')
      }, 3000);
      setIsLoading(false);
    }
  }
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center", justifyContent: "center", marginTop: 50 }}
    >
       <View style={{}}>
        <Text style={{fontSize:24, }}>
          COSTICO
        </Text>
      </View>
      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 12, color: "#041E42" }}>
           Request Membership Account
          </Text>
        </View>

        <View style={{ marginTop: 40 }}>
          {/* Name Input */}
          <TextInputField
            icon="person"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
          />

          {/* Email Input */}
          <TextInputField
            icon="email"
            value={email}
            onChangeText={setEmail}
            placeholder="your Email"
          />

        

          {/* Average Salary Input */}
          <TextInputField
            icon="payments"
            value={avg_salary}
            onChangeText={setAvgSalary}
            placeholder="your average salary"
            keyboardType="numeric"
          />

          {/* City Input */}
          <TextInputField
            icon="home"
            value={city}
            onChangeText={setCity}
            placeholder="your city"
          />
          <TextInputField
            icon="call"
            value={number}
            onChangeText={setphone}
            placeholder="your Phone Number"
            keyboardType="numeric"
          />

          {/* Occupation Input */}
          <TextInputField
            icon="work"
            value={occupation}
            onChangeText={setOccupation}
            placeholder="your occupation"
          />
        </View>

        {/* Register Button */}
        <Pressable
          onPress={handleRegister}
          style={{ width: 200, backgroundColor: "#FEBE10", borderRadius: 6, padding: 15, marginTop: 30, alignSelf: "center" }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            <Text style={{ textAlign: "center", color: "white", fontSize: 16, fontWeight: "bold" }}>
              Register
            </Text>
          )}
        </Pressable>

        {/* Response Message */}
        {responseMessage ? (
          <Text style={{ textAlign: "center", color: "green", fontSize: 16, marginTop: 20 }}>
            {responseMessage}
          </Text>
        ) : null}


        {/* Sign In Link */}
        <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 15 }}>
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
           Check Membership Request
          </Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("checkRequest")} style={{ marginTop: 15 }}>
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16,marginTop:-10 }}>
       Have Membership? Try Login
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const TextInputField = ({ icon, value, onChangeText, placeholder, secureTextEntry = false, keyboardType = "default" }) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#D0D0D0",
      paddingVertical: 5,
      borderRadius: 5,
      marginTop: 20,
      paddingLeft: 8,
    }}
  >
    <MaterialIcons name={icon} size={24} color="gray" />
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      placeholderTextColor="#fff"
      
      style={{   marginLeft: 10, marginVertical: 10,   width: 280, paddingLeft:5, color: "black" }}
    />
  </View>
);

export default RequestScreen;

// You can further customize styles or add validation as needed
