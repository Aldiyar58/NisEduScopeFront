/**
 * @fileoverview React Query hook for fetching raw GradeChange records.
 *
 * While the FastAPI backend is unavailable it returns MOCK_GRADE_CHANGES.
 * Once the backend is live, delete the try/catch fallback and let the
 * service call run directly.
 *
 * Usage:
 *   import { useGradeChanges } from '@/hooks/useGradeChanges';
 *   const { data, isLoading, isError } = useGradeChanges({ subject: 'Физика' });
 */

import { useQuery } from "@tanstack/react-query";
import { gradeChangeService } from "../services/gradeChangeService";
import { MOCK_GRADE_CHANGES } from "../constants/mockData";

/**
 * @param {import('../types').GradeChangeFilters} [filters]
 */
export function useGradeChanges(filters = {}) {
  return useQuery({
    queryKey: ["gradeChanges", filters],

    queryFn: async () => {
      try {
        // Просто вызываем сервис и возвращаем результат
        const data = await gradeChangeService.getAll(filters);

        // Если сервис вернул что-то (даже пустой массив), возвращаем это
        return data;
      } catch (error) {
        // Если сервер упал (500) или не найден (404), показываем старые моки
        console.warn("[useGradeChanges] Ошибка API, откат к мокам:", error);
        return MOCK_GRADE_CHANGES; // Твоя переменная с тестовыми данными
      }
    },

    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
// export function useGradeChanges(filters = {}) {
//   return useQuery({
//     queryKey: ["gradeChanges", filters],
//     queryFn: () => {
//       // Прямой возврат данных без всяких проверок сервиса
//       console.log("Force using MOCK_GRADE_CHANGES");
//       return MOCK_GRADE_CHANGES;
//     },
//     staleTime: Infinity,
//   });
// }
