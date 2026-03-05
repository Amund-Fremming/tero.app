import Color from "@/src/core/constants/Color";
import { GameCategory, PatchGameBaseRequest } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { resetToHomeScreen } from "@/src/core/utils/utilFunctions";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import GenericCreateScreen from "@/src/play/screens/GenericCreateScreen/GenericCreateScreen";
import { useNavigation } from "expo-router";
import { useQuizSessionProvider } from "../../context/QuizGameProvider";

export const PatchScreen = () => {
  const navigation: any = useNavigation();

  const { pseudoId } = useAuthProvider();
  const { displayInfoModal, displayErrorModal } = useModalProvider();
  const { gameService } = useServiceProvider();
  const { setScreen } = useQuizSessionProvider();
  const { gameSession } = useGlobalSessionProvider();
  const { gameId } = gameSession;

  const handleInfoPressed = () => {
    displayInfoModal("Gi ditt nye spill ett navn og en kategori!", "Hva nå?");
  };

  const handlePatchGame = async (name: string, category: GameCategory) => {
    let request: PatchGameBaseRequest = {
      name,
      category,
    };

    const result = await gameService().patchGame(pseudoId, gameId, request);
    if (result.isError()) {
      console.error("Failed to patch game base: ", result.error);
      displayErrorModal("Klarte ikke lagre spill korrekt. Spillet ditt finnes fortsatt men med ett annet navn.");
      return;
    }

    displayInfoModal("Takk for at du lagret spillet ditt!", "Suksess", () => {
      resetToHomeScreen(navigation);
    });
  };

  return (
    <GenericCreateScreen
      themeColor={Color.LighterGreen}
      secondaryThemeColor={Color.DeepForest}
      onBackPressed={() => navigation.goBack()}
      onInfoPressed={handleInfoPressed}
      headerText="Lagre"
      bottomButtonText="Opprett"
      handlePatchGame={handlePatchGame}
      featherIcon="stack"
    />
  );
};

export default PatchScreen;
