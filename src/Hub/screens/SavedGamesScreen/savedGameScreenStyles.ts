import Color from "@/src/common/constants/Color";
import { horizontalScale, moderateScale, verticalScale } from "@/src/common/utils/dimensions";
import { StyleSheet } from "react-native";
import { Font } from "../../../common/constants/Font";
import { handleUrlParams } from "expo-router/build/fork/getStateFromPath-forks";

export const styles = StyleSheet.create({
  card: {
    height: verticalScale(110),
    width: "90%",
    backgroundColor: Color.White,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(10),
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

  innerCard: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: verticalScale(90),
    width: "90%",
    flexDirection: "row",
  },

  iconCardInner: {
    height: verticalScale(81),
    width: horizontalScale(56),
    borderRadius: moderateScale(8),
    backgroundColor: Color.Purple,
  },

  iconCardOuter: {
    backgroundColor: Color.Black,
    height: verticalScale(90),
    width: horizontalScale(65),
    borderRadius: moderateScale(8),
    justifyContent: "center",
    alignItems: "center",
  },

  iconCardText: {
    position: "absolute",
    left: verticalScale(6),
    bottom: verticalScale(2),
    color: Color.White,
    fontFamily: Font.PassionOneRegular,
    fontSize: moderateScale(20),
  },

  textWrapper: {
    paddingLeft: horizontalScale(20),
    paddingRight: horizontalScale(40),
  },

  cardHeader: {
    fontFamily: Font.PassionOneRegular,
    fontSize: moderateScale(22),
  },

  cardParagraph: {
    fontFamily: Font.SintonyRegular,
    fontSize: moderateScale(14),
  },

  icon: {
    position: "absolute",
    right: horizontalScale(10),
    top: verticalScale(10),
  },
});
