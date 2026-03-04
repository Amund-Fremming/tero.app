import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import { useModalProvider } from "@/src/core/context/ModalProvider";
import { Text, View } from "react-native";

export const GenericCreateScreen = () => {
    const { displayInfoModal } = useModalProvider();

    const handleBackPressed = () => {
        //
    }

    return(
        <View>
        <ScreenHeader title="Lagre" onBackPressed={handleBackPressed}  />
            <Text></Text>
        </View>
    );
}

export default GenericCreateScreen;