import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import style from '../Style/style';
import { useNavigation } from '@react-navigation/native';
import { collection, query, getDocs, limit } from 'firebase/firestore';
import {  firestore } from "../firebase/config";
const bestSellers = [
  {
    id: '1',
    imageUri: 'https://via.placeholder.com/150',
    shopName: 'Shop One',
    category:"Category",
    rating:"4",
  },
  {
    id: '2',
    imageUri: 'https://via.placeholder.com/150',
    shopName: 'Shop Two',
    category:"Category",
    rating:"4",
  },
  {
    id: '3',
    imageUri: 'https://via.placeholder.com/150',
    shopName: 'Shop Three',
    category:"Category",
    rating:"0",
  },
  // Add more items as needed
];



const BestSellers = () => {
 const navigation = useNavigation();
 const [shops, setShops] = useState([]);
const [loading, setloading] = useState(true)

 useEffect(() => {
  const fetchShops = async () => {
    setloading(true)
    console.log("fetchedShops");
    const q = query(collection(firestore, "shop"), limit(10));
    console.log("fetchedShops");
    const querySnapshot = await getDocs(q);
    const fetchedShops = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setShops(fetchedShops);
    setloading(false)
   
  };

  fetchShops();
}, []);
const renderStars = (rating) => {
 const fullStars = Math.floor(rating);
 const halfStar = rating % 1 ? 1 : 0;
 const emptyStars = 5 - fullStars - halfStar;
 return (
   <View style={{ flexDirection: 'row' }}>
     {Array(fullStars).fill(<MaterialIcons name="star" size={24} color="gold" />)}
     {halfStar ? <MaterialIcons name="star-half" size={24} color="gold" /> : null}
     {Array(emptyStars).fill(<MaterialIcons name="star-outline" size={24} color="gold" />)}
   </View>
 );
};

  
  return (
   < >
   {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        shops.map(item => (
          <Pressable
            onPress={() => navigation.navigate('Shop', { ...item })}
            key={item.id}
            style={styles.itemContainer}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.shopBottom}>
              <Text style={styles.shopName}>{item.storeName}</Text>
              {/* Implement renderStars if you have a rating system */}
            </View>
            <Text style={styles.category}>{item.category}</Text>
          </Pressable>
        ))
      )}
 </>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'column', // Align items in a row
    padding: 0, // Add some padding around each item
    alignItems: 'center', // Center items vertically
   // borderWidth:0.5, 
   margin:15, 
   overflow:'hidden',
   borderWidth:0.5,
   borderColor:'#eee',
   borderTopRightRadius:10,
   borderTopLeftRadius:10,
  },
  shopBottom:{
   width:'100%',
   flexDirection: 'row',
   justifyContent:'space-between',
   margin:10,
   padding:10,
  },
  image: {
    width: '100%', // Set image width
    height: 200, // Set image height
    // marginRight: 10, // Add some margin right to separate image from text
  },
  shopName: {
    fontSize: 14, // Increase shop name font size
    fontWeight: 'bold', // Make the shop name bold
   
  },
  category:{
   textAlign:'left',
   width:'100%',
   marginTop:-10,
   paddingLeft:10,
   paddingBottom:10,
  }
});

export default BestSellers;
