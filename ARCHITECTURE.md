# GradeWatch — Architecture Reference

## File Tree

```
src/
├── App.jsx                          ← Root: QueryClientProvider + DashboardPage
│
├── types/
│   └── index.js                     ← JSDoc @typedef for ALL domain types
│                                      GradeChange, TeacherStat, RiskStudent …
│
├── constants/
│   ├── theme.js                     ← PALETTE colours + THEME CSS-variable maps
│   └── mockData.js                  ← MOCK_GRADE_CHANGES (delete when API is live)
│
├── services/                        ← HTTP layer — never used directly in UI
│   ├── apiClient.js                 ← Axios instance, base URL, auth interceptor
│   ├── gradeChangeService.js        ← GET /api/grade-changes  (raw records)
│   └── analyticsService.js         ← GET /api/analytics/*    (aggregated)
│
├── utils/
│   └── aggregations.js             ← Pure JS aggregation functions (no React)
│                                      aggregateByTeacher, calculateTrends …
│
├── hooks/
│   ├── useGradeChanges.js          ← React Query hook for raw records
│   └── useAnalytics.js             ← Master hook: server → fallback → UI
│
├── components/
│   ├── StatsCard.jsx               ← KPI card  (icon / value / trend badge)
│   ├── DataTable.jsx               ← Sortable + searchable generic table
│   ├── ui.jsx                      ← AnalyticsChart, DeltaBadge, Tabs
│   └── sections.jsx                ← TeacherSection, SubjectSection,
│                                      ClassroomSection, StudentsSection,
│                                      ScaleSection
│
└── pages/
    └── DashboardPage.jsx           ← Composes everything; owns tab + theme state
```

## Import Map (who imports whom)

```
App.jsx
  └── pages/DashboardPage.jsx
        ├── hooks/useAnalytics.js
        │     ├── hooks/useGradeChanges.js
        │     │     ├── services/gradeChangeService.js
        │     │     │     └── services/apiClient.js
        │     │     └── constants/mockData.js  (fallback)
        │     ├── services/analyticsService.js
        │     │     └── services/apiClient.js
        │     └── utils/aggregations.js        (fallback)
        │
        ├── components/StatsCard.jsx
        ├── components/DataTable.jsx
        ├── components/ui.jsx
        │     └── constants/theme.js  (PALETTE)
        ├── components/sections.jsx
        │     ├── components/ui.jsx
        │     ├── components/DataTable.jsx
        │     └── constants/theme.js
        └── constants/theme.js
```

## Data Flow

```
FastAPI  ──────►  analyticsService  ──►  useAnalytics  ──►  DashboardPage
  │ (fails)               │ (fallback)          │
  ▼                       ▼                     ▼
gradeChangeService  ─►  useGradeChanges  ─►  aggregations.js
  │ (fails)
  ▼
MOCK_GRADE_CHANGES
```

## Connecting a FastAPI Endpoint (checklist)

1. Open `src/services/analyticsService.js`
2. Find the matching function (e.g. `getTeacherStats`)
3. Remove the `// TODO` comment
4. Verify the response shape matches the `@typedef` in `src/types/index.js`
5. Delete the `try/catch` fallback block in the corresponding `useAnalytics`
   `useWithFallback` call once you're confident the endpoint is stable.

## Environment Variables (`.env`)

```
VITE_API_BASE_URL=http://localhost:8000   # development
VITE_API_BASE_URL=https://api.domain.kz  # production
```

## Install

```bash
npm install @tanstack/react-query axios recharts lucide-react
```
