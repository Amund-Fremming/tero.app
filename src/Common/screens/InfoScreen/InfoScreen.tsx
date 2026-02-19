import { Text, View } from "react-native";
import ScreenHeader from "../../components/ScreenHeader/ScreenHeader";
import { useNavigation } from "expo-router";

export const InfoScreen = () => {
  const navigation: any = useNavigation();

  return (
    <View>
      <ScreenHeader
        title="Info"
        onBackPressed={() => navigation.goBack()}
        onInfoPress={() => {}}
        infoIconOverride="x"
      />
    </View>
  );
};
