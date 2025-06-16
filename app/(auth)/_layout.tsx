import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { Platform, TouchableOpacity } from "react-native";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        contentStyle: { backgroundColor: "#fff" },
        gestureEnabled: true, // Bật cử chỉ vuốt để đóng modal
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="(modal)/create"
        options={{
          presentation: "modal",
          title: "New Thread",
          headerRight: () => (
            <TouchableOpacity onPress={() => console.log("More options")}>
              <Ionicons
                name="ellipsis-horizontal-circle"
                size={24}
                color="#000"
              />
            </TouchableOpacity>
          ),
          animation:
            Platform.OS === "android" ? "slide_from_bottom" : undefined, // Thêm animation cho Android
          gestureEnabled: true, // Cho phép vuốt để đóng modal
        }}
      />
    </Stack>
  );
};

export default Layout;
