import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { styles } from "./loadingModalStyles";
import Color from "../../constants/Color";

interface LoadingModalProps {
  onCloseFunc?: () => void;
}

export const LoadingModal = ({ onCloseFunc }: LoadingModalProps) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Color.BuzzifyLavender} style={{ marginVertical: 20 }} />
        <Text style={styles.message}>Forbindelsen er brutt. Vi prøver å koble deg til på nytt nå</Text>
        <Pressable onPress={onCloseFunc} style={styles.button}>
          <Text style={styles.buttonText}>Forlat</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoadingModal;
