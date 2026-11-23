import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { PageHeader } from "../../../components/PageHeader";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { colors } from "../../../constants/colors";
import { ReferenceManagerScreen } from "../../assessment/components/ReferenceManagerScreen";
import type { Profile } from "../../profile/types";
import { FundamentalsScreen } from "../screens/FundamentalsScreen";
import { ReferenceLibraryScreen } from "../screens/ReferenceLibraryScreen";
import { RubricScreen } from "../screens/RubricScreen";

type Section = "learn" | "references" | "manage" | "rubric";

export function ArnisContentScreen({ profile }: { profile: Profile }) {
  const [section, setSection] = useState<Section>("learn");
  const tabs: { id: Section; label: string }[] = [
    { id: "learn", label: "Learn" },
    { id: "references", label: "Reference library" },
    ...(profile.role === "teacher"
      ? [
          { id: "manage" as const, label: "Manage references" },
          { id: "rubric" as const, label: "Rubric" },
        ]
      : []),
  ];

  return (
    <ScreenContainer>
      <View style={styles.screen}>
        <PageHeader
          eyebrow="LEARNING LIBRARY"
          subtitle="Build a strong foundation in Arnis."
          title="Arnis fundamentals"
        />
        <ScrollView
          style={styles.tabScroll}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabList}
        >
          {tabs.map((tab) => (
            <Pressable
              key={tab.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: section === tab.id }}
              onPress={() => setSection(tab.id)}
              style={[styles.tab, section === tab.id && styles.activeTab]}
            >
              <Text
                style={[
                  styles.tabText,
                  section === tab.id && styles.activeTabText,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        {section === "learn" ? (
          <FundamentalsScreen />
        ) : section === "references" ? (
          <ReferenceLibraryScreen canManage={profile.role === "teacher"} />
        ) : section === "manage" ? (
          <ReferenceManagerScreen teacherId={profile.user_id} />
        ) : (
          <RubricScreen />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: 15, paddingHorizontal: 20, paddingTop: 16 },
  tabScroll: { flexGrow: 0, flexShrink: 0, height: 44 },
  tabList: { alignItems: "center", gap: 8, paddingVertical: 2 },
  tab: {
    alignSelf: "center",
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 9,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: 13,
  },
  activeTab: { backgroundColor: colors.ink, borderColor: colors.ink },
  tabText: { color: colors.muted, fontSize: 11, fontWeight: "700" },
  activeTabText: { color: colors.white },
});
