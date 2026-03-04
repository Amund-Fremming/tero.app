import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import Color from "@/src/core/constants/Color";
import { useNavigation } from "expo-router";
import { useRef, useState } from "react";
import { Animated, Easing, Pressable, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Polygon, Stop } from "react-native-svg";
import { styles } from "./diceGameStyles";

const FACE_LAYOUTS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

const PIP_POSITIONS: Record<number, { left: `${number}%`; top: `${number}%` }> = {
  0: { left: "20%", top: "20%" },
  1: { left: "50%", top: "20%" },
  2: { left: "80%", top: "20%" },
  3: { left: "20%", top: "50%" },
  4: { left: "50%", top: "50%" },
  5: { left: "80%", top: "50%" },
  6: { left: "20%", top: "80%" },
  7: { left: "50%", top: "80%" },
  8: { left: "80%", top: "80%" },
};

const TOP_FACE: Record<number, number> = {
  1: 2,
  2: 6,
  3: 2,
  4: 6,
  5: 1,
  6: 5,
};

const RIGHT_FACE: Record<number, number> = {
  1: 3,
  2: 3,
  3: 5,
  4: 1,
  5: 4,
  6: 4,
};

type FaceProps = {
  value: number;
};

const toUnit = (index: number) => {
  const position = PIP_POSITIONS[index];
  return {
    x: Number.parseInt(position.left, 10) / 100,
    y: Number.parseInt(position.top, 10) / 100,
  };
};

const frontMap = (ux: number, uy: number) => ({
  x: 34 + ux * 60,
  y: 46 + uy * 60,
});

const topMap = (ux: number, uy: number) => ({
  x: 34 + ux * 60 + uy * 20,
  y: 46 - uy * 20,
});

const rightMap = (ux: number, uy: number) => ({
  x: 94 + ux * 20,
  y: 46 - ux * 20 + uy * 60,
});

const Dice3D = ({ value }: FaceProps) => {
  const frontFace = value;
  const topFace = TOP_FACE[value];
  const rightFace = RIGHT_FACE[value];

  const renderFacePips = (
    faceValue: number,
    mapper: (ux: number, uy: number) => { x: number; y: number },
    prefix: string,
    radius = 4.2
  ) => {
    return FACE_LAYOUTS[faceValue].map((index) => {
      const unit = toUnit(index);
      const point = mapper(unit.x, unit.y);
      return <Circle key={`${prefix}-${index}`} cx={point.x} cy={point.y} r={radius} fill="#1f2428" />;
    });
  };

  return (
    <Svg width="100%" height="100%" viewBox="0 0 140 120">
      <Defs>
        <LinearGradient id="frontGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#ffffff" />
          <Stop offset="1" stopColor="#ececef" />
        </LinearGradient>
        <LinearGradient id="topGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#ffffff" />
          <Stop offset="1" stopColor="#f2f2f5" />
        </LinearGradient>
        <LinearGradient id="rightGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#e7e7eb" />
          <Stop offset="1" stopColor="#d9d9df" />
        </LinearGradient>
      </Defs>

      <Polygon points="34,46 54,26 114,26 94,46" fill="url(#topGrad)" stroke="#d8d8dd" strokeWidth="2" />
      <Polygon points="94,46 114,26 114,86 94,106" fill="url(#rightGrad)" stroke="#cbccd2" strokeWidth="2" />
      <Polygon points="34,46 94,46 94,106 34,106" fill="url(#frontGrad)" stroke="#d8d8dd" strokeWidth="2" />

      {renderFacePips(topFace, topMap, "top", 3.6)}
      {renderFacePips(rightFace, rightMap, "right", 3.6)}
      {renderFacePips(frontFace, frontMap, "front", 4.2)}
    </Svg>
  );
};

export const DiceGame = () => {
  const navigation: any = useNavigation();
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);

  const throwProgress = useRef(new Animated.Value(0)).current;
  const spinProgress = useRef(new Animated.Value(0)).current;
  const settleTilt = useRef(new Animated.Value(0)).current;

  const handleInfoPressed = () => {
    //
  };

  const handleRoll = () => {
    if (isRolling) {
      return;
    }

    const nextValue = Math.floor(Math.random() * 6) + 1;
    setIsRolling(true);

    throwProgress.setValue(0);
    spinProgress.setValue(0);
    settleTilt.setValue(0);

    Animated.parallel([
      Animated.timing(throwProgress, {
        toValue: 1,
        duration: 1150,
        easing: Easing.bezier(0.2, 0.85, 0.25, 1),
        useNativeDriver: true,
      }),
      Animated.timing(spinProgress, {
        toValue: 1,
        duration: 1150,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDiceValue(nextValue);

      Animated.sequence([
        Animated.spring(settleTilt, {
          toValue: nextValue % 2 === 0 ? 1 : -1,
          friction: 6,
          tension: 75,
          useNativeDriver: true,
        }),
        Animated.spring(settleTilt, {
          toValue: 0,
          friction: 8,
          tension: 90,
          useNativeDriver: true,
        }),
      ]).start(() => setIsRolling(false));
    });
  };

  const translateY = throwProgress.interpolate({
    inputRange: [0, 0.45, 0.82, 1],
    outputRange: [0, -170, 14, 0],
  });

  const scale = throwProgress.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [1, 0.9, 1.04, 1],
  });

  const rotateX = spinProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "980deg"],
  });

  const rotateY = spinProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "1280deg"],
  });

  const rotateZ = spinProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "760deg"],
  });

  const settleX = settleTilt.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-5deg", "0deg", "5deg"],
  });

  const settleY = settleTilt.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["4deg", "0deg", "-4deg"],
  });

  const shadowScale = throwProgress.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [1, 0.74, 1],
  });

  const shadowOpacity = throwProgress.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.35, 0.14, 0.3],
  });

  const animatedDiceStyle = {
    transform: [
      { perspective: 1000 },
      { translateY },
      { scale },
      { rotateX },
      { rotateY },
      { rotateZ },
      { rotateX: settleX },
      { rotateY: settleY },
    ],
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Terning"
        backgroundColor={Color.LightGray}
        onBackPressed={() => navigation.goBack()}
        onInfoPress={handleInfoPressed}
      />

      <View style={styles.content}>
        <View style={styles.tableSurface}>
          <View style={styles.tableFelt} />
          <View style={styles.spotlight} />

          <Animated.View
            pointerEvents="none"
            style={[
              styles.diceGroundShadow,
              {
                opacity: shadowOpacity,
                transform: [{ scale: shadowScale }],
              },
            ]}
          />

          <Pressable style={styles.dicePressable} onPress={handleRoll} disabled={isRolling}>
            <Animated.View style={[styles.diceContainer, animatedDiceStyle]}>
              <View style={styles.diceCube}>
                <Dice3D value={diceValue} />
              </View>
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default DiceGame;
