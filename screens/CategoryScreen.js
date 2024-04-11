 
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

 
const CategoryScreen = ( ) => {
  const route = useRoute();
  
   const selectedCategory =route.params.item;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
   
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'shops'
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      setLoading(true);
    
      try {
        // Step 1: Fetch active shops matching the selected category
        const shopsRef = collection(firestore, 'shop');
        const qShops = query(shopsRef, where('category', '==', selectedCategory), where('isActive', '==', true));
        const shopSnapshot = await getDocs(qShops);
        const activeShopUids = shopSnapshot.docs.map((doc) => doc.id);
    
        // Step 2: Fetch active products from these active shops
        const productsRef = collection(firestore, 'products');
        const productsPromises = activeShopUids.map((uid) => {
          const qProducts = query(productsRef, where('seller_id', '==', uid), where('isActive', '==', true));
          return getDocs(qProducts);
        });
        const productsSnapshots = await Promise.all(productsPromises);
        let fetchedProducts = [];
        productsSnapshots.forEach((snapshot) => {
          const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          fetchedProducts = [...fetchedProducts, ...products];
        });
    
        // Step 3: Fetch reviews for these active products and calculate review count and average rating
        const reviewsRef = collection(firestore, 'reviews');
        const productsWithReviews = await Promise.all(fetchedProducts.map(async (product) => {
          const qReviews = query(reviewsRef, where('prod_id', '==', product.id));
          const reviewsSnapshot = await getDocs(qReviews);
          const reviews = reviewsSnapshot.docs.map((doc) => doc.data());
          const reviewCount = reviews.length;
          const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount || 0;
          return { ...product, reviews, reviewCount, avgRating };
        }));
    
        // Output the products with their reviews
        console.log(productsWithReviews);
        setProducts(productsWithReviews);
      } catch (error) {
        console.error("Failed to fetch products by category:", error);
      } finally {
        setLoading(false);
      }
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
      
        // Adjust the query to include only shops that are active and match the selected category
        const shopsRef = collection(firestore, 'shop');
        const q = query(shopsRef, where('category', '==', selectedCategory), where('isActive', '==', true));
      
        try {
          const querySnapshot = await getDocs(q);
          const fetchedShops = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(), // This spreads all fields from the shop document
          }));
          setShops(fetchedShops); // Assuming you have a state setter function setShops to update your component state
          console.log(fetchedShops); // Debugging: logs fetched shops to the console
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
