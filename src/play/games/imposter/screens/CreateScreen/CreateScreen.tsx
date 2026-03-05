import { GameCategory } from "@/src/core/constants/Types";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import GenericCreateScreen from "@/src/play/screens/GenericCreateScreen/GenericCreateScreen";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { useSpinSessionProvider } from "../../../spinGame/context/SpinGameProvider";

export const CreateScreen = () => {
  const navigation: any = useNavigation();

  const { themeColor, secondaryThemeColor } = useSpinSessionProvider();
  const { displayInfoModal } = useModalProvider();

  const [loading, setLoading] = useState<boolean>(false);

  const handleInfoPressed = () => {
    displayInfoModal("Gi ditt nye spill ett navn og en kategori!", "Hva nå?");
  };

  const handlePatchGame = async (name: string, category: GameCategory) => {
    // TODO
  };

  return (
    <GenericCreateScreen
      handlePatchGame={handlePatchGame}
      themeColor={themeColor}
      secondaryThemeColor={secondaryThemeColor}
      onBackPressed={() => navigation.goBack()}
      onInfoPressed={handleInfoPressed}
      headerText="Opprett"
      bottomButtonText="Neste"
      featherIcon={"users"}
    />
  );
};

export default CreateScreen;
