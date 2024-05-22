import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SliderBox } from "react-native-image-slider-box";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  FontAwesome,
  Entypo,
} from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/CartReducer";
import { useNavigation, useRoute } from "@react-navigation/native";
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore } from "../firebase/config";
 
const { width } = Dimensions.get("window");

const ProductInfoScreen = () => {
  const route = useRoute()
  console.log("ProductInfo")
  const navigation = useNavigation();
 
  const product = route.params;
   console.log(product)
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shop, setShop] = useState(null);
  const fetchReviewsAndUserNames = async () => {
    if (!product.id) return;
    setLoading(true);

    // Step 1: Fetch reviews for the given product ID
    const reviewsQuery = query(collection(firestore, "reviews"), where("prod_id", "==", product.id));
    const reviewsSnapshot = await getDocs(reviewsQuery);
    
    // Step 2: Fetch user data for each review
    const reviewsWithUserNamesPromises = reviewsSnapshot.docs.map(async (docs) => {
      const reviewData = docs.data();
      const userRef = doc(firestore, "app_users", reviewData.user_id);
      const userSnap = await getDoc(userRef);

      return {
        ...reviewData,
        userName: userSnap.exists() ? userSnap.data().name : "Unknown User", // Assuming the user's name field is called "name"
      };
    });
    
    // Wait for all user names to be fetched
    const reviewsWithUserNames = await Promise.all(reviewsWithUserNamesPromises);

    setReviews(reviewsWithUserNames);
    
    setLoading(false);
  };
  const fetchShop = async () => {
    if (!product.seller_id) return;
    setLoading(true);

    // Assuming each shop has a 'sellerId' field that matches the seller's ID
    // And assuming there's a direct relationship between a seller and their shop
    const shopRef = doc(firestore, "shop", product.seller_id); // This assumes shop IDs are the same as seller IDs
    // If shops are stored under a different ID, you might need to adjust this query to use where() instead of doc()
    const shopSnap = await getDoc(shopRef);

    if (shopSnap.exists()) {
      setShop({ id: shopSnap.id, ...shopSnap.data() });
 
    } else {
      console.log("No such shop!");
      setShop(null);
    }

    setLoading(false);
  };
  useEffect(() => {
    fetchShop();
    fetchReviewsAndUserNames();
  }, []);
  if(loading){
    return <ActivityIndicator size={'large'}/>
  }
  const handleAddToCart = () => {
    const { createdAt, ...productWithoutCreatedAt } = product;
    console.log(shop)
    // console.log(productWithoutCreatedAt)
    const itemToAdd = {
      id:product.id,
      images: product.images,
      name: product.name,
      price: product.price, 
      storeName:shop.storeName,
      seller_id:shop.id,
      address:shop.address,
      

        
  };
  console.log(itemToAdd)
 // Dispatch the action with both product and shop data
 dispatch(addToCart(itemToAdd));

    setIsAddedToCart(true);
    // Show toast notification
    if (Platform.OS === 'android') {
      ToastAndroid.show('Item added to cart!', ToastAndroid.SHORT);
    } else {
      // For iOS, you might use a custom toast component or a library
      alert('Item added to cart!'); // Simple fallback
    }
  };
  const buyNow = ()=>{
    const { createdAt, ...productWithoutCreatedAt } = product;
    const itemToAdd = {
      id:product.id,
      images: product.images,
      name: product.name,
      price: product.price, 
      storeName:shop.storeName,
      seller_id:shop.id,
      address:shop.address,
      

        
  };
  dispatch(addToCart(itemToAdd));
  navigation.navigate('Cart')
  }
  // Function to render stars based on rating
  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome5
          key={i}
          name="star"
          solid={i <= rating}
          color={i <= rating ? "#ffd700" : "#ccc"}
          style={styles.starIcon}
        />
      );
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <SliderBox
        key={product.id}
          images={product.images}
          sliderBoxHeight={350}
          dotColor="#FFEE58"
          inactiveDotColor="#90A4AE"
        />
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.productPrice}>${product.price}</Text>

        {/* Product Description */}
        <Text style={styles.description}>{product.description}</Text>
        {/* shop info  */}
        <View style={styles.shopInfo}>
    <Text style={styles.shopName}>Store Name: {shop?.storeName}</Text>
    
        </View>

        {/* Reviews Section */}
        <Text style={styles.subTitle}>Reviews</Text>
        {reviews.map((review,i) => (
          <View key={i} style={styles.review}>
            <View>

            </View>
            <Text style={styles.reviewAuthor}>{review.userName}</Text>
            <View style={styles.stars}>{renderStars(review.rating)}</View>
            <Text style={styles.reviewText}>{review.comment}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Action Bar with Buy Now and Add to Cart */}
      <View style={styles.actionBar}>
      <TouchableOpacity
          style={[styles.actionButton, isAddedToCart && styles.buttonDisabled]} // Apply the disabled style conditionally
          onPress={handleAddToCart}
          disabled={isAddedToCart} // Disable the button when the item is added to cart
        >
          <Text style={styles.actionButtonText}>
            {isAddedToCart ? "Added to Cart" : "Add to Cart"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.buyNowButton]}     onPress={() => buyNow()}>
          <Text style={styles.actionButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... other styles from previous snippets
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    marginBottom: 70,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productImage: {
    width: width - 32,
    height: width - 32,
    alignSelf: "center",
    resizeMode: "contain",
    marginTop: 16,
  },
  productMetaContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  badge: {
    color: "green",
    borderWidth: 1,
    borderColor: "green",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 12,
  },
  paginationDots: {
    // Placeholder for pagination dots
  },
  productTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 8,
    paddingHorizontal: 16,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#E31837",
    paddingHorizontal: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 18,
  },
  soldText: {
    fontSize: 18,
    color: "#555",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    paddingHorizontal: 16,
    marginTop: 16,
  },
  actionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  actionButton: {
    backgroundColor: "#FEBE10",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: width / 2 - 20,
    alignItems: "center",
  },
  buyNowButton: {
    backgroundColor: "#5ad10b",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    marginLeft: 16,
  },
  review: {
    marginHorizontal: 16,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    borderTopColor: "#e1e1e1",
    borderTopWidth:1,
    paddingTop:5,
  },
  reviewAuthor: {
    fontWeight: "bold",
    fontSize: 16,
  },
  stars: {
    flexDirection: "row",
    marginVertical: 5,
  },
  starIcon: {
    marginRight: 5,
  },
  reviewText: {
    fontSize: 14,
    color: "#333",
  },
  shopInfo:{
    marginTop:10,

  },
  shopName:{
    fontSize: 16,
    // lineHeight: 12,
    color: "#FEBE10",
    paddingHorizontal: 16,
    marginTop: 16,
    fontWeight:'700',

  },
  buttonDisabled: {
    backgroundColor: "#cd9600",  
  },
  // ... any additional styles you want to add or adjust
});

export default ProductInfoScreen;
