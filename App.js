import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { ModalPortal } from "react-native-modals";
import { Provider, useDispatch } from "react-redux";
import StackNavigator from "./navigation/StackNavigator";
import store from "./store";
// import { UserContext } from "./UserContext";
import { useEffect } from "react";
import { loadCartFromStorage } from "./components/storage";
import UserContext, { UserProvider } from "./UserContext";

export default function App() {

  return (
    <>
  <Provider store={store}>
        <UserProvider>
          <StackNavigator />
          <ModalPortal />
        </UserProvider>
      </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
