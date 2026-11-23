import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppIcon, type AppIconName } from "./AppIcon";
import { colors } from "../constants/colors";

type Props = {
  title: string;
  description: string;
  icon?: AppIconName;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
};

export function EmptyState({
  title,
  description,
  icon = "reports",
  actionLabel,
  onAction,
  compact = false,
}: Props) {
  return (
    <View style={[styles.state, compact && styles.compact]}>
      <View style={styles.iconWrap}>
        <AppIcon color={colors.teal} name={icon} size={22} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  state: {
    alignItems: "flex-start",
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    padding: 18,
  },
  compact: { padding: 14 },
  iconWrap: {
    alignItems: "center",
    backgroundColor: colors.tealSoft,
    borderRadius: 9,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  title: { color: colors.ink, fontSize: 15, fontWeight: "800" },
  description: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  action: { alignSelf: "flex-start", minHeight: 40, justifyContent: "center", paddingVertical: 6 },
  actionText: { color: colors.tealDark, fontSize: 13, fontWeight: "800" },
  pressed: { opacity: 0.7 },
});
