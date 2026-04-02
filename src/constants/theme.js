/**
 * @fileoverview Design tokens for GradeWatch.
 * Import anywhere you need colours or CSS-variable names.
 *
 * Usage:
 *   import { PALETTE, THEME } from '@/constants/theme';
 */

/** Chart / badge colours */
export const PALETTE = {
  up:        "#22c55e",   // positive delta  → green
  down:      "#ef4444",   // negative delta  → red
  neutral:   "#94a3b8",   // zero delta      → slate
  accent:    "#6366f1",   // primary brand   → indigo
  accentSoft:"#818cf8",   // lighter indigo
  warn:      "#f59e0b",   // warning / risk  → amber
  pie:       ["#6366f1", "#22c55e", "#f59e0b"],
  bar:       ["#22c55e",  "#ef4444", "#94a3b8", "#6366f1"],
};

/** CSS-variable maps injected as inline style on the root div */
export const THEME = {
  dark: {
    "--bg":       "#0f1117",
    "--card-bg":  "#1a1d27",
    "--border":   "#2a2d3e",
    "--text":     "#e8eaf0",
    "--muted":    "#6b7280",
    "--tab-bg":   "#1a1d27",
    "--input-bg": "#0f1117",
    "--row-alt":  "#1e2132",
    "--accent":   "#818cf8",
  },
  light: {
    "--bg":       "#f4f6fa",
    "--card-bg":  "#ffffff",
    "--border":   "#e5e7ef",
    "--text":     "#1a1d2e",
    "--muted":    "#7c869a",
    "--tab-bg":   "#ebedf5",
    "--input-bg": "#f8f9fc",
    "--row-alt":  "#f8f9fc",
    "--accent":   "#6366f1",
  },
};
