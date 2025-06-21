import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { ThreadType } from "@/types/thread";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { Image } from "expo-image";
import React, { useCallback, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Thread = ({ thread }: ThreadType) => {
  console.log("Rendering Thread component with thread ID");
  const {
    creator,
    likeCount,
    commentCount,
    retweetCount,
    content,
    mediaFiles,
    _id,
    _creationTime,
  } = thread;

  const { first_name, last_name, imageUrl, username } = creator;

  const likeThread = useMutation(api.message.likeThread);

  const handleLike = useCallback(() => {
    likeThread({ messageId: _id });
  }, [likeThread, _id]);

  const formattedDate = useMemo(() => {
    return new Date(_creationTime).toLocaleDateString();
  }, [_creationTime]);

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl && imageUrl }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <View style={[styles.header, !content && { marginBottom: 10 }]}>
          <View style={styles.headerText}>
            <Text style={styles.username}>
              {username ? username : `${first_name} ${last_name}`}
            </Text>

            <Text style={styles.timestamp}>{formattedDate}</Text>
          </View>
          <Ionicons
            name="ellipsis-horizontal"
            size={24}
            color={Colors.border}
            style={{ alignSelf: "flex-start" }}
          />
        </View>

        {content && <Text style={styles.content}>{content}</Text>}
        {mediaFiles && mediaFiles.length > 0 && (
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={styles.mediaContainer}
          >
            {mediaFiles.map((file, index) => (
              <Image
                key={index}
                source={{ uri: file }}
                style={styles.mediaImage}
              />
            ))}
          </ScrollView>
        )}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Ionicons name="heart-outline" size={24} color="black" />
            <Text style={styles.actionText}>{likeCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color="black" />
            <Text style={styles.actionText}>{commentCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="repeat-outline" size={24} color="black" />
            <Text style={styles.actionText}>{retweetCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="send" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Tối ưu memo function bằng cách chỉ re-render khi dữ liệu thực sự thay đổi
export default React.memo(Thread, (prevProps, nextProps) => {
  return (
    prevProps.thread._id === nextProps.thread._id &&
    prevProps.thread.likeCount === nextProps.thread.likeCount &&
    prevProps.thread.commentCount === nextProps.thread.commentCount &&
    prevProps.thread.retweetCount === nextProps.thread.retweetCount
  );
});

// Styles không thay đổi

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
  },
  avatar: {
    marginTop: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  headerText: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  timestamp: {
    color: "#777",
    fontSize: 12,
  },
  content: {
    fontSize: 15,
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    marginTop: 10,
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 5,
    color: "black",
  },
  mediaImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  mediaContainer: {
    flexDirection: "row",
    gap: 12,
    paddingRight: 40,
  },
});
