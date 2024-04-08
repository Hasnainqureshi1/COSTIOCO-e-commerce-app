import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs,getDoc, addDoc, doc } from 'firebase/firestore';
import { auth, firestore } from '../firebase/config';
import {
 View, Text, Image, TextInput, Button, StyleSheet, ScrollView, ActivityIndicator
} from "react-native";

const UserReviews = () => {
 const [products, setProducts] = useState([]);
 const [reviews, setReviews] = useState({}); 
  const [userId, setUser] = useState();
  const [loading, setloading] = useState(false)
  useEffect(() => {
   const unsubscribe = auth.onAuthStateChanged((user) => {
     setUser(user.uid);
   });

   return () => unsubscribe();
 }, []);

  useEffect(() => {
    const fetchOrdersAndReviews = async () => {
     if(userId){
setloading(true);
    
      const ordersRef = collection(firestore, 'orders');
      const ordersQuery = query(ordersRef, where('user_id', '==', userId), where('status', '==', 'completed'));
      const ordersSnapshot = await getDocs(ordersQuery);
      let productIds = [];

      for (const orderDoc of ordersSnapshot.docs) {
        const orderData = orderDoc.data();
        console.log(orderData);
        productIds = productIds.concat(orderData.products.map(product => product.prod_id));
        console.log(productIds);
        console.log(productIds);
      }

      const reviewsRef = collection(firestore, 'reviews');
      const reviewsQuery = query(reviewsRef, where('user_id', '==', userId), where('prod_id', 'in', productIds));
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const reviewedProductIds = reviewsSnapshot.docs.map(doc => doc.data().prod_id);

      for (const productId of productIds) {
       if (!reviewedProductIds.includes(productId)) {
         console.log("productId");
         console.log(productId);
     
         // Reference the product document directly by its ID
         const productRef = doc(firestore, 'products', productId);
         const productSnapshot = await getDoc(productRef);
     
         if (productSnapshot.exists()) { // Check if the document exists
           console.log("ProductSnapshot");
           console.log(productSnapshot.data());
     
           const productData = productSnapshot.data();
           setProducts(prevProducts => [...prevProducts, { ...productData, prod_id: productId }]);
         } else {
           console.log("No product found for ID:", productId);
         }
       }
     }
     }
     setloading(false);
    };

    fetchOrdersAndReviews();
  }, [userId]);
 if(loading){
  return  <ActivityIndicator size={'large'}/>
 }
 const handleReviewSubmit = async (prodId) => {
  const comment = reviews[prodId]?.comment || '';
  const rating = reviews[prodId]?.rating || 0;

  try {
    await addDoc(collection(firestore, 'reviews'), {
      prod_id: prodId,
      comment,
      rating,
      user_id: userId,
    });
    alert('Review submitted successfully');
    // After successful submission, remove the reviewed product from the list
    setProducts(products.filter(product => product.prod_id !== prodId));
  } catch (error) {
    console.error('Error submitting review:', error);
    alert('Failed to submit review. Please try again.');
  }
};

const updateReview = (prodId, field, value) => {
  setReviews({
    ...reviews,
    [prodId]: {
      ...reviews[prodId],
      [field]: value,
    },
  });
};

  return (
   <ScrollView contentContainerStyle={styles.container}>
   <Text style={styles.title}>Products Pending Review</Text>
   {products.length > 0 ? (
     products.map((product, index) => (
       <View key={index} style={styles.productContainer}>
         <Image source={{ uri: product.images[0] }} style={styles.image} />
         <Text>{product.name}</Text>
         <Text>Price: ${product.price}</Text>
         <TextInput
           style={styles.input}
           onChangeText={(text) => updateReview(product.prod_id, 'comment', text)}
           value={reviews[product.prod_id]?.comment || ''}
           placeholder="Leave a review"
           multiline
         />
        <TextInput
  style={styles.input}
  onChangeText={(text) => {
    const rating = parseInt(text, 10);
    if (rating >= 0 && rating <= 5) {
      updateReview(product.prod_id, 'rating', rating);
    }
  }}
  value={String(reviews[product.prod_id]?.rating || '')}
  placeholder="Rating (0-5)"
  keyboardType="numeric"
/>
         <Button
           title="Submit Review"
           onPress={() => handleReviewSubmit(product.prod_id)}
         />
       </View>
     ))
   ) : (
     <Text>You have reviewed all your purchased products.</Text>
   )}
 </ScrollView>
  );
};
const styles = StyleSheet.create({
 container: {
   padding: 20,
 },
 title: {
   fontSize: 20,
   fontWeight: 'bold',
   marginBottom: 20,
 },
 productContainer: {
   marginBottom: 20,
 },
 image: {
   width: 100,
   height: 100,
 },
 input: {
   borderWidth: 1,
   borderColor: 'gray',
   marginTop: 10,
   marginBottom: 10,
   padding: 10,
 },
});

export default UserReviews;
