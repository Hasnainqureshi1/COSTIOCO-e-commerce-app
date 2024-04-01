import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProductList from '../components/ProductList';

const { width } = Dimensions.get('window');
const numColumns = 2; // Number of columns for the products grid
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
const ShopScreen = () => {
  const navigation = useNavigation();

  // Dummy data for shop details and products
  const shop = {
    name: 'Example Shop Name',
    image: 'https://via.placeholder.com/100',
    address: '123 Main St, City, State, Zip'
  };

  const products = [
    //... Array of product objects with at least 'id', 'title', and 'image' properties
  ];

  // Function to render each product item
  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productTitle}>{item.title}</Text>
      {/* Add additional product details here */}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: shop.image }} style={styles.shopImage} />
        <Text style={styles.shopName}>{shop.name}</Text>
        <Text style={styles.shopAddress}>{shop.address}</Text>
      </View>
      <ProductList item={offers} horizontal={false} col = {2} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#f8f8f8',
    borderBottomColor: '#e1e1e1',
    borderBottomWidth: 1,
    paddingVertical: 20,
    alignItems: 'center',
  },
  shopImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  shopName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  shopAddress: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  productItem: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
  },
  productImage: {
    width: width / numColumns - 20,
    height: width / numColumns - 20,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  productTitle: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  // ... rest of your styles
});

export default ShopScreen;
