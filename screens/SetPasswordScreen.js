import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, query, where, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase/config"; // Make sure this path is correct
import { MaterialIcons } from '@expo/vector-icons';

const SetPasswordScreen = () => {
 const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEmail = async () => {
      const storedEmail = await AsyncStorage.getItem("userEmail");
      if (storedEmail) setEmail(storedEmail);
    };
    fetchEmail();
  }, []);

  const handleSetPassword = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
  
    setIsLoading(true); // Start loading
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // This is the user object
  
      const requestRef = collection(firestore, "membership_request");
      const q = query(requestRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        for (const docSnapshot of querySnapshot.docs) {
          const requestData = docSnapshot.data();
  
          // Update the user's profile with a display name. Pass the user object correctly here.
          await updateProfile(user, {
            displayName: requestData.name
          });
  
          // Set user document in Firestore under "users" collection
          await setDoc(doc(firestore, "users", user.uid), {
            name: requestData.name,
            email: requestData.email,
            role: "member",
          });
  
          // Additionally, set user document under "app_users" collection
          await setDoc(doc(firestore, "app_users", user.uid), {
            ...requestData,
          });
        }
  
        Alert.alert("Success", "Your account has been successfully created.", [{ text: "OK", onPress: () => navigation.navigate("HomeScreen") }]);
      } else {
        console.log("No matching membership request found.");
        Alert.alert("Error", "No matching membership request found.");
      }
    } catch (error) {
      console.log(error);
      if (error.code === 'auth/email-already-in-use') {
        // If the email is already in use, prompt the user to login instead
        Alert.alert("Account Exists", "Your account exists, kindly login to your account.", [
          { text: "Login", onPress: () => navigation.navigate("Login") },
          { text: "Cancel", style: "cancel" },
        ]);
      } else {
        console.error("Error in user creation or data transfer:", error);
        Alert.alert("Error", error.message);
      }
    } finally {
      setIsLoading(false); // Ensure loading is stopped regardless of outcome
    }
  };
  
 


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
              color: "gray",
            }}
          >
            Set Password for your Account
          </Text>
        </View>
       
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
      <MaterialIcons
  style={{ marginLeft: 8,marginRight:8 }}
  name="password"
  size={24}
  color="gray"
  
/>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your Password"
          secureTextEntry
          style={{
           color: "gray",
           marginVertical: 10,
           width: 300,
           fontSize: email ? 16 : 16,
         }}
        />
        </View>
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
   <MaterialIcons
  style={{ marginLeft: 8,marginRight:8 }}
  name="password"
  size={24}
  color="gray"
  
/>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your Password"
          secureTextEntry
          style={{
           color: "gray",
           marginVertical: 10,
           width: 300,
           fontSize: email ? 16 : 16,
         }}
        />
        </View>
        <Pressable onPress={handleSetPassword} disabled={isLoading} style={styles.loginButton}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.loginButtonText}>Set Password</Text>
        )}
      </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // styles remain unchanged, add input style
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: "#FEBE10",
    borderRadius: 6,
    padding: 15,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SetPasswordScreen
