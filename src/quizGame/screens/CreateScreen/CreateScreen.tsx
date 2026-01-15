import { Text, View } from "react-native";
import styles from "./createScreenStyles";
import Color from "@/src/Common/constants/Color";
import { useEffect, useState } from "react";
import { CreateGameRequest, GameCategory, GameEntryMode, GameType } from "@/src/Common/constants/Types";
import { Pressable, TextInput } from "react-native-gesture-handler";
import { useAuthProvider } from "@/src/Common/context/AuthProvider";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { useGlobalSessionProvider } from "@/src/Common/context/GlobalSessionProvider";
import AbsoluteHomeButton from "@/src/Common/components/AbsoluteHomeButton/AbsoluteHomeButton";
import { useServiceProvider } from "@/src/Common/context/ServiceProvider";
import { useHubConnectionProvider } from "@/src/Common/context/HubConnectionProvider";
import { useNavigation } from "expo-router";
import { QuizGameScreen as QuizSessionScreen } from "../../constants/quizTypes";
import { useQuizGameProvider } from "../../context/QuizGameProvider";
import { Feather } from "@expo/vector-icons";
import { moderateScale } from "@/src/Common/utils/dimensions";

export const CreateScreen = () => {
  const navigation: any = useNavigation();
  const { pseudoId } = useAuthProvider();
  const { displayErrorModal } = useModalProvider();
  const { gameService } = useServiceProvider();
  const { setGameKey, setGameEntryMode, setHubAddress } = useGlobalSessionProvider();
  const { setScreen } = useQuizGameProvider();
  const {} = useHubConnectionProvider();

  const [loading, setLoading] = useState<boolean>(false);
  const [createRequest, setCreateRequest] = useState<CreateGameRequest>({
    name: "",
    category: GameCategory.All,
  });

  const handleCreateGame = async () => {
    if (loading) return;

    if (!pseudoId) {
      // TODO - handle
      console.error("No pseudo id present");
      displayErrorModal("En feil har skjedd, forsøk å åpne appen på nytt");
      return;
    }

    setLoading(true);
    const result = await gameService().createInteractiveGame(pseudoId, GameType.Quiz, createRequest);

    if (result.isError()) {
      displayErrorModal(result.error);
      setLoading(false);
      return;
    }

    console.info("Game initiated with key:", result.value.key);
    setGameKey(result.value.key);
    setHubAddress(result.value.hub_address);
    setGameEntryMode(GameEntryMode.Creator);
    setScreen(QuizSessionScreen.Lobby);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconWrapper}>
          <Feather name="chevron-left" size={moderateScale(45)} />
        </Pressable>
        <Text style={styles.header}>Opprett</Text>
        <View style={styles.iconWrapper}>
          <Text style={styles.textIcon}>?</Text>
        </View>
      </View>
      <View style={styles.midSection}>
        <Text style={styles.iterations}>4</Text>
        <Feather
          name="layers"
          size={moderateScale(200)}
          style={{
            opacity: 0.5,
          }}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Spillnavn"
        value={createRequest.name}
        onChangeText={(val) => setCreateRequest((prev) => ({ ...prev, name: val }))}
      />
      <View style={styles.bottomSection}>
        <Pressable style={styles.categoryButton}>
          <Text style={styles.bottomText}>Velg categori</Text>
        </Pressable>
        <Pressable onPress={handleCreateGame} style={styles.createButton}>
          <Text style={styles.bottomText}>Opprett</Text>
        </Pressable>
      </View>
    </View>
  );
};
