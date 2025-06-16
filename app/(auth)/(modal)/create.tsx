import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handlePost = () => {
    // Implement post creation logic here
    console.log("Creating post with content:", content);
    router.back();
  };

  const pickImage = () => {
    // Implement image picker logic
    console.log("Opening image picker");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelButton}>Hủy</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tạo bài đăng mới</Text>
          <TouchableOpacity
            onPress={handlePost}
            disabled={!content.trim()}
            style={[
              styles.postButton,
              !content.trim() && styles.disabledButton,
            ]}
          >
            <Text
              style={[
                styles.postButtonText,
                !content.trim() && styles.disabledButtonText,
              ]}
            >
              Đăng
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: "https://github.com/identicons/github.png" }}
              style={styles.profileImage}
            />
            <View style={styles.profileLine} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.username}>username</Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Bạn đang nghĩ gì?"
              multiline
              style={styles.input}
              autoFocus
            />

            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.previewImage}
              />
            )}

            <View style={styles.actions}>
              <TouchableOpacity onPress={pickImage}>
                <Ionicons
                  name="image-outline"
                  size={24}
                  color={Colors.border}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="link-outline" size={24} color={Colors.border} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    color: Colors.border,
    fontSize: 16,
  },
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.background,
    borderRadius: 20,
  },
  postButtonText: {
    color: "#000",
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: Colors.border,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  profileContainer: {
    marginRight: 12,
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileLine: {
    flex: 1,
    width: 2,
    backgroundColor: "#e0e0e0",
    marginTop: 8,
  },
  inputContainer: {
    flex: 1,
  },
  username: {
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    lineHeight: 22,
    minHeight: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 16,
    marginTop: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: Platform.OS === "ios" ? 20 : 0,
    borderTopRightRadius: Platform.OS === "ios" ? 20 : 0,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#0095f6",
    padding: 12,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  cancelButtonText: {
    color: "#333",
  },
});
