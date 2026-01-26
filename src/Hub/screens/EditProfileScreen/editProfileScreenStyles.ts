import Color from "@/src/common/constants/Color";
import { horizontalScale, moderateScale, verticalScale } from "@/src/common/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    minHeight: "100%",
    backgroundColor: Color.White,
    borderRadius: moderateScale(10),
  },

  email: {
    paddingTop: verticalScale(15),
    fontWeight: 600,
    fontSize: moderateScale(22),
  },

  layoverEditScroll: {
    width: "100%",
  },

  input: {
    width: "86%",
    backgroundColor: Color.White,
    height: verticalScale(50),
    paddingLeft: horizontalScale(20),
    padding: moderateScale(5),
    borderRadius: moderateScale(10),
    fontWeight: 100,
    fontSize: moderateScale(20),
  },

  inputWrapper: {
    width: "100%",
    alignItems: "center",
    gap: verticalScale(8),
  },

  inputLabel: {
    paddingTop: verticalScale(20),
    width: "86%",
    fontSize: moderateScale(16),
    fontWeight: 500,
    color: Color.Black,
  },

  content: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  username: {
    paddingTop: verticalScale(5),
    fontSize: moderateScale(18),
  },

  layoverEdit: {
    width: "100%",
    height: "70%",
    backgroundColor: Color.LightGray,
    borderTopLeftRadius: moderateScale(50),
    borderTopRightRadius: moderateScale(50),
    marginTop: verticalScale(20),
  },

  layoverEditContent: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: verticalScale(40),
  },

  iconsBar: {
    position: "absolute",
    top: verticalScale(60),
    width: "95%",
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row",
  },

  buttonWrapper: {
    paddingTop: verticalScale(25),
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  cancelButtonText: {
    fontSize: moderateScale(22),
    color: Color.Purple,
    fontWeight: 600,
  },

  cancelButton: {
    width: "43%",
    height: verticalScale(45),
    backgroundColor: Color.White,
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(3),
    borderColor: Color.Purple,
    justifyContent: "center",
    alignItems: "center",
  },

  saveButtonText: {
    fontSize: moderateScale(22),
    color: Color.White,
    fontWeight: 600,
  },

  saveButton: {
    width: "43%",
    height: verticalScale(45),
    backgroundColor: Color.Purple,
    borderRadius: moderateScale(10),
    borderColor: Color.White,
    justifyContent: "center",
    alignItems: "center",
  },

  genderButtonContainer: {
    width: "86%",
    height: verticalScale(60),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: horizontalScale(8),
  },

  genderButton: {
    flex: 1,
    height: verticalScale(50),
    backgroundColor: Color.White,
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(2),
    borderColor: Color.LightGray,
    justifyContent: "center",
    alignItems: "center",
  },

  genderButtonSelected: {
    borderColor: Color.Black,
  },

  genderButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 400,
    color: Color.Black,
  },

  genderButtonTextSelected: {
    fontWeight: 600,
  },
});
