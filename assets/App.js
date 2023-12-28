import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Utama from "./screens/Utama";
import Login from "./screens/Login";
import Home from "./screens/Home";
import TabNavigation from "./Navigations/TabNavigation";
import StackParamScreenUtamaToHome from "./screens/Stack_param_UtamaToHome";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStackNavigator = () => (
  <Stack.Navigator>
    
  </Stack.Navigator>
);

const MainStackNavigator = () => (
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
      component={TabNavigation}
      options={{ headerShown: false }}
    />
     <Stack.Screen
      name="StackParamScreenHomeToDetail"
      component={Home}
      options={{ headerShown: false }}
    />
    {/* Tambahkan screen lain jika diperlukan */}
  </Stack.Navigator>
);

const App = () => {
  const isLoggedIn = true; // Ganti dengan status login yang sesuai

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MainStackNavigator />
      ) : (
        <AuthStackNavigator />
      )}
    </NavigationContainer>
  );
};

export default App;
