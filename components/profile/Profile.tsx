import { Colors } from "@/constants/Colors";
import { ProfileProps } from "@/types/user";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileHeader from "./ProfileHeader";
import EmptyThreads from "../ui/EmptyThreads";

const Profile = ({ showBackButton = false, userId }: ProfileProps) => {
  const { top } = useSafeAreaInsets();

  const headerComponent = useMemo(
    () => <ProfileHeader showBackButton={showBackButton} userId={userId} />,
    [showBackButton, userId]
  );

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <FlatList
        data={[]}
        renderItem={() => null} // Placeholder for thread items
        ListEmptyComponent={<EmptyThreads />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={headerComponent}
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
  },
});
