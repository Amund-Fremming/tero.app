import { StyleSheet } from "react-native";
import { Color } from "../../../Common/constants/Color";
import { verticalScale, moderateScale, horizontalScale } from "@/src/Common/utils/dimensions";
import { Font } from "../../../Common/constants/Font";

export const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(60),
    backgroundColor: Color.LightGray,
    width: "100%",
    height: "100%",
    alignItems: "center",
    gap: 10,
  },

  headerWrapper: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  textIcon: {
    paddingTop: verticalScale(3),
    fontSize: moderateScale(45),
    fontFamily: Font.PassionOneRegular,
    color: Color.Black,
    opacity: 0.6,
  },

  header: {
    fontFamily: Font.PassionOneBold,
    color: Color.Black,
    fontSize: moderateScale(55),
    fontWeight: 600,
    opacity: 0.8,
    textAlign: "center",
  },

  iconWrapper: {
    backgroundColor: Color.DarkerGray,
    justifyContent: "center",
    alignItems: "center",
    height: verticalScale(50),
    width: horizontalScale(50),
    borderRadius: moderateScale(10),
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
    paddingTop: verticalScale(20),
    marginTop: verticalScale(100),
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
