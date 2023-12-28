import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "../screens/Profile";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import Chat from "../screens/Chat";
import RiwayatScreen from "../screens/History";
import StackParamScreen from "../screens/Stack_param_searchtodetail";
import StackParamScreenHomeToDetail from "../screens/Stack_param_HomeToDetail";

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="StackParamScreenHomeToDetail"
        component={StackParamScreenHomeToDetail}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
          tabBarVisible: false,
        }}
      />
      <Tab.Screen
        name="StackParamScreen"
        component={StackParamScreen}
        options={{
          tabBarLabel: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Riwayat"
        component={RiwayatScreen}
        options={{
          tabBarLabel: "Riwayat",
          tabBarIcon: ({ color, size }) => (
            <Feather name="list" color={color} size={size} /> // Change to Feather icon for "list"
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarLabel: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbox-ellipses-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
