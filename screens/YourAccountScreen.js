import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase/config'; // Adjust this import according to your Firebase config file

const YourAccountScreen = () => {
  const [userData, setUserData] = useState(null);
  const [User, setUser] = useState();
  useEffect(() => {
   const unsubscribe = auth.onAuthStateChanged((user) => {
     setUser(user.uid);
   });
 
   return () => unsubscribe();
 }, []);
 useEffect(() => {
  if (!User) return;  

  const fetchUserData = async () => {
    const userRef = doc(firestore, 'app_users', User);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setUserData(userSnap.data());
    } else {
      console.log('No such document!');
    }
  };

  fetchUserData();
}, [User]);

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
      <ActivityIndicator/>
      </SafeAreaView>
    );
  }

  return (
   <SafeAreaView style={styles.container}>
   <ScrollView contentContainerStyle={styles.contentContainer}>
     <View style={styles.detailItem}>
       <Text style={styles.detailTitle}>Name:</Text>
       <Text style={styles.detailValue}>{userData.name}</Text>
     </View>
     <View style={styles.detailItem}>
       <Text style={styles.detailTitle}>Email:</Text>
       <Text style={styles.detailValue}>{userData.email}</Text>
     </View>
     <View style={styles.detailItem}>
       <Text style={styles.detailTitle}>Average Salary:</Text>
       <Text style={styles.detailValue}>{userData.avg_salary}</Text>
     </View>
     <View style={styles.detailItem}>
       <Text style={styles.detailTitle}>City:</Text>
       <Text style={styles.detailValue}>{userData.city}</Text>
     </View>
     
     <View style={styles.detailItem}>
       <Text style={styles.detailTitle}>Number:</Text>
       <Text style={styles.detailValue}>{userData.number}</Text>
     </View>
     <View style={styles.detailItem}>
       <Text style={styles.detailTitle}>Occupation:</Text>
       <Text style={styles.detailValue}>{userData.occupation}</Text>
     </View>
   </ScrollView>
 </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
  },
  detailItem: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  detailValue: {
    fontSize: 16,
    color: '#666',
    flexShrink: 1, // Ensure text does not go out of the screen
  },
});

export default YourAccountScreen;
