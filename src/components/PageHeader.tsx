import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

type Props = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  action?: ReactNode;
};

export function PageHeader({ title, eyebrow, subtitle, action }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: "center", flexDirection: "row", gap: 12 },
  copy: { flex: 1, gap: 4 },
  eyebrow: {
    color: colors.teal,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
  },
  title: { color: colors.ink, fontSize: 25, fontWeight: "800", letterSpacing: -0.5 },
  subtitle: { color: colors.muted, fontSize: 13, lineHeight: 19 },
});
