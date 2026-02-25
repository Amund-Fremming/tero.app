import Color from "@/src/common/constants/Color";
import Font from "@/src/common/constants/Font";
import { moderateScale, verticalScale } from "@/src/common/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: Color.BuzzifyLavender,
  },

  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingBottom: verticalScale(80),
  },

  mysteryCard: {
    width: moderateScale(220),
    height: moderateScale(220),
    backgroundColor: Color.Black,
    borderRadius: moderateScale(30),
    alignItems: "center",
    justifyContent: "center",
  },

  questionMark: {
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(150),
    color: Color.White,
    lineHeight: moderateScale(160),
  },

  revealCard: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    gap: verticalScale(8),
    paddingHorizontal: moderateScale(20),
  },

  imposterLabel: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(22),
    color: Color.OffBlack,
    letterSpacing: 2,
  },

  imposterName: {
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(90),
    color: Color.Red,
    textAlign: "center",
    lineHeight: moderateScale(94),
  },

  buttonsWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: verticalScale(20),
    paddingBottom: 50,
  },

  nextButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "86%",
    borderRadius: moderateScale(10),
    height: verticalScale(69),
    backgroundColor: Color.Black,
  },

  nextButtonFinish: {
    backgroundColor: Color.HomeRed,
  },

  buttonText: {
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
  },
});

export default styles;
