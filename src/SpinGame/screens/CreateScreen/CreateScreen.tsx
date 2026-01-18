import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./createScreenStyles";
import { useEffect, useState } from "react";
import { CreateGameRequest, GameCategory, GameEntryMode, GameType } from "@/src/Common/constants/Types";
import { TextInput } from "react-native-gesture-handler";
import { useAuthProvider } from "@/src/Common/context/AuthProvider";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { useGlobalSessionProvider } from "@/src/Common/context/GlobalSessionProvider";
import { useServiceProvider } from "@/src/Common/context/ServiceProvider";
import { useNavigation } from "expo-router";
import { SpinSessionScreen } from "../../constants/SpinTypes";
import { useSpinGameProvider } from "../../context/SpinGameProvider";
import { Feather } from "@expo/vector-icons";
import { moderateScale } from "@/src/Common/utils/dimensions";
import Color from "@/src/Common/constants/Color";
import CategoryDropdown from "@/src/Common/components/CategoryDropdown/CategoryDropdown";

export const CreateScreen = () => {
  const navigation: any = useNavigation();
  const { pseudoId } = useAuthProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { gameService } = useServiceProvider();
  const { setGameKey, setGameEntryMode, setHubAddress } = useGlobalSessionProvider();
  const { setScreen } = useSpinGameProvider();
  const { gameType } = useGlobalSessionProvider();

  const [themeColor, setThemeColor] = useState<string>(Color.BeigeLight);
  const [secondaryThemeColor, setSecondaryThemeColor] = useState<string>(Color.Beige);
  const [featherIcon, setFeatherIcon] = useState<"refresh-cw" | "rotate-cw">("refresh-cw");

  const [loading, setLoading] = useState<boolean>(false);
  const [opacity, setOpacity] = useState<number>(0.4);
  const [createRequest, setCreateRequest] = useState<CreateGameRequest>({
    name: "",
    category: "" as any,
  });

  const categoryData = [
    { label: "Alle", value: GameCategory.All },
    { label: "Vors", value: GameCategory.Vors },
    { label: "Jenter", value: GameCategory.Ladies },
    { label: "Gutter", value: GameCategory.Boys },
  ];

  useEffect(() => {
    console.log("GameType=", gameType);
    switch (gameType) {
      case GameType.Duel:
        setSecondaryThemeColor(Color.BeigeLight);
        setThemeColor(Color.Beige);
        setFeatherIcon("refresh-cw");
        break;
      case GameType.Roulette:
        setSecondaryThemeColor(Color.SkyBlueLight);
        setThemeColor(Color.SkyBlue);
        setFeatherIcon("rotate-cw");
        break;
    }
  }, [gameType]);

  const handleCreateGame = async () => {
    if (loading) return;

    if (!createRequest.category) {
      displayInfoModal("Du må velge kategori");
      return;
    }

    if (createRequest.name === "") {
      displayInfoModal("Spillet må ha ett navn");
      return;
    }

    if (!pseudoId) {
      console.error("No pseudo id present");
      displayErrorModal("En feil har skjedd, forsøk å åpne appen på nytt");
      return;
    }

    setLoading(true);
    const result = await gameService().createInteractiveGame(pseudoId, gameType, createRequest);

    if (result.isError()) {
      displayErrorModal(result.error);
      setLoading(false);
      return;
    }

    console.info("Game initiated with key:", result.value.key);
    setGameKey(result.value.key);
    setHubAddress(result.value.hub_address);
    setGameEntryMode(GameEntryMode.Creator);
    setScreen(SpinSessionScreen.Lobby);
    setLoading(false);
  };

  const handleInfoPressed = () => {
    console.log("Info pressed");
  };

  return (
    <View style={{ ...styles.container, backgroundColor: themeColor }}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconWrapper}>
          <Feather name="chevron-left" size={moderateScale(45)} />
        </TouchableOpacity>
        <Text style={styles.header}>Opprett</Text>
        <TouchableOpacity onPress={handleInfoPressed} style={styles.iconWrapper}>
          <Text style={styles.textIcon}>?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.midSection}>
        <Text style={{ ...styles.iterations, opacity }}>?</Text>
        <Feather
          name={featherIcon}
          size={moderateScale(200)}
          style={{
            opacity,
          }}
        />
      </View>
      <View style={styles.bottomSection}>
        <TextInput
          style={styles.input}
          placeholder="Spillnavn"
          value={createRequest.name}
          onChangeText={(val) => setCreateRequest((prev) => ({ ...prev, name: val }))}
        />
        <View style={styles.inputBorder} />
        <CategoryDropdown
          data={categoryData}
          value={createRequest.category}
          onChange={(value) => setCreateRequest((prev) => ({ ...prev, category: value as GameCategory }))}
          placeholder="Velg categori"
          buttonBackgroundColor={secondaryThemeColor}
          buttonTextColor={Color.White}
        />
        <TouchableOpacity onPress={handleCreateGame} style={styles.createButton}>
          <Text style={styles.bottomText}>Opprett</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateScreen;
