import React from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import SwipeableCard from "../components/SwipeableCard";


export default function SearchScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Search Movies</Text>

<SwipeableCard
    onSwipeLeft={() => Alert.alert("Swiped Left!")}
    onSwipeRight={() => Alert.alert("Swiped Right!")}
>

    <TouchableOpacity style={styles.card} onPress={() => Alert.alert("Tap", "Card Pressed!")}>
          <Text style={styles.cardText}>Swipe this card left/right</Text>
        </TouchableOpacity>
      </SwipeableCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  title: { color: "#fff", fontSize: 20, fontWeight: "800", marginBottom: 12 },
  card: {
    backgroundColor: "#0a0a0a",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#1e90ff",
    padding: 16,
  },
  cardText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});