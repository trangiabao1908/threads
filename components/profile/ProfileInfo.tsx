import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProfileInfoProps {
  userId?: string;
}

const ProfileInfo = ({ userId }: ProfileInfoProps) => {
  const userInfo = useQuery(api.user.getUserById, {
    userid: userId as Id<"users">,
  });
  const { userProfile } = useUserProfile();
  const isCurrentUser = userProfile?._id === userId;

  if (__DEV__) {
    console.log("ProfileInfo rendered with userId:", userId);
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileTextContainer}>
          <Text style={styles.userName}>
            {userInfo?.username
              ? userInfo?.username
              : `${userInfo?.first_name} ${userInfo?.last_name}`}
          </Text>
          <Text style={styles.userEmail}>{userInfo?.email}</Text>
        </View>
        <Image
          source={{ uri: userInfo?.imageUrl as string }}
          style={styles.image}
        />
      </View>
      <Text style={styles.userBio}>{userInfo?.bio || "No bio yet"}</Text>
      <Text>
        {userInfo?.followersCount} followers{" "}
        {userInfo?.websiteUrl ? `· ${userInfo?.websiteUrl}` : ""}
      </Text>
      <View style={styles.ButtonRow}>
        {isCurrentUser ? (
          <>
            <TouchableOpacity style={styles.profileButton} onPress={() => {}}>
              <Text style={styles.profileText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton} onPress={() => {}}>
              <Text style={styles.profileText}>Share Profile</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.fullButton}>
              <Text style={styles.fullButtonText}>Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton}>
              <Text style={styles.profileText}>Mention</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default React.memo(ProfileInfo);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },

  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileTextContainer: {
    gap: 6,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  userBio: {
    fontSize: 14,
    marginVertical: 16,
  },
  ButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: 16,
    marginTop: 16,
  },
  profileButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  fullButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  fullButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
