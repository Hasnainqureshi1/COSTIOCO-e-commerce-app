import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import style from '../Style/style';
import { useNavigation } from '@react-navigation/native';
import ProductList from '../components/ProductList';
import ShopList from '../components/ShopList';

// Assuming bestSellers and offers data are imported or defined here
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
const offers = [
  {
    id: "0",
    title:
      "Oppo Enco Air3 Pro True Wireless in Ear Earbuds with Industry First Composite Bamboo Fiber, 49dB ANC, 30H Playtime, 47ms Ultra Low Latency,Fast Charge,BT 5.3 (Green)",
    offer: "72% off",
    oldPrice: 7500,
    price: 4500,
    image:
      "https://m.media-amazon.com/images/I/61a2y1FCAJL._AC_UL640_FMwebp_QL65_.jpg",
    carouselImages: [
      "https://m.media-amazon.com/images/I/61a2y1FCAJL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/71DOcYgHWFL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/71LhLZGHrlL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/61Rgefy4ndL._SX679_.jpg",
    ],
    color: "Green",
    size: "Normal",
  },
  {
    id: "1",
    title:
      "Fastrack Limitless FS1 Pro Smart Watch|1.96 Super AMOLED Arched Display with 410x502 Pixel Resolution|SingleSync BT Calling|NitroFast Charging|110+ Sports Modes|200+ Watchfaces|Upto 7 Days Battery",
    offer: "40%",
    oldPrice: 7955,
    price: 3495,
    image: "https://m.media-amazon.com/images/I/41mQKmbkVWL._AC_SY400_.jpg",
    carouselImages: [
      "https://m.media-amazon.com/images/I/71h2K2OQSIL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/71BlkyWYupL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/71c1tSIZxhL._SX679_.jpg",
    ],
    color: "black",
    size: "Normal",
  },
  {
    id: "2",
    title: "Aishwariya System On Ear Wireless On Ear Bluetooth Headphones",
    offer: "40%",
    oldPrice: 7955,
    price: 3495,
    image: "https://m.media-amazon.com/images/I/41t7Wa+kxPL._AC_SY400_.jpg",
    carouselImages: ["https://m.media-amazon.com/images/I/41t7Wa+kxPL.jpg"],
    color: "black",
    size: "Normal",
  },
  {
    id: "3",
    title:
      "Fastrack Limitless FS1 Pro Smart Watch|1.96 Super AMOLED Arched Display with 410x502 Pixel Resolution|SingleSync BT Calling|NitroFast Charging|110+ Sports Modes|200+ Watchfaces|Upto 7 Days Battery",
    offer: "40%",
    oldPrice: 24999,
    price: 19999,
    image: "https://m.media-amazon.com/images/I/71k3gOik46L._AC_SY400_.jpg",
    carouselImages: [
      "https://m.media-amazon.com/images/I/41bLD50sZSL._SX300_SY300_QL70_FMwebp_.jpg",
      "https://m.media-amazon.com/images/I/616pTr2KJEL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/71wSGO0CwQL._SX679_.jpg",
    ],
    color: "Norway Blue",
    size: "8GB RAM, 128GB Storage",
  },
];
const CategoryScreen = () => {
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'shops'
  const navigation = useNavigation();
 
  

  return (
    <View style={{ backgroundColor:'white',height:'100%'  }}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'products' ? styles.activeTab : {}]}
          onPress={() => setActiveTab('products')}
        >
          <Text style={styles.tabButtonText}>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'shops' ? styles.activeTab : {}]}
          onPress={() => setActiveTab('shops')}
        >
          <Text style={styles.tabButtonText}>Shops</Text>
        </TouchableOpacity>
      </View>
      {activeTab === 'products' && (
            <ProductList item={offers} horizontal={false} col = {2} />

      )}
      {activeTab === 'shops' && (
       <ShopList bestSellers= {bestSellers}/>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Styles for products, shops, tabs, etc.
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'navy',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Add styles for productItemContainer, productImage, itemContainer, image, shopBottom, shopName, category
});

export default CategoryScreen;
