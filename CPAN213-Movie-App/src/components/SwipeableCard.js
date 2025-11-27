import Ract, { useMemo, useRef } from "react";
import { Animated, Panresponder, StyleSheet } from "react-native";

export default function SwipeableCard({ children, onSwipeLeft, onSwipeRight }) {
    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = useMemo(
        () => 
            PanResponder.create({
                onStartShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dy) < 25,
                onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
                    useNativeDriver: false,
                }),
                onPanResponderRelease: (_, g) => {
                    const threshold = 120;

                    const reset = () =>
                        Animated.spring(pan, {
                            toValue: { x: 0, y: 0 },
                            useNativeDriver: false,
                        }).start();

                    if (g.dx > threshold) {
                        Animated.timing(pan, {
                            toValue: { x: 400, y: g.dy },
                            duration: 160,
                            useNativeDriver: false,
                        }).start(() => {
                            pan.setValue({ x: 0, y: 0 });
                            onSwipeRight?.();
                        });
                        return;
                    }

                    if (g.dx < -threshold) {
                        Animated.timing(pan, {
                            toValue: { x: -400, y: g.dy },
                            duration: 160,
                            useNativeDriver: false,
                        }).start(() => {
                            pan.setValue({ x: 0, y: 0 });
                            onSwipeLeft?.();
                        });
                        return;
                    }

                    reset();
                },
            }),
        [onSwipeLeft, onSwipeRight, pan]
    );

    return (
        <Animated.View
            style={[styles.card, { transform: [{ translateX: pan.x }, { translateY: pan.y }] }]}
            >
                {children}
            </Animated.View>
    );
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 12,
        marginVertical: 10,
        elevation: 3,
    },
});