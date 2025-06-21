import { Platform } from "react-native";

export const Colors = {
  background: "#FDF8FF",
  border: "#acacac",
  itemBackground: "#f5f5f5",

  ...Platform.select({
    ios: {
      submit: "#007AFF", // iOS blue color
    },
    android: {
      submit: "#1a73e8", // Material blue color
    },
    default: { submit: "#2196F3" },
  }),
};
