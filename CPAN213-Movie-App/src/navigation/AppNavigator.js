import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import FavoriteScreen from "./FavoritesScreen";

// Only keep these if they exist in your project.
// If they don't exist yet, remove these 2 imports for now.
import DetailsScreen from "../screens/DetailsScreen";
import SettingScreen from "../screens/SettingScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BrowseStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Browse"
          component={BrowseStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen name="Favorites" component={FavoriteScreen} />
        <Tab.Screen name="Settings" component={SettingScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
