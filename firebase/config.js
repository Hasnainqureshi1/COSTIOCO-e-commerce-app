// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Import only initializeAuth and getReactNativePersistence for React Native
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-kkms-k8kuI3w5Ffq6aVq3h4zSxidva8",
  authDomain: "wholesale-f4f40.firebaseapp.com",
  projectId: "wholesale-f4f40",
  storageBucket: "wholesale-f4f40.appspot.com",
  messagingSenderId: "692247150502",
  appId: "1:692247150502:web:3077a70969f92f58be5967",
  measurementId: "G-7NS580WEM4"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyB5OH68PqQRopEoT9SxKkaY5f2n4qiZPmY",
//   authDomain: "wholesaleapp-bfff7.firebaseapp.com",
//   projectId: "wholesaleapp-bfff7",
//   storageBucket: "wholesaleapp-bfff7.appspot.com",
//   messagingSenderId: "238229090683",
//   appId: "1:238229090683:web:25a673fbfc8218e37f8dde"
// };
// Initialize Firebase
export const app =  initializeApp(firebaseConfig);

// Initialize Firestore
export const firestore = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

// Initialize Auth with React Native specific configurations
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
