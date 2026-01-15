import Color from "@/src/Common/constants/Color";
import Font from "@/src/Common/constants/Font";
import { horizontalScale, moderateScale, verticalScale } from "@/src/Common/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingTop: verticalScale(80),
    alignItems: "center",
    gap: 10,
    backgroundColor: Color.BuzzifyLavender,
  },

  iconWrapper: {
    backgroundColor: Color.DarkerGray,
    justifyContent: "center",
    alignItems: "center",
    height: verticalScale(50),
    width: horizontalScale(50),
    borderRadius: moderateScale(10),
  },

  header: {
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(55),
    fontWeight: 600,
    opacity: 0.8,
  },

  paragraph: {
    fontSize: moderateScale(16),
  },

  input: {
    fontSize: moderateScale(16),
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
  },

  iterations: {
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(160),
    opacity: 0.4,
  },

  midSection: {
    justifyContent: "center",
    alignItems: "center",
  },

  bottomSection: {
    position: "absolute",
    bottom: verticalScale(50),
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: verticalScale(20),
  },

  categoryButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "86%",
    height: verticalScale(69),
    backgroundColor: Color.BuzzifyLavenderLight,
    borderRadius: moderateScale(10),
  },

  createButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "86%",
    borderRadius: moderateScale(10),
    height: verticalScale(69),
    backgroundColor: Color.Black,
  },

  bottomText: {
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
  },
});

export default styles;
