import { StyleSheet } from "react-native";
import { Color } from "../../../Common/constants/Color";
import { verticalScale, moderateScale, horizontalScale } from "@/src/Common/utils/dimensions";
import { Font } from "../../../Common/constants/Font";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.LightGray,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  header: {
    paddingTop: verticalScale(40),
    paddingBottom: verticalScale(25),
    paddingLeft: horizontalScale(20),
    width: "100%",
    color: Color.Black,
    fontSize: moderateScale(45),
    fontWeight: 900,
    fontFamily: Font.PassionOneBold,
    opacity: 0.7,
  },

  goBack: {
    position: "absolute",
    top: verticalScale(50),
    left: verticalScale(20),
    backgroundColor: Color.LightGray,
    borderRadius: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
    width: horizontalScale(40),
    height: horizontalScale(40),
  },

  paragraph: {
    fontSize: moderateScale(16),
  },

  input: {
    width: "70%",
    fontSize: moderateScale(35),
    marginBottom: verticalScale(-10),
    fontFamily: Font.PassionOneRegular,
    color: Color.OffBlack,
  },

  inputBorder: {
    backgroundColor: Color.Black,
    opacity: 0.9,
    width: "85%",
    height: verticalScale(10),
    borderRadius: moderateScale(10),
  },

  card: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(20),
    backgroundColor: Color.White,
    gap: verticalScale(25),
    paddingBottom: verticalScale(40),
  },

  inputWrapper: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    marginBottom: verticalScale(-10),
  },

  button: {
    justifyContent: "center",
    alignItems: "center",
    width: "86%",
    borderRadius: moderateScale(10),
    height: verticalScale(69),
    backgroundColor: Color.SoftPurple,
  },

  buttonText: {
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
  },
});

export default styles;
