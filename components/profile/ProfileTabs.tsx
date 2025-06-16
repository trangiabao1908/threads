import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export type TabOptions = "Threads" | "Replies" | "Reposts";

type ProfileTabsProps = {
  activeTab: TabOptions;
  onTabChange: (tab: TabOptions) => void;
};

const ProfileTabs = ({ activeTab, onTabChange }: ProfileTabsProps) => {
  return (
    <View style={styles.tabContainer}>
      {(["Threads", "Replies", "Reposts"] as TabOptions[]).map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => onTabChange(tab)}
        >
          <Text
            style={[styles.tabText, activeTab === tab && styles.activeTabText]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ProfileTabs;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  tabText: {
    color: Colors.border,
  },
  activeTabText: {
    color: "#000",
    fontWeight: "600",
  },
});
