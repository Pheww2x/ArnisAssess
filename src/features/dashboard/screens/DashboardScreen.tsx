import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AppIcon } from "../../../components/AppIcon";
import { EmptyState } from "../../../components/EmptyState";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { colors } from "../../../constants/colors";
import type { Profile } from "../../profile/types";
import { useConnectivity } from "../../../hooks/useConnectivity";
import {
  getStudentDashboardData,
  getTeacherDashboardData,
  type StudentDashboardData,
  type TeacherDashboardData,
} from "../services/phase2DashboardService";

type DashboardData = StudentDashboardData | TeacherDashboardData;

export function DashboardScreen({ profile }: { profile: Profile }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const { isOffline } = useConnectivity();
  const navigation = useNavigation<{ navigate: (name: string) => void }>();
  const goTo = (screen: string) => navigation.navigate(screen);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setLoadError(false);
    const request =
      profile.role === "teacher"
        ? getTeacherDashboardData(profile.user_id)
        : getStudentDashboardData(profile.user_id);
    request
      .then((result) => {
        if (active) setData(result);
      })
      .catch(() => {
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [profile.role, profile.user_id, reloadKey]);

  const firstName = profile.full_name.trim().split(/\s+/)[0] || "there";
  const nameInitial = firstName.slice(0, 1).toUpperCase();
  const greeting = getGreeting();

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View style={styles.brand}>
            <View style={styles.brandMark}>
              <Text style={styles.brandInitial}>A</Text>
            </View>
            <View style={styles.brandCopy}>
              <Text style={styles.brandName}>ARNIS ASSESS</Text>
              <Text style={styles.brandRole}>
                {profile.role === "teacher" ? "TEACHER PORTAL" : "STUDENT PORTAL"}
              </Text>
            </View>
          </View>
          <Pressable
            accessibilityLabel="Open profile"
            accessibilityRole="button"
            onPress={() => goTo("Profile")}
            style={({ pressed }) => [styles.avatarButton, pressed && styles.pressed]}
          >
            <Text style={styles.avatarInitial}>{nameInitial}</Text>
          </Pressable>
        </View>

        <View style={styles.welcome}>
          <Text style={styles.greeting}>
            {greeting}, {firstName}
          </Text>
          <Text style={styles.intro}>
            {profile.role === "teacher"
              ? "Ready to develop your students’ Arnis skills?"
              : "Keep building your Arnis skills, one practice at a time."}
          </Text>
          {profile.role === "student" && (profile.grade || profile.section) ? (
            <Text style={styles.classInfo}>
              {[profile.grade && `Grade ${profile.grade}`, profile.section]
                .filter(Boolean)
                .join(" · ")}
            </Text>
          ) : null}
        </View>

        {isOffline ? (
          <View style={styles.offlineNotice}>
            <View style={styles.offlineDot} />
            <Text style={styles.offlineText}>
              Offline · live class activity may be out of date
            </Text>
          </View>
        ) : null}

        <View style={styles.actions}>
          <ActionCard
            icon="assessment"
            onPress={() => goTo("Assessment")}
            primary
            subtitle={
              profile.role === "teacher" ? "Assess a student" : "View assigned work"
            }
            title={
              profile.role === "teacher" ? "Create assessment" : "My assessments"
            }
          />
          <ActionCard
            icon="book"
            onPress={() => goTo("Fundamentals")}
            subtitle="Techniques and practice"
            title="Arnis fundamentals"
          />
        </View>

        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.teal} size="small" />
            <Text style={styles.loadingText}>Loading class activity…</Text>
          </View>
        ) : loadError ? (
          <EmptyState
            actionLabel="Try again"
            compact
            description={
              isOffline
                ? "Your class activity will refresh when a connection is available."
                : "We couldn’t load class activity. Check your connection or account access, then try again."
            }
            icon="clock"
            onAction={() => setReloadKey((key) => key + 1)}
            title={isOffline ? "You’re offline" : "Activity unavailable"}
          />
        ) : profile.role === "teacher" && data && "studentCount" in data ? (
          <TeacherOverview
            data={data}
            onCreateAssessment={() => goTo("Assessment")}
          />
        ) : profile.role === "student" && data && "assessments" in data ? (
          <StudentOverview data={data} />
        ) : null}

        <View style={styles.resourceSection}>
          <Text style={styles.sectionEyebrow}>LEARNING RESOURCES</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => goTo("Fundamentals")}
            style={({ pressed }) => [
              styles.resourceRow,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.resourceIcon}>
              <AppIcon color={colors.tealDark} name="book" size={20} />
            </View>
            <View style={styles.resourceCopy}>
              <Text style={styles.resourceTitle}>Arnis fundamentals</Text>
              <Text style={styles.resourceSubtitle}>
                Background, techniques, and reference skills
              </Text>
            </View>
            <AppIcon color={colors.muted} name="arrow" size={18} />
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function TeacherOverview({
  data,
  onCreateAssessment,
}: {
  data: TeacherDashboardData;
  onCreateAssessment: () => void;
}) {
  const totalAssessments = data.pendingCount + data.completedCount;

  return (
    <>
      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Class snapshot</Text>
        <Text style={styles.sectionMeta}>From your class records</Text>
      </View>
      <View style={styles.metricGrid}>
        <Metric label="Students" value={data.studentCount} />
        <Metric label="Assessments" value={totalAssessments} />
        <Metric label="Pending review" value={data.pendingCount} />
        <Metric label="Validated" value={data.completedCount} />
      </View>

      <View style={styles.performance}>
        <View style={styles.performanceHeading}>
          <View>
            <Text style={styles.performanceTitle}>Class performance</Text>
            <Text style={styles.performanceSubtitle}>
              Validated assessment average
            </Text>
          </View>
          <Text style={styles.performanceScore}>
            {data.classAverage === null ? "—" : `${data.classAverage}/4`}
          </Text>
        </View>
        <View style={styles.progressTrack}>
          {data.classAverage !== null ? (
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(100, Math.max(0, data.classAverage * 25))}%` },
              ]}
            />
          ) : null}
        </View>
      </View>

      <View style={styles.activitySection}>
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Recent activity</Text>
          {data.pendingCount ? (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>
                {data.pendingCount} TO REVIEW
              </Text>
            </View>
          ) : null}
        </View>
        {data.recentAssessments.length ? (
          <View style={styles.activityList}>
            {data.recentAssessments.slice(0, 4).map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.activityRow,
                  index === 0 && styles.firstActivityRow,
                ]}
              >
                <View style={styles.activityIcon}>
                  <AppIcon
                    color={
                      item.status === "pending" ? colors.warning : colors.success
                    }
                    name={item.status === "pending" ? "clock" : "check"}
                    size={17}
                  />
                </View>
                <View style={styles.activityCopy}>
                  <Text numberOfLines={1} style={styles.activityTitle}>
                    {item.skill_name}
                  </Text>
                  <Text style={styles.activitySubtitle}>
                    {item.status === "pending"
                      ? "Awaiting teacher validation"
                      : "Result validated"}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusDot,
                    item.status === "pending"
                      ? styles.statusPending
                      : styles.statusComplete,
                  ]}
                />
              </View>
            ))}
          </View>
        ) : (
          <EmptyState
            actionLabel="Create your first assessment"
            compact
            description="New assessment activity will appear here as students submit their work."
            icon="assessment"
            onAction={onCreateAssessment}
            title="You’re all caught up"
          />
        )}
      </View>
    </>
  );
}

function StudentOverview({ data }: { data: StudentDashboardData }) {
  const latest = data.assessments[0];
  const currentLevel =
    latest?.overall_score === null || latest?.overall_score === undefined
      ? "Not assessed"
      : ["Beginning", "Developing", "Proficient", "Advanced"][
          Math.max(0, Math.min(3, Math.round(latest.overall_score) - 1))
        ];

  return (
    <>
      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Your progress</Text>
        <Text style={styles.sectionMeta}>Validated results</Text>
      </View>
      <View style={styles.metricGrid}>
        <Metric label="Current level" value={currentLevel} />
        <Metric label="Skills assessed" value={data.completedSkills.length} />
      </View>
      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Latest assessment</Text>
        {latest ? (
          <View style={styles.latestResult}>
            <Text style={styles.activityTitle}>{latest.skill_name}</Text>
            <Text style={styles.performanceScore}>
              {latest.overall_score === null
                ? "Score pending"
                : `${latest.overall_score} / 4`}
            </Text>
          </View>
        ) : (
          <EmptyState
            compact
            description="Your teacher-validated assessment results will appear here."
            icon="reports"
            title="No results yet"
          />
        )}
      </View>
      {data.strongestSkill ? (
        <View style={styles.highlight}>
          <Text style={styles.highlightLabel}>STRONGEST SKILL</Text>
          <Text style={styles.highlightValue}>{data.strongestSkill}</Text>
        </View>
      ) : null}
    </>
  );
}

function ActionCard({
  icon,
  title,
  subtitle,
  primary = false,
  onPress,
}: {
  icon: "assessment" | "book";
  title: string;
  subtitle: string;
  primary?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionCard,
        primary && styles.actionCardPrimary,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.actionIcon, primary && styles.actionIconPrimary]}>
        <AppIcon
          color={primary ? colors.white : colors.tealDark}
          name={icon}
          size={20}
        />
      </View>
      <Text
        numberOfLines={2}
        style={[styles.actionTitle, primary && styles.actionTitlePrimary]}
      >
        {title}
      </Text>
      <Text
        numberOfLines={2}
        style={[
          styles.actionSubtitle,
          primary && styles.actionSubtitlePrimary,
        ]}
      >
        {subtitle}
      </Text>
    </Pressable>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text adjustsFontSizeToFit minimumFontScale={0.8} style={styles.metricValue}>
        {value}
      </Text>
    </View>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const styles = StyleSheet.create({
  content: { gap: 20, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28 },
  topBar: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  brand: { alignItems: "center", flexDirection: "row", gap: 10 },
  brandMark: {
    alignItems: "center",
    backgroundColor: colors.ink,
    borderRadius: 9,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  brandInitial: { color: colors.white, fontSize: 20, fontWeight: "800" },
  brandCopy: { gap: 2 },
  brandName: { color: colors.ink, fontSize: 12, fontWeight: "900", letterSpacing: 0.6 },
  brandRole: { color: colors.teal, fontSize: 9, fontWeight: "800", letterSpacing: 1.1 },
  avatarButton: {
    alignItems: "center",
    backgroundColor: colors.tealSoft,
    borderColor: "#C8DEDC",
    borderRadius: 22,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  avatarInitial: { color: colors.tealDark, fontSize: 16, fontWeight: "800" },
  welcome: { gap: 6, paddingTop: 3 },
  greeting: { color: colors.ink, fontSize: 25, fontWeight: "800", letterSpacing: -0.5 },
  intro: { color: colors.muted, fontSize: 14, lineHeight: 20, maxWidth: 330 },
  classInfo: { color: colors.tealDark, fontSize: 12, fontWeight: "700", marginTop: 2 },
  offlineNotice: {
    alignItems: "center",
    backgroundColor: colors.warningSoft,
    borderColor: "#F0DFBD",
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  offlineDot: { backgroundColor: colors.warning, borderRadius: 4, height: 7, width: 7 },
  offlineText: { color: "#77561D", flex: 1, fontSize: 11, fontWeight: "700" },
  actions: { flexDirection: "row", gap: 10 },
  actionCard: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    gap: 7,
    minHeight: 132,
    padding: 12,
  },
  actionCardPrimary: { backgroundColor: colors.ink, borderColor: colors.ink },
  actionIcon: {
    alignItems: "center",
    backgroundColor: colors.tealSoft,
    borderRadius: 8,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  actionIconPrimary: { backgroundColor: "rgba(255,255,255,0.14)" },
  actionTitle: { color: colors.ink, fontSize: 13, fontWeight: "800", lineHeight: 17 },
  actionTitlePrimary: { color: colors.white },
  actionSubtitle: { color: colors.muted, fontSize: 10, lineHeight: 14 },
  actionSubtitlePrimary: { color: "#D5E4E8" },
  sectionHeading: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: -8,
  },
  sectionTitle: { color: colors.ink, fontSize: 16, fontWeight: "800" },
  sectionMeta: { color: colors.muted, fontSize: 10 },
  metricGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  metric: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 11,
    borderWidth: 1,
    flexBasis: "47%",
    flexGrow: 1,
    gap: 7,
    minHeight: 77,
    padding: 12,
  },
  metricLabel: { color: colors.muted, fontSize: 11, fontWeight: "600" },
  metricValue: { color: colors.ink, fontSize: 22, fontWeight: "800" },
  performance: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    gap: 14,
    padding: 15,
  },
  performanceHeading: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  performanceTitle: { color: colors.ink, fontSize: 13, fontWeight: "800" },
  performanceSubtitle: { color: colors.muted, fontSize: 10, marginTop: 3 },
  performanceScore: { color: colors.tealDark, fontSize: 19, fontWeight: "800" },
  progressTrack: { backgroundColor: colors.tealSoft, borderRadius: 4, height: 7, overflow: "hidden" },
  progressFill: { backgroundColor: colors.teal, borderRadius: 4, height: "100%" },
  activitySection: { gap: 12 },
  pendingBadge: { backgroundColor: colors.warningSoft, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 5 },
  pendingBadgeText: { color: "#77561D", fontSize: 9, fontWeight: "800", letterSpacing: 0.4 },
  activityList: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 13,
  },
  activityRow: {
    alignItems: "center",
    borderTopColor: colors.line,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: 62,
    paddingVertical: 9,
  },
  firstActivityRow: { borderTopWidth: 0 },
  activityIcon: {
    alignItems: "center",
    backgroundColor: colors.paper,
    borderRadius: 9,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  activityCopy: { flex: 1, gap: 3 },
  activityTitle: { color: colors.ink, fontSize: 12, fontWeight: "700" },
  activitySubtitle: { color: colors.muted, fontSize: 10 },
  statusDot: { borderRadius: 4, height: 8, width: 8 },
  statusPending: { backgroundColor: colors.warning },
  statusComplete: { backgroundColor: colors.success },
  latestResult: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
  highlight: {
    backgroundColor: colors.tealSoft,
    borderRadius: 11,
    gap: 5,
    padding: 14,
  },
  highlightLabel: { color: colors.tealDark, fontSize: 9, fontWeight: "800", letterSpacing: 0.8 },
  highlightValue: { color: colors.ink, fontSize: 14, fontWeight: "800" },
  resourceSection: { gap: 9 },
  sectionEyebrow: { color: colors.muted, fontSize: 9, fontWeight: "800", letterSpacing: 0.9 },
  resourceRow: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 11,
    minHeight: 68,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  resourceIcon: {
    alignItems: "center",
    backgroundColor: colors.tealSoft,
    borderRadius: 9,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  resourceCopy: { flex: 1, gap: 3 },
  resourceTitle: { color: colors.ink, fontSize: 12, fontWeight: "800" },
  resourceSubtitle: { color: colors.muted, fontSize: 10, lineHeight: 14 },
  loading: { alignItems: "center", flexDirection: "row", gap: 9, paddingVertical: 16 },
  loadingText: { color: colors.muted, fontSize: 12 },
  pressed: { opacity: 0.78 },
});
