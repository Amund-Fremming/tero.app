import HubConnectionProvider from "@/src/common/context/HubConnectionProvider";
import GlobalGameProvider from "../src/core/context/GlobalSessionProvider";
import ModalProvider from "@/src/core/context/ModalProvider";
import Hub from "@/src/hub/Hub";
import AuthProvider from "../src/core/context/AuthProvider";
import ServiceProvider from "@/src/core/context/ServiceProvider";
import { View, StatusBar, Dimensions } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { useEffect } from "react";
import QuizSessionProvider from "@/src/games/quizGame/context/QuizGameProvider";
import ImposterSessionProvider from "@/src/games/imposter/context/ImposterSessionProvider";
import SpinSessionProvider from "@/src/games/spinGame/context/SpinGameProvider";

SplashScreen.preventAutoHideAsync().catch(() => {});
const { width, height } = Dimensions.get("window");

export default () => (
  <FontLoader>
    <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
    <ServiceProvider>
      <ModalProvider>
        <AuthProvider>
          <GlobalGameProvider>
            <HubConnectionProvider>
              <QuizSessionProvider>
                <SpinSessionProvider>
                  <ImposterSessionProvider>
                    <Hub />
                  </ImposterSessionProvider>
                </SpinSessionProvider>
              </QuizSessionProvider>
            </HubConnectionProvider>
          </GlobalGameProvider>
        </AuthProvider>
      </ModalProvider>
    </ServiceProvider>
  </FontLoader>
);

const FontLoader = ({ children }: { children: React.ReactNode }) => {
  const [fontsLoaded] = Font.useFonts({
    "PassionOne-Regular": require("../src/common/assets/fonts/PassionOne-Regular.ttf"),
    "PassionOne-Bold": require("../src/common/assets/fonts/PassionOne-Bold.ttf"),
    "SpaceMono-Regular": require("../src/common/assets/fonts/SpaceMono-Regular.ttf"),
    "Sintony-Regular": require("../src/common/assets/fonts/Sintony-Regular.ttf"),
    "Sintony-Bold": require("../src/common/assets/fonts/Sintony-Bold.ttf"),
    "ArchivoBlack-Regular": require("../src/common/assets/fonts/ArchivoBlack-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return <View style={{ width, height, position: "absolute", top: 0, left: 0 }}>{children}</View>;
};
