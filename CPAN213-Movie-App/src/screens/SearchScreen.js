import React from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import SwipeableCard from "../components/SwipeableCard";

export default function SearchScreen({ route }) {
  const selectedMovie = route?.params?.selectedMovie;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Movies</Text>

      {selectedMovie?.title ? (
        <Text style={styles.subtitle}>Selected: {selectedMovie.title}</Text>
      ) : (
        <Text style={styles.subtitle}>Swipe the card to demo gestures.</Text>
      )}

      <SwipeableCard
        onSwipeLeft={() => Alert.alert("Swipe", "Swiped Left!")}
        onSwipeRight={() => Alert.alert("Swipe", "Swiped Right!")}
      >
        <TouchableOpacity
          style={styles.card}
          onPress={() => Alert.alert("Tap", "Card Pressed!")}
        >
          <Text style={styles.cardText}>Swipe this card left/right</Text>
        </TouchableOpacity>
      </SwipeableCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  title: { color: "#fff", fontSize: 20, fontWeight: "800", marginBottom: 8 },
  subtitle: { color: "#87ceeb", marginBottom: 12, fontWeight: "600" },
  card: {
    backgroundColor: "#0a0a0a",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#1e90ff",
    padding: 16,
  },
  cardText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
