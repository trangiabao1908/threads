import { useUserProfile } from "@/hooks/useUserProfile";
import { ProfileProps } from "@/types/user";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { Fragment, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProfileInfo from "./ProfileInfo";
import ProfileTabs, { TabOptions } from "./ProfileTabs";

type ProfileHeaderProps = ProfileProps;

const ProfileHeader = ({
  showBackButton = false,
  userId,
}: ProfileHeaderProps) => {
  const router = useRouter();
  const { signOut } = useAuth();
  const { userProfile } = useUserProfile();
  const [activeTab, setActiveTab] = useState<TabOptions>("Threads");
  return (
    <Fragment>
      <View style={styles.header}>
        {showBackButton ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={"black"} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <MaterialCommunityIcons name="web" size={24} color={"black"} />
        )}
        <View style={styles.headerIcons}>
          <Ionicons name="logo-instagram" size={24} color={"black"} />
          <TouchableOpacity onPress={() => signOut()}>
            <Ionicons name="log-out-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {userId ? (
        <ProfileInfo userId={userId} />
      ) : (
        userProfile?._id && <ProfileInfo userId={userProfile?._id} />
      )}
      <ProfileTabs
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />
    </Fragment>
  );
};

export default React.memo(ProfileHeader);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backText: {
    fontSize: 16,
    color: "black",
  },
  loadingContainer: {
    paddingVertical: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    margin: 16,
  },
});
