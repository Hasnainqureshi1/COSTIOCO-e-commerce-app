import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from "../firebase/config";
import AsyncStorage from "@react-native-async-storage/async-storage";


const CheckRequest = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
  const handleLogin = async () => {
   // Query Firestore for a membership request with the given email
   const requestsRef = collection(firestore, "membership_request");
   const q = query(requestsRef, where("email", "==", email));
 
   try {
     const querySnapshot = await getDocs(q);
     if (querySnapshot.empty) {
       Alert.alert("No request found", "No membership request found with this email.");
       return;
     }
 
     querySnapshot.forEach((doc) => {
       const requestData = doc.data();
       if (requestData.status === "Pending") {
         Alert.alert("Request Pending", "Your membership request is still pending.");
       } else if (requestData.status === "Accepted") {
        Alert.alert("Request Accepted", "Your request has been accepted. Welcome!", [
         {
           text: "OK",
           onPress: async () => {
             try {
               await AsyncStorage.setItem('userEmail', email);
               navigation.navigate("SetPasswordScreen"); // Assuming this is your next screen
             } catch (error) {
               console.error("Error saving email to storage:", error);
               Alert.alert("Error", "Could not save email. Please try again.");
             }
           },
         },
       ]);
       } else {
         Alert.alert("Request Status", `Your request status is: ${requestData.status}.`);
       }
     });
   } catch (error) {
     console.error("Error fetching membership request:", error);
     Alert.alert("Error", "Could not check membership request.");
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
              color: "#041E42",
            }}
          >
            Check Membership Request
          </Text>
        </View>
      <View style={{marginTop:60}} >
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

      <Pressable onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Check Membership Request</Text>
      </Pressable>
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
  onPress={() => navigation.navigate("Login")}
  style={{ marginTop: 15 }}
>
  <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
    OR 
  </Text>
  <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
   Have Membership? Login here
  </Text>
</Pressable>
</KeyboardAvoidingView>
      {/* Other components like Register navigation */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  loginButton: {
     marginTop: 20,
    backgroundColor: "#FEBE10",
    borderRadius: 6,
    padding: 15,
    
    marginLeft: "auto",
    marginRight: "auto",
  },
  loginButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Add other styles as needed
});

export default CheckRequest;
