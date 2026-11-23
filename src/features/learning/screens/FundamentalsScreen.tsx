import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppIcon } from "../../../components/AppIcon";
import learningContent from "../../../../assets/data/learning-content.json";
import { colors } from "../../../constants/colors";

type Topic = {
  id: string;
  title: string;
  body: string;
  steps: string[];
  image_placeholder: string;
};
const content = learningContent as {
  background: Topic[];
  fundamentals: Topic[];
};

export function FundamentalsScreen() {
  const [group, setGroup] = useState<"background" | "fundamentals">(
    "fundamentals",
  );
  const [expanded, setExpanded] = useState<string | null>(null);
  const topics = content[group];

  return (
    <View style={styles.container}>
      <View style={styles.groupToggle}>
        {(["background", "fundamentals"] as const).map((item) => (
          <Pressable
            key={item}
            onPress={() => {
              setGroup(item);
              setExpanded(null);
            }}
            style={[styles.groupButton, group === item && styles.groupSelected]}
          >
            <Text
              style={[
                styles.groupText,
                group === item && styles.groupTextSelected,
              ]}
            >
              {item === "background" ? "Background" : "Fundamentals"}
            </Text>
          </Pressable>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.topicList}>
        {topics.map((topic) => {
          const isExpanded = expanded === topic.id;
          return (
            <View key={topic.id} style={styles.topic}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: isExpanded }}
                onPress={() => setExpanded(isExpanded ? null : topic.id)}
                style={styles.topicHeader}
              >
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.chevron}>{isExpanded ? "−" : "+"}</Text>
              </Pressable>
              {isExpanded && (
                <View style={styles.topicBody}>
                  <Text style={styles.bodyText}>{topic.body}</Text>
                  <Text style={styles.stepsTitle}>Practice steps</Text>
                  {topic.steps.map((step, index) => (
                    <Text key={`${topic.id}-${index}`} style={styles.step}>
                      {index + 1}. {step}
                    </Text>
                  ))}
                  <View
                    accessibilityLabel={topic.image_placeholder}
                    style={styles.imagePlaceholder}
                  >
                    <AppIcon color={colors.tealDark} name="book" size={22} />
                    <Text style={styles.imageDescription}>
                      {topic.image_placeholder}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  groupToggle: {
    backgroundColor: colors.tealSoft,
    borderRadius: 9,
    flexDirection: "row",
    marginHorizontal: 20,
    padding: 4,
  },
  groupButton: {
    alignItems: "center",
    borderRadius: 7,
    flex: 1,
    justifyContent: "center",
    minHeight: 40,
  },
  groupSelected: { backgroundColor: colors.white },
  groupText: { color: colors.muted, fontSize: 12, fontWeight: "700" },
  groupTextSelected: { color: colors.tealDark },
  topicList: { gap: 9, padding: 16, paddingBottom: 28 },
  topic: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 11,
    borderWidth: 1,
    overflow: "hidden",
  },
  topicHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 56,
    paddingHorizontal: 15,
  },
  topicTitle: { color: colors.ink, flex: 1, fontSize: 14, fontWeight: "800" },
  chevron: {
    color: colors.tealDark,
    fontSize: 19,
    fontWeight: "600",
    paddingLeft: 10,
  },
  topicBody: {
    borderTopColor: colors.line,
    borderTopWidth: 1,
    gap: 11,
    padding: 15,
  },
  bodyText: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  stepsTitle: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 3,
  },
  step: { color: colors.ink, fontSize: 12, lineHeight: 19 },
  imagePlaceholder: {
    alignItems: "center",
    backgroundColor: colors.tealSoft,
    borderRadius: 9,
    gap: 7,
    justifyContent: "center",
    minHeight: 90,
    padding: 13,
  },
  imageDescription: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
});
