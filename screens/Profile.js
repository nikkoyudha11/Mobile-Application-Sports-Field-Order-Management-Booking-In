import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { StatusBar } from "expo-status-bar";
import { useRoute } from "@react-navigation/native";

export default function Profile() {
  const route = useRoute(); // Use useRoute hook to get the route object
  const { username } = route.params;
  const [avatar, setAvatar] = useState("");
  const [fullName, setFullName] = useState("");
  const [telepon, setTelepon] = useState("");
  const [alamat, setAlamat] = useState("");
  const [pendidikan, setPendidikan] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          "https://nikkoyudha11.github.io/API-Lapangan/lapangan.json"
        );
        const data = await response.json();
        const user = data.User.find((item) => item.username === username);
        if (user) {
          setAvatar(user.foto_user);
          setFullName(user.nama_user);
          setTelepon(user.nomor_user);
          setAlamat(user.alamat_user);
          setPendidikan(user.pendidikan);
          if (user.foto_user) {
            setAvatar(user.foto_user);
          } else {
            console.log("Gambar URL is empty");
          }
        } else {
          console.log("User not found");
          console.log(username);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
      }
    };

    fetchUser(); // Invoke the fetchUser function here
  }, [username]);

  return (
    <View style={{ flex: 1, backgroundColor: "grey" }}>
      <StatusBar style="center" />
      <View style={{ flex: 7, backgroundColor: "#ffffff" }}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1.0 }}>
            {avatar ? (
              <Image
                source={{ uri: avatar }}
                style={{
                  marginTop: 50,
                  width: 200,
                  height: 200,
                  borderRadius: 1000 / 2,
                  borderWidth: 3,
                  borderColor: "#ffffff",
                  position: "relative",
                  zIndex: 400,
                }}
              />
            ) : (
              <Text>Gambar tidak tersedia</Text>
            )}
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                zIndex: 500,
                width: 25,
                height: 25,
                backgroundColor: "#ffffff",
                borderRadius: 50 / 2,
              }}
            >
              <Icon name="plus" size={20} color="#000000" />
            </View>
          </View>
        </View>
        <View style={{ marginTop: 275 }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 24,
              textAlign: "center",
              color: "black",
            }}
          >
            {fullName}
          </Text>
          <View style={{ marginLeft: 125 }}>
            <View style={styles.Listsosmed}>
              <View style={styles.iconstyles}>
                <Icon name="whatsapp" size={25} color="#212121" />
              </View>
              <View style={styles.content}>
                <Text style={styles.keterangan}>{telepon}</Text>
              </View>
            </View>
            <View style={styles.Listsosmed}>
              <View style={styles.iconstyles}>
                <Icon name="map-marker-alt" size={25} color="#212121" />
              </View>
              <View style={styles.content}>
                <Text style={styles.keterangan}>{alamat}</Text>
              </View>
            </View>
            <View style={styles.Listsosmed}>
              <View style={styles.iconstyles}>
                <Icon name="university" size={25} color="#212121" />
              </View>
              <View style={styles.content}>
                <Text style={styles.keterangan}>{pendidikan}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = {
  button: {
    padding: 10,
    backgroundColor: "lightblue",
    borderRadius: 5,
    marginTop: 10,
  },
  nama: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  desc: {
    textAlign: "center",
  },
  Listsosmed: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  keterangan: {
    fontWeight: "bold",
  },
  content: {
    justifyContent: "center",
    flex: 1,
    marginLeft: 10,
  },
  iconstyles: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
  },
  betweenicons: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
};
