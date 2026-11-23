import { StyleSheet, View } from "react-native";
import { colors } from "../constants/colors";

export type AppIconName =
  | "dashboard"
  | "students"
  | "assessment"
  | "book"
  | "reports"
  | "profile"
  | "plus"
  | "arrow"
  | "search"
  | "camera"
  | "image"
  | "clock"
  | "check";

type Props = {
  name: AppIconName;
  color?: string;
  size?: number;
};

export function AppIcon({ name, color = colors.teal, size = 22 }: Props) {
  const stroke = {
    borderColor: color,
    borderWidth: Math.max(1.5, size * 0.08),
  };
  const line = { backgroundColor: color };

  if (name === "dashboard") {
    return (
      <View style={[styles.canvas, { height: size, width: size }]}>
        {[0, 1, 2, 3].map((item) => (
          <View
            key={item}
            style={[
              styles.tile,
              stroke,
              {
                height: size * 0.34,
                left: item % 2 ? size * 0.56 : size * 0.1,
                top: item > 1 ? size * 0.56 : size * 0.1,
                width: size * 0.34,
              },
            ]}
          />
        ))}
      </View>
    );
  }

  if (name === "students") {
    return (
      <View style={[styles.canvas, { height: size, width: size }]}>
        <View
          style={[
            styles.personHead,
            stroke,
            { height: size * 0.27, left: size * 0.36, top: size * 0.08, width: size * 0.27 },
          ]}
        />
        <View
          style={[
            styles.personHead,
            stroke,
            { height: size * 0.2, left: size * 0.02, top: size * 0.31, width: size * 0.2 },
          ]}
        />
        <View
          style={[
            styles.personHead,
            stroke,
            styles.sideHeadRight,
            { height: size * 0.2, top: size * 0.31, width: size * 0.2 },
          ]}
        />
        <View
          style={[
            styles.shoulders,
            stroke,
            { height: size * 0.4, left: size * 0.23, top: size * 0.54, width: size * 0.54 },
          ]}
        />
        <View
          style={[
            styles.sideShoulder,
            stroke,
            styles.sideShoulderLeft,
            { height: size * 0.28, top: size * 0.63, width: size * 0.29 },
          ]}
        />
        <View
          style={[
            styles.sideShoulder,
            stroke,
            styles.sideShoulderRight,
            { height: size * 0.28, top: size * 0.63, width: size * 0.29 },
          ]}
        />
      </View>
    );
  }

  if (name === "assessment") {
    return (
      <View style={[styles.canvas, { height: size, width: size }]}>
        <View
          style={[
            styles.clipboard,
            stroke,
            { height: size * 0.76, left: size * 0.16, top: size * 0.16, width: size * 0.68 },
          ]}
        >
          <View style={[styles.clipLine, line, { top: size * 0.27 }]} />
          <View style={[styles.clipLine, line, { top: size * 0.45 }]} />
          <View style={[styles.clipLine, styles.shortClipLine, line, { top: size * 0.62 }]} />
        </View>
        <View
          style={[
            styles.clip,
            stroke,
            { height: size * 0.16, left: size * 0.36, top: size * 0.06, width: size * 0.28 },
          ]}
        />
      </View>
    );
  }

  if (name === "book") {
    return (
      <View style={[styles.canvas, { height: size, width: size }]}>
        <View
          style={[
            styles.bookPage,
            stroke,
            { height: size * 0.68, left: size * 0.08, top: size * 0.18, width: size * 0.41 },
          ]}
        />
        <View
          style={[
            styles.bookPage,
            stroke,
            { height: size * 0.68, right: size * 0.08, top: size * 0.18, width: size * 0.41 },
          ]}
        />
        <View
          style={[
            styles.bookSeam,
            line,
            { height: size * 0.72, left: size * 0.48, top: size * 0.18 },
          ]}
        />
      </View>
    );
  }

  if (name === "reports") {
    return (
      <View style={[styles.canvas, { height: size, width: size }]}>
        <View style={[styles.chartAxis, line, { height: size * 0.76, left: size * 0.12, top: size * 0.1 }]} />
        <View style={[styles.chartAxis, line, { height: size * 0.76, left: size * 0.12, top: size * 0.84, transform: [{ rotate: "90deg" }], width: size * 0.76 }]} />
        <View style={[styles.chartBar, line, { height: size * 0.25, left: size * 0.3, top: size * 0.57, width: size * 0.15 }]} />
        <View style={[styles.chartBar, line, { height: size * 0.42, left: size * 0.56, top: size * 0.4, width: size * 0.15 }]} />
        <View style={[styles.chartBar, line, { height: size * 0.6, left: size * 0.79, top: size * 0.22, width: size * 0.15 }]} />
      </View>
    );
  }

  if (name === "profile") {
    return (
      <View style={[styles.canvas, { height: size, width: size }]}>
        <View
          style={[
            styles.personHead,
            stroke,
            { height: size * 0.32, left: size * 0.34, top: size * 0.08, width: size * 0.32 },
          ]}
        />
        <View
          style={[
            styles.profileShoulders,
            stroke,
            { height: size * 0.38, left: size * 0.12, top: size * 0.53, width: size * 0.76 },
          ]}
        />
      </View>
    );
  }

  if (name === "plus") {
    return (
      <View style={[styles.canvas, { height: size, width: size }]}>
        <View style={[styles.plusLine, line, { height: size * 0.66, left: size * 0.46, top: size * 0.17 }]} />
        <View style={[styles.plusLine, line, { height: size * 0.66, left: size * 0.46, top: size * 0.17, transform: [{ rotate: "90deg" }] }]} />
      </View>
    );
  }

  if (name === "arrow") {
    return (
      <View style={[styles.canvas, { height: size, width: size }]}>
        <View style={[styles.arrowLine, line, { left: size * 0.14, top: size * 0.46, width: size * 0.66 }]} />
        <View style={[styles.arrowHead, stroke, { height: size * 0.38, right: size * 0.1, top: size * 0.31, width: size * 0.38 }]} />
      </View>
    );
  }

  if (name === "search") {
    return (
      <View style={[styles.canvas, { height: size, width: size }]}>
        <View style={[styles.searchLens, stroke, { height: size * 0.57, left: size * 0.08, top: size * 0.08, width: size * 0.57 }]} />
        <View style={[styles.searchHandle, line, { height: size * 0.09, left: size * 0.59, top: size * 0.68, transform: [{ rotate: "45deg" }], width: size * 0.34 }]} />
      </View>
    );
  }

  if (name === "camera" || name === "image") {
    return (
      <View style={[styles.canvas, { height: size, width: size }]}>
        <View
          style={[
            styles.mediaFrame,
            stroke,
            { height: size * 0.66, left: size * 0.08, top: size * 0.2, width: size * 0.84 },
          ]}
        />
        {name === "camera" ? (
          <>
            <View style={[styles.cameraTop, stroke, { height: size * 0.12, left: size * 0.26, top: size * 0.08, width: size * 0.28 }]} />
            <View style={[styles.cameraLens, stroke, { height: size * 0.32, left: size * 0.37, top: size * 0.37, width: size * 0.32 }]} />
          </>
        ) : (
          <>
            <View style={[styles.sun, line, { height: size * 0.12, left: size * 0.25, top: size * 0.34, width: size * 0.12 }]} />
            <View style={[styles.mountain, stroke, { height: size * 0.28, left: size * 0.22, top: size * 0.53, width: size * 0.52 }]} />
          </>
        )}
      </View>
    );
  }

  if (name === "clock") {
    return (
      <View style={[styles.canvas, { height: size, width: size }]}>
        <View style={[styles.clockFace, stroke, { height: size * 0.8, left: size * 0.1, top: size * 0.1, width: size * 0.8 }]} />
        <View style={[styles.clockHand, line, { height: size * 0.3, left: size * 0.48, top: size * 0.25 }]} />
        <View style={[styles.clockHand, line, { height: size * 0.25, left: size * 0.5, top: size * 0.48, transform: [{ rotate: "90deg" }] }]} />
      </View>
    );
  }

  return (
    <View style={[styles.canvas, { height: size, width: size }]}>
      <View style={[styles.checkShort, stroke, { height: size * 0.36, left: size * 0.22, top: size * 0.45, width: size * 0.36 }]} />
      <View style={[styles.checkLong, stroke, { height: size * 0.68, left: size * 0.42, top: size * 0.18, width: size * 0.36 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: { overflow: "hidden", position: "relative" },
  tile: { borderRadius: 2, position: "absolute" },
  personHead: { borderRadius: 100, position: "absolute" },
  sideHeadRight: { right: 0 },
  shoulders: {
    borderBottomWidth: 0,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    position: "absolute",
  },
  sideShoulder: {
    borderBottomWidth: 0,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    position: "absolute",
  },
  sideShoulderLeft: { left: 0 },
  sideShoulderRight: { right: 0 },
  clipboard: { borderRadius: 3, position: "absolute" },
  clip: { backgroundColor: colors.paper, borderRadius: 2, position: "absolute" },
  clipLine: { height: 1.5, left: "23%", position: "absolute", width: "55%" },
  shortClipLine: { width: "46%" },
  bookPage: { borderRadius: 2, position: "absolute" },
  bookSeam: { position: "absolute", width: 1.5 },
  chartAxis: { position: "absolute", width: 1.5 },
  chartBar: { borderTopLeftRadius: 2, borderTopRightRadius: 2, position: "absolute" },
  profileShoulders: {
    borderBottomWidth: 0,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    position: "absolute",
  },
  plusLine: { borderRadius: 2, position: "absolute", width: 2 },
  arrowLine: { height: 1.8, position: "absolute" },
  arrowHead: {
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    position: "absolute",
    transform: [{ rotate: "45deg" }],
  },
  searchLens: { borderRadius: 100, position: "absolute" },
  searchHandle: { borderRadius: 2, position: "absolute" },
  mediaFrame: { borderRadius: 3, position: "absolute" },
  cameraTop: { borderBottomWidth: 0, borderTopLeftRadius: 2, borderTopRightRadius: 2, position: "absolute" },
  cameraLens: { borderRadius: 100, position: "absolute" },
  sun: { borderRadius: 100, position: "absolute" },
  mountain: { borderBottomWidth: 0, borderLeftWidth: 0, position: "absolute", transform: [{ rotate: "45deg" }] },
  clockFace: { borderRadius: 100, position: "absolute" },
  clockHand: { position: "absolute", width: 1.5 },
  checkShort: {
    borderRightWidth: 0,
    borderTopWidth: 0,
    position: "absolute",
    transform: [{ rotate: "-45deg" }],
  },
  checkLong: {
    borderRightWidth: 0,
    borderTopWidth: 0,
    position: "absolute",
    transform: [{ rotate: "45deg" }],
  },
});
