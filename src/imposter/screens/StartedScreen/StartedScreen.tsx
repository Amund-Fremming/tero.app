import { View, Text } from "react-native";
import styles from "./startedScreenStyles";
import ScreenHeader from "@/src/common/components/ScreenHeader/ScreenHeader";
import Color from "@/src/common/constants/Color";
import { useNavigation } from "expo-router";
import { resetToHomeScreen } from "@/src/common/utils/navigation";
import { useModalProvider } from "@/src/common/context/ModalProvider";
import { useGlobalSessionProvider } from "@/src/common/context/GlobalSessionProvider";
import { useImposterSessionProvider } from "../../context/ImposterSessionProvider";

export const StartedScreen = () => {
  const navigation: any = useNavigation();
  const { displayActionModal } = useModalProvider();
  const { clearGlobalSessionValues } = useGlobalSessionProvider();
  const { clearImposterSessionValues } = useImposterSessionProvider();

  const handleGoHome = () => {
    displayActionModal(
      "Er du sikker på at du vil forlate spillet?",
      () => {
        clearGlobalSessionValues();
        clearImposterSessionValues();
        resetToHomeScreen(navigation);
      },
      () => {},
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Velg spill" onBackPressed={handleGoHome} />
      <View style={styles.textBox}>
        <Text style={styles.header}>Spillet har startet!</Text>
        <Text style={styles.subHeader}>
          Ønsker du å styre spillet selv, kan du starte det ved å finne det under velg spill
        </Text>
      </View>
    </View>
  );
};

export default StartedScreen;
