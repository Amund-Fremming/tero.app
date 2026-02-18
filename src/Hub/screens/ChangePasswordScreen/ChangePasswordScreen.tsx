import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { styles } from "./changePasswordScreenStyles";
import { useAuthProvider } from "@/src/common/context/AuthProvider";
import { useState } from "react";
import { useServiceProvider } from "@/src/common/context/ServiceProvider";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Color from "@/src/common/constants/Color";
import { TextInput } from "react-native-gesture-handler";
import { useModalProvider } from "@/src/common/context/ModalProvider";
import ScreenHeader from "@/src/common/components/ScreenHeader/ScreenHeader";
import { moderateScale } from "@/src/common/utils/dimensions";

export const ChangePasswordScreen = () => {
  const navigation: any = useNavigation();

  const { accessToken } = useAuthProvider();
  const { userService } = useServiceProvider();
  const { displayErrorModal } = useModalProvider();

  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleChangePassword = async () => {
    if (!accessToken) {
      console.error("No access token present");
      return;
    }

    if (newPassword !== confirmPassword) {
      displayErrorModal("Nye passord matcher ikke");
      return;
    }

    if (newPassword.length < 8) {
      displayErrorModal("Passordet må være minst 8 tegn");
      return;
    }

    const result = await userService().changePassword(accessToken, oldPassword, newPassword);
    if (result.isError()) {
      displayErrorModal(result.error);
      return;
    }

    navigation.goBack();
  };

  const handleInfoPressed = () => {
    console.log("Info pressed");
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Passord"
        backgroundColor={Color.LightGray}
        onBackPressed={() => navigation.goBack()}
        onInfoPress={handleInfoPressed}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <Feather
              style={{ paddingLeft: moderateScale(15), paddingRight: moderateScale(10) }}
              name="lock"
              size={24}
              color={Color.OffBlack}
            />
            <TextInput
              onChangeText={setOldPassword}
              style={styles.input}
              value={oldPassword}
              placeholder="Gammelt passord"
              placeholderTextColor={Color.DarkerGray}
              secureTextEntry={true}
            />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <Feather
              style={{ paddingLeft: moderateScale(15), paddingRight: moderateScale(10) }}
              name="lock"
              size={24}
              color={Color.OffBlack}
            />
            <TextInput
              onChangeText={setNewPassword}
              style={styles.input}
              value={newPassword}
              placeholder="Nytt passord"
              placeholderTextColor={Color.DarkerGray}
              secureTextEntry={true}
            />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <Feather
              style={{ paddingLeft: moderateScale(15), paddingRight: moderateScale(10) }}
              name="lock"
              size={24}
              color={Color.OffBlack}
            />
            <TextInput
              onChangeText={setConfirmPassword}
              style={styles.input}
              value={confirmPassword}
              placeholder="Bekreft nytt passord"
              placeholderTextColor={Color.DarkerGray}
              secureTextEntry={true}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Avbryt</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleChangePassword} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Lagre</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangePasswordScreen;
