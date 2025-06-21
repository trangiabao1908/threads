import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native";

const Layout = () => {
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        contentStyle: { backgroundColor: "#fff" },
        gestureEnabled: true,
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

      <Stack.Screen
        name="(modal)/edit-profile"
        options={{
          presentation: "modal",
          title: "Edit Profile",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <Text style={styles.buttonCancel}>Cancel</Text>
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
const styles = StyleSheet.create({
  buttonCancel: {
    fontSize: 16,
    color: "black",
  },
});

export default Layout;
