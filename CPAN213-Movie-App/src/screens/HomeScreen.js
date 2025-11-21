import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native'; // optional, if using react-navigation

export default function HomeScreen() {
  // Animated value A: used for fade-in + slide-up on screen load
  const appearAnim = useRef(new Animated.Value(0)).current; // 0 => hidden, 1 => visible

  // Animated value B: used for bounce on button press
  const bounceAnim = useRef(new Animated.Value(1)).current; // scale value (1 = normal)

  // If using react-navigation, you may want to animate on focus:
  const isFocused = useIsFocused(); // optional; remove if not using react-navigation

  // Trigger the appear animation when the component mounts or when screen becomes focused
  useEffect(() => {
    if (!isFocused) return; // only animate when focused; remove if not using navigation
    Animated.timing(appearAnim, {
      toValue: 1,            // final opacity/position state
      duration: 700,
      useNativeDriver: true,
      // easing: Easing.out(Easing.ease) // optional import from 'react-native'
    }).start();
  }, [appearAnim, isFocused]);

  // Handler for bounce button
  function handleBounce() {
    // Reset to 1 then spring to 1.25 and back (spring handles bounce)
    bounceAnim.setValue(1);
    Animated.sequence([
      Animated.spring(bounceAnim, {
        toValue: 1.25,      // grow a bit
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,         // return to normal
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      })
    ]).start();
  }

  // Interpolate appearAnim to create opacity and translateY values
  const opacity = appearAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateY = appearAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0], // start 20px lower and slide up into place
  });

  return (
    <View style={styles.container}>
      {/* Animated component that appears on mount */}
      <Animated.View
        style={[
          styles.card,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <Text style={styles.title}>Welcome to the App</Text>
        <Text style={styles.subtitle}>This content faded and slid up on load.</Text>
      </Animated.View>

      {/* Animated button that bounces on press */}
      <Animated.View style={{ transform: [{ scale: bounceAnim }], marginTop: 30 }}>
        <TouchableOpacity style={styles.button} onPress={handleBounce} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Tap to Bounce</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 6, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#555' },
  button: {
    backgroundColor: '#5A67D8',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
