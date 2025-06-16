import { View, Text, Button } from "react-native";
import React from "react";
import * as Sentry from "@sentry/react-native";

const Page = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Feed Page</Text>
      <Button
        title="Test Sentry Error"
        onPress={() =>
          Sentry.captureException(new Error("Test Sentry Error from Feed Page"))
        }
      />
    </View>
  );
};

export default Page;
