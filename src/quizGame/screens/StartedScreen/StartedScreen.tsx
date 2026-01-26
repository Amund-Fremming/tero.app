import { View, Text } from "react-native";
import styles from "./startedScreenStyles";
import AbsoluteHomeButton from "@/src/common/components/AbsoluteHomeButton/AbsoluteHomeButton";

export const StartedScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.textBox}>
        <Text style={styles.header}>Du kan legge vekk telefonen, spillet har startet.</Text>
      </View>
      <AbsoluteHomeButton />
    </View>
  );
};

export default StartedScreen;
