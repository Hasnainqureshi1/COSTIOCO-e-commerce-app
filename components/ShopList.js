import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import style from '../Style/style';
import { useNavigation } from '@react-navigation/native';


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

const ShopList = ({shops}) => {
 const navigation = useNavigation();
 const renderItem = ({ item }) => (
  <TouchableOpacity style={style.itemContainer} onPress={() => navigation.navigate("Shop", { ...item })} key={item.id}>
  
    <Image source={{ uri: item.imageUrl }} style={style.image} />
    <View style={style.shopBottom}>
    <Text style={style.shopName}>{item.storeName}</Text>
    {/* {renderStars(item.rating)} */}
 
    </View>
    <Text style={style.category}>{item.category}</Text>
  </TouchableOpacity>
 );
  return (
   <FlatList
   data={shops} 
   renderItem={renderItem}
   keyExtractor={item => item.id}
   numColumns={1}
 />
  )
}

export default ShopList