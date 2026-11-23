import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/colors";

export function ScreenContainer({ children }: React.PropsWithChildren) {
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={styles.container}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.paper, flex: 1 },
});
