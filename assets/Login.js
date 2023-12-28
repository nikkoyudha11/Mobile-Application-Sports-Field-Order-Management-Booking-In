import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Separator from "../components/separator";

const Login = () => {
  const navigation = useNavigation();
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const fetchUser = async () => {
    try {
      const response = await fetch("https://nikkoyudha11.github.io/API-Lapangan/lapangan.json");

      if (!response.ok) {
        throw new Error("Failed to fetch lapangan data");
      }

      const data = await response.json();
      const user = data.User.find((item) => item.username === usernameInput && item.password === passwordInput);

      if (user) {
        navigation.navigate('Home');
      } else {
        Alert.alert(
          "Invalid Credentials",
          "Please check your username and password"
        );
      }
    } catch (error) {
      console.error("Error fetching lapangan data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.judul}>
        Hello Again! Welcome Back To Booking - In
      </Text>
      <Separator height={15} />
      <TextInput
        style={styles.textusername}
        placeholder="Username"
        value={usernameInput}
        onChangeText={(text) => setUsernameInput(text)}
      />
      <Separator height={15} />
      <TextInput
        style={styles.textpassword}
        placeholder="Password"
        value={passwordInput}
        onChangeText={(text) => setPasswordInput(text)}
        secureTextEntry={true}
      />
      <TouchableOpacity onPress={fetchUser} style={styles.tombol}>
        <Text style={styles.textTombol}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3DB8FF",
    top: 5,
  },
  judul: {
    top: 120,
    left: 70,
    width: "70%",
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  tombol: {
    width: 100,
    height: 50,
    top: 40,
    left: "35%",
    backgroundColor: "#30CF5F",
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "#218F42",
  },
  textTombol: {
    paddingLeft: 2,
    paddingTop: 10,
    paddingBottom: 4,
    alignSelf: "center",
    fontSize: 16,
    color: "blue",
    fontWeight: "bold",
  },
  textusername: {
    alignSelf: "center",
    backgroundColor: "#BAC1D6",
    width: "60%",
    marginTop: "50%",
    borderWidth: 1,
    borderColor: "#CCD4EB",
    borderRadius: 20,
    textAlign: "center",
    padding: 3,
    fontSize: 16,
  },
  textpassword: {
    alignSelf: "center",
    backgroundColor: "#BAC1D6",
    width: "60%",
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#CCD4EB",
    borderRadius: 20,
    textAlign: "center",
    padding: 3,
    fontSize: 16,
  },
});

export default Login;
