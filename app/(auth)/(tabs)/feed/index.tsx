import CreateThread from "@/components/thread/CreateThread";
import Thread from "@/components/thread/Thread";
import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { usePaginatedQuery } from "convex/react";
import { Image } from "expo-image";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HeaderComponent = React.memo(() => {
  return (
    <>
      <Image
        source={require("@/assets/images/threads-logo-black.png")}
        style={{
          width: 40,
          height: 40,
          alignSelf: "center",
          marginBottom: 10,
        }}
      />
      <CreateThread isPreview />
    </>
  );
});

HeaderComponent.displayName = "HeaderComponent";

const Page = () => {
  const { top } = useSafeAreaInsets();

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const scrollOffset = useSharedValue(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const tabarBottonHeight = useBottomTabBarHeight();

  const { results, isLoading, loadMore, status } = usePaginatedQuery(
    api.message.getThreads,
    { refreshKey },
    {
      initialNumItems: 5,
    }
  );

  const threadIds = React.useMemo(() => {
    return results.map((thread) => thread._id);
  }, [results]);

  const updateTabBarMargin = useCallback(() => {
    let newMarginBottom = 0;
    if (scrollOffset.value >= 0 && scrollOffset.value <= tabarBottonHeight) {
      newMarginBottom = -scrollOffset.value;
    } else if (scrollOffset.value > tabarBottonHeight) {
      newMarginBottom = -tabarBottonHeight;
    }
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        marginBottom: newMarginBottom,
      },
    });
  }, [navigation, tabarBottonHeight, scrollOffset]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (isFocused) {
        scrollOffset.value = event.contentOffset.y;
        runOnJS(updateTabBarMargin)();
      }
    },
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const onLoadMore = useCallback(() => {
    if (!isLoading) {
      loadMore(5);
    }
  }, [isLoading, loadMore]);

  // Sử dụng memoized component trực tiếp
  return (
    <View style={{ flex: 1 }}>
      <Animated.FlatList
        data={results}
        renderItem={useCallback(
          ({ item }: any) => (
            <Thread
              thread={item as Doc<"messages"> & { creator: Doc<"users"> }}
            />
          ),
          []
        )}
        onScroll={onScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.border}
            colors={[Colors.border]}
            progressViewOffset={10}
            progressBackgroundColor={Colors.background}
          />
        }
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingTop: top, paddingBottom: 16 }}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={useCallback(
          () => (
            <View
              style={{
                backgroundColor: Colors.border,
                height: StyleSheet.hairlineWidth,
              }}
            />
          ),
          []
        )}
        ListHeaderComponent={HeaderComponent}
        ListFooterComponent={
          isLoading && status === "LoadingMore" ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color={Colors.border} />
              <Text style={styles.footerText}>Loading more...</Text>
            </View>
          ) : null
        }
        initialNumToRender={5}
        windowSize={10}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        extraData={threadIds}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 25,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    color: Colors.border,
    fontSize: 14,
    marginTop: 5,
  },
});
export default React.memo(Page);
