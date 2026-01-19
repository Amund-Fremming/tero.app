import { View, Text, TouchableOpacity } from "react-native";
import createStyles from "../CreateScreen/createScreenStyles";
import styles from "./lobbyScreenStyles";
import { useGlobalSessionProvider } from "@/src/Common/context/GlobalSessionProvider";
import { TextInput } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { useHubConnectionProvider } from "@/src/Common/context/HubConnectionProvider";
import { HubChannel } from "@/src/Common/constants/HubChannel";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { useAuthProvider } from "@/src/Common/context/AuthProvider";
import { SpinSessionScreen } from "../../constants/SpinTypes";
import { useSpinGameProvider } from "../../context/SpinGameProvider";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { GameType } from "@/src/Common/constants/Types";
import { moderateScale } from "@/src/Common/utils/dimensions";
import Color from "@/src/Common/constants/Color";

export const LobbyScreen = () => {
  const navigation: any = useNavigation();
  const { pseudoId } = useAuthProvider();
  const { connect, setListener, invokeFunction, disconnect } = useHubConnectionProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { gameKey, gameType, hubAddress, setIsHost, isHost, clearGlobalSessionValues } = useGlobalSessionProvider();
  const { setScreen, themeColor, secondaryThemeColor, featherIcon } = useSpinGameProvider();

  const [round, setRound] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);
  const [iterations, setIterations] = useState<number>(0);
  const [players, setPlayers] = useState<number>(0);

  useEffect(() => {
    console.log("GameType=" + gameType);
    createHubConnecion();
  }, []);

  const createHubConnecion = async () => {
    console.log("Hub address:", hubAddress);
    const result = await connect(hubAddress);
    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("En feil har skjedd, forsøk å gå ut og inn av spillet");
      return;
    }

    setListener("host", (hostId: string) => {
      console.info("Received new host:", hostId);
      setIsHost(pseudoId == hostId);
    });

    setListener("players_count", (players: number) => {
      console.info("Received players count:", players);
      setPlayers(players);
    });

    setListener(HubChannel.Error, (message: string) => {
      console.info("Received error:", message);
      displayErrorModal(message);
    });

    setListener(HubChannel.Iterations, (iterations: number) => {
      console.info("Received iterations:", iterations);
      setIterations(iterations);
    });

    setListener("signal_start", (_value: boolean) => {
      console.info("Received start signal");
      setScreen(SpinSessionScreen.Game);
    });

    const groupResult = await invokeFunction("ConnectToGroup", gameKey, pseudoId);
    if (groupResult.isError()) {
      console.error(groupResult.error);
      displayErrorModal("Klarte ikke koble til, forsøk å lukke appen og start på nytt");
      return;
    }
  };

  const handleAddRound = async () => {
    if (round === "") {
      displayInfoModal("Du har glemt å skrive inn en runde");
      return;
    }

    const result = await invokeFunction("AddRound", gameKey, round);
    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Klarte ikke legge til runde");
      return;
    }

    setRound("");
  };

  const handleStartGame = async () => {
    if (started) {
      return;
    }

    if (!pseudoId) {
      console.error("No pseudo id present");
      displayErrorModal("En feil har skjedd");
      return;
    }

    let minPlayers = gameType == GameType.Roulette ? 2 : 3;

    if (players < minPlayers) {
      displayInfoModal(`Minimum ${minPlayers} spillere for å starte, du har: ${players}`);
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
    setScreen(SpinSessionScreen.Game);
  };

  const handleBackPressed = async () => {
    await disconnect();
    navigation.goBack();
    clearGlobalSessionValues();
  };

  return (
    <View style={{ ...createStyles.container, backgroundColor: themeColor }}>
      <View style={createStyles.headerWrapper}>
        <TouchableOpacity onPress={handleBackPressed} style={createStyles.iconWrapper}>
          <Feather name="chevron-left" size={moderateScale(45)} />
        </TouchableOpacity>
        <View style={styles.headerInline}>
          <Text style={styles.toastHeader}>Rom:</Text>
          <Text style={styles.header}>{gameKey?.toUpperCase()}</Text>
        </View>
        <View style={createStyles.iconWrapper}>
          <Text style={createStyles.textIcon}>?</Text>
        </View>
      </View>
      <View style={createStyles.midSection}>
        <Text style={{ ...createStyles.iterations, opacity: 0.4 }}>{iterations}</Text>
        <Feather name={featherIcon} size={moderateScale(200)} style={{ opacity: 0.4 }} />
      </View>
      <View style={createStyles.bottomSection}>
        <TextInput
          multiline
          style={createStyles.input}
          placeholder="Runde..."
          value={round}
          onChangeText={(input) => setRound(input)}
        />
        <View style={createStyles.inputBorder} />
        <TouchableOpacity
          onPress={handleAddRound}
          style={{ ...createStyles.categoryButton, backgroundColor: secondaryThemeColor }}
        >
          <Text style={createStyles.bottomText}>Legg til</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleStartGame} style={createStyles.createButton}>
          <Text style={createStyles.bottomText}>Start spill</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LobbyScreen;
