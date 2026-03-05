import { GameEntryMode, GameType } from "@/src/core/constants/Types";
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

  useEffect(() => {
    setIsHost(true);
  }, []);

  const onFinishedPressed = async () => {
    if (loading) return;

    setLoading(true);
    const result = await gameService().createSession(pseudoId, GameType.Quiz);

    if (result.isError()) {
      displayErrorModal(result.error);
      setLoading(false);
      return;
    }

    console.info("Game initiated with key:", result.value.key);
    setGameSessionValues(result.value.key, result.value.hub_name, result.value.game_id);
    setGameEntryMode(GameEntryMode.Creator);
    setScreen(QuizGameScreen.Lobby);
    setLoading(false);
  };

  return <GenericTutorialScreen onFinishedPressed={onFinishedPressed} lastButtonText="Opprett spill" />;
};

export default TutorialScreen;
