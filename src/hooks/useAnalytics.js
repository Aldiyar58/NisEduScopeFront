/**
 * @fileoverview Master analytics hook.
 *
 * Tries each FastAPI analytics endpoint first.
 * Falls back to client-side aggregation over raw data if the endpoint fails.
 *
 * The Dashboard page imports ONLY this hook — it doesn't know whether
 * the data came from the server or was computed locally.
 *
 * Usage:
 *   import { useAnalytics } from '@/hooks/useAnalytics';
 *   const { teacherStats, riskStudents, isLoading } = useAnalytics();
 */

import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "../services/analyticsService";
import { useGradeChanges } from "./useGradeChanges";
import {
  aggregateByTeacher,
  aggregateBySubject,
  aggregateByClassroom,
  identifyRiskGroups,
  calculateTrends,
  aggregateByAssessmentType,
  computeTotals,
} from "../utils/aggregations";

// ---------------------------------------------------------------------------
// Small helper — wraps a server query with a client-side fallback
// ---------------------------------------------------------------------------

/**
 * @template T
 * @param {string[]}       queryKey
 * @param {() => Promise<T>} serverFn   - Calls the FastAPI analytics endpoint
 * @param {() => T}          clientFn   - Client-side aggregation fallback
 * @returns {import('@tanstack/react-query').UseQueryResult<T>}
 */
function useWithFallback(queryKey, serverFn, clientFn) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      // TODO: Remove try/catch once FastAPI analytics endpoints are live
      try {
        return await serverFn();
      } catch {
        console.warn(`[useAnalytics] ${queryKey[0]} — falling back to client-side aggregation`);
        return clientFn();
      }
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

// ---------------------------------------------------------------------------
// Public hook
// ---------------------------------------------------------------------------

export function useAnalytics() {
  // Raw records — used as the fallback data source for all aggregations
  const { data: rawData = [] } = useGradeChanges();

  // -- Teacher stats --
  // TODO: Connect to FastAPI endpoint: GET /api/analytics/teachers
  const teacherQuery = useWithFallback(
    ["analytics", "teachers", rawData],
    () => analyticsService.getTeacherStats(),
    () => aggregateByTeacher(rawData)
  );

  // -- Subject stats --
  // TODO: Connect to FastAPI endpoint: GET /api/analytics/subjects
  const subjectQuery = useWithFallback(
    ["analytics", "subjects", rawData],
    () => analyticsService.getSubjectStats(),
    () => aggregateBySubject(rawData)
  );

  // -- Classroom stats --
  // TODO: Connect to FastAPI endpoint: GET /api/analytics/classrooms
  const classroomQuery = useWithFallback(
    ["analytics", "classrooms", rawData],
    () => analyticsService.getClassroomStats(),
    () => aggregateByClassroom(rawData)
  );

  // -- Risk students --
  // TODO: Connect to FastAPI endpoint: GET /api/analytics/risk-students
  const riskQuery = useWithFallback(
    ["analytics", "risk-students", rawData],
    () => analyticsService.getRiskStudents(),
    () => identifyRiskGroups(rawData)
  );

  // -- Trends histogram --
  // TODO: Connect to FastAPI endpoint: GET /api/analytics/trends
  const trendsQuery = useWithFallback(
    ["analytics", "trends", rawData],
    () => analyticsService.getTrends(),
    () => calculateTrends(rawData)
  );

  // -- Assessment-type distribution --
  // TODO: Connect to FastAPI endpoint: GET /api/analytics/assessment-types
  const assessmentQuery = useWithFallback(
    ["analytics", "assessment-types", rawData],
    () => analyticsService.getAssessmentTypeStats(),
    () => aggregateByAssessmentType(rawData)
  );

  // -- KPI totals --
  // TODO: Connect to FastAPI endpoint: GET /api/analytics/totals
  const totalsQuery = useWithFallback(
    ["analytics", "totals", rawData],
    () => analyticsService.getTotals(),
    () => computeTotals(rawData)
  );

  // ---------------------------------------------------------------------------
  // Combine loading / error states
  // ---------------------------------------------------------------------------
  const queries = [teacherQuery, subjectQuery, classroomQuery, riskQuery, trendsQuery, assessmentQuery, totalsQuery];
  const isLoading = queries.some((q) => q.isLoading);
  const isError   = queries.some((q) => q.isError);

  return {
    // Raw data (for the "recent changes" table on the overview tab)
    rawData,

    // Aggregated slices
    teacherStats:       teacherQuery.data    ?? [],
    subjectStats:       subjectQuery.data    ?? [],
    classroomStats:     classroomQuery.data  ?? [],
    riskStudents:       riskQuery.data       ?? [],
    trends:             trendsQuery.data     ?? [],
    assessmentTypeStats:assessmentQuery.data ?? [],
    totals:             totalsQuery.data     ?? { total: 0, ups: 0, downs: 0, neutral: 0 },

    // Meta
    isLoading,
    isError,
  };
}
