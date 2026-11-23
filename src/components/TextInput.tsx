import {
    TextInput as NativeTextInput,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { colors } from "../constants/colors";
type Props = React.ComponentProps<typeof NativeTextInput> & {
  label: string;
  error?: string;
};
export function TextInput({ label, error, ...props }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <NativeTextInput
        {...props}
        placeholderTextColor={colors.muted}
        style={[styles.input, error && styles.invalid]}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { color: colors.ink, fontSize: 12, fontWeight: "700" },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 9,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 15,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  invalid: { borderColor: colors.danger },
  error: { color: colors.danger, fontSize: 12 },
});
