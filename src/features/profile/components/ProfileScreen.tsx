import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button } from "../../../components/Button";
import { PageHeader } from "../../../components/PageHeader";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { TextInput } from "../../../components/TextInput";
import { colors } from "../../../constants/colors";
import { updateProfile } from "../services/profileService";
import type { Profile } from "../types";

export function ProfileScreen({
  profile,
  onSignOut,
}: {
  profile: Profile;
  onSignOut: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile.full_name);
  const [grade, setGrade] = useState(profile.grade);
  const [section, setSection] = useState(profile.section);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveProfile() {
    if (!fullName.trim()) {
      setError("Enter your full name.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await updateProfile(profile.user_id, {
        full_name: fullName,
        grade,
        section,
      });
      setIsEditing(false);
    } catch {
      setError(
        "Profile changes could not be saved. Check your connection and access.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  const initial = fullName.trim().slice(0, 1).toUpperCase() || "?";

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <PageHeader
          eyebrow="YOUR ACCOUNT"
          subtitle="Manage your profile and account access."
          title="Profile"
        />
        <View style={styles.profileCard}>
          <View style={styles.identity}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={styles.identityCopy}>
              <Text style={styles.name}>{fullName}</Text>
              <Text style={styles.role}>
                {profile.role === "teacher" ? "Teacher" : "Student"}
              </Text>
            </View>
          </View>

          {isEditing ? (
            <View style={styles.form}>
              <TextInput
                autoCapitalize="words"
                label="Full name"
                onChangeText={setFullName}
                value={fullName}
              />
              {profile.role === "student" ? (
                <View style={styles.classFields}>
                  <View style={styles.gradeField}>
                    <TextInput
                      keyboardType="number-pad"
                      label="Grade"
                      onChangeText={setGrade}
                      value={grade}
                    />
                  </View>
                  <View style={styles.sectionField}>
                    <TextInput
                      label="Section"
                      onChangeText={setSection}
                      value={section}
                    />
                  </View>
                </View>
              ) : null}
              {error ? (
                <Text accessibilityLiveRegion="polite" style={styles.error}>
                  {error}
                </Text>
              ) : null}
              <Button
                label="Save changes"
                loading={isSaving}
                onPress={() => void saveProfile()}
              />
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setIsEditing(false);
                  setError(null);
                }}
                style={styles.cancelButton}
              >
                <Text style={styles.cancel}>Cancel</Text>
              </Pressable>
            </View>
          ) : (
            <>
              {profile.role === "student" && (grade || section) ? (
                <View style={styles.classInfo}>
                  <Text style={styles.classLabel}>CLASS</Text>
                  <Text style={styles.classValue}>
                    {[grade && `Grade ${grade}`, section]
                      .filter(Boolean)
                      .join(" · ")}
                  </Text>
                </View>
              ) : null}
              {error ? (
                <Text accessibilityLiveRegion="polite" style={styles.error}>
                  {error}
                </Text>
              ) : null}
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setError(null);
                  setIsEditing(true);
                }}
                style={({ pressed }) => [
                  styles.editButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.edit}>Edit profile</Text>
              </Pressable>
            </>
          )}
        </View>
        <View style={styles.accountSection}>
          <Text style={styles.sectionTitle}>Account access</Text>
          <Text style={styles.accountDescription}>
            Your sign-in and classroom access are managed by your account.
          </Text>
          <Button
            label="Sign out"
            onPress={onSignOut}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, gap: 18, padding: 20, paddingTop: 16, paddingBottom: 28 },
  profileCard: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 13,
    borderWidth: 1,
    gap: 18,
    padding: 16,
  },
  identity: { alignItems: "center", flexDirection: "row", gap: 12 },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.ink,
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    width: 50,
  },
  avatarText: { color: colors.white, fontSize: 20, fontWeight: "800" },
  identityCopy: { flex: 1, gap: 4 },
  name: { color: colors.ink, fontSize: 17, fontWeight: "800" },
  role: { color: colors.tealDark, fontSize: 12, fontWeight: "700" },
  classInfo: {
    backgroundColor: colors.paper,
    borderRadius: 9,
    gap: 4,
    padding: 12,
  },
  classLabel: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  classValue: { color: colors.ink, fontSize: 13, fontWeight: "700" },
  editButton: {
    alignItems: "center",
    backgroundColor: colors.tealSoft,
    borderRadius: 9,
    justifyContent: "center",
    minHeight: 44,
  },
  edit: { color: colors.tealDark, fontSize: 13, fontWeight: "800" },
  form: { gap: 14 },
  classFields: { flexDirection: "row", gap: 10 },
  gradeField: { flex: 0.7 },
  sectionField: { flex: 1.3 },
  error: {
    backgroundColor: colors.dangerSoft,
    borderRadius: 8,
    color: colors.danger,
    fontSize: 12,
    lineHeight: 18,
    padding: 11,
  },
  cancelButton: { alignItems: "center", justifyContent: "center", minHeight: 44 },
  cancel: { color: colors.muted, fontSize: 13, fontWeight: "700" },
  accountSection: { gap: 9 },
  sectionTitle: { color: colors.ink, fontSize: 15, fontWeight: "800" },
  accountDescription: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  pressed: { opacity: 0.78 },
});
