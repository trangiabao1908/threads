import React, { memo, useEffect, useState } from "react";
import {
  InputAccessoryView,
  Keyboard,
  KeyboardEvent,
  Platform,
  StyleSheet,
  View,
} from "react-native";

interface KeyboardAccessoryProps {
  nativeID?: string;
  children: React.ReactNode;
}

const KeyboardAccessory: React.FC<KeyboardAccessoryProps> = ({
  nativeID,
  children,
}) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e: KeyboardEvent) => {
        setKeyboardHeight(e.endCoordinates.height + 15); // Thêm khoảng cách 15px để tránh che khuất nội dung
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // iOS
  if (Platform.OS === "ios") {
    console.log("Using InputAccessoryView with props:", { nativeID });
    return (
      <InputAccessoryView nativeID={nativeID}>{children}</InputAccessoryView>
    );
  }

  // Android
  return (
    <View
      style={[
        styles.androidAccessory,
        {
          // Định vị phía trên bàn phím khi nó hiển thị
          bottom: keyboardVisible ? keyboardHeight : 0,
          // Chỉ hiển thị khi có bàn phím
          display: keyboardVisible ? "flex" : "none",
        },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  androidAccessory: {
    position: "absolute",
    left: 0,
    right: 0,
    width: "100%",
    padding: 8,
    zIndex: 1000, // Đảm bảo nó hiển thị phía trên nội dung khác
  },
});

export default memo(KeyboardAccessory);
