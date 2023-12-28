import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import Separator from "../components/separator";
import Login from "./Login";

export default function Utama() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.judul}>Welcome{"\n"} To Booking - In</Text>
      <Image source={{ uri: "https://i.ibb.co/S31zbM5/img12-removebg-preview.png" }} style={styles.gambarLapangan} />
      <TouchableOpacity
        onPress={() => navigation.navigate(Login)}
        style={styles.tombol}
      >
        <Text style={styles.textTombol}>Lanjutkan</Text>
      </TouchableOpacity>
    </View>
  );
}

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
    width: 150,
    height: 50,
    top: 40,
    left: "30%",
    backgroundColor: "#30CF5F",
    borderWidth: 2, // Menambahkan ketebalan garis tepi
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
  textusername:{
    alignSelf: "center",
    backgroundColor: "#BAC1D6",
    width: "60%",
    marginTop: "50%",
    borderWidth: 1, // Menambahkan ketebalan garis tepi
    borderColor: "#CCD4EB",
    borderRadius: 20,
    textAlign: "center",
    padding: 3,
    fontSize: 16,
  },
  gambarLapangan: {
    marginTop: 160,
    marginLeft: 50,
    width: 300,
    height: 300,
    resizeMode: "stretch",
  },
});
