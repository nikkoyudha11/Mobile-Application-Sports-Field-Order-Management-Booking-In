import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";

export default function Search() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [locationOfInterest, setLocationOfInterest] = useState([]);
  const [geocodingInfo, setGeocodingInfo] = useState(null);
  const [dataCurrentLocation, setDataCurrentLocation] = useState([]);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const getPermissions = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Please grant location permissions");
          return;
        }

        // Watch for location changes
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (newLocation) => {
            // Handle the updated location here
            setLocation(newLocation);
          }
        );

        // Save the subscription for later cleanup
        setLocationSubscription(subscription);
      } catch (error) {
        console.error("Error getting location permissions:", error);
      }
    };

    getPermissions();

    // Cleanup the subscription when the component unmounts
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    const geocode = async () => {
      if (!location) {
        console.log("Location not available yet");
        return;
      }

      try {
        const results = [];

        for (const query of dataCurrentLocation) {
          const cleanedQuery = cleanQuery(query);

          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=lapangan%20sepak%20bola%20${cleanedQuery}&limit=15&lat=${location.coords.latitude}&lon=${location.coords.longitude}`
          );

          if (!response.ok) {
            console.log(`Error fetching data for query: ${cleanedQuery}`);
            continue;
          }

          const data = await response.json();
          console.log(`Results for query lapangan ${cleanedQuery}:`, data);

          let newData = data.map((item) => ({
            display_name: item.display_name,
            latitude: item.lat,
            longitude: item.lon,
          }));
          results.push(...newData);
        }

        setLocationOfInterest(results);
        console.log("Updated locationOfInterest:");
        console.log(results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    geocode();
  }, [location, dataCurrentLocation]);

  const cleanQuery = (query) => {
    const excludedKeywords = [
      "Kecamatan",
      "Kota",
      "Kabupaten",
      "Kelurahan",
      "Provinsi",
      " ",
    ];
    const cleanedQuery = query
      .split(" ")
      .filter((word) => !excludedKeywords.includes(word))
      .join("%20");
    return cleanedQuery;
  };

  const reversegeocode = async () => {
    try {
      const reversegeocodeaddress = await Location.reverseGeocodeAsync({
        longitude: location?.coords?.longitude || 0,
        latitude: location?.coords?.latitude || 0,
      });
      console.log("geocodee", reversegeocodeaddress);
      setGeocodingInfo(reversegeocodeaddress[0]);
      console.log("Reverse Geocoded:");
      console.log(reversegeocodeaddress);

      if (reversegeocodeaddress[0]) {
        console.log("City:", reversegeocodeaddress[0].city);
        console.log("District:", reversegeocodeaddress[0].district);
        console.log("Subregion:", reversegeocodeaddress[0].subregion);
        let newData = [
          reversegeocodeaddress[0].city,
          reversegeocodeaddress[0].district,
          reversegeocodeaddress[0].subregion,
        ];
        setDataCurrentLocation(newData);
      } else {
        console.log("Geocoding info not available");
      }
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
    }
  };

  useEffect(() => {
    if (location) {
      console.log("loccc", location);
      reversegeocode();
    }
  }, [location]);

  const calculateDistance = () => {
    if (location && destination) {
      const distanceInMeters = haversine(
        location.coords.latitude,
        location.coords.longitude,
        destination.latitude,
        destination.longitude
      );

      setDistance(distanceInMeters);
    }
  };

  useEffect(() => {
    calculateDistance();
  }, [location, destination]);

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
          description={`Lat: ${item.latitude}, Lon: ${item.longitude}`}
          onPress={() => selectLocation(item)}
        />
      );
    });
  };

  const selectLocation = (selectedItem) => {
    // Set the selected location as the destination for directions
    setDestination({
      latitude: parseFloat(selectedItem.latitude),
      longitude: parseFloat(selectedItem.longitude),
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
      <TouchableOpacity
        style={styles.locationListItem}
        onPress={() =>
          navigation.navigate("DetailLapangan", {
            display_name: item.display_name,
          })
        }
      >
        <Text style={styles.locationListItemText}>{item.display_name}</Text>
        <Text>Distance: {locationDistance.toFixed(2)} kilometers</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
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
          {destination && (
            <Polyline
              coordinates={[
                {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                },
                destination,
              ]}
              strokeColor="hotpink"
              strokeWidth={3}
            />
          )}
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
  maps: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
