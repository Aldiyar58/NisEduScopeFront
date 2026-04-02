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
// export function useGradeChanges(filters = {}) {
//   return useQuery({
//     // Re-fetch whenever filters change
//     queryKey: ["gradeChanges", filters],
//
//     // queryFn: async () => {
//     //   // TODO: Remove try/catch once FastAPI is live — use service directly
//     //   try {
//     //     const response = await gradeChangeService.getAll(filters);
//     //     return response.items; // unwrap paginated envelope
//     //   } catch {
//     //     // Fallback to mock data during development
//     //     console.warn("[useGradeChanges] API unavailable — using mock data");
//     //     return MOCK_GRADE_CHANGES;
//     //   }
//     // },
//     queryFn: () => {
//       console.log("Загружаем мок-данные...");
//       return MOCK_GRADE_CHANGES;
//     },
//
//     staleTime: 60_000,      // treat data as fresh for 1 minute
//     refetchOnWindowFocus: false,
//   });
// }
export function useGradeChanges(filters = {}) {
  return useQuery({
    queryKey: ["gradeChanges", filters],
    queryFn: () => {
      // Прямой возврат данных без всяких проверок сервиса
      console.log("Force using MOCK_GRADE_CHANGES");
      return MOCK_GRADE_CHANGES;
    },
    staleTime: Infinity,
  });
}
