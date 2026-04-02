/**
 * @fileoverview Service layer for the GradeChange resource.
 *
 * Each function maps to one FastAPI endpoint.
 * Components and hooks NEVER call apiClient directly — they go through here.
 *
 * Usage:
 *   import { gradeChangeService } from '@/services/gradeChangeService';
 *   const data = await gradeChangeService.getAll({ subject: 'Физика' });
 */

import { apiClient } from "./apiClient";

export const gradeChangeService = {
  /**
   * Fetch a paginated list of raw grade-change records.
   * TODO: Connect to FastAPI endpoint — GET /api/grade-changes
   *
   * @param {import('../types').GradeChangeFilters} [filters]
   * @returns {Promise<import('../types').PaginatedResponse<import('../types').GradeChange>>}
   */
  getAll: (filters = {}) =>
    apiClient.get("/grade-changes", { params: filters }).then((r) => r.data),

  /**
   * Fetch a single record by ID.
   * TODO: Connect to FastAPI endpoint — GET /api/grade-changes/{id}
   *
   * @param {number} id
   * @returns {Promise<import('../types').GradeChange>}
   */
  getById: (id) =>
    apiClient.get(`/grade-changes/${id}`).then((r) => r.data),
};
