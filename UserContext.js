import React, { createContext, useContext, useState } from 'react';
import { auth, firestore } from './firebase/config'; // Ensure these are imported correctly
import { doc, getDoc } from 'firebase/firestore';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to fetch user data from Firestore
  const fetchUserData = async (userId) => {
    const userDocRef = doc(firestore, "app_users", userId);
    try {
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        console.log(userDocSnap.data())
        return userDocSnap.data();
      } else {
        console.log("No such document in 'app_users' collection!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};
export default UserContext