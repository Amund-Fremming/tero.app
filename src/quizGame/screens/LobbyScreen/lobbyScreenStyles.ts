import Color from "@/src/Common/constants/Color";
import Font from "@/src/Common/constants/Font";
import { moderateScale } from "@/src/Common/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  headerInline: {
    justifyContent: "center",
    alignItems: "center",
  },

  toastHeader: {
    fontSize: moderateScale(25),
    fontFamily: Font.PassionOneRegular,
  },

  header: {
    fontSize: moderateScale(40),
    fontFamily: Font.PassionOneRegular,
    color: Color.Black,
  },

  paragraph: {
    fontSize: moderateScale(16),
  },

  input: {
    borderWidth: 2,
    borderColor: "gray",
    height: 50,
    width: 240,
  },
});

export default styles;
