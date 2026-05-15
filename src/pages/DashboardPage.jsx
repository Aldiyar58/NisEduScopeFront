/**
 * @fileoverview DashboardPage — top-level page for the GradeWatch analytics dashboard.
 *
 * Responsibilities:
 *  - Manage UI state (active tab, dark mode)
 *  - Pull all analytics data via useAnalytics()
 *  - Compose the layout from section components
 *
 * No data-fetching logic lives here. No styling primitives live here.
 *
 * Usage (in your router):
 *   import { DashboardPage } from '@/pages/DashboardPage';
 *   <Route path="/" element={<DashboardPage />} />
 */

import { useState } from "react";
import {
  TrendingUp, TrendingDown, Users, BookOpen, School, AlertTriangle,
  BarChart2, Filter, RefreshCw, Download, Eye, Moon, Sun,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useAnalytics }      from "../hooks/useAnalytics";
import { StatsCard }         from "../components/StatsCard";
import { DataTable }         from "../components/DataTable";
import { AnalyticsChart, DeltaBadge, Tabs } from "../components/ui";
import {
  TeacherSection,
  SubjectSection,
  ClassroomSection,
  StudentsSection,
  ScaleSection,
} from "../components/sections";
import { PALETTE, THEME }    from "../constants/theme";

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------
const TABS = [
  { id: "overview",    label: "Обзор",     icon: BarChart2 },
  { id: "teachers",    label: "Учителя",   icon: Users     },
  { id: "subjects",    label: "Предметы",  icon: BookOpen  },
  { id: "classrooms",  label: "Классы",    icon: School    },
  { id: "students",    label: "Ученики",   icon: Eye       },
  { id: "scale",       label: "Масштаб",   icon: Filter    },
];

const TOOLTIP_STYLE = {
  background: "var(--card-bg)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

// ---------------------------------------------------------------------------
// DashboardPage
// ---------------------------------------------------------------------------
export function DashboardPage() {
  const [dark, setDark] = useState(false);
  const [tab,  setTab]  = useState("overview");

  const analytics = useAnalytics();

  // Apply CSS variables for theming
  const themeVars = dark ? THEME.dark : THEME.light;

  return (
    <div style={{
      ...themeVars,
      background: "var(--bg)",
      minHeight: "100vh",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "var(--text)",
    }}>
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                               */}
      {/* ------------------------------------------------------------------ */}
      <header style={{
        background: "var(--card-bg)",
        borderBottom: "1px solid var(--border)",
        padding: "0 32px",
        height: 58,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32,
            background: PALETTE.accent,
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <BarChart2 size={17} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.3, color: "var(--text)" }}>
              GradeWatch
            </div>
            <div style={{ fontSize: 10, color: "var(--muted)", marginTop: -2 }}>
              Мониторинг корректировок оценок
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button style={{
            padding: "6px 14px", borderRadius: 8,
            border: "1px solid var(--border)",
            background: "transparent", color: "var(--muted)",
            cursor: "pointer", fontSize: 12,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <Download size={13} /> Экспорт
          </button>
          <button
            onClick={() => setDark((d) => !d)}
            style={{
              width: 36, height: 36, borderRadius: 8,
              border: "1px solid var(--border)",
              background: "transparent",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {dark
              ? <Sun  size={15} color="var(--muted)" />
              : <Moon size={15} color="var(--muted)" />}
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Main content                                                         */}
      {/* ------------------------------------------------------------------ */}
      <main style={{ padding: "28px 32px", maxWidth: 1280, margin: "0 auto" }}>

        {/* KPI cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 28,
        }}>
          <StatsCard
            icon={RefreshCw}
            label="Всего корректировок"
            value={analytics.totals.total}
            color={PALETTE.accent}
          />
          <StatsCard
            icon={TrendingUp}
            label="Повышений оценок"
            value={analytics.totals.ups}
            color={PALETTE.up}
            trend={analytics.totals.total
              ? Math.round((analytics.totals.ups / analytics.totals.total) * 100)
              : 0}
          />
          <StatsCard
            icon={TrendingDown}
            label="Понижений оценок"
            value={analytics.totals.downs}
            color={PALETTE.down}
            trend={analytics.totals.total
              ? -Math.round((analytics.totals.downs / analytics.totals.total) * 100)
              : 0}
          />
          <StatsCard
            icon={AlertTriangle}
            label="Группа риска (ученики)"
            value={analytics.riskStudents.length}
            color={PALETTE.warn}
            sub="Оценки менялись ≥2 раз"
          />
        </div>

        {/* Tab bar */}
        <Tabs tabs={TABS} active={tab} onChange={setTab} />

        {/* Tab panels */}
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Charts row */}
            <ScaleSection
              trends={analytics.trends}
              assessmentTypeStats={analytics.assessmentTypeStats}
            />

            {/* Quick top-N charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <AnalyticsChart title="Топ учителей по правкам">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[...analytics.teacherStats].sort((a, b) => b.changes - a.changes).slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="author" tick={{ fontSize: 10, fill: "var(--muted)" }} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Bar dataKey="changes" fill={PALETTE.accent} radius={[4, 4, 0, 0]} name="Правок" />
                  </BarChart>
                </ResponsiveContainer>
              </AnalyticsChart>

              <AnalyticsChart title="Топ предметов">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[...analytics.subjectStats].sort((a, b) => b.changes - a.changes).slice(0, 5)} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted)" }} />
                    <YAxis dataKey="subject" type="category" tick={{ fontSize: 11, fill: "var(--muted)" }} width={80} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Bar dataKey="changes" fill={PALETTE.warn} radius={[0, 4, 4, 0]} name="Правок" />
                  </BarChart>
                </ResponsiveContainer>
              </AnalyticsChart>
            </div>

            {/* Recent changes table */}
            <AnalyticsChart title="Последние корректировки">
              <DataTable
                columns={[
                  {
                    key: "changed_at", label: "Дата",
                    render: (v) => new Date(v).toLocaleString("ru-KZ", { dateStyle: "short", timeStyle: "short" }),
                  },
                  { key: "author",          label: "Учитель"  },
                  { key: "student_name",    label: "Ученик"   },
                  { key: "subject",         label: "Предмет"  },
                  { key: "assessment_type", label: "Тип"      },
                  { key: "classroom",       label: "Класс"    },
                  {
                    key: "score_before", label: "Δ Балл",
                    render: (v, row) => {
                      const d = row.score_after - row.score_before;
                      return (
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ color: "var(--muted)", fontSize: 11 }}>{v}→{row.score_after}</span>
                          <DeltaBadge delta={d} />
                        </span>
                      );
                    },
                  },
                ]}
                rows={
                  [...analytics.rawData]
                    .sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at))
                    .slice(0, 8)
                }
              />
            </AnalyticsChart>
          </div>
        )}

        {tab === "teachers"   && <TeacherSection   teacherStats={analytics.teacherStats} />}
        {tab === "subjects"   && <SubjectSection   subjectStats={analytics.subjectStats} />}
        {tab === "classrooms" && <ClassroomSection classroomStats={analytics.classroomStats} />}
        {tab === "students"   && <StudentsSection   riskStudents={analytics.riskStudents} />}
        {tab === "scale"      && (
          <ScaleSection
            trends={analytics.trends}
            assessmentTypeStats={analytics.assessmentTypeStats}
          />
        )}
      </main>
    </div>
  );
}
