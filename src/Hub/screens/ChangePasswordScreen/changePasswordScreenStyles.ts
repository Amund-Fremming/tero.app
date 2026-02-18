import Color from "@/src/common/constants/Color";
import { horizontalScale, moderateScale, verticalScale } from "@/src/common/utils/dimensions";
import { Font } from "@/src/common/constants/Font";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.LightGray,
    height: "100%",
    width: "100%",
    position: "relative",
  },

  scrollView: {
    flex: 1,
    width: "100%",
  },

  scrollContent: {
    alignItems: "center",
    gap: verticalScale(25),
    paddingTop: verticalScale(120),
    paddingBottom: verticalScale(200),
  },

  inputWrapper: {
    width: "100%",
    alignItems: "center",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.White,
    borderRadius: moderateScale(15),
    width: "90%",
    paddingVertical: verticalScale(12),
    height: verticalScale(65),
  },

  input: {
    flex: 1,
    fontSize: moderateScale(20),
    color: Color.OffBlack,
    paddingRight: moderateScale(20),
  },

  buttonWrapper: {
    position: "absolute",
    bottom: verticalScale(20),
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: verticalScale(15),
    paddingHorizontal: "5%",
  },

  cancelButton: {
    width: "90%",
    height: verticalScale(69),
    backgroundColor: Color.White,
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(4),
    borderColor: Color.BuzzifyLavender,
    justifyContent: "center",
    alignItems: "center",
  },

  cancelButtonText: {
    fontSize: moderateScale(28),
    fontFamily: Font.PassionOneBold,
    color: Color.BuzzifyLavender,
  },

  saveButton: {
    width: "90%",
    height: verticalScale(69),
    backgroundColor: Color.BuzzifyLavender,
    borderRadius: moderateScale(15),
    justifyContent: "center",
    alignItems: "center",
  },

  saveButtonText: {
    fontSize: moderateScale(28),
    fontFamily: Font.PassionOneBold,
    color: Color.White,
  },
});
