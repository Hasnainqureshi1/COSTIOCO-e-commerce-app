 
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import style from '../Style/style';
import { useEffect, useState } from 'react';
 
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase/config';
// import { useNavigation, useRoute } from '@react-navigation/native';
import ProductList from '../components/ProductList';
import ShopList from '../components/ShopList';
import { useRoute } from '@react-navigation/native';

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
const CategoryScreen = ( ) => {
  const route = useRoute();
  
   const selectedCategory =route.params.item;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
   
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'shops'
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      setLoading(true);

      // Step 1: Fetch shops matching the selected category
      const shopsRef = collection(firestore, 'shop');
      const qShops = query(shopsRef, where('category', '==', selectedCategory));
      const shopSnapshot = await getDocs(qShops);
      const shopUids = shopSnapshot.docs.map((doc) => doc.id);

      // Step 2: Fetch products from these shops
      const productsRef = collection(firestore, 'products');
      const productsPromises = shopUids.map((uid) => {
        const qProducts = query(productsRef, where('seller_id', '==', uid));
        return getDocs(qProducts);
      });
      const productsSnapshots = await Promise.all(productsPromises);
      let fetchedProducts = [];
      productsSnapshots.forEach((snapshot) => {
        const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        fetchedProducts = [...fetchedProducts, ...products];
      });

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
      console.log(productsWithReviews)
      setProducts(productsWithReviews);
      setLoading(false);
    };

    fetchProductsByCategory();
  }, [selectedCategory]);

  // fetching shop
  const [shops, setShops] = useState([]);
  const [sloading, setsLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(null); // Document snapshot to start next page fetch
  const [hasMore, setHasMore] = useState(true);
  
   
  
    useEffect(() => {
      const fetchShops = async () => {
        if (!selectedCategory) return;
  
        const shopsRef = collection(firestore, 'shop');
        const q = query(shopsRef, where('category', '==', selectedCategory));
  
        try {
          const querySnapshot = await getDocs(q);
          const fetchedShops = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setShops(fetchedShops);
          console.log(fetchedShops);
        } catch (error) {
          console.error("Error fetching shops by category:", error);
        }
      };
  
      fetchShops();
    }, [selectedCategory]);
  
   
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
        (loading ? <ActivityIndicator  size={'large'} style={{marginTop:20,}}/> :
        
          <ProductList item={products} horizontal={false} col = {2} />
        )

      )}
      {activeTab === 'shops'&& (
        (loading ? <ActivityIndicator  size={'large'} style={{marginTop:20,}}/> :
       <ShopList shops= {shops}/>
      ))}
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
