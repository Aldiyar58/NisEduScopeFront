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

export const analyticsService = {
  /**
   * Per-teacher correction counts, avg delta, up/down ratios.
   * TODO: Connect to FastAPI endpoint — GET /api/analytics/teachers
   *
   * @returns {Promise<import('../types').TeacherStat[]>}
   */
  getTeacherStats: () =>
    apiClient.get("/analytics/teachers").then((r) => r.data),

  /**
   * Per-subject correction counts with section breakdown.
   * TODO: Connect to FastAPI endpoint — GET /api/analytics/subjects
   *
   * @returns {Promise<import('../types').SubjectStat[]>}
   */
  getSubjectStats: () =>
    apiClient.get("/analytics/subjects").then((r) => r.data),

  /**
   * Per-classroom correction counts with up/down split.
   * TODO: Connect to FastAPI endpoint — GET /api/analytics/classrooms
   *
   * @returns {Promise<import('../types').ClassroomStat[]>}
   */
  getClassroomStats: () =>
    apiClient.get("/analytics/classrooms").then((r) => r.data),

  /**
   * Students whose grades were corrected ≥ N times (risk group).
   * TODO: Connect to FastAPI endpoint — GET /api/analytics/risk-students
   *
   * @param {number} [minChanges=2]
   * @returns {Promise<import('../types').RiskStudent[]>}
   */
  getRiskStudents: (minChanges = 2) =>
    apiClient
      .get("/analytics/risk-students", { params: { min_changes: minChanges } })
      .then((r) => r.data),

  /**
   * Delta-magnitude histogram buckets (+1, +2, +3+, 0, -1, -2, -3-).
   * TODO: Connect to FastAPI endpoint — GET /api/analytics/trends
   *
   * @returns {Promise<import('../types').TrendBucket[]>}
   */
  getTrends: () =>
    apiClient.get("/analytics/trends").then((r) => r.data),

  /**
   * Distribution of corrections by assessment_type (СОР / СОЧ / Формативное).
   * TODO: Connect to FastAPI endpoint — GET /api/analytics/assessment-types
   *
   * @returns {Promise<import('../types').AssessmentTypeStat[]>}
   */
  getAssessmentTypeStats: () =>
    apiClient.get("/analytics/assessment-types").then((r) => r.data),

  /**
   * Dashboard-level KPI totals (total / ups / downs / neutral).
   * TODO: Connect to FastAPI endpoint — GET /api/analytics/totals
   *
   * @returns {Promise<import('../types').DashboardTotals>}
   */
  getTotals: () =>
    apiClient.get("/analytics/totals").then((r) => r.data),
};
