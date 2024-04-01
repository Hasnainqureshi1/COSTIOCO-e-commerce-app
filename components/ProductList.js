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
 console.log(item?.image)
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