/**
 * @fileoverview Analytics section components — one per dashboard tab.
 *
 * Each component receives pre-aggregated data as props and is responsible
 * only for rendering. No data fetching happens here.
 *
 * Exports:
 *  - TeacherSection
 *  - SubjectSection
 *  - ClassroomSection
 *  - StudentsSection
 *  - ScaleSection
 *
 * Usage:
 *   import { TeacherSection } from '@/components/sections';
 *   <TeacherSection teacherStats={analytics.teacherStats} />
 */

import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import { AlertTriangle } from "lucide-react";
import { AnalyticsChart, DeltaBadge } from "./ui";
import { DataTable } from "./DataTable";
import { PALETTE } from "../constants/theme";

// Recharts tooltip style — consistent across all charts
const TOOLTIP_STYLE = {
  background: "var(--card-bg)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

// ---------------------------------------------------------------------------
// TeacherSection
// ---------------------------------------------------------------------------

/**
 * @param {{ teacherStats: import('../types').TeacherStat[] }} props
 */
export function TeacherSection({ teacherStats }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <AnalyticsChart title="Учителя — среднее изменение баллов">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={teacherStats} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="author" tick={{ fontSize: 11, fill: "var(--muted)" }} />
            <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="avgDelta" fill={PALETTE.accent} radius={[4, 4, 0, 0]} name="Ср. изменение" />
          </BarChart>
        </ResponsiveContainer>
      </AnalyticsChart>

      <AnalyticsChart title="Детальная таблица по учителям">
        <DataTable
          searchable
          columns={[
            { key: "author",  label: "Учитель" },
            { key: "changes", label: "Кол-во правок" },
            { key: "avgDelta", label: "Ср. Δ", render: (v) => <DeltaBadge delta={v} /> },
            { key: "ups",   label: "↑ Повышений", render: (v) => <span style={{ color: PALETTE.up,   fontWeight: 700 }}>{v}</span> },
            { key: "downs", label: "↓ Понижений", render: (v) => <span style={{ color: PALETTE.down, fontWeight: 700 }}>{v}</span> },
            { key: "neutral", label: "= Без изм.", render: (v) => <span style={{ color: PALETTE.neutral }}>{v}</span> },
          ]}
          rows={teacherStats}
        />
      </AnalyticsChart>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SubjectSection
// ---------------------------------------------------------------------------

/**
 * @param {{ subjectStats: import('../types').SubjectStat[] }} props
 */
export function SubjectSection({ subjectStats }) {
  const sectionData = useMemo(() => {
    const map = {};
    subjectStats.forEach((s) => {
      Object.entries(s.sections).forEach(([sec, cnt]) => {
        map[sec] = (map[sec] ?? 0) + cnt;
      });
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [subjectStats]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <AnalyticsChart title="Предметы — частота правок">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={subjectStats} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted)" }} />
              <YAxis dataKey="subject" type="category" tick={{ fontSize: 11, fill: "var(--muted)" }} width={90} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="changes" fill={PALETTE.accentSoft} radius={[0, 4, 4, 0]} name="Правок" />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsChart>

        <AnalyticsChart title="Разделы — распределение правок">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--muted)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="value" fill={PALETTE.warn} radius={[4, 4, 0, 0]} name="Правок" />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsChart>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ClassroomSection
// ---------------------------------------------------------------------------

/**
 * @param {{ classroomStats: import('../types').ClassroomStat[] }} props
 */
export function ClassroomSection({ classroomStats }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <AnalyticsChart title="Классы — кол-во корректировок">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={classroomStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="classroom" tick={{ fontSize: 12, fill: "var(--muted)" }} />
            <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend />
            <Bar dataKey="ups"   fill={PALETTE.up}   radius={[4, 4, 0, 0]} name="Повышений" stackId="a" />
            <Bar dataKey="downs" fill={PALETTE.down}  radius={[4, 4, 0, 0]} name="Понижений" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </AnalyticsChart>

      <AnalyticsChart title="Таблица по классам">
        <DataTable
          columns={[
            { key: "classroom", label: "Класс" },
            { key: "changes",   label: "Всего правок" },
            { key: "ups",   label: "↑ Повышений", render: (v) => <span style={{ color: PALETTE.up,   fontWeight: 700 }}>{v}</span> },
            { key: "downs", label: "↓ Понижений", render: (v) => <span style={{ color: PALETTE.down, fontWeight: 700 }}>{v}</span> },
            {
              key: "ups", label: "Соотношение",
              render: (_, row) => {
                const ratio = row.changes > 0 ? Math.round((row.ups / row.changes) * 100) : 0;
                return (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ flex: 1, height: 6, borderRadius: 99, background: "var(--border)" }}>
                      <div style={{ width: `${ratio}%`, height: "100%", background: PALETTE.up, borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: 11, color: "var(--muted)", minWidth: 32 }}>{ratio}%↑</span>
                  </div>
                );
              },
            },
          ]}
          rows={classroomStats}
        />
      </AnalyticsChart>
    </div>
  );
}

// ---------------------------------------------------------------------------
// StudentsSection
// ---------------------------------------------------------------------------

/**
 * @param {{ riskStudents: import('../types').RiskStudent[] }} props
 */
export function StudentsSection({ riskStudents }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{
        background: PALETTE.warn + "18",
        border: `1px solid ${PALETTE.warn}44`,
        borderRadius: 12, padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 10,
        color: PALETTE.warn, fontSize: 13,
      }}>
        <AlertTriangle size={16} />
        <span>
          Повторяющиеся кейсы — ученики, чьи оценки корректировались 2 и более раз.
          Требуют дополнительного внимания.
        </span>
      </div>

      <AnalyticsChart title="Группа риска — частые изменения оценок">
        <DataTable
          searchable
          columns={[
            { key: "name", label: "Ученик" },
            { key: "iin",  label: "ИИН", render: (v) => <code style={{ fontSize: 11, color: "var(--muted)" }}>{v}</code> },
            {
              key: "count", label: "Кол-во правок",
              render: (v) => (
                <span style={{
                  background: v >= 3 ? PALETTE.down + "22" : PALETTE.warn + "22",
                  color: v >= 3 ? PALETTE.down : PALETTE.warn,
                  fontWeight: 700, borderRadius: 6, padding: "2px 8px",
                }}>
                  {v}
                </span>
              ),
            },
            { key: "avgDelta", label: "Ср. Δ", render: (v) => <DeltaBadge delta={v} /> },
          ]}
          rows={riskStudents}
        />
      </AnalyticsChart>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ScaleSection
// ---------------------------------------------------------------------------

/**
 * @param {{
 *   trends: import('../types').TrendBucket[],
 *   assessmentTypeStats: import('../types').AssessmentTypeStat[],
 * }} props
 */
export function ScaleSection({ trends, assessmentTypeStats }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <AnalyticsChart title="Гистограмма — масштаб изменений">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--muted)" }} />
            <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Правок">
              {trends.map((entry, i) => (
                <Cell
                  key={i}
                  fill={
                    entry.label.startsWith("+") ? PALETTE.up
                    : entry.label.startsWith("-") ? PALETTE.down
                    : PALETTE.neutral
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </AnalyticsChart>

      <AnalyticsChart title="Тип оценивания — доля правок">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={assessmentTypeStats}
              cx="50%" cy="50%"
              innerRadius={55} outerRadius={90}
              dataKey="value" nameKey="name"
              paddingAngle={3}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={{ stroke: "var(--muted)", strokeWidth: 1 }}
            >
              {assessmentTypeStats.map((_, i) => (
                <Cell key={i} fill={PALETTE.pie[i % PALETTE.pie.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} />
          </PieChart>
        </ResponsiveContainer>
      </AnalyticsChart>
    </div>
  );
}
