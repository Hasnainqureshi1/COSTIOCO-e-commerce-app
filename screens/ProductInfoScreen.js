import React, { useState } from "react";
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

const { width } = Dimensions.get("window");

const ProductInfoScreen = () => {
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ id: product.id, ...product }));
    setIsAddedToCart(true);
    // Show toast notification
    if (Platform.OS === 'android') {
      ToastAndroid.show('Item added to cart!', ToastAndroid.SHORT);
    } else {
      // For iOS, you might use a custom toast component or a library
      alert('Item added to cart!'); // Simple fallback
    }
  };
  // Dummy data for product details and reviews
  const product = {
    id:1,
    image: "https://via.placeholder.com/150",
    title: "RS-X Men Sneaker",
    price: "$85.00",
    rating: 4.5,
    soldCount: "8,374",
    description:
      "Lorem ipsum dolor sit amet consectetur. Porta at eget vitae convallis suspendisse. ipsum dolor sit amet consectetur. Porta at eget.",
    reviews: [
      {
        id: "1",
        author: "John Doe",
        rating: 5,
        text: "Great sneakers! Super comfortable and stylish.",
      },
      {
        id: "2",
        author: "Jane Smith",
        rating: 4,
        text: "Really good quality for the price. Would recommend.",
      },
    ],
  };

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
          images={["https://example.com/image1.jpg"]}
          sliderBoxHeight={250}
          dotColor="#FFEE58"
          inactiveDotColor="#90A4AE"
        />
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.productPrice}>{product.price}</Text>

        {/* Product Description */}
        <Text style={styles.description}>{product.description}</Text>
        {/* shop info  */}
        <View style={styles.shopInfo}>
    <Text style={styles.shopName}>Shop Name</Text>
    <Text style={styles.shopName}>Shop Address</Text>
        </View>

        {/* Reviews Section */}
        <Text style={styles.subTitle}>Reviews</Text>
        {product.reviews.map((review) => (
          <View key={review.id} style={styles.review}>
            <Text style={styles.reviewAuthor}>{review.author}</Text>
            <View style={styles.stars}>{renderStars(review.rating)}</View>
            <Text style={styles.reviewText}>{review.text}</Text>
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
        <TouchableOpacity style={[styles.actionButton, styles.buyNowButton]}>
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
