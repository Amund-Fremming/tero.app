import { CreateGameRequest, GameCategory, GameEntryMode, GameType } from "@/src/core/constants/Types";
import { useAuthProvider } from "@/src/core/context/AuthProvider";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { useServiceProvider } from "@/src/core/context/ServiceProvider";
import { useGlobalSessionProvider } from "@/src/play/context/GlobalSessionProvider";
import GenericTutorialScreen from "@/src/play/screens/GenericTutorialScreen/GenericTutorialScreen";
import { useEffect, useState } from "react";
import { QuizGameScreen } from "../../constants/quizTypes";
import { useQuizSessionProvider } from "../../context/QuizGameProvider";

export const TutorialScreen = () => {
  const { pseudoId } = useAuthProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { setGameSessionValues, setGameEntryMode, setIsHost } = useGlobalSessionProvider();
  const { gameService } = useServiceProvider();
  const { setScreen } = useQuizSessionProvider();

  const [loading, setLoading] = useState<boolean>(false);
  const [createRequest, setCreateRequest] = useState<CreateGameRequest>({
    name: "Generic",
    category: GameCategory.Mixed,
  });

  useEffect(() => {
    setIsHost(true);
  }, []);

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
      displayInfoModal("Spillnavn må ha minst 3 tegn.");
      return;
    }

    setLoading(true);
    const result = await gameService().createInteractiveGame(pseudoId, GameType.Quiz, {
      ...createRequest,
      name: gameName,
    });

    if (result.isError()) {
      displayErrorModal(result.error);
      setLoading(false);
      return;
    }

    console.info("Game initiated with key:", result.value.key);
    setGameSessionValues(result.value.key, result.value.hub_name);
    setGameEntryMode(GameEntryMode.Creator);
    setScreen(QuizGameScreen.Lobby);
    setLoading(false);
  };

  return <GenericTutorialScreen onFinishedPressed={onFinishedPressed} lastButtonText="Opprett spill" />;
};

export default TutorialScreen;
