/**
 * @fileoverview Small shared UI components used across multiple dashboard sections.
 *
 * Exports:
 *  - AnalyticsChart  — white card wrapper for any Recharts chart
 *  - DeltaBadge      — coloured delta indicator (↑ green / ↓ red / — neutral)
 *  - Tabs            — pill-style tab bar
 *
 * Usage:
 *   import { AnalyticsChart, DeltaBadge, Tabs } from '@/components/ui';
 */

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// ---------------------------------------------------------------------------
// AnalyticsChart
// ---------------------------------------------------------------------------

/**
 * @param {{
 *   title: string,
 *   children: React.ReactNode,
 *   action?: React.ReactNode,
 * }} props
 */
export function AnalyticsChart({ title, children, action }) {
  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--border)",
      borderRadius: 16,
      padding: 24,
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 20,
      }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", margin: 0 }}>
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DeltaBadge
// ---------------------------------------------------------------------------

/**
 * @param {{ delta: number }} props
 */
export function DeltaBadge({ delta }) {
  if (delta > 0) {
    return (
      <span style={{ color: "#22c55e", fontWeight: 700, display: "flex", alignItems: "center", gap: 2 }}>
        <TrendingUp size={13} />+{delta}
      </span>
    );
  }
  if (delta < 0) {
    return (
      <span style={{ color: "#ef4444", fontWeight: 700, display: "flex", alignItems: "center", gap: 2 }}>
        <TrendingDown size={13} />{delta}
      </span>
    );
  }
  return (
    <span style={{ color: "#94a3b8", fontWeight: 600 }}>
      <Minus size={13} />
    </span>
  );
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

/**
 * @param {{
 *   tabs: Array<{ id: string, label: string, icon?: React.ComponentType }>,
 *   active: string,
 *   onChange: (id: string) => void,
 * }} props
 */
export function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{
      display: "flex", gap: 4,
      background: "var(--tab-bg)",
      borderRadius: 10, padding: 4, marginBottom: 24,
    }}>
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            padding: "7px 16px", borderRadius: 7,
            border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 600,
            background: active === t.id ? "var(--card-bg)" : "transparent",
            color: active === t.id ? "var(--accent)" : "var(--muted)",
            boxShadow: active === t.id ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
            transition: "all 0.18s",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          {t.icon && <t.icon size={14} />}
          {t.label}
        </button>
      ))}
    </div>
  );
}
