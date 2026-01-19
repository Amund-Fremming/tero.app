import { View, Text, Pressable, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { styles } from "./savedGameScreenStyles";
import VerticalScroll from "@/src/Common/wrappers/VerticalScroll";
import { useEffect, useState } from "react";
import { useServiceProvider } from "@/src/Common/context/ServiceProvider";
import { useAuthProvider } from "@/src/Common/context/AuthProvider";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { GameBase } from "@/src/Common/constants/Types";
import { useNavigation } from "expo-router";
import { screenHeight, verticalScale } from "@/src/Common/utils/dimensions";
import Color from "@/src/Common/constants/Color";
import { Feather } from "@expo/vector-icons";

export const SavedGamesScreen = () => {
  const navigation: any = useNavigation();
  const { gameService } = useServiceProvider();
  const { pseudoId: guestId, accessToken } = useAuthProvider();
  const { displayErrorModal } = useModalProvider();

  const [games, setGames] = useState<GameBase[] | undefined>(undefined);
  const [pageNum, setPageNum] = useState<number>(0);

  const hasPrev = () => pageNum > 0;

  useEffect(() => {
    fetchSavedGames();
  }, []);

  const handleUnsavePressed = async (game: GameBase) => {
    if (!accessToken) {
      console.warn("No access token present");
      return;
    }

    setGames((prev) => prev?.filter((g) => g.id != game.id));
    await gameService().unsaveGame(accessToken, game.id);
  };

  const fetchSavedGames = async () => {
    if (!accessToken) {
      console.warn("No access token present");
      return;
    }

    const result = await gameService().getSavedGames(accessToken, pageNum);
    if (result.isError()) {
      displayErrorModal(result.error);
      return;
    }

    const page = result.value;
    setGames(page.items);
  };

  const handleGamePressed = (id: string) => {
    //
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
      style={{
        width: "100%",
        backgroundColor: Color.LightGray,
        height: screenHeight(),
      }}
      contentContainerStyle={{
        alignItems: "center",
        gap: verticalScale(15),
        paddingBottom: verticalScale(200),
      }}
    >
      <View style={styles.topWrapper}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.header}>Dine spill</Text>
        </Pressable>
      </View>

      {!games || (games.length == 0 && <Text>Du har ingen lagrede spill</Text>)}

      {games &&
        games.map((game) => (
          <TouchableOpacity onPress={() => handleGamePressed(game.id)} style={styles.card} key={game.id}>
            <View style={styles.innerCard}>
              <View style={styles.iconCardOuter}>
                <View style={styles.iconCardInner}></View>
              </View>

              <View style={styles.textWrapper}>
                <Text style={styles.cardHeader}>{game.name}</Text>
                <Text style={styles.cardParagraph}>{game.description}</Text>
              </View>
            </View>
            <Pressable style={styles.icon} onPress={() => handleUnsavePressed(game)}>
              <Feather name="x" size={30} />
            </Pressable>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
};
