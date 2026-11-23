import { ScrollView, StyleSheet, View } from "react-native";
import { EmptyState } from "../../../components/EmptyState";
import { PageHeader } from "../../../components/PageHeader";
import { ScreenContainer } from "../../../components/ScreenContainer";

type Props = { title: string; description: string };

export function FeaturePlaceholderScreen({ title, description }: Props) {
  const isReports = title === "Reports";

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PageHeader
          eyebrow={title === "Progress" ? "STUDENT PORTAL" : "TEACHER PORTAL"}
          subtitle={description}
          title={title}
        />
        <View style={styles.stateWrap}>
          <EmptyState
            icon="reports"
            title={isReports ? "Reports will appear here" : "Coming up next"}
            description={
              isReports
                ? "Class summaries will be available when validated assessment results can be reported."
                : "This area is ready for validated progress updates."
            }
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, gap: 18, padding: 20, paddingTop: 16 },
  stateWrap: { marginTop: 4 },
});
