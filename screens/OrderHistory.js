import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList,Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { auth, firestore } from '../firebase/config';
const OrderHistory = () => {
 const [User, setUser] = useState();
 const [ordersWithProducts, setOrdersWithProducts] = useState([]);
 const [loading, setloading] = useState(false)
 useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    setUser(user.uid);
  });

  return () => unsubscribe();
}, []);
 // Step 2: Fetch orders for the authenticated user
 useEffect(() => {
  console.log(User)
  fetchOrdersForUser(User);
  console.log("ordersWithProducts")
  console.log(ordersWithProducts)
}, [User]);

const fetchOrdersForUser = async (userId) => {
 setloading(true)
 if(userId){


 console.log("userId",userId)
 const ordersRef = collection(firestore, "orders");
 const q = query(ordersRef, where("user_id", "==", userId));

 try {
   const querySnapshot = await getDocs(q);
   const orders = [];
   for (const doc of querySnapshot.docs) {
     const orderData = { id: doc.id, ...doc.data() };
     console.log(orderData)
     const productsDetails = await Promise.all(orderData.products.map(async (product) => {
       const productDetail = await fetchProductDetails(product.prod_id);
       if (productDetail) {
         // Merge the sold_price and other order-specific product data with the fetched product details
         console.log(product.sold_price)
         return {
           ...productDetail,
           sold_price: product.sold_price,
           quantity: product.quantity // Assuming there's a quantity field as well
           // Add any other order-specific product fields here
         };
       }
       return null;
     }));

     orderData.products = productsDetails.filter(product => product !== null); // Filter out any null fetched products
     orders.push(orderData);
    }
    setloading(false)
    setOrdersWithProducts(orders); // Assuming you have a useState hook for setting this data
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
}
};


// Helper function to fetch product details
const fetchProductDetails = async (productId) => {
  const productRef = doc(firestore, "products", productId);
  try {
    const docSnap = await getDoc(productRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such product!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
};
if(loading){

 return <ActivityIndicator size={'large'} style={{marginTop:0}}/>
} 
const dateConvert = (timestamp) => {
 const { seconds } = timestamp; // Extracting only the seconds part
 const date = new Date(seconds * 1000); // Converting to milliseconds and creating a date object
 return date.toLocaleDateString("en-US", { // Formatting the date
   year: 'numeric',
   month: 'long',
   day: 'numeric',
   hour: '2-digit',
   minute: '2-digit',
 });
};
const renderItem = ({ item }) => {
 
 return (
   <View style={styles.orderItem}>
     <Text style={styles.orderNumber}>Order ID: {item.id}</Text>
     <Text style={styles.orderDate}>Placed on {dateConvert(item.order_date)}</Text>
  
     
     {item.products.map((product, index) => (
       <View key={index} style={styles.productDetail}>
         <Image
           style={styles.productImage}
           source={{ uri: product.images[0] }} // Displaying the first image as an example
         />
         <View style={styles.productView}>

         <Text style={styles.productName} numberOfLines={3} ellipsizeMode='tail'>{product.name}</Text>
       <View style={{ alignItems:"flex-end"}}>
       <Text style={{fontSize:13}}>Total item: {product.quantity}</Text>
         <Text style={styles.productPrice}>${product.sold_price}</Text>
       </View>
         
         </View>
       </View>
     ))}
        <Text style={styles.orderStatus}>Status: {item.status}</Text>

     
   </View>
 );
};

  return (
 
   <View style={styles.container}>
      
      <FlatList
        data={ordersWithProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#ededed',
  },
  orderItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor:'red',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderStatus: {
    fontSize: 14,
    color: 'green',
  },
  productDetail: {
    flexDirection: 'row',
     
    marginTop: 8,
  },
  productName: {
    fontSize: 14,
    color: '#333',
   
     
  },
  productPrice: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  button: {
    marginTop: 8,
    backgroundColor: 'orange',
    padding: 12,
    borderRadius: 4,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
   orderItem: {
    padding: 10,
    backgroundColor: '#ffffff',
    marginBottom: 10,
  },
 
  productView:{
   marginLeft:10,
    flex:1,
    
    // backgroundColor:'red'
   // flexWrap:""
  },
 
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
   
});

export default OrderHistory;

// Sample data to pass to OrderHistory component


// Usage: <OrderHistory orders={sampleOrders} />
