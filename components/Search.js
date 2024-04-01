import React from 'react'
import { AntDesign } from '@expo/vector-icons';
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
const Search = () => {
  return (
   <View
   style={{
     
     padding: 10,
     flexDirection: "row",
     alignItems: "center",
     width:'100%',
     borderBottomWidth: 0.5,
   }}
 >
   <Pressable
     style={{
       flexDirection: "row",
       alignItems: "center",
       marginHorizontal: 7,
       gap: 10,
       backgroundColor: "white",
       borderRadius: 3,
       height: 38,
       width:"100%",
       // flex: 1,
     }}
   >
     <AntDesign
       style={{ paddingLeft: 10 }}
       name="search1"
       size={22}
       color="black"
     />
     <TextInput placeholder="Search..." />
   </Pressable>
 </View>
  )
}

export default Search