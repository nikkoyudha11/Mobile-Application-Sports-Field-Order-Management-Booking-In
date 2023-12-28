import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Home";
import Login from "./Login";

const Stack = createNativeStackNavigator();

const StackParamScreenLoginToHome = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: "Detail Lapangan",
        }}
      />
    </Stack.Navigator>
  );
};
export default StackParamScreenLoginToHome;
