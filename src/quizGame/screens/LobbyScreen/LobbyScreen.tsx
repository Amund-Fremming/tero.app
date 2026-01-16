import Color from "@/src/Common/constants/Color";
import MediumButton from "@/src/Common/components/MediumButton/MediumButton";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import styles from "./lobbyScreenStyles";
import createStyles from "../CreateScreen/createScreenStyles";
import { useHubConnectionProvider } from "@/src/Common/context/HubConnectionProvider";
import { useGlobalSessionProvider } from "@/src/Common/context/GlobalSessionProvider";
import AbsoluteHomeButton from "@/src/Common/components/AbsoluteHomeButton/AbsoluteHomeButton";
import Screen from "@/src/Common/constants/Screen";
import { HubChannel } from "@/src/Common/constants/HubChannel";
import { GameEntryMode } from "@/src/Common/constants/Types";
import { useQuizGameProvider } from "../../context/QuizGameProvider";
import { QuizGameScreen, QuizSession } from "../../constants/quizTypes";
import { useNavigation } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { moderateScale } from "@/src/Common/utils/dimensions";

export const LobbyScreen = () => {
  const navigation: any = useNavigation();
  const [question, setQuestion] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);
  const [iterations, setIterations] = useState<number>(0);

  const { gameEntryMode, gameKey, hubAddress } = useGlobalSessionProvider();
  const { connect, disconnect, setListener, invokeFunction } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { setQuizSession, setScreen } = useQuizGameProvider();

  useEffect(() => {
    if (gameKey) {
      createHubConnection(gameKey, hubAddress);
    }

    return () => {
      disconnect();
    };
  }, [gameKey]);

  const createHubConnection = async (key: string, address: string) => {
    const result = await connect(address);
    if (result.isError()) {
      displayErrorModal(result.error);
      return;
    }

    setListener(HubChannel.Iterations, (iterations: number) => {
      console.log(`Received: ${iterations}`);
      setIterations(iterations);
    });

    setListener(HubChannel.Error, (message: string) => {
      console.log(`Received: ${message}`);
      disconnect();
      displayErrorModal(message, () => navigation.navigate(Screen.Home));
    });

    setListener(HubChannel.Game, (game: QuizSession) => {
      console.log(`Received game session`);
      console.log("Questions: ", game.questions);
      setQuizSession(game);
    });

    setListener(HubChannel.State, (message: string) => {
      console.log("Received state message:", message);
      setScreen(QuizGameScreen.Started);
      disconnect();
    });

    console.debug("Connecting to group with key:", key);
    const connectResult = await invokeFunction("ConnectToGroup", key);
    if (connectResult.isError()) {
      displayErrorModal("En feil har skjedd, forsøk å gå ut og inn av spillet");
      await disconnect();
      return;
    }
  };

  const handleAddQuestion = async () => {
    if (question === "") {
      displayInfoModal("Du har glemt å skrive inn ett spørsmål");
      return;
    }

    const result = await invokeFunction("AddQuestion", gameKey, question);
    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Klarte ikke legge til spørsmål");
      return;
    }

    setQuestion("");
  };

  const handleStartGame = async () => {
    if (started) {
      return;
    }

    setStarted(true);
    const result = await invokeFunction("StartGame", gameKey);

    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Klarte ikke starte spill");
      setStarted(false);
      return;
    }

    await disconnect();
    setScreen(QuizGameScreen.Game);
  };

  return (
    <View style={createStyles.container}>
      <View style={createStyles.headerWrapper}>
        <Pressable onPress={() => navigation.goBack()} style={createStyles.iconWrapper}>
          <Feather name="chevron-left" size={moderateScale(45)} />
        </Pressable>
        <Text style={createStyles.header}>Opprett</Text>
        <View style={createStyles.iconWrapper}>
          <Text style={createStyles.textIcon}>?</Text>
        </View>
      </View>
      <View style={createStyles.midSection}>
        <Text style={{ ...createStyles.iterations, opacity: 0.4 }}>{iterations}</Text>
        <Feather name="layers" size={moderateScale(200)} style={{ opacity: 0.4 }} />
      </View>
      <View style={createStyles.bottomSection}>
        <TextInput
          multiline
          style={createStyles.input}
          placeholder="Spørsmål..."
          value={question}
          onChangeText={(input) => setQuestion(input)}
        />
        <View style={createStyles.inputBorder} />
        <Pressable onPress={handleAddQuestion} style={createStyles.categoryButton}>
          <Text style={createStyles.bottomText}>Legg til</Text>
        </Pressable>
        <Pressable onPress={handleStartGame} style={createStyles.createButton}>
          <Text style={createStyles.bottomText}>Start spill</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LobbyScreen;
