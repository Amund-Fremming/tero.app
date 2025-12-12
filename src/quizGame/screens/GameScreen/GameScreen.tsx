import Color from "@/src/Common/constants/Color";
import MediumButton from "@/src/Common/components/MediumButton/MediumButton";
import { Text, View } from "react-native";
import { useQuizGameProvider } from "../../context/QuizGameProvider";
import styles from "./gameScreenStyles";
import AbsoluteHomeButton from "@/src/Common/components/AbsoluteHomeButton/AbsoluteHomeButton";
import { useHubConnectionProvider } from "@/src/Common/context/HubConnectionProvider";
import { useEffect } from "react";

export const GameScreen = ({ navigation }: any) => {
  const { disconnect } = useHubConnectionProvider();

  useEffect(() => {
    disconnect();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Gjenstående spørsmål:</Text>
      <AbsoluteHomeButton />
    </View>
  );
};
