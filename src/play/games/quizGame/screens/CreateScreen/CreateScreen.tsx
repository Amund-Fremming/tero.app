import { GameType } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { getGameTheme } from "@/src/play/config/gameTheme";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import GenericCreateScreen from "@/src/play/screens/GenericCreateScreen/GenericCreateScreen";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { useQuizSessionProvider } from "../../context/QuizGameProvider";

export const CreateScreen = () => {
  const navigation: any = useNavigation();
  const { pseudoId } = useAuthProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { gameService } = useServiceProvider();
  const { setGameSessionValues, setGameEntryMode, isHost, setIsHost } = useGlobalSessionProvider();
  const { setScreen } = useQuizSessionProvider();
  const theme = getGameTheme(GameType.Quiz);

  useEffect(() => {
    setIsHost(true);
  }, []);

  const handleInfoPressed = () => {
    displayInfoModal("Gi ditt nye spill ett navn og en kategori!", "Hva nå?");
  };

  const handlePatchGame = async (name: string) => {
    // TODO!
  };

  return (
    <GenericCreateScreen
      themeColor={theme.primaryColor}
      secondaryThemeColor={theme.secondaryColor}
      onBackPressed={() => navigation.goBack()}
      onInfoPressed={handleInfoPressed}
      headerText="Opprett"
      topButtonText={"Velg kategori"}
      bottomButtonText="Opprett"
      bottomButtonCallback={handlePatchGame}
      featherIcon="stack"
    />
  );
};
