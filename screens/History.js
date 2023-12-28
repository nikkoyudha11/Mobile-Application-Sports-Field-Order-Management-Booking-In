import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function History() {
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // useEffect(() => {
  //   const fetchRiwayat = async () => {
  //     try {
  //       const response = await fetch(
  //         "https://nikkoyudha11.github.io/API-Lapangan/riwayat.json"
  //       );
  //       const data = await response.json();
  //       const riwayatData = data.riwayat_sewa;
  //       setRiwayat(riwayatData);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching riwayat:", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchRiwayat();
  // }, []);
  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        // Retrieve booking history from local storage
        const historyData = await AsyncStorage.getItem("bookingHistory");
        const riwayatData = historyData ? JSON.parse(historyData) : [];

        setRiwayat(riwayatData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching riwayat:", error);
        setLoading(false);
      }
    };

    fetchRiwayat();
  
      // Set up an interval to fetch riwayat every 3 seconds
      const intervalId = setInterval(() => {
        fetchRiwayat();
      }, 3000);
  
      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);
    
  }, []);

  const removeItem = async (item) => {
    try {
      const updatedRiwayat = riwayat.filter((riwayatItem) => riwayatItem !== item);

      // Update local storage with the modified riwayatData
      await AsyncStorage.setItem("bookingHistory", JSON.stringify(updatedRiwayat));

      // Update state to reflect the change
      setRiwayat(updatedRiwayat);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Riwayat Pemesanan</Text>
      <FlatList
        data={riwayat}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.riwayatContainer}>
            <Image style={styles.image} source={{ uri: item.gambar }} />
            <Text style={styles.detail_riwayat}> {item.namaLapangan} </Text>
            <Ionicons name="football" size={24} color="black">
              <Text style={styles.detail_riwayat_lain}> {item.fasilitas}</Text>
            </Ionicons>
            <Ionicons name="play" size={24} color="black">
              <Text style={styles.detail_riwayat_lain}>
                {" "}
                Mulai : {item.mulai}
              </Text>
            </Ionicons>
            {/* <Ionicons name="stop" size={24} color="black">
              <Text style={styles.detail_riwayat_lain}>
                {" "}
                Selesai : {item.selesai}
              </Text>
            </Ionicons> */}
            <FontAwesome name="phone" size={24} color="black">
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Chat");
                }}
              >
                <Text style={styles.detail_riwayat_lain}> {item.telepon}</Text>
              </TouchableOpacity>
            </FontAwesome>
            <Ionicons name="time-sharp" size={24} color="black">
              <Text style={styles.detail_riwayat_lain}>
                {""} {item.sewa} Jam
              </Text>
            </Ionicons>
            <FontAwesome name="money" size={24} color="black">
              <Text style={styles.detail_riwayat_lain}>
                {""} Harga Sewa: {item.hargaSewa}/jam
              </Text>
            </FontAwesome>
            <Ionicons name="calculator" size={24} color="black">
              <Text style={styles.detail_riwayat_lain}>
                {""} Total Harga Sewa: {item.hargaSewa * item.sewa}
              </Text>
            </Ionicons>
            <TouchableOpacity onPress={() => removeItem(item)}>
              <Text style={styles.buttonhapus}>Hapus</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginBottom: 50,
    backgroundColor: "#30CF5F",
    marginTop: 10,
  },
  buttonhapus: {
    backgroundColor: "red",
    width: 80,
    height: 40,
    color: "white",
    textAlign: "center",
    paddingTop: 10,
    borderRadius: 8,
    alignSelf: "flex-end",
  },
  riwayatContainer: {
    width: "95%",
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: "green",
    borderRadius: 8,
    marginBottom: 10,
    marginLeft: 10,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 5,
  },
  header: {
    backgroundColor: "#3DB8FF",
    height: 55,
    paddingTop: 18,
    paddingLeft: 15,
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  detail_riwayat: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detail_riwayat_lain: {
    fontSize: 16,
    // paddingLeft: 5,
  },
});
