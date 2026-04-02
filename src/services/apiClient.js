/**
 * @fileoverview Axios instance pre-configured for the GradeWatch FastAPI backend.
 *
 * Every service module imports `apiClient` from here — never calls axios directly.
 * This means you only ever change the base URL, auth header, or interceptors
 * in one place.
 *
 * Usage:
 *   import { apiClient } from '@/services/apiClient';
 *   const data = await apiClient.get('/analytics/teachers');
 */

import axios from "axios";

// ---------------------------------------------------------------------------
// Base URL — set via Vite env variable so it works across environments:
//   .env.development  → VITE_API_BASE_URL=http://localhost:8000
//   .env.production   → VITE_API_BASE_URL=https://api.gradewatch.kz
// ---------------------------------------------------------------------------
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ---------------------------------------------------------------------------
// Request interceptor — attach JWT from localStorage on every outgoing call
// ---------------------------------------------------------------------------
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------------------------------------------------------
// Response interceptor — global error normalisation
// ---------------------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => response,          // pass-through on success
  (error) => {
    if (error.response?.status === 401) {
      // Token expired → clear storage and redirect to login
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    // Re-throw so React Query can catch and surface the error
    return Promise.reject(error);
  }
);
