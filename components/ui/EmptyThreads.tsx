import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type EmptyThreadsProps = {
  isLoading?: boolean;
  message?: string;
  title?: string;
  showCreateButton?: boolean;
};

const EmptyThreads = ({
  isLoading = false,
  message = "Your post will appear here",
  title = "No posts yet",
  showCreateButton = true,
}: EmptyThreadsProps) => {
  const router = useRouter();
  // Tạo giá trị Animated để theo dõi hiệu ứng scale
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Hàm xử lý khi người dùng bắt đầu nhấn nút
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 3,
      tension: 400,
      useNativeDriver: true,
    }).start();
  };

  // Hàm xử lý khi người dùng nhấc tay khỏi nút
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 400,
      useNativeDriver: true,
    }).start();
  };

  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator color={Colors.border} size="large" />
        <Text style={styles.loadingText}>Đang tải bài viết...</Text>
      </View>
    );
  }

  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{message}</Text>

      {showCreateButton && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => router.push("/(auth)/(modal)/create")}
        >
          <Animated.View
            style={[
              styles.newPostButton,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Text style={styles.newPostButtonText}>Create your first post</Text>
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyThreads;

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  emptyText: {
    fontSize: 16,
    color: Colors.border,
    textAlign: "center",
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.border,
    marginTop: 10,
  },
  newPostButton: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  newPostButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
