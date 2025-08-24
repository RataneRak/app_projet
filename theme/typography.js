import { fontSize } from "./dimensions";

export const typography = {
  // Font families and weights
  fontFamily: "Roboto",
  fontWeightBold: "bold",

  // Numeric tokens used across screens (compatibility layer)
  fontSizeSmall: fontSize.small,
  fontSizeRegular: fontSize.medium,
  fontSizeMedium: fontSize.medium,
  fontSizeLarge: fontSize.large,
  fontSizeXL: fontSize.xlarge,

  title: {
    fontWeight: "bold",
    fontSize: fontSize.large,
    fontFamily: "Roboto",
  },
  text: {
    fontSize: fontSize.medium,
    fontFamily: "Roboto",
  },
  small: {
    fontSize: fontSize.small,
    fontFamily: "Roboto",
  },
};

export default typography;
