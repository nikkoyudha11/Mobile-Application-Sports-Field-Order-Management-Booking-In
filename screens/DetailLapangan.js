// DetailLapangan.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DetailLapangan = ({ route, navigation }) => {
  // Menerima data lapangan dari navigasi
  const { display_name } = route.params;
  const [namaLapangan, setNamaLapangan] = useState("");
  const [hargaSewa, setHargaSewa] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [telepon, setTelepon] = useState("");
  const [fasilitas, setFasilitas] = useState("");
  const [buka, setBuka] = useState("");
  const [tutup, setTutup] = useState("");
  const [mulai, setMulai] = useState("");
  const [sewa, setSewa] = useState("");
  let [gambar, setGambar] = useState("");

  useEffect(() => {
    const fetchLapanganData = async () => {
      try {
        const response = await fetch(
          "https://nikkoyudha11.github.io/API-Lapangan/lapangan.json"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch lapangan data");
        }

        const data = await response.json();
        const lapangan = data.data_lapangan.find(
          (item) => item.nama_lapangan === display_name
        );

        if (lapangan) {
          setNamaLapangan(lapangan.nama_lapangan);
          setHargaSewa(lapangan.harga_sewa);
          setDeskripsi(lapangan.deskripsi_lapangan);
          setFasilitas(lapangan.fasilitas);
          setTelepon(lapangan.telepon);
          setBuka(lapangan.jam_buka);
          setTutup(lapangan.jam_tutup);

          if (lapangan.gambar_url) {
            setGambar(lapangan.gambar_url);
          } else {
            console.log("Gambar URL is empty");
          }

          if (lapangan.fasilitas == "") {
            setFasilitas("belum terisi");
          }
        } else {
          console.log("Lapangan not found");
        }
      } catch (error) {
        console.error("Error fetching lapangan data:", error);
      }
    };

    fetchLapanganData();
  }, [display_name]);

  // Fungsi untuk menavigasi ke halaman Booking
  const navigateToBooking = () => {
    const isSewaValid = /^\d+$/.test(sewa);
  // Validasi input "Jam mulai" hanya berupa format waktu (HH:mm)
  const isJamMulaiValid = /^([01]\d|2[0-3]):[0-5]\d$/.test(mulai);

  if (!isSewaValid) {
    Alert.alert("Peringatan", "Harga sewa hanya boleh berupa angka");
  } else if (!isJamMulaiValid) {
    Alert.alert("Peringatan", "Format jam mulai tidak valid. Gunakan format HH:mm");
  } else {
    saveBookingDataToLocalStorage({
      namaLapangan,
      hargaSewa,
      fasilitas,
      telepon,
      buka,
      tutup,
      mulai,
      sewa,
      deskripsi,
      gambar,
    });
    // Jika input valid, lanjutkan dengan pemesanan
    Alert.alert("Pemesanan anda sedang diproses");
  }
  };

  const saveBookingDataToLocalStorage = async (bookingData) => {
    try {
      // Fetch existing data from local storage
      const existingData = await AsyncStorage.getItem("bookingHistory");
      const existingHistory = existingData ? JSON.parse(existingData) : [];

      // Add new booking data to the array
      existingHistory.push(bookingData);

      // Save the updated array to local storage
      await AsyncStorage.setItem("bookingHistory", JSON.stringify(existingHistory));
    } catch (error) {
      console.error("Error saving booking data to local storage:", error);
    }
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Tambahkan gambar lapangan dari URL */}
        {gambar ? (
          <Image source={{ uri: gambar }} style={styles.gambarLapangan} />
        ) : (
          <Text>Gambar tidak tersedia</Text>
        )}

        <Text style={styles.namaLapangan}>{namaLapangan}</Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="pricetag" size={24} color="black" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}> Harga Sewa </Text>
              <Text style={styles.infoText}>Rp.{hargaSewa}/ jam</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="football" size={24} color="black" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Fasilitas</Text>
              <Text style={styles.infoText}>{fasilitas}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="call" size={24} color="black" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Nomor HP</Text>
              <TouchableOpacity onPress={() => {navigation.navigate("Chat")}}>
              <Text style={styles.infoText}>{telepon}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="time" size={24} color="black" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>jam buka</Text>
              <Text style={styles.infoText}>{buka}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="stop" size={24} color="black" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>jam tutup</Text>
              <Text style={styles.infoText}>{tutup}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="timer" size={24} color="black" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Sewa</Text>
              <TextInput style={styles.infoText1} placeholder="jam (ex: 1, 2)" value={sewa} onChangeText={setSewa}></TextInput> 
            </View>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="play" size={24} color="black" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Jam mulai</Text>
              <TextInput style={styles.infoText1} placeholder="jam (HH:mm)"value={mulai} onChangeText={setMulai}></TextInput> 
            </View>
          </View>
        </View>

        <Text style={styles.deskripsiLabel}>Deskripsi:</Text>
        <Text style={styles.deskripsiText}>{deskripsi}</Text>

        {/* Tombol Booking */}
        <TouchableOpacity
          style={styles.bookingButton}
          onPress={navigateToBooking}
        >
          <Text style={styles.bookingButtonText}>Booking</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  gambarLapangan: {
    width: "100%",
    height: 200, // Sesuaikan tinggi gambar sesuai kebutuhan
    resizeMode: "cover",
    borderRadius: 8,
    marginBottom: 10,
  },
  namaLapangan: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoContainer: {
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoTextContainer: {
    marginLeft: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 16,
  },
  infoText1: {
    fontSize: 16,
    paddingLeft: 5,
    backgroundColor: "#E3E1D3",
  },
  deskripsiLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  deskripsiText: {
    fontSize: 16,
    lineHeight: 22,
  },
  bookingButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  bookingButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DetailLapangan;
