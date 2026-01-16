import { Text, View } from "react-native";
import styles from "./createScreenStyles";
import { useState } from "react";
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
import { Dropdown } from "react-native-element-dropdown";

export const CreateScreen = () => {
  const navigation: any = useNavigation();
  const { pseudoId } = useAuthProvider();
  const { displayErrorModal, displayInfoModal } = useModalProvider();
  const { gameService } = useServiceProvider();
  const { setGameKey, setGameEntryMode, setHubAddress } = useGlobalSessionProvider();
  const { setScreen } = useQuizGameProvider();
  const {} = useHubConnectionProvider();

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

  const handleCreateGame = async () => {
    if (loading) return;

    if (!createRequest.category) {
      displayInfoModal("Du må velge kategori");
      return;
    }

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
        <Text style={{ ...styles.iterations, opacity }}>4</Text>
        <Feather
          name="layers"
          size={moderateScale(200)}
          style={{
            opacity,
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
        <Dropdown
          style={styles.categoryButton}
          containerStyle={styles.dropdownContainer}
          itemContainerStyle={styles.dropdownItemContainer}
          itemTextStyle={styles.dropdownItemText}
          selectedTextStyle={styles.selectedText}
          placeholderStyle={styles.selectedText}
          data={categoryData}
          labelField="label"
          valueField="value"
          placeholder="Velg categori"
          value={createRequest.category}
          onChange={(item) => setCreateRequest((prev) => ({ ...prev, category: item.value }))}
          dropdownPosition="top"
          renderItem={(item) => (
            <View style={styles.dropdownItem}>
              <Text style={styles.bottomText}>{item.label}</Text>
            </View>
          )}
        />
        <Pressable onPress={handleCreateGame} style={styles.createButton}>
          <Text style={styles.bottomText}>Opprett</Text>
        </Pressable>
      </View>
    </View>
  );
};
