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
import React from 'react'
 
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import style from "../Style/style";
const ProductList = ({item,horizontal, col }) => {
 const navigation = useNavigation();
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
            {item.reviews.length >0 && (
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
                  >{`${item.avgRating.toFixed(1)} / 5 (${
                    item.reviewCount
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
   <FlatList
   data={item}
   renderItem={renderItem}
   keyExtractor={(item) => item.id}
    
   horizontal={ horizontal }
   numColumns={col}
   showsHorizontalScrollIndicator={false}
 />
  )
}

export default ProductList