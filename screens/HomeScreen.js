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
} from "react-native";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { SliderBox } from "react-native-image-slider-box";
// import axios from "axios";
import ProductItem from "../components/ProductItem";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { BottomModal, SlideAnimation, ModalContent } from "react-native-modals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import style from "../Style/style";
import BestSellersComponent from "../components/BestSeller";
import BestSellers from "../components/BestSeller";
import Search from "../components/Search";
import ProductList from "../components/ProductList";
import { loadCartFromStorage } from "../components/storage";
import { setCart } from "../redux/CartReducer";
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
  const list = [
    {
      id: "0",
      image: "https://m.media-amazon.com/images/I/41EcYoIZhIL._AC_SY400_.jpg",
      name: "Home",
    },
    {
      id: "1",
      image:
        "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/blockbuster.jpg",
      name: "Deals",
    },
    {
      id: "3",
      image:
        "https://images-eu.ssl-images-amazon.com/images/I/31dXEvtxidL._AC_SX368_.jpg",
      name: "Electronics",
    },
    {
      id: "4",
      image:
        "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/All_Icons_Template_1_icons_01.jpg",
      name: "Mobiles",
    },
    {
      id: "5",
      image:
        "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/music.jpg",
      name: "Music",
    },
    {
      id: "6",
      image: "https://m.media-amazon.com/images/I/51dZ19miAbL._AC_SY350_.jpg",
      name: "Fashion",
    },
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
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [category, setCategory] = useState("jewelery");
  // const { userId, setUserId } = useContext(UserType);
  const [selectedAddress, setSelectedAdress] = useState("");
  console.log(selectedAddress);
  const [items, setItems] = useState([
    { label: "Men's clothing", value: "men's clothing" },
    { label: "jewelery", value: "jewelery" },
    { label: "electronics", value: "electronics" },
    { label: "women's clothing", value: "women's clothing" },
  ]);
  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get("https://fakestoreapi.com/products");
  //       setProducts(response.data);
  //     } catch (error) {
  //       console.log("error message", error);
  //     }
  //   };

  //   fetchData();
  // }, []);
  const onGenderOpen = useCallback(() => {
    setCompanyOpen(false);
  }, []);

  const cart = useSelector((state) => state.cart.cart);
 
  // useEffect(() => {
  //   if (userId) {
  //     fetchAddresses();
  //   }
  // }, [userId, modalVisible]);
  // const fetchAddresses = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8000/addresses/${userId}`
  //     );
  //     const { addresses } = response.data;

  //     setAddresses(addresses);
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const token = await AsyncStorage.getItem("authToken");
  //     const decodedToken = jwt_decode(token);
  //     const userId = decodedToken.userId;
  //     setUserId(userId);
  //   };

  //   fetchUser();
  // }, []);
  const FavoriteHeader = () => {
    const favorites = useSelector((state) => state.cart.favorites);
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 10,
        }}
      >
        <Text>My App</Text>
        <TouchableOpacity
          onPress={() => {
            /* navigate to favorites screen if needed */
          }}
        >
          <Text>Favorites ({favorites.length})</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const renderItem = ({ item }) => {
 
    return (
      <View style={style.ProductitemContainer}>
        <Pressable
          onPress={() => navigation.navigate("Info", { ...item })}
          style={style.Productpressable}
        >
          <Image style={style.Productimage} source={{ uri: item?.image }} />
          <View style={style.buyNowContainer}>
            <Text style={style.buyNowText}>
              {item.title.split(" ").length > 3
                ? item.title.split(" ").slice(0, 3).join(" ") + "..."
                : item.title}
            </Text>
            <View style={style.productBottomRP}>
              <Text style={style.productTitle}>$ 50</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="star" size={18} color="gold" />
                <Text style={style.ratingTitle}>3.5/5 (2)</Text>
              </View>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };
  console.log("address", addresses);
  return (
    <>
      <SafeAreaView
        style={{
          paddinTop: Platform.OS === "android" ? 40 : 0,

          flex: 1,
       
          backgroundColor: "white",
        }}
      >
        <ScrollView disableScrollViewPanResponder={true}>
          <Search/>
          <View style={{ paddingLeft: 12, paddingTop: 10 }}>
            <Text style={style.title}>Category</Text>
          </View>
          {/* Categoies  */}
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {list.map((item, index) => (
                <Pressable
                  key={index}
                  style={style.Categorybutton}
                  onPress={() =>
                    navigation.navigate("CategoryScreen", { index })
                  }
                >
                  <Text style={style.buttonText}>{item?.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

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

          <ProductList item={offers} horizontal={true} col = {1} />

          <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold" }}>
            New Arrivals
          </Text>

          <FlatList
            data={offers}
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
          >
            
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {products
              ?.filter((item) => item.category === category)
              .map((item, index) => (
                <ProductItem item={item} key={index} />
              ))}
          </View>
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
