import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";

export default function Search() {
  const [location, setlocation] = useState(null);
  const [address, setAddress] = useState("");
  const [locationOfInterest, setLocationOfInterest] = useState([]);

  useEffect(() => {
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
  }, []);

  const geocode = async () => {
    if (!location) {
      console.log("Location not available yet");
      return;
    }

    try {
      // Using the Nominatim API to search for "Indomaret" near the current location
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

      // Extracting relevant data and updating locationOfInterest state
      let newData = data.map((item) => ({
        display_name: item.display_name,
        latitude: item.lat,
        longitude: item.lon,
      }));

      setLocationOfInterest(newData);
      console.log("Updated locationOfInterest:");
      console.log(locationOfInterest);
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

  return (
    <View style={styles.container}>
      <TextInput
        placeholder=" Address"
        value={address}
        onChangeText={setAddress}
      />
      <Button title="Geocode Address" onPress={geocode} />
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
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  maps: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
});