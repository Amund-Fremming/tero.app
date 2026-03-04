import Color from "@/src/core/constants/Color";
import { GameCategory } from "@/src/core/constants/Types";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import GenericCreateScreen from "@/src/play/screens/GenericCreateScreen/GenericCreateScreen";
import { useNavigation } from "expo-router";
import { useQuizSessionProvider } from "../../context/QuizGameProvider";

export const CreateScreen = () => {
  const navigation: any = useNavigation();

  const { displayInfoModal } = useModalProvider();
  const { setScreen } = useQuizSessionProvider();

  const handleInfoPressed = () => {
    displayInfoModal("Gi ditt nye spill ett navn og en kategori!", "Hva nå?");
  };

  const handlePatchGame = async (name: string, category: GameCategory) => {
    // TODO!
  };

  return (
    <GenericCreateScreen
      themeColor={Color.LightGreen}
      secondaryThemeColor={Color.DeepForest}
      onBackPressed={() => navigation.goBack()}
      onInfoPressed={handleInfoPressed}
      headerText="Opprett"
      bottomButtonText="Opprett"
      handlePatchGame={handlePatchGame}
      featherIcon="stack"
    />
  );
};
