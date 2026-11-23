import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppIcon, type AppIconName } from "../components/AppIcon";
import { colors } from "../constants/colors";
import { AssessmentScreen } from "../features/assessment/components/AssessmentScreen";
import { DashboardScreen } from "../features/dashboard/screens/DashboardScreen";
import { ArnisContentScreen } from "../features/learning/components/ArnisContentScreen";
import { FeaturePlaceholderScreen } from "../features/navigation/screens/FeaturePlaceholderScreen";
import { ProfileScreen } from "../features/profile/components/ProfileScreen";
import type { Profile } from "../features/profile/types";
import { StudentsScreen } from "../features/students/components/StudentsScreen";

const Tab = createBottomTabNavigator();
const tabIcons: Record<string, AppIconName> = {
  Dashboard: "dashboard",
  Students: "students",
  Assessment: "assessment",
  Fundamentals: "book",
  Reports: "reports",
  Progress: "reports",
  Profile: "profile",
};
const tabLabels: Record<string, string> = {
  Assessment: "Assessments",
};

const placeholders = {
  Students:
    "Class roster, student profiles, and learning support will be available here.",
  Assessment:
    "Assigned and teacher-created Arnis assessments will be available here.",
  Fundamentals:
    "Arnis background, reference skills, and practice instructions will be available here.",
  Reports:
    "Validated assessment reports and class summaries will be available here.",
  Progress:
    "Your validated results and improvement over time will be available here.",
};

export function MainTabs({
  profile,
  onSignOut,
}: {
  profile: Profile;
  onSignOut: () => void;
}) {
  const insets = useSafeAreaInsets();
  const teacherTabs = [
    "Dashboard",
    "Students",
    "Assessment",
    "Fundamentals",
    "Reports",
    "Profile",
  ];
  const studentTabs = [
    "Dashboard",
    "Assessment",
    "Fundamentals",
    "Progress",
    "Profile",
  ];
  const tabs = profile.role === "teacher" ? teacherTabs : studentTabs;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.tealDark,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: ({ focused, color }) => (
          <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
            <AppIcon
              color={focused ? colors.tealDark : color}
              name={tabIcons[route.name] ?? "dashboard"}
              size={19}
            />
          </View>
        ),
        tabBarLabel: ({ color, focused }) => (
          <Text
            adjustsFontSizeToFit
            minimumFontScale={0.86}
            numberOfLines={1}
            style={[
              styles.tabLabel,
              { color },
              focused && styles.tabLabelActive,
            ]}
          >
            {tabLabels[route.name] ?? route.name}
          </Text>
        ),
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.line,
          borderTopWidth: 1,
          elevation: 8,
          height: 64 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 7),
          paddingTop: 5,
        },
        tabBarItemStyle: { paddingHorizontal: 1, paddingTop: 2 },
        tabBarHideOnKeyboard: true,
      })}
    >
      {tabs.map((tab) => {
        if (tab === "Dashboard") {
          return (
            <Tab.Screen key={tab} name={tab}>
              {() => <DashboardScreen profile={profile} />}
            </Tab.Screen>
          );
        }
        if (tab === "Profile") {
          return (
            <Tab.Screen key={tab} name={tab}>
              {() => <ProfileScreen profile={profile} onSignOut={onSignOut} />}
            </Tab.Screen>
          );
        }
        if (tab === "Students") {
          return (
            <Tab.Screen key={tab} name={tab}>
              {() => <StudentsScreen teacherId={profile.user_id} />}
            </Tab.Screen>
          );
        }
        if (tab === "Fundamentals") {
          return (
            <Tab.Screen key={tab} name={tab}>
              {() => <ArnisContentScreen profile={profile} />}
            </Tab.Screen>
          );
        }
        if (tab === "Assessment") {
          return (
            <Tab.Screen key={tab} name={tab}>
              {() => <AssessmentScreen profile={profile} />}
            </Tab.Screen>
          );
        }
        const description = placeholders[tab as keyof typeof placeholders];
        return (
          <Tab.Screen key={tab} name={tab}>
            {() => (
              <FeaturePlaceholderScreen title={tab} description={description} />
            )}
          </Tab.Screen>
        );
      })}
    </Tab.Navigator>
  );
}

const styles = {
  iconWrap: {
    alignItems: "center" as const,
    borderRadius: 9,
    height: 29,
    justifyContent: "center" as const,
    width: 38,
  },
  iconWrapActive: { backgroundColor: colors.tealSoft },
  tabLabel: {
    fontSize: 9,
    fontWeight: "600" as const,
    lineHeight: 12,
    marginTop: 1,
  },
  tabLabelActive: { fontWeight: "800" as const },
};
