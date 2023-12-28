import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Dimensions,
  FlatList,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

export default function Header() {
  const [location, setlocation] = useState(null);
  const [address, setAddress] = useState("");
  const [locationOfInterest, setLocationOfInterest] = useState([]);
  const [geocodeResult, setGeocodeResult] = useState(null);
  const navigation = useNavigation();

  const geocode = async () => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Please grant location permissions");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setlocation(currentLocation);
      console.log("Location : ");
      console.log(currentLocation);
    };
    getPermissions();

    if (!location) {
      console.log("Location not available yet");
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${address}&limit=5&lat=${location.coords.latitude}&lon=${location.coords.longitude}`
      );

      if (!response.ok) {
        console.log("Error fetching data from Nominatim API");
        return;
      }

      const data = await response.json();
      console.log(address);
      console.log(data);

      let newData = data.map((item) => ({
        display_name: item.display_name,
        latitude: item.lat,
        longitude: item.lon,
      }));

      setLocationOfInterest(newData);
      // setGeocodeResult(newData); // Update state geocodeResult
      console.log("Updated locationOfInterest:");
      console.log(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  let ShowLocationsOfInterest = () => {
    return locationOfInterest.map((item, index) => {
      return (
        <Marker
          key={index}
          coordinate={{
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude),
          }}
          title={item.display_name}
          description={`latitude: ${item.latitude}, longitude: ${item.longitude}`}
        />
      );
    });
  };

  const renderLocationItem = ({ item }) => {
    // Calculate distance for each location
    const locationDistance = haversine(
      location.coords.latitude,
      location.coords.longitude,
      parseFloat(item.latitude),
      parseFloat(item.longitude)
    );

    return (
      <View style={styles.locationListItem}>
        <Text style={styles.locationListItemText}>{item.display_name}</Text>
        <Text>Distance: {locationDistance.toFixed(2)} kilometers</Text>
      </View>
    );
  };
  
  return (
    <View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
        }}
      >
        <Image source={require("./../assets/gps.png")} style={styles.logo} />
        <View style={styles.searchBar}>
          <TextInput
            placeholder="search here"
            value={address}
            onChangeText={setAddress}
            onSubmitEditing={geocode} // Menggunakan onSubmitEditing
          />
        </View>
        <Image
          source={require("./../assets/search.png")}
          style={styles.logoUser}
        />
      </View>

      {geocodeResult && (
        <Text>
          {geocodeResult.map(
            (item, index) =>
              `${item.display_name} (Lat: ${item.latitude}, Long: ${item.longitude})\n`
          )}
        </Text>
      )}

      {location && (
        <MapView
          style={styles.maps}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005251309080501976,
            longitudeDelta: 0.002587325870990753,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here"
            description="Your current location"
            pinColor="cyan"
          />
          {ShowLocationsOfInterest()}
        </MapView>
      )}
      {locationOfInterest.length > 0 && (
        <FlatList
          data={locationOfInterest}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderLocationItem}
          style={styles.locationList}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 40,
    height: 40,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 4,
    borderRadius: 50,
    paddingLeft: 10,
    width: Dimensions.get("screen").width * 0.6,
  },
  logoUser: {
    width: 35,
    height: 35,
  },
  maps: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  locationList: {
    height: 300,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
  },
  locationListItem: {
    marginBottom: 10,
  },
  locationListItemText: {
    fontWeight: "bold",
  },
});

const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

const toRadians = (angle) => {
  return (angle * Math.PI) / 180;
};

