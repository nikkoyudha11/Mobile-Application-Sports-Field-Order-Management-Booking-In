import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Home";
import DetailLapangan from "./DetailLapangan";
import Login from "./Login";
import Utama from "./Utama";

const Stack = createNativeStackNavigator();

const StackParamScreenUtamaToHome = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Utama"
        component={Utama}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
export default StackParamScreenUtamaToHome;
