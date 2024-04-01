import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  Categorybutton: {
    margin: 10,
    marginTop: 0,
    width: 100,
    height: 50,
    paddingBottom: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: "#FEBE10",
    backgroundColor: "#feb710",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 5,
    color: "#ffffff",
  },
  productTitle: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "500",
    // marginTop: 5,
    color: "#FEBE10",

    // marginTop: 8,
  },
  ratingTitle: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "500",
    // marginTop: 5,
    color: "#989898",

    // marginTop: 8,
  },
  productBottomRP:{
    flexDirection:'row',alignItems:'center',justifyContent:"space-between",padding:4,paddingLeft:10,paddingRight:10,marginTop:8
  },
  itemContainer: {
    flexDirection: 'column', // Align items in a row
    padding: 0, // Add some padding around each item
    alignItems: 'center', // Center items vertically
   // borderWidth:0.5, 
   margin:15, 
   overflow:'hidden',
   borderWidth:0.5,
   borderColor:'#eee',
   borderTopRightRadius:10,
   borderTopLeftRadius:10,
  },
  shopBottom:{
   width:'100%',
   flexDirection: 'row',
   justifyContent:'space-between',
   margin:10,
   padding:10,
  },
  image: {
    width: '100%', // Set image width
    height: 200, // Set image height
    
    // marginRight: 10, // Add some margin right to separate image from text
  },
  shopName: {
    fontSize: 14, // Increase shop name font size
    fontWeight: 'bold', // Make the shop name bold
   
  },
  category:{
   textAlign:'left',
   width:'100%',
   marginTop:-10,
   paddingLeft:10,
   paddingBottom:10,
  },
  ProductitemContainer: {
    marginVertical: 10,
    // borderWidth:0.2,
    marginRight:5,
    marginLeft:5,
    padding:0,
 
    borderRadius:10,
  
  },
  Productpressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  Productimage: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },
  buyNowContainer: {
    // backgroundColor: '#FEBE10',
    paddingVertical: 5,
    width: '100%',
   
    marginTop: 2,
    borderRadius: 4,
  },
  buyNowText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 13,
    fontWeight: 'bold',
    paddingLeft:4,
    paddingRight:4,
    
   
  },
  favButton: {
 
    
    padding: 10,
    backgroundColor:'#ffffff',
    width:'100%',
    
  },
  
});
