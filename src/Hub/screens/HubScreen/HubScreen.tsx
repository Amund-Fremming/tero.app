import { View, Text, Button, Pressable } from "react-native";
import styles from "./hubScreenStyles";
import Screen from "../../../common/constants/Screen";
import { Feather } from "@expo/vector-icons";
import Color from "@/src/common/constants/Color";
import { useNavigation } from "expo-router";
import { useAuthProvider } from "@/src/common/context/AuthProvider";
import { useEffect, useRef, useState } from "react";

export const HubScreen = () => {
  const navigation: any = useNavigation();

  const {
    logValues,
    rotateTokens,
    pseudoId: guestId,
    resetPseudoId: resetGuestId,
    redirectUri,
    triggerLogin,
    triggerLogout,
    accessToken,
    invalidateAccessToken,
  } = useAuthProvider();

  const [displayDebugTools, setDisplayDebugTools] = useState<boolean>(true);

  const shouldNavigateAfterLogin = useRef(false);

  // Navigate to profile only when a login flow was initiated from this screen
  useEffect(() => {
    if (accessToken && shouldNavigateAfterLogin.current) {
      shouldNavigateAfterLogin.current = false;
      navigation.navigate(Screen.Profile);
    }

    console.log("Redirect URI:", redirectUri);
  }, [accessToken, navigation]);

  const handleProfilePressed = () => {
    if (accessToken) {
      navigation.navigate(Screen.Profile);
      return;
    }

    shouldNavigateAfterLogin.current = true;
    triggerLogin();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topWrapper}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.header}>Hub</Text>
        </Pressable>
        <Pressable onPress={handleProfilePressed}>
          <Feather name="user" size={30} color={Color.Black} />
        </Pressable>
      </View>

      {displayDebugTools && (
        <View style={styles.debugBox}>
          <Text style={styles.debugHeader}>Debug tools</Text>
          <Text>Peseudo id: {guestId}</Text>
          <Text>Redirect uri: {redirectUri}</Text>

          <Button title="Invalidate AT" onPress={invalidateAccessToken} />
          <Button title="reset guest id" onPress={resetGuestId} />
          <Button title="log values" onPress={logValues} />
          <Button title="rotate tokens" onPress={rotateTokens} />
          <Button title="logout" onPress={triggerLogout} />
        </View>
      )}
    </View>
  );
};

export default HubScreen;
// a319f637-58d0-45e7-bc89-8c2b3a668a42
// a319f637-58d0-45e7-bc89-8c2b3a668a42
