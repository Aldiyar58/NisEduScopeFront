/**
 * @fileoverview StatsCard — KPI summary card with icon, value, label, and trend badge.
 *
 * Usage:
 *   import { StatsCard } from '@/components/StatsCard';
 *   <StatsCard icon={TrendingUp} label="Повышений" value={42} color="#22c55e" trend={12} />
 */

import { ArrowUpRight, ArrowDownRight } from "lucide-react";

/**
 * @param {{
 *   icon: React.ComponentType<{size?: number, color?: string}>,
 *   label: string,
 *   value: string | number,
 *   sub?: string,
 *   color?: string,
 *   trend?: number,   // percentage — positive = up (green), negative = down (red)
 * }} props
 */
export function StatsCard({ icon: Icon, label, value, sub, color = "#6366f1", trend }) {
  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--border)",
      borderRadius: 16,
      padding: "20px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    }}>
      {/* Icon + trend */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: color + "22",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={20} color={color} />
        </div>

        {trend !== undefined && (
          <span style={{
            fontSize: 12, fontWeight: 600,
            color: trend >= 0 ? "#22c55e" : "#ef4444",
            background: (trend >= 0 ? "#22c55e" : "#ef4444") + "18",
            borderRadius: 99, padding: "2px 8px",
            display: "flex", alignItems: "center", gap: 2,
          }}>
            {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>

      {/* Value */}
      <div style={{
        fontSize: 28, fontWeight: 800, color: "var(--text)",
        fontFamily: "'DM Mono', monospace", letterSpacing: -1,
      }}>
        {value}
      </div>

      {/* Label */}
      <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>{label}</div>

      {/* Sub-label */}
      {sub && (
        <div style={{ fontSize: 11, color: "var(--muted)", opacity: 0.7 }}>{sub}</div>
      )}
    </div>
  );
}
