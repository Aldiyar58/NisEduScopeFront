/**
 * @fileoverview Service layer for the GradeChange resource.
 * Подключено к FastAPI: GET /api/grade-changes
 */

import { apiClient } from "./apiClient";

export const gradeChangeService = {
  getAll: (filters = {}) => {
    // ОБЯЗАТЕЛЬНО возвращаем результат вызова (return)
    return apiClient
      .get("/grade-changes", { params: filters })
      .then((r) => {
        // Распаковываем "items", если они есть, иначе берем весь ответ
        // Если вообще ничего нет — отдаем пустой массив []
        return r.data.items || r.data || [];
      });
  },

  getById: (id) => {
    return apiClient.get(`/grade-changes/${id}`).then((r) => r.data);
  },
};