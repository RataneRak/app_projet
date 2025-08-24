import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const rem = width / 380;

export const fontSize = {
  small: 14 * rem,
  medium: 18 * rem,
  large: 22 * rem,
  xlarge: 28 * rem,
};

export const spacing = {
  xsmall: 4 * rem,
  small: 8 * rem,
  medium: 16 * rem,
  large: 24 * rem,
  xlarge: 32 * rem,
};
