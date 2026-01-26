import { Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "./changePasswordScreenStyles";
import { useAuthProvider } from "@/src/common/context/AuthProvider";
import { useState } from "react";
import { useServiceProvider } from "@/src/common/context/ServiceProvider";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Color from "@/src/common/constants/Color";
import { TextInput } from "react-native-gesture-handler";
import { useModalProvider } from "@/src/common/context/ModalProvider";

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

  return (
    <View style={styles.container}>
      <View style={styles.iconsBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={32} color={Color.Black} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.header}>Bytt passord</Text>
        <Text style={styles.username}></Text>

        <View style={styles.layverPasswordEdit}>
          <ScrollView
            style={styles.layoverEditScroll}
            contentContainerStyle={styles.layoverEditContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Gammelt passord</Text>
              <TextInput
                onChangeText={setOldPassword}
                style={styles.input}
                value={oldPassword}
                placeholder="Skriv inn gammelt passord"
                secureTextEntry={true}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Nytt passord</Text>
              <TextInput
                onChangeText={setNewPassword}
                style={styles.input}
                value={newPassword}
                placeholder="Skriv inn nytt passord"
                secureTextEntry={true}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Bekreft nytt passord</Text>
              <TextInput
                onChangeText={setConfirmPassword}
                style={styles.input}
                value={confirmPassword}
                placeholder="Skriv inn nytt passord igjen"
                secureTextEntry={true}
              />
            </View>
          </ScrollView>

          <View style={styles.buttonWrapperPassword}>
            <Pressable style={styles.cancelButtonPassword} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelButtonText}>avbryt</Text>
            </Pressable>
            <Pressable onPress={handleChangePassword} style={styles.saveButtonPassword}>
              <Text style={styles.saveButtonText}>lagre</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ChangePasswordScreen;
