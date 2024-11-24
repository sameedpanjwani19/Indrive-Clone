import { View, Text, Button } from "react-native";
import React from "react";
import { signOutUser } from '../../config/firebasemethod';
import { useNavigation } from "expo-router";

const settings = () => {
  const navigation = useNavigation(); // React Navigation hook for navigation

  const LogoutUser = async () => {
    const user = await signOutUser();
    console.log(user);
    navigation.navigate('index');
  };
  return (
    <View>
      <Text>settings</Text>
      <View>
        <Button title="Logout" onPress={LogoutUser} color="#C3F224" />
      </View>
    </View>
  );
};

export default settings;
