import React, { useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { loginUser } from "../config/firebasemethod"; // Assuming you have this method implemented
import { useNavigation } from "@react-navigation/native"; // For navigation
import { Link, useRouter } from "expo-router";

const index = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation(); // React Navigation hook for navigation
  const router = useRouter();

  const loginUserFromFirebase = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const userLogin = await loginUser({ email, password });
      console.log(userLogin);
      navigation.navigate('./tabs/home'); // Navigate to the Home screen
      router.push("/tabs/home");

    } catch (error) {
      console.error(error);
      Alert.alert("Login Failed", error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Your Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title={loading ? "Logging in..." : "Login"}
        onPress={loginUserFromFirebase}
        disabled={loading}
      />
      <Link href="/register">Dont have an account?</Link>
      

      {loading && <ActivityIndicator style={styles.loading} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  loading: {
    marginTop: 20,
  },
});

export default index;
