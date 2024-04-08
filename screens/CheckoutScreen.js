import { useNavigation } from '@react-navigation/native';
import { StripeProvider } from '@stripe/stripe-react-native';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import PaymentForm from '../components/PaymentForm';

const CheckoutScreen = () => {
  const navigation = useNavigation()
  const cart = useSelector((state) => state.cart.cart);
 // Group cart items by seller_id
 const groupedItems = cart.reduce((acc, item) => {
  acc[item.seller_id] = acc[item.seller_id] || {
    seller_id: item.seller_id,
    storeName: item.storeName,
    items: [],
  };
  acc[item.seller_id].items.push(item);
  return acc;
}, {});
// console.log(groupedItems)
const renderGroupedItems = ({ item: group }) => (
  <View style={styles.itemContainer}>
    <Text style={styles.shopName}>By {group.storeName}</Text>
    {group.items.map((item) => (
      <View key={item.id} style={styles.rowContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.itemName}>{item.id}</Text>
          <Text style={styles.itemPrice}>${item.price}</Text>
          <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
        </View>
        <Image style={styles.image} source={{ uri: item.images[0] }} />
      </View>
    ))}
  </View>
);
  const total = cart
  ?.map((item) => item.price * item.quantity)
  .reduce((curr, prev) => curr + prev, 0);
  const totalItems = cart
  ?.map((item) =>  item.quantity++)
  .reduce((curr, prev) => curr + prev, 0);
  console.log(typeof totalItems)
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={Object.values(groupedItems)}
        renderItem={renderGroupedItems}
        keyExtractor={(item) => item.seller_id}
      />
      <View style={styles.orderSummary}>
        <Text style={styles.summaryText}>Total Items : {totalItems}</Text>
        
        <Text style={styles.summaryText}>Total Payment: ${total}</Text>
      </View>
      <StripeProvider
  publishableKey='pk_test_51P1llfFZvvbxFtlIbgtzDdHqpWkJjVBjO3UJrF11x9i6XEHTwi5dJumw9cCv4W635H7UBKZCDjJLwPwoXRDIYXy600zXgPGtRd'
>


      <TouchableOpacity style={styles.placeOrderButton}>
        
        <PaymentForm  totalItem = {totalItems} totalPayment = {total} groupedItems = {groupedItems}/>
      </TouchableOpacity>
      </StripeProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop:10,
 
    
  },
  shopName: {
    color: '#000',
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    marginVertical: 5,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E31837',
  },
  itemOriginalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#777',
  },
  itemQuantity: {
    fontSize: 16,
    color: '#555',
  },
  orderSummary: {
    padding: 10,
  },
  summaryText: {
    fontSize: 18,
    marginVertical: 5,
  },
  placeOrderButton: {
    backgroundColor: '#FFA07A', // Orange color for the button
  
    borderRadius: 5,
    margin: 10,
  },
  placeOrderText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
});

export default CheckoutScreen;
