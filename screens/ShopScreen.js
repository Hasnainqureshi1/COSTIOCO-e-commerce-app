import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ProductList from '../components/ProductList';
import { useEffect, useState } from 'react';
 
import { collection, query, getDoc,where, getDocs, doc } from 'firebase/firestore';
import { firestore } from '../firebase/config';
const { width } = Dimensions.get('window');
const numColumns = 2; // Number of columns for the products grid
 
const ShopScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [ Products,  setProducts] = useState([])
  const [ loading,  setLoading] = useState(false)
  const shop = route.params
  console.log(shop)
  useEffect(() => {
    const fetchProductsByShopId = async (shopId) => {
      setLoading(true);
  
      // Step 1: Directly fetch the shop document using its UID
      const shopRef = doc(firestore, 'shop', shopId);
      const shopSnap = await getDoc(shopRef);
  
      if (!shopSnap.exists()) {
        console.log("No such shop!");
        setLoading(false);
        return;
      }
  
      const shopData = shopSnap.data();
      console.log("Fetched shop data: ", shopData);
  
      // Step 2: Fetch products from this shop
      const productsRef = collection(firestore, 'products');
      const qProducts = query(productsRef, where('seller_id', '==', shopId));
      const productsSnapshot = await getDocs(qProducts);
      
      const fetchedProducts = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      // Step 3: Fetch reviews for these products and calculate review count and average rating
      const reviewsRef = collection(firestore, 'reviews');
      const productsWithReviews = await Promise.all(fetchedProducts.map(async (product) => {
        const qReviews = query(reviewsRef, where('prod_id', '==', product.id));
        const reviewsSnapshot = await getDocs(qReviews);
        const reviews = reviewsSnapshot.docs.map((doc) => doc.data());
        const reviewCount = reviews.length;
        const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount || 0;
        return { ...product, reviews, reviewCount, avgRating };
      }));
  
      console.log("Products with reviews: ", productsWithReviews);
      setProducts(productsWithReviews);
      setLoading(false);
    };
  
    fetchProductsByShopId(shop.id); // Pass the actual shop ID here
  }, []); // Consider adding dependencies if needed
  

  // Dummy data for shop details and products
  // const shop = {
  //   name: 'Example Shop Name',
  //   image: 'https://via.placeholder.com/100',
  //   address: '123 Main St, City, State, Zip'
  // };

  

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
        <Image source={{ uri: shop.imageUrl }} style={styles.shopImage} />
        <Text style={styles.shopName}>{shop.storeName}</Text>
        <Text style={styles.shopAddress}>{shop.address}</Text>
      </View>
      {loading ? <ActivityIndicator/>:
      <>
      <Text style={{fontSize:24,marginTop:10,textAlign:'center',borderBottomColor:"#eee",borderBottomWidth:1,paddingBottom:5,}}>Store Items</Text>
      {Products.length > 0 ?
      <ProductList item={Products} horizontal={false} col = {2} />:
      <Text style={{fontSize:16,marginTop:10,textAlign:'center',borderBottomColor:"#eee",borderBottomWidth:1,paddingBottom:5,}}>No Products Found</Text>
      
    }
      </>
    }
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
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    // objectFit:'co'
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
