import { Pressable, Text, View } from "react-native";
import styles from "./gameScreenStyles";
import AbsoluteHomeButton from "@/src/Common/components/AbsoluteHomeButton/AbsoluteHomeButton";
import { useEffect, useState } from "react";
import { SpinGameState } from "../../constants/SpinTypes";
import { useGlobalGameProvider } from "@/src/Common/context/GlobalGameProvider";
import { GameEntryMode } from "@/src/Common/constants/Types";
import Color from "@/src/Common/constants/Color";
import { useHubConnectionProvider } from "@/src/Common/context/HubConnectionProvider";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { HubChannel } from "@/src/Common/constants/HubChannel";
import Screen from "@/src/Common/constants/Screen";
import { useAuthProvider } from "@/src/Common/context/AuthProvider";

export const GameScreen = ({ navigation }: any) => {
  const [bgColor, setBgColor] = useState<string>(Color.Gray);
  const [state, setState] = useState<SpinGameState>(SpinGameState.RoundStarted);
  const [roundText, setRoundText] = useState<string>("");

  const { disconnect, connect, setListener, invokeFunction } = useHubConnectionProvider();
  const { gameEntryMode } = useGlobalGameProvider();
  const { displayErrorModal } = useModalProvider();
  const { pseudoId: userId } = useAuthProvider();

  const isHost = gameEntryMode === GameEntryMode.Creator || gameEntryMode === GameEntryMode.Host;

  useEffect(() => {
    setupListeners();
    handleStartGame();
  }, []);

  const setupListeners = async () => {
    setListener(HubChannel.Error, (message: string) => {
      displayErrorModal(message);
    });

    setListener("round_text", (roundText: string) => {
      setRoundText(roundText);
    });
  };

  const handleStartGame = async () => {
    const result = await invokeFunction("StartGame");
    if (result.isError()) {
      console.error(result.error);
      displayErrorModal("Klarte ikke starte spill, prøv igjen senere");
      return;
    }
  };

  const handleStartSpin = () => {
    console.log("Starting...");
  };

  return (
    <View style={{ ...styles.container, backgroundColor: bgColor }}>
      {isHost && (
        <View>
          <Text>{roundText}</Text>

          <Pressable onPress={handleStartSpin}>
            <Text>Start spin</Text>
          </Pressable>
        </View>
      )}
      <AbsoluteHomeButton />
    </View>
  );
};
