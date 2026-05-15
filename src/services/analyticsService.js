/**
 * @fileoverview Service layer for pre-aggregated analytics endpoints.
 *
 * These endpoints are expected to return server-side aggregations from FastAPI
 * (backed by SQL GROUP BY / window functions) rather than raw records.
 * If the backend isn't ready yet the hooks fall back to client-side aggregation.
 *
 * Usage:
 *   import { analyticsService } from '@/services/analyticsService';
 *   const stats = await analyticsService.getTeacherStats();
 */

import { apiClient } from "./apiClient";

/**
 * Приводит ответ GET /analytics/assessment-types к виду { name, value }[],
 * который ожидают Recharts Pie и aggregateByAssessmentType на клиенте.
 *
 * Бэкенд часто отдаёт assessment_type + count; без маппинга dataKey="value" даёт undefined.
 *
 * @param {unknown} payload
 * @returns {import('../types').AssessmentTypeStat[]}
 */
export function normalizeAssessmentTypeStats(payload) {
  if (payload == null) return [];
  const raw = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.items)
      ? payload.items
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

  return raw
    .map((row) => {
      if (row == null || typeof row !== "object") return null;
      const name =
        row.name ??
        row.assessment_type ??
        row.type ??
        row.label ??
        "";
      const n = Number(
        row.value ?? row.count ?? row.changes ?? row.total ?? 0,
      );
      return { name: String(name), value: Number.isFinite(n) ? n : 0 };
    })
    .filter((row) => row && row.name.length > 0);
}

export const analyticsService = {
  /**
   * Статистика по учителям (GET /api/analytics/teachers)
   */
  getTeacherStats: () =>
    apiClient.get("/analytics/teachers").then((r) => r.data),

  /**
   * Статистика по предметам (GET /api/analytics/subjects)
   */
  getSubjectStats: () =>
    apiClient.get("/analytics/subjects").then((r) => r.data),

  /**
   * Статистика по классам (GET /api/analytics/classrooms)
   */
  getClassroomStats: () =>
    apiClient.get("/analytics/classrooms").then((r) => r.data),

  /**
   * Группы риска: ученики с частыми изменениями (GET /api/analytics/risk-students)
   */
  getRiskStudents: (minChanges = 2) =>
    apiClient
      .get("/analytics/risk-students", { params: { min_changes: minChanges } })
      .then((r) => r.data),

  /**
   * Тренды: гистограмма изменений (GET /api/analytics/trends)
   */
  getTrends: () =>
    apiClient.get("/analytics/trends").then((r) => r.data),

  /**
   * Типы оценивания (СОР/СОЧ) - Добавь этот эндпоинт в FastAPI, если он нужен
   */
  getAssessmentTypeStats: () =>
    apiClient
      .get("/analytics/assessment-types")
      .then((r) => normalizeAssessmentTypeStats(r.data)),

  /**
   * Общие KPI для карточек (GET /api/analytics/totals)
   */
  getTotals: () =>
    apiClient.get("/analytics/totals").then((r) => r.data),
};

// export const analyticsService = {
//   /**
//    * Per-teacher correction counts, avg delta, up/down ratios.
//    * TODO: Connect to FastAPI endpoint — GET /api/analytics/teachers
//    *
//    * @returns {Promise<import('../types').TeacherStat[]>}
//    */
//   getTeacherStats: () =>
//     apiClient.get("/analytics/teachers").then((r) => r.data),
//
//   /**
//    * Per-subject correction counts with section breakdown.
//    * TODO: Connect to FastAPI endpoint — GET /api/analytics/subjects
//    *
//    * @returns {Promise<import('../types').SubjectStat[]>}
//    */
//   getSubjectStats: () =>
//     apiClient.get("/analytics/subjects").then((r) => r.data),
//
//   /**
//    * Per-classroom correction counts with up/down split.
//    * TODO: Connect to FastAPI endpoint — GET /api/analytics/classrooms
//    *
//    * @returns {Promise<import('../types').ClassroomStat[]>}
//    */
//   getClassroomStats: () =>
//     apiClient.get("/analytics/classrooms").then((r) => r.data),
//
//   /**
//    * Students whose grades were corrected ≥ N times (risk group).
//    * TODO: Connect to FastAPI endpoint — GET /api/analytics/risk-students
//    *
//    * @param {number} [minChanges=2]
//    * @returns {Promise<import('../types').RiskStudent[]>}
//    */
//   getRiskStudents: (minChanges = 2) =>
//     apiClient
//       .get("/analytics/risk-students", { params: { min_changes: minChanges } })
//       .then((r) => r.data),
//
//   /**
//    * Delta-magnitude histogram buckets (+1, +2, +3+, 0, -1, -2, -3-).
//    * TODO: Connect to FastAPI endpoint — GET /api/analytics/trends
//    *
//    * @returns {Promise<import('../types').TrendBucket[]>}
//    */
//   getTrends: () =>
//     apiClient.get("/analytics/trends").then((r) => r.data),
//
//   /**
//    * Distribution of corrections by assessment_type (СОР / СОЧ / Формативное).
//    * TODO: Connect to FastAPI endpoint — GET /api/analytics/assessment-types
//    *
//    * @returns {Promise<import('../types').AssessmentTypeStat[]>}
//    */
//   getAssessmentTypeStats: () =>
//     apiClient.get("/analytics/assessment-types").then((r) => r.data),
//
//   /**
//    * Dashboard-level KPI totals (total / ups / downs / neutral).
//    * TODO: Connect to FastAPI endpoint — GET /api/analytics/totals
//    *
//    * @returns {Promise<import('../types').DashboardTotals>}
//    */
//   getTotals: () =>
//     apiClient.get("/analytics/totals").then((r) => r.data),
// };
