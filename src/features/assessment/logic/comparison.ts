import thresholds from "../../../../assets/data/analysis-thresholds.json";
import type {
    NumericPoseMetric,
    PoseMeasurements,
    ScoreLevel,
    ValidatedReference,
} from "../types";

export type MetricComparison = {
  metric: keyof PoseMeasurements;
  measured: number;
  expected: number;
  normalizedError: number;
  score: ScoreLevel;
};

function metricTolerance(
  metric: keyof PoseMeasurements,
  referenceTolerance: number | undefined,
): number {
  const fallback =
    metric.toLowerCase().includes("angle")
      ? thresholds.comparison.angleToleranceDegrees
      : metric === "footSpacingRatio"
        ? thresholds.comparison.spacingToleranceRatio
        : metric === "shoulderHipAlignmentRatio"
          ? thresholds.comparison.alignmentToleranceRatio
          : 0.1;

  if (
    typeof referenceTolerance !== "number" ||
    !Number.isFinite(referenceTolerance) ||
    referenceTolerance < 0
  ) {
    return fallback;
  }

  return referenceTolerance;
}

function scoreNormalizedError(error: number): ScoreLevel {
  if (!Number.isFinite(error)) return 1;
  const [advanced, proficient, developing] = thresholds.comparison.scoreBands;
  if (error <= advanced) return 4;
  if (error <= proficient) return 3;
  if (error <= developing) return 2;
  return 1;
}

export function comparePoseToReference(
  measured: PoseMeasurements,
  reference: ValidatedReference,
): MetricComparison[] {
  if (!reference.validated) return [];
  return Object.entries(reference.metrics).flatMap(([key, expectation]) => {
    if (!expectation) return [];
    if (!Number.isFinite(expectation.target)) return [];

    const metric = key as NumericPoseMetric;
    const value = measured[metric];
    if (typeof value !== "number" || !Number.isFinite(value)) return [];

    const tolerance = metricTolerance(metric, expectation.tolerance);
    const normalizedError =
      tolerance > 0
        ? Math.abs(value - expectation.target) / tolerance
        : value === expectation.target
          ? 0
          : Number.POSITIVE_INFINITY;

    return [
      {
        metric,
        measured: value,
        expected: expectation.target,
        normalizedError,
        score: scoreNormalizedError(normalizedError),
      },
    ];
  });
}
