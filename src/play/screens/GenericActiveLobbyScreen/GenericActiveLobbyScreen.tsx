import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import { Text, View } from "react-native";

interface GenericActiveLobbyScreenProps {
    onCreatePressed: () => Promise<void>
    onBackPressed: () => void
}

export const GenericActiveLobbyScreen= ({ onCreatePressed, onBackPressed }: GenericActiveLobbyScreenProps) => {
    return(
        <View>
        <ScreenHeader title="Lagre" onBackPressed={onBackPressed}  />
            <Text></Text>
        </View>
    );
}

export default GenericActiveLobbyScreen;