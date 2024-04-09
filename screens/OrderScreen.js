import { StyleSheet, Text, View,SafeAreaView, TouchableOpacity, BackHandler, Alert } from "react-native";
import React ,{useEffect, useRef, useState} from "react";
import LottieView from "lottie-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Modal from "react-native-modals";
import QRCode from "react-native-qrcode-svg";
import downloadQRCode from "../components/downloadQRCode";
import { useDispatch } from "react-redux";

const OrderScreen = () => {
    const navigation = useNavigation()
    const router = useRoute()
    const orderIds = router.params.orderIds;
    const orderIdsStr = orderIds.join(',');
    const [showQRCode, setShowQRCode] = useState(false);
    console.log("orderIds: ", orderIds);
    const qrCodeRef = useRef();
  const dispatch = useDispatch();
  const handleCheckQRCodePress = () => {
    setShowQRCode(true);
  };
  useEffect(() => {
    
      // Override hardware back button on Android
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true // Ignore the back button event
      );
  
      // Return the cleanup function
      return () => backHandler.remove();
  
  }, []);
  useEffect(() => {
  
  }, [showQRCode ==false]);

  const onClose = ()=>{
    setShowQRCode(false)
      // Remove all previous screens and navigate to home screen
      navigation.reset({
        index: 0,
        routes: [{ name: "HomeScreen" }], // Change "HomeScreen" to your home screen's route name
      });
  }
   
  // Function to handle the close confirmation
const confirmClose = () => {
  Alert.alert(
    "Download QR Code?",
    "Before you leave, please make sure to download the QR code. This is important for your Purchasing. Do you want to continue?",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "Yes", onPress: () => onClose() }
    ],
    { cancelable: false }
  );
};



  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
    <LottieView
        source={require("../assets/orderconfirm.json")}
        style={{
          height: 300,
          position: "absolute",
          top: 100,
          width: 300,
          alignSelf: "center",
        }}
        autoPlay
        loop={true}
        speed={0.7}
      />
      <Text
        style={{
          marginTop: 20,
          fontSize: 19,
          fontWeight: "600",
          textAlign: "center",
          position:"absolute",
          top: 320,
          left:30,
        }}
      >
        Your Order Has been Recieved
      </Text>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showQRCode}
        onRequestClose={() => setShowQRCode(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView} ref={qrCodeRef}>
          <Text style={styles.modalText}>QR Code Will be used for Recieve Order.</Text>
            <QRCode
              value={orderIdsStr}  
              size={200}
            />
            <Text style={styles.modalText}>Save this and don't share with anyone.</Text>

          </View>
            <TouchableOpacity onPress={() => downloadQRCode(qrCodeRef)}>
  <Text style={{fontWeight:"500", fontSize:16,}}>Download QR Code</Text>
</TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.modalButton]}
              onPress={() => confirmClose()}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>

            <TouchableOpacity>
  <Text style={{fontWeight:"400", fontSize:16, marginTop:50,textAlign:"center",borderBottomColor:'black',borderBottomWidth:0.5, paddingBottom:10 }}>Please Don't Press Close before Downloading QR Code</Text>
</TouchableOpacity>

        </View>
      </Modal>
      <TouchableOpacity   style={{
          marginTop: 20,
          fontSize: 19,
          fontWeight: "600",
          textAlign: "center",
          position:"absolute",
          bottom: 120,
          left:100,
        }} onPress={handleCheckQRCodePress}>
        <Text style={{
          marginTop: 20,
          fontSize: 19,
          fontWeight: "600",
          textAlign: "center",
         
        }}>Collect QR Code</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    marginTop:15,
    fontSize:16
  },
  buttonText:{
    marginTop:10,
    fontSize:16,
    color:'red',
  }
});
