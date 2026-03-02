import { CommonActions, NavigationProp } from "@react-navigation/native";
import Screen from "../constants/Screen";
import { resetToHomeGlobal } from "./navigationRef";

export function getHeaders(pseudo_id: string, token: string | null): Record<string, string> {
  if (!token) {
    return {
      "X-Guest-Authentication": pseudo_id,
    };
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export const resetToHomeScreen = (_navigation?: NavigationProp<any>) => {
  resetToHomeGlobal();
};
