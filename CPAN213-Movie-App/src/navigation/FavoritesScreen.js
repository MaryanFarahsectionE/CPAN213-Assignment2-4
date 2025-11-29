import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      <Text style={styles.text}>Favorites screen is working ✅</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#000" },
  title: { color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 8 },
  text: { color: "#87ceeb", fontSize: 16 },
});
