import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  Button,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useCallback, useContext } from "react";

import { MaterialIcons } from "@expo/vector-icons";

import ProductItem from "../components/ProductItem";
import { RefreshControl } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import style from "../Style/style";

import BestSellers from "../components/BestSeller";
import Search from "../components/Search";
import ProductList from "../components/ProductList";
import { loadCartFromStorage } from "../components/storage";
import { setCart } from "../redux/CartReducer";
import { auth, firestore } from "../firebase/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
// import { UserType } from "../UserContext";
// import jwt_decode from "jwt-decode";

const HomeScreen = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const loadCart = async () => {
      const loadedCart = await loadCartFromStorage();
      if (loadedCart) {
        dispatch(setCart(loadedCart));
      }
    };

    loadCart();
  }, [dispatch]);

  const [products, setProducts] = useState([]);
  const [products1, setProducts1] = useState([]);
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  
  // const [category, setCategory] = useState("jewelery");
  const [User, setUser] = useState();
  const [categories, setCategories] = useState([]);
  const [loading, setloading] = useState(true);
  const [ploading, setploading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [items, setItems] = useState([
    { label: "Men's clothing", value: "men's clothing" },
    { label: "jewelery", value: "jewelery" },
    { label: "electronics", value: "electronics" },
    { label: "women's clothing", value: "women's clothing" },
  ]);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);
  //fetching categories
  const fetchShops = async () => {
    setloading(true);
    // Construct a query to fetch only shops where isActive is true
const shopsCollectionRef = collection(firestore, "shop");
const activeShopsQuery = query(shopsCollectionRef, where("isActive", "==", true));

const querySnapshot = await getDocs(activeShopsQuery);
    const allCategories = [];

    querySnapshot.forEach((doc) => {
      const shopData = doc.data();

      // Assuming each shop document has a categories array
      allCategories.push(shopData.category);
    });

    // Use a Set to remove duplicate categories
    const uniqueCategories = Array.from(new Set(allCategories));
    setCategories(uniqueCategories);

    setloading(false);
  };

  //fetch recent products

  const [Productloading, setProductLoading] = useState(true);
  const fetchRecentProducts = async () => {
    try {
      // Define the query to fetch the most recent, active products
      const q = query(
        collection(firestore, "products"),
        where("isActive", "==", true), // Ensure the product is active
        orderBy("createdAt", "desc"),
        limit(10)
      );
  
      const querySnapshot = await getDocs(q);
      const recentProducts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      setProducts(recentProducts);
    } catch (error) {
      console.error("Failed to fetch recent products:", error);
    } finally {
      setProductLoading(false);
    }
  };
  
  useEffect(() => {
    fetchShops();
    fetchBestProducts();
    fetchRecentProducts();
  }, []);

  const fetchBestProducts = async () => {
    setploading(true);
  
    // Fetch all reviews
    const reviewsQuery = query(collection(firestore, "reviews"));
    const reviewsSnapshot = await getDocs(reviewsQuery);
  
    // Aggregate reviews by product_id and calculate total count and average rating
    const reviewAggregates = reviewsSnapshot.docs.reduce((acc, doc) => {
      const { prod_id, rating } = doc.data();
  
      if (!acc[prod_id]) {
        acc[prod_id] = { totalReviews: 0, totalRating: 0 };
      }
      acc[prod_id].totalReviews += 1;
      acc[prod_id].totalRating += rating;
      return acc;
    }, {});
  
    // Prepare data with average ratings
    const productsWithReviews = Object.entries(reviewAggregates)
      .map(([productId, { totalReviews, totalRating }]) => ({
        productId,
        totalReviews,
        averageRating: totalRating / totalReviews,
      }))
      .sort((a, b) => b.averageRating - a.averageRating || b.totalReviews - a.totalReviews); // Sort primarily by averageRating, then by totalReviews
  
    // Fetch products by sorted order of productIds that have reviews
    const fetchedProducts = await Promise.all(
      productsWithReviews.map(async ({ productId }) => {
        const productRef = doc(firestore, "products", productId);
        const productSnap = await getDoc(productRef);
  
        if (productSnap.exists() && productSnap.data().isActive) {
          const productData = productSnap.data();
          return {
            id: productSnap.id,
            ...productData,
            productId,
          };
        } else {
          return null; // Handle case where product might not exist or isn't active
        }
      })
    );
  
    // Filter out any null entries (in case some products didn't exist or weren't active)
    const validProducts = fetchedProducts.filter((product) => product !== null);
  
    // You might want to consider further sorting or filtering here based on your requirements
  
    console.log("Valid Products with Reviews", validProducts);
    setProducts1(validProducts);
    setploading(false);
  };
  

  const cart = useSelector((state) => state.cart.cart);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await fetchShops();
    await fetchBestProducts();
    await fetchRecentProducts();
    setRefreshing(false);
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View style={style.ProductitemContainer}>
        <Pressable
          onPress={() => navigation.navigate("Info", { ...item })}
          style={style.Productpressable}
        >
          <Image style={style.Productimage} source={{ uri: item?.images[0] }} />
          <View style={style.buyNowContainer}>
            <Text style={style.buyNowText}>
              {item.name.split(" ").length > 3
                ? item.name.split(" ").slice(0, 3).join(" ") + "..."
                : item.name}
            </Text>
            <View style={style.productBottomRP}>
              <Text style={style.productTitle}>$ {item.price}</Text>
              {item.totalReviews && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons name="star" size={18} color="gold" />
                  <Text
                    style={style.ratingTitle}
                  >{`${item.averageRating.toFixed(1)} / 5 (${
                    item.totalReviews
                  })`}</Text>
                </View>
              )}
            </View>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <>
      <SafeAreaView
        style={{
          paddinTop: Platform.OS === "android" ? 40 : 0,

          flex: 1,

          backgroundColor: "white",
        }}
      >
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* <Search /> */}
          <View style={{ paddingLeft: 12, paddingTop: 10 }}>
            <Text style={style.title}>Category</Text>
          </View>
          {/* Categoies  */}
          {loading ? (
            <ActivityIndicator />
          ) : (
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((item, index) => (
                  <Pressable
                    key={index}
                    style={style.Categorybutton}
                    onPress={() =>
                      navigation.navigate("CategoryScreen", { item })
                    }
                  >
                    <Text style={style.buttonText}>{item}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
          <Text
            style={{
              height: 1,
              borderColor: "#D0D0D0",
              borderWidth: 2,
              marginTop: 15,
            }}
          />

          <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold" }}>
            Best Selling
          </Text>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={products1}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          )}
          <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold" }}>
            New Arrivals
          </Text>

          <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
          {/* Best sellers  */}
          <View>
            <BestSellers />
          </View>
          <Text
            style={{
              height: 1,
              borderColor: "#D0D0D0",
              borderWidth: 2,
              marginTop: 15,
            }}
          />

          <View
            style={{
              marginHorizontal: 10,
              marginTop: 20,
              width: "45%",
              marginBottom: open ? 50 : 15,
            }}
          ></View>

       
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  ProductitemContainer: {
    marginVertical: 10,
    borderWidth: 0.4,
    marginRight: 5,
    marginLeft: 5,
    paddingTop: 10,
    position: "relative",
    borderRadius: 10,
  },
  Productpressable: {
    alignItems: "center",
    justifyContent: "center",
  },
  Productimage: {
    width: 120,
    height: 100,
    resizeMode: "contain",
  },
  buyNowContainer: {
    // backgroundColor: '#FEBE10',
    paddingVertical: 5,
    width: 130,

    marginTop: 2,
    borderRadius: 4,
  },
  buyNowText: {
    textAlign: "center",
    color: "black",
    fontSize: 13,
    fontWeight: "bold",
  },
  favButton: {
    padding: 10,
    backgroundColor: "#ffffff",
    width: "100%",
  },
  favText: {
    fontSize: 24, // Adjust the size as needed
  },
});

// const styles = StyleSheet.create({});

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  return (
    <View style={{ flexDirection: "row" }}>
      {Array(fullStars).fill(
        <MaterialIcons name="star" size={15} color="gold" />
      )}
      {halfStar ? (
        <MaterialIcons name="star-half" size={15} color="gold" />
      ) : null}
      {Array(emptyStars).fill(
        <MaterialIcons name="star-outline" size={15} color="gold" />
      )}
    </View>
  );
};
