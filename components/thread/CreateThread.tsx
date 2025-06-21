import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import KeyboardAccessory from "../keyboard/KeyboardAccessory";

type CreateThreadProps = {
  isPreview?: boolean;
  isReply?: boolean;
  threadId?: Id<"messages">;
};
const CreateThread = ({ isPreview, isReply, threadId }: CreateThreadProps) => {
  const router = useRouter();
  const createThread = useMutation(api.message.generateMessage);
  const generateUploadUrl = useMutation(api.message.generateUploadUrl);
  const [content, setContent] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<
    ImagePicker.ImagePickerAsset[]
  >([]);
  const { userProfile } = useUserProfile();
  const inputAccessoryViewID = "uniqueId";
  const handleCreateThread = async () => {
    const mediaUrls = await Promise.all(selectedImage.map(generateMediaUrl));
    await createThread({
      content: content,
      threadId: threadId,
      mediaFiles: mediaUrls,
    });
    setContent("");
    setSelectedImage([]);
    router.dismiss();
  };
  const handleCancel = () => {
    setContent("");
    router.dismiss();
    // Alert.alert("Discard thread?", "", [
    //   {
    //     text: "Discard",
    //     onPress: () => router.dismiss(),
    //     style: "destructive",
    //   },
    //   {
    //     text: "Save Draft",
    //     style: "cancel",
    //   },
    //   {
    //     text: "Cancel",
    //     style: "cancel",
    //   },
    // ]);
  };
  const removeThread = () => {
    setContent("");
    setSelectedImage([]);
  };

  const generateMediaUrl = async (
    image: ImagePicker.ImagePickerAsset
  ): Promise<string> => {
    const postUrl = await generateUploadUrl();
    const response = await fetch(image!.uri);
    const blob = await response.blob();
    const result = await fetch(postUrl, {
      method: "POST",
      body: blob,
      headers: {
        "content-type": image!.mimeType!,
      },
    });
    const { storageId } = await result.json();
    return storageId;
  };
  const pickImage = async (type: "library" | "camera") => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
    };
    let result;
    if (type === "library") {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();

      if (cameraStatus !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera permissions to make this work!",
          [{ text: "OK" }]
        );
        return;
      }
      result = await ImagePicker.launchCameraAsync(options);
    }
    if (!result.canceled) {
      setSelectedImage([result.assets[0], ...selectedImage]);
    } else {
      console.log("Image selection cancelled");
    }
  };
  const removeImage = (index: number) => {
    setSelectedImage((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      {isPreview && (
        <TouchableOpacity
          style={{
            inset: 0,
            position: "absolute",
            zIndex: 1000,
          }}
          onPress={() => router.push("/(auth)/(modal)/create")}
        />
      )}

      <Stack.Screen
        options={{
          headerTitleAlign: "center",
          headerTitle: isPreview ? "Preview" : "New Thread",
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel}>
              <Text style={styles.buttonCancelText}>Cancel</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.topRow}>
        <Image source={userProfile?.imageUrl} style={styles.avatar} />
        <View style={styles.centerContainer}>
          <Text
            style={styles.name}
          >{`${userProfile?.first_name} ${userProfile?.last_name}`}</Text>

          <TextInput
            style={styles.input}
            placeholder={isReply ? "Reply to thread" : "What's new?"}
            value={content}
            onChangeText={setContent}
            multiline
            autoFocus={!isPreview}
            inputAccessoryViewID={inputAccessoryViewID}
          />
          {selectedImage?.length > 0 && (
            <ScrollView horizontal>
              {selectedImage.map((image, index) => (
                <View style={styles.imageContainer} key={index}>
                  <Image source={image!.uri} style={styles.image} />
                  <TouchableOpacity
                    style={styles.deleteIconContainer}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
          <View style={styles.iconRow}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => pickImage("library")}
            >
              <Ionicons name="images-outline" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => pickImage("camera")}
            >
              <Ionicons name="camera-outline" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="gif" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="mic-outline" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome6 name="hashtag" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons
                name="stats-chart-outline"
                size={24}
                color={Colors.border}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={removeThread}
          style={[styles.cancelButton, { opacity: isPreview ? 0 : 1 }]}
        >
          <Ionicons name="close" size={24} color={Colors.border} />
        </TouchableOpacity>
      </View>

      <KeyboardAccessory nativeID={inputAccessoryViewID}>
        <View style={styles.keyboardAccessory}>
          <Text style={styles.keyboardAccessoryText}>
            {isReply
              ? "Everyone can reply and quote"
              : " Profiles that you follow can reply and quote"}
          </Text>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCreateThread}
          >
            <Text style={styles.submitButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAccessory>
    </View>
  );
};
export default React.memo(CreateThread);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonCancelText: {
    fontSize: 16,
    color: "black",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
    paddingHorizontal: 15,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  centerContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    fontSize: 16,
    maxHeight: 100,
    marginLeft: Platform.OS === "ios" ? 0 : -2,
  },
  cancelButton: {
    marginLeft: 12,
    alignSelf: "flex-start",
  },
  imageContainer: {
    position: "relative",
    marginRight: 10,
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 150,
    borderRadius: 6,
    marginRight: 10,
    marginTop: 10,
  },
  deleteIconContainer: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 4,
  },
  keyboardAccessory: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingLeft: 64,
    gap: 12,
  },
  keyboardAccessoryText: {
    flex: 1,
    color: Colors.border,
  },
  submitButton: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  iconRow: {
    flexDirection: "row",
    paddingTop: 2,
  },
  iconButton: {
    marginRight: 16,
  },
});
