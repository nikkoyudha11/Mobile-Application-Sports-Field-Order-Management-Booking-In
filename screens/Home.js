import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from "react-native";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useNavigation } from '@react-navigation/native';

export default function Home({ route }) {
  const navigation = useNavigation();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const response = await fetch(
          "https://api-berita-indonesia.vercel.app/cnn/olahraga"
        );
        const data = await response.json();
        setNewsData(data.data.posts || []); // Use posts array if available, otherwise provide an empty array
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };

    fetchNewsData();
  }, []);

  const recommendedFields = [
    {
      id: 1,
      name: "Lapangan Sepak Bola Benowo, Jalan Benowo Tegal, RW 02, Benowo, Pakal, Surabaya, Jawa Timur, Jawa, 60195, Indonesia",
      image: "https://i.ytimg.com/vi/Kmy7Ewvbsk0/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH2CYAC0AWKAgwIABABGGMgYyhjMA8=&rs=AOn4CLATQ9VEYmVQavw-SXo9UnRjzL21tg",
    },
    {
      id: 2,
      name: "Lapangan Sepak Bola Karah, Jalan Karah Indah IV, RW 01, Karah, Jambangan, Surabaya, Jawa Timur, Jawa, 60222, Indonesia",
      image: "https://t.ly/kKSdT",
    },
    // Add more fields as needed
  ];

  const handleNewsPress = (link) => {
    Linking.openURL(link);
  };

  return (
    <View style={styles.container}>
      <Header username={route.params?.username} />

      <ScrollView style={{ padding: 20 }}>
        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => {
            navigation.navigate('StackParamScreen');
          }}
        >
          <Text style={styles.orderButtonText}>Order Lapangan</Text>
        </TouchableOpacity>

        <Text style={styles.headerText}>Rekomendasi Lapangan</Text>

        <View style={styles.fieldContainer}>
          {recommendedFields.map((field) => (
            <TouchableOpacity
              key={field.id}
              style={styles.fieldItem}
              onPress={() => {
                navigation.navigate("DetailLapangan", {
                  display_name: field.name,
                })
              }}
            >
              <Image source={{uri: field.image}} style={styles.fieldImage} />
              <Text style={styles.fieldName}>{field.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.headerText}>What's New</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#3498db" />
        ) : (
          <ScrollView>
            {newsData.map((article) => (
              <TouchableOpacity
                key={article.link}
                style={{ marginBottom: 15, backgroundColor: "white", borderRadius: 7, padding: 7, }}
                onPress={() => handleNewsPress(article.link)}
              >
                <Image
                  source={{ uri: article.thumbnail || "https://via.placeholder.com/150" }}
                  style={{ width: "100%", height: 200, borderRadius: 8 }}
                />
                <Text style={{ marginTop: 10, fontSize: 18, fontWeight: "bold" }}>
                  {article.title}
                </Text>
                <Text style={{ marginTop: 5, fontSize: 14, color: "#555" }}>
                  {article.description}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#54C0FF",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  orderButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  fieldContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fieldItem: {
    flex: 1,
    marginRight: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  fieldImage: {
    width: "100%",
    height: 150,
  },
  fieldName: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
});
