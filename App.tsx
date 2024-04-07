import { StatusBar } from "expo-status-bar";
import { Dimensions, StyleSheet } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const IMAGE_URI =
  "https://images.unsplash.com/photo-1621569642780-4864752e847e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80";

const { height, width } = Dimensions.get("screen");

export default function App() {
  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onChange((event) => {
      scale.value = event.scale;
      focalX.value = event.focalX;
      focalY.value = event.focalY;
    })
    .onEnd(() => {
      scale.value = withTiming(1);
    });

  const imageAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: focalX.value,
        },
        {
          translateY: focalY.value,
        },
        {
          translateX: -width / 2,
        },
        {
          translateY: -height / 2,
        },
        {
          scale: scale.value,
        },
        {
          translateX: -focalX.value,
        },
        {
          translateY: -focalY.value,
        },
        {
          translateX: width / 2,
        },
        {
          translateY: height / 2,
        },
      ],
    };
  });

  const focalCenterAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: focalX.value,
        },
        {
          translateY: focalY.value,
        },
      ],
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={pinchGesture}>
        <Animated.Image
          style={imageAnimatedStyles}
          source={{
            uri: IMAGE_URI,
            height,
            width,
          }}
        />
      </GestureDetector>
      <Animated.View style={[styles.focalCenter, focalCenterAnimatedStyles]} />
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  focalCenter: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0000ff",
    borderRadius: 10,
    height: 20,
    width: 20,
  },
});
