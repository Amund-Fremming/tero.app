import { CreateGameRequest, GameEntryMode } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import GenericTutorialScreen from "@/src/play/screens/GenericTutorialScreen/GenericTutorialScreen";
import { useState } from "react";

interface TutorialScreenProps {
  onGameCreated: (hubName: string, gameKey: string) => Promise<void>;
}

export const TutorialScreen = ({ onGameCreated }: TutorialScreenProps) => {
  const { pseudoId } = useAuthProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { gameService } = useServiceProvider();
  const { setGameSessionValues, setGameEntryMode, gameType, setIsHost } = useGlobalSessionProvider();

  const [loading, setLoading] = useState<boolean>(false);
  const [createRequest, setCreateRequest] = useState<CreateGameRequest>({
    name: "",
    category: "" as any,
  });

  const onFinishedPressed = async () => {
    if (loading) return;
    const gameName = createRequest.name.trim();

    if (!createRequest.category) {
      displayInfoModal("Velg kategori.");
      return;
    }

    if (gameName === "") {
      displayInfoModal("Spillnavn kan ikke være tomt");
      return;
    }

    if (gameName.length < 3) {
      displayInfoModal("Navn må ha minst 3 tegn.");
      return;
    }

    setLoading(true);
    const result = await gameService().createSession(pseudoId, gameType, { ...createRequest, name: gameName });

    if (result.isError()) {
      displayErrorModal(result.error);
      setLoading(false);
      return;
    }

    console.info("Game initiated with key:", result.value.key);
    setGameSessionValues(result.value.key, result.value.hub_name);
    setGameEntryMode(GameEntryMode.Creator);
    await onGameCreated(result.value.hub_name, result.value.key);
    setLoading(false);
  };

  return <GenericTutorialScreen onFinishedPressed={onFinishedPressed} lastButtonText="Opprett spill" />;
};

export default TutorialScreen;
