import { StyleSheet } from "react-native";
import Colors, { Color } from "../../../common/constants/Color";
import { verticalScale, moderateScale, horizontalScale } from "@/src/common/utils/dimensions";
import { Font } from "../../../common/constants/Font";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: "100%",
    backgroundColor: Colors.LightGray,
  },

  header: {
    color: Color.Purple,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(50),
  },

  topWrapper: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: verticalScale(50),
    width: "90%",
    display: "flex",
    flexDirection: "row",
  },

  debugHeader: {
    fontSize: moderateScale(25),
    fontWeight: 700,
    paddingRight: "60%",
    paddingBottom: verticalScale(15),
  },

  debugBox: {
    marginTop: verticalScale(50),
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: verticalScale(25),
    borderColor: Color.Red,
    borderWidth: moderateScale(6),
    width: "90%",
  },
});

export default styles;
