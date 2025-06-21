import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";

const EditProfilePage = () => {
  const router = useRouter();
  const { userId, bio, imageUrl, websiteUrl, username } = useLocalSearchParams<{
    userId?: string;
    bio?: string;
    imageUrl?: string;
    websiteUrl?: string;
    username?: string;
  }>();
  const [newBio, setNewBio] = React.useState(bio || "");
  const [selectedImage, setSelectedImage] =
    React.useState<ImagePicker.ImagePickerAsset | null>(null);
  const [newWebSiteUrl, setNewWebSiteUrl] = React.useState(websiteUrl || "");
  const [isLoading, setIsLoading] = useState(false);

  const updateUser = useMutation(api.user.updateUser);
  const generateUploadUrl = useMutation(api.user.generateUploadUrl);

  const onDone = async () => {
    if (isLoading) return; // Prevent multiple submissions

    setIsLoading(true);
    try {
      let storageId: string | undefined;
      if (selectedImage) {
        // If an image is selected, we will upload it first
        storageId = await updateProfileImage();
      }

      await updateUser({
        _id: userId as Id<"users">,
        bio: newBio,
        websiteUrl: newWebSiteUrl,
        imageUrl: selectedImage ? storageId : imageUrl,
      });

      router.dismiss();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert(
        "Update Failed",
        "There was an error updating your profile. Please try again."
      );
    } finally {
      setIsLoading(false);
      setSelectedImage(null);
    }
  };

  const updateProfileImage = async () => {
    try {
      // create a new upload URL
      const postUrl = await generateUploadUrl();
      // convert the image to a blob
      const response = await fetch(selectedImage!.uri);
      const blob = await response.blob();
      // upload the image to the post URL
      const uploadResponse = await fetch(postUrl, {
        method: "POST",
        body: blob,
        headers: {
          "Content-Type": selectedImage!.mimeType!,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const { storageId } = await uploadResponse.json();
      return storageId;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error; // Re-throw to handle in onDone
    }
  };

  const pickImage = async () => {
    if (isLoading) return; // Prevent picking during update

    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio for profile pictures
      quality: 0.8, // Slightly lower quality for better performance
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={onDone}
              disabled={isLoading}
              style={isLoading ? styles.disabledButton : null}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.submit} />
              ) : (
                <Text style={styles.doneButtonText}>Done</Text>
              )}
            </TouchableOpacity>
          ),
        }}
      />

      <TouchableOpacity
        onPress={pickImage}
        disabled={isLoading}
        style={[styles.imageContainer, isLoading && styles.disabledButton]}
      >
        {selectedImage ? (
          <Image source={{ uri: selectedImage?.uri }} style={styles.image} />
        ) : imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text>Add Photo</Text>
          </View>
        )}
        {isLoading && (
          <View style={styles.imageOverlay}>
            <ActivityIndicator color="#ffffff" />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          value={newBio}
          onChangeText={(text: string) => setNewBio(text)}
          placeholder="Write a bio..."
          numberOfLines={4}
          multiline
          textAlignVertical="top"
          style={styles.bioInput}
          editable={!isLoading}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Link</Text>
        <TextInput
          value={newWebSiteUrl}
          onChangeText={(text: string) => setNewWebSiteUrl(text)}
          placeholder="Link to your website or profile"
          autoCapitalize="none"
          editable={!isLoading}
        />
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.submit} />
          <Text style={styles.loadingText}>Updating profile...</Text>
        </View>
      )}
    </View>
  );
};

export default EditProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  doneButtonText: {
    color: Colors.submit,
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    position: "relative",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.border,
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: [{ translateX: "-50%" }],
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bioInput: {
    height: 100,
  },
  loadingOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.border,
  },
});
