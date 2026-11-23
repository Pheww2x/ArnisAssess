import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { AppIcon } from "../../../components/AppIcon";
import { Button } from "../../../components/Button";
import { EmptyState } from "../../../components/EmptyState";
import { PageHeader } from "../../../components/PageHeader";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { TextInput } from "../../../components/TextInput";
import { colors } from "../../../constants/colors";
import {
    addStudent,
    listTeacherStudents,
    setStudentArchived,
    updateStudent,
} from "../services/studentsService";
import type { StudentRosterInput, StudentRosterRecord } from "../types";

const emptyStudent: StudentRosterInput = {
  full_name: "",
  email: "",
  grade: "7",
  section: "",
};

export function StudentsScreen({ teacherId }: { teacherId: string }) {
  const [students, setStudents] = useState<StudentRosterRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [isArchivedVisible, setIsArchivedVisible] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editing, setEditing] = useState<StudentRosterRecord | null>(null);
  const [form, setForm] = useState<StudentRosterInput>(emptyStudent);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setStudents(await listTeacherStudents(teacherId));
    } catch {
      setError(
        "Student records could not be loaded. Check your connection and teacher access.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filteredStudents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return students.filter((student) => {
      const isArchived = student.status === "archived";
      return (
        isArchived === isArchivedVisible &&
        (!normalizedSearch ||
          student.full_name.toLowerCase().includes(normalizedSearch) ||
          student.email.toLowerCase().includes(normalizedSearch)) &&
        (!gradeFilter.trim() || student.grade === gradeFilter.trim()) &&
        (!sectionFilter.trim() ||
          student.section.toLowerCase() === sectionFilter.trim().toLowerCase())
      );
    });
  }, [gradeFilter, isArchivedVisible, search, sectionFilter, students]);

  function openCreate() {
    setEditing(null);
    setForm(emptyStudent);
    setFormError(null);
    setIsFormVisible(true);
  }

  function openEdit(student: StudentRosterRecord) {
    setEditing(student);
    setForm({
      full_name: student.full_name,
      email: student.email,
      grade: student.grade,
      section: student.section,
    });
    setFormError(null);
    setIsFormVisible(true);
  }

  async function saveStudent() {
    if (!form.full_name.trim() || !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setFormError("Enter the student’s name and a valid email address.");
      return;
    }
    if (!form.grade.trim() || !form.section.trim()) {
      setFormError("Enter the student’s grade and section.");
      return;
    }
    setIsSaving(true);
    setFormError(null);
    try {
      if (editing) await updateStudent(editing.id, form);
      else await addStudent(teacherId, form);
      setIsFormVisible(false);
      await refresh();
    } catch {
      setFormError(
        "The student record could not be saved. Check your teacher access and connection.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleArchive(student: StudentRosterRecord) {
    try {
      await setStudentArchived(student.id, student.status === "active");
      await refresh();
    } catch {
      setError("The student record could not be updated.");
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.screen}>
        <PageHeader
          eyebrow="TEACHER PORTAL"
          subtitle="Manage your class roster and student records."
          title="Students"
          action={
          <Pressable
            accessibilityRole="button"
            onPress={openCreate}
            style={styles.addButton}
          >
            <AppIcon color={colors.white} name="plus" size={17} />
            <Text style={styles.addButtonText}>Add student</Text>
          </Pressable>
          }
        />
        <TextInput
          label="Search students"
          onChangeText={setSearch}
          placeholder="Name or email"
          value={search}
        />
        <View style={styles.filters}>
          <View style={styles.filterInput}>
            <TextInput
              keyboardType="number-pad"
              label="Grade"
              onChangeText={setGradeFilter}
              placeholder="All"
              value={gradeFilter}
            />
          </View>
          <View style={styles.filterInput}>
            <TextInput
              label="Section"
              onChangeText={setSectionFilter}
              placeholder="All"
              value={sectionFilter}
            />
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => setIsArchivedVisible((value) => !value)}
          style={styles.archiveToggle}
        >
          <Text style={styles.archiveToggleText}>
            {isArchivedVisible
              ? "View active students"
              : "View archived students"}
          </Text>
          <AppIcon
            color={colors.tealDark}
            name={isArchivedVisible ? "students" : "arrow"}
            size={16}
          />
        </Pressable>
        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.teal} size="small" />
            <Text style={styles.stateText}>Loading students…</Text>
          </View>
        ) : error ? (
          <EmptyState
            actionLabel="Retry"
            compact
            description={error}
            icon="students"
            onAction={() => void refresh()}
            title="Roster unavailable"
          />
        ) : filteredStudents.length === 0 ? (
          <EmptyState
            actionLabel={
              isArchivedVisible ? undefined : "Add your first student"
            }
            compact
            description={
              isArchivedVisible
                ? "Archived students will appear here."
                : "Add a student to start building your class roster."
            }
            icon="students"
            onAction={isArchivedVisible ? undefined : openCreate}
            title={isArchivedVisible ? "No archived students" : "No students yet"}
          />
        ) : (
          <ScrollView
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            style={styles.studentList}
          >
            <Text style={styles.resultMeta}>
              {filteredStudents.length}{" "}
              {filteredStudents.length === 1 ? "student" : "students"}
            </Text>
            {filteredStudents.map((student) => (
              <View key={student.id} style={styles.studentRow}>
                <View style={styles.studentAvatar}>
                  <Text style={styles.studentInitial}>
                    {student.full_name.trim().slice(0, 1).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.studentCopy}>
                  <Text style={styles.studentName}>{student.full_name}</Text>
                  <Text style={styles.studentEmail}>{student.email}</Text>
                  <Text style={styles.studentClass}>
                    Grade {student.grade} · {student.section}
                  </Text>
                </View>
                <View style={styles.rowActions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => openEdit(student)}
                    style={styles.rowAction}
                  >
                    <Text style={styles.actionText}>Edit</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => void toggleArchive(student)}
                    style={styles.rowAction}
                  >
                    <Text style={styles.archiveText}>
                      {student.status === "active" ? "Archive" : "Restore"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        <Modal
          animationType="slide"
          onRequestClose={() => setIsFormVisible(false)}
          transparent
          visible={isFormVisible}
        >
          <View style={styles.modalBackdrop}>
            <ScrollView
              contentContainerStyle={styles.modalScroll}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.modalSheet}>
                <Text style={styles.modalTitle}>
                  {editing ? "Edit student" : "Add student"}
                </Text>
                <TextInput
                  autoCapitalize="words"
                  label="Full name"
                  onChangeText={(full_name) =>
                    setForm((value) => ({ ...value, full_name }))
                  }
                  placeholder="Student name"
                  value={form.full_name}
                />
                <TextInput
                  autoCapitalize="none"
                  keyboardType="email-address"
                  label="Email"
                  onChangeText={(email) =>
                    setForm((value) => ({ ...value, email }))
                  }
                  placeholder="student@school.edu"
                  value={form.email}
                />
                <View style={styles.filters}>
                  <View style={styles.filterInput}>
                    <TextInput
                      keyboardType="number-pad"
                      label="Grade"
                      onChangeText={(grade) =>
                        setForm((value) => ({ ...value, grade }))
                      }
                      placeholder="7"
                      value={form.grade}
                    />
                  </View>
                  <View style={styles.filterInput}>
                    <TextInput
                      label="Section"
                      onChangeText={(section) =>
                        setForm((value) => ({ ...value, section }))
                      }
                      placeholder="Section"
                      value={form.section}
                    />
                  </View>
                </View>
                {formError && <Text style={styles.formError}>{formError}</Text>}
                <Button
                  label={editing ? "Save changes" : "Add student"}
                  loading={isSaving}
                  onPress={() => void saveStudent()}
                />
                <Pressable onPress={() => setIsFormVisible(false)}>
                  <Text style={styles.cancel}>Cancel</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: 15, paddingHorizontal: 20, paddingTop: 16 },
  addButton: {
    alignItems: "center",
    backgroundColor: colors.teal,
    borderRadius: 9,
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    minHeight: 42,
    paddingHorizontal: 10,
  },
  addButtonText: { color: colors.white, fontSize: 11, fontWeight: "800" },
  filters: { flexDirection: "row", gap: 10, paddingTop: 2 },
  filterInput: { flex: 1 },
  archiveToggle: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 7,
    minHeight: 36,
    paddingRight: 7,
  },
  archiveToggleText: {
    color: colors.tealDark,
    fontSize: 11,
    fontWeight: "700",
  },
  list: { gap: 9, paddingBottom: 24 },
  studentList: { flex: 1 },
  resultMeta: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 1,
  },
  studentRow: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 11,
    borderWidth: 1,
    flexDirection: "row",
    gap: 11,
    minHeight: 80,
    padding: 11,
  },
  studentAvatar: {
    alignItems: "center",
    backgroundColor: colors.tealSoft,
    borderRadius: 21,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  studentInitial: { color: colors.tealDark, fontSize: 16, fontWeight: "800" },
  studentCopy: { flex: 1, gap: 3 },
  studentName: { color: colors.ink, fontSize: 13, fontWeight: "800" },
  studentEmail: { color: colors.muted, fontSize: 10 },
  studentClass: { color: colors.tealDark, fontSize: 10, fontWeight: "700" },
  rowActions: { alignItems: "flex-end", gap: 2 },
  rowAction: { minHeight: 34, justifyContent: "center", paddingHorizontal: 4 },
  actionText: {
    color: colors.tealDark,
    fontSize: 11,
    fontWeight: "800",
  },
  archiveText: {
    color: colors.danger,
    fontSize: 10,
    fontWeight: "700",
  },
  stateText: { color: colors.muted, fontSize: 12 },
  loading: { alignItems: "center", flexDirection: "row", gap: 9, paddingVertical: 14 },
  modalBackdrop: {
    backgroundColor: "rgba(20,45,61,0.46)",
    flex: 1,
    justifyContent: "flex-end",
  },
  modalScroll: { justifyContent: "flex-end", minHeight: "100%" },
  modalSheet: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 16,
    padding: 20,
    paddingBottom: 32,
  },
  modalTitle: { color: colors.ink, fontSize: 21, fontWeight: "800" },
  formError: { color: colors.danger, fontSize: 12, lineHeight: 18 },
  cancel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    padding: 8,
    textAlign: "center",
  },
});
