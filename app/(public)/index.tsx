import { Colors } from "@/constants/Colors";
import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useNavigation, useRouter } from "expo-router";
import { useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Enum cho các loại chiến lược đăng nhập
enum LoginStrategy {
  FACEBOOK = "oauth_facebook",
  GOOGLE = "oauth_google",
}

// Component cho nút đăng nhập
interface LoginButtonProps {
  icon?: React.ReactNode;
  label: string;
  subText?: string;
  onPress?: () => void;
}

const LoginButton = ({ icon, label, subText, onPress }: LoginButtonProps) => (
  <TouchableOpacity onPress={onPress} style={styles.buttonLogin}>
    <View style={styles.buttonLoginContent}>
      {icon}
      <Text style={styles.buttonLoginText}>{label}</Text>
      <Ionicons name="chevron-forward" size={24} color={Colors.border} />
    </View>
    {subText && <Text style={styles.buttonLoginSubText}>{subText}</Text>}
  </TouchableOpacity>
);

export default function LoginScreen() {
  const { startSSOFlow } = useSSO();
  const navigate = useRouter();
  // Hàm xử lý đăng nhập chung cho nhiều provider
  const handleLogin = useCallback(
    async (strategy: LoginStrategy) => {
      try {
        const { createdSessionId, setActive } = await startSSOFlow({
          strategy,
        });

        if (createdSessionId) {
          setActive!({ session: createdSessionId });
        } else {
          console.log(`No session created during ${strategy} SSO flow.`);
        }
      } catch (error) {
        console.error(`Error during ${strategy} SSO flow:`, error);
      }
    },
    [startSSOFlow]
  );

  const handleLoginFacebook = useCallback(() => {
    handleLogin(LoginStrategy.FACEBOOK);
  }, [handleLogin]);

  const handleLoginGoogle = useCallback(() => {
    handleLogin(LoginStrategy.GOOGLE);
  }, [handleLogin]);
  const handleNavigateToSwitchAccount = useCallback(() => {
    navigate.replace({ pathname: "/create" });
  }, [navigate]);
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/login.png")}
        style={styles.imageLogin}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>How would you like to use app</Text>
        <View style={styles.buttonContainer}>
          <LoginButton
            icon={
              <Image
                source={require("@/assets/images/instagram_icon.webp")}
                style={styles.buttonLoginImage}
              />
            }
            label="Continue with Instagram"
            subText="Log in or create a THreads profile with your Instagram account. With a profile, you can post, interact and get personalised recommendations."
            onPress={handleLoginFacebook}
          />

          <LoginButton
            label="Continue with Google"
            onPress={handleLoginGoogle}
          />

          <LoginButton
            label="Continue without account"
            subText="You can browse Threads without a profile, but won't be able to post, interact or get personalised recommendations."
          />

          <TouchableOpacity onPress={handleNavigateToSwitchAccount}>
            <Text style={styles.buttonSwitchAccount}>
              Switch another account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    alignItems: "center",
    gap: 20,
    paddingBottom: 20,
  },
  imageLogin: {
    width: "100%",
    height: 350,
    objectFit: "cover",
  },
  title: {
    fontSize: 18,
    fontFamily: "DMSans_500Medium",
    marginTop: 16,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
    gap: 12,
  },
  buttonLogin: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  buttonLoginContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  buttonLoginImage: {
    width: 45,
    height: 45,
  },
  buttonLoginText: {
    fontSize: 16,
    fontFamily: "DMSans_500Medium",
    color: "#000",
    flex: 1,
  },
  buttonLoginSubText: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    color: Colors.border,
    marginTop: 10,
  },
  buttonSwitchAccount: {
    fontSize: 15,
    fontFamily: "DMSans_500Medium",
    color: Colors.border,
    alignSelf: "center",
    marginTop: 12,
  },
});
