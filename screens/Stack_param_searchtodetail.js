import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Search from "./Search";
import DetailLapangan from "./DetailLapangan";

const Stack = createNativeStackNavigator();

const StackParamScreen = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen
          name="Search"
          component={Search}
          options={{headerShown:false}}
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
export default StackParamScreen;
