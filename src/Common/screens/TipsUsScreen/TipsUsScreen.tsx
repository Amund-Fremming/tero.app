import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { styles } from "./tipsUsScreenStyles";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from "expo-router";
import { useModalProvider } from "../../context/ModalProvider";
import { Feather } from "@expo/vector-icons";
import Color from "../../constants/Color";
import ScreenHeader from "../../components/ScreenHeader/ScreenHeader";
import { moderateScale } from "../../utils/dimensions";
import { useState } from "react";

export const TipsUsScreen = () => {
  const navigation: any = useNavigation();
  const { displayInfoModal } = useModalProvider();
  const [ideaText, setIdeaText] = useState<string>("");

  const handleIdeaTextChange = (text: string) => {
    const wordCount = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

    if (wordCount > 500) {
      displayInfoModal("Du har nådd maks grensen på 500 ord", "Oops");
      return;
    }

    setIdeaText(text);
  };

  const handleSend = () => {
    console.warn("NOT IMPLEMENTED");

    displayInfoModal("Takk for tipset!", "Danke", () => navigation.goBack());
  };

  const handleInfoPressed = () => {
    console.log("Info pressed");
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Tips oss"
        backgroundColor={Color.LightGray}
        onBackPressed={() => navigation.goBack()}
        onInfoPress={handleInfoPressed}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subHeader}>Send oss ditt spillforslag!</Text>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <Feather
              style={{ paddingLeft: moderateScale(15), paddingRight: moderateScale(10) }}
              name="user"
              size={24}
              color={Color.OffBlack}
            />
            <TextInput style={styles.input} placeholder="Navn" placeholderTextColor={Color.DarkerGray} />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <Feather
              style={{ paddingLeft: moderateScale(15), paddingRight: moderateScale(10) }}
              name="phone"
              size={24}
              color={Color.OffBlack}
            />
            <TextInput
              style={styles.input}
              placeholder="Mobil"
              placeholderTextColor={Color.DarkerGray}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <View style={styles.multilineContainer}>
            <Feather
              style={{ paddingLeft: moderateScale(15), paddingRight: moderateScale(10), paddingTop: moderateScale(5) }}
              name="edit"
              size={24}
              color={Color.OffBlack}
            />
            <TextInput
              style={styles.multiline}
              placeholder="Din ide..."
              placeholderTextColor={Color.DarkerGray}
              multiline={true}
              textAlignVertical="top"
              scrollEnabled={true}
              value={ideaText}
              onChangeText={handleIdeaTextChange}
            />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};
