import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Home";
import DetailLapangan from "./DetailLapangan";
import Login from "./Login";
import Utama from "./Utama";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

const StackParamScreenHomeToDetail = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = navigation.addListener("tabPress", (e) => {
        // Jika tab "Home" ditekan dan layar "Home" sedang difokuskan, tetap di "Home"
        if (isFocused) {
          e.preventDefault(); // Mencegah default navigation behavior
        } else {
          // Jika tidak, navigasikan ke "Home"
          navigation.navigate("Home");
        }
      });

      return unsubscribe;
    }, [isFocused])
  );

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Utama"
        component={Utama}
        options={{ headerShown: false, tabBarVisible: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false, tabBarVisible: false }}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="DetailLapangan"
        component={DetailLapangan}
        options={{
          title: "Detail Lapangan",
        }}
      />
    </Stack.Navigator>
  );
};
export default StackParamScreenHomeToDetail;
