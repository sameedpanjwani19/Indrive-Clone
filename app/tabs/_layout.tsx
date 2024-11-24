import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { DrawerItem } from "@react-navigation/drawer";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";

// Define your navigation types
type RootStackParamList = {
  index: undefined;
  home: undefined;
  safety: undefined;
  settingHelpSupport: undefined;
  login: undefined; // Define the login route
};

// Define the navigation prop type
type NavigationProps = {
  navigate: (screen: keyof RootStackParamList) => void;
};

// Define an interface for the props
interface LayoutProps {
  navigation?: NavigationProps; // Use the defined NavigationProps type
}

const Layout: React.FC<LayoutProps> = () => {
  const auth = getAuth(); // Initialize Firebase Auth
  const navigation = useNavigation<NavigationProps>(); // Use the correct navigation type

  // Custom sign-out function
  const signOutUser = () => {
    return new Promise((resolve, reject) => {
      signOut(auth)
        .then(() => {
          resolve("Sign Out Successfully");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  };

  const handleLogout = async () => {
    try {
      await signOutUser(); // Call the custom sign-out method
      console.log("User  logged out");
      // Navigate to the login screen after successful sign-out
      navigation.navigate("login"); // Adjust this based on your routing
    } catch (error) {
      console.error("Error logging out: ", error);
      // Handle error (e.g., show an alert)
    }
  };



  return (
    <GestureHandlerRootView style={styles.container}>
      <Drawer>
       
        <Drawer.Screen
          name="home" // This is the name of the page and must match the URL from root
          options={{
            drawerLabel: "Home",
            title: "Home",
          }}
        />
        <Drawer.Screen
          name="profile" // This is the name of the page and must match the URL from root
          options={{
            drawerLabel: "Profile",
            title: "Profile",
          }}
        />
        <Drawer.Screen
          name="settings" // This is the name of the page and must match the URL from root
          options={{
            drawerLabel: "Settings",
            title: "Settings",
          }}
        />
     

        {/* Log Out Button */}
        <DrawerItem
          label="Log Out"
          onPress={handleLogout}
          style={styles.drawerItem}
        />

       
      </Drawer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    backgroundColor: "#007BFF",
    padding: 15,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  drawerItem: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
});

export default Layout;