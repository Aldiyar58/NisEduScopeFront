/**
 * @fileoverview Domain types for the GradeWatch analytics system.
 * In a TypeScript project these would be `interface` / `type` definitions.
 * Here we use JSDoc @typedef so VS Code still gives you full IntelliSense.
 */

// ---------------------------------------------------------------------------
// Core entity — mirrors the DB model on the FastAPI side
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} GradeChange
 * @property {number}  id              - Unique record identifier
 * @property {string}  author          - Teacher full name (Учитель)
 * @property {string}  changed_at      - ISO-8601 datetime string (Дата/время)
 * @property {AssessmentType} assessment_type - Type of assessment (Тип оценивания)
 * @property {string}  period          - Academic quarter, e.g. "3" (Четверть)
 * @property {string}  subject         - Subject name (Предмет)
 * @property {string}  section         - Subject section/topic (Раздел)
 * @property {string}  classroom       - Class label, e.g. "8А" (Класс)
 * @property {string}  student_name    - Student display name (Ученик)
 * @property {string}  student_iin     - Student national ID (ИИН)
 * @property {number}  score_before    - Score before correction (Балл до)
 * @property {number}  score_after     - Score after correction (Балл после)
 */

/**
 * Allowed values for the assessment_type field.
 * @typedef {"СОР" | "СОЧ" | "Формативное"} AssessmentType
 */

// ---------------------------------------------------------------------------
// Aggregated analytics shapes — produced by aggregation helpers / API
// ---------------------------------------------------------------------------

/**
 * Per-teacher aggregated statistics.
 * @typedef {Object} TeacherStat
 * @property {string} author      - Teacher full name
 * @property {number} changes     - Total number of grade corrections
 * @property {number} totalDelta  - Sum of (score_after - score_before) across all changes
 * @property {number} avgDelta    - Average delta (totalDelta / changes), rounded to 2dp
 * @property {number} ups         - Count of positive corrections
 * @property {number} downs       - Count of negative corrections
 * @property {number} neutral     - Count of zero-delta corrections
 */

/**
 * Per-subject aggregated statistics.
 * @typedef {Object} SubjectStat
 * @property {string}          subject     - Subject name
 * @property {number}          changes     - Total corrections for this subject
 * @property {number}          totalDelta  - Sum of deltas
 * @property {Record<string, number>} sections - Map of section → correction count
 */

/**
 * Per-classroom aggregated statistics.
 * @typedef {Object} ClassroomStat
 * @property {string} classroom - Class label (e.g. "8А")
 * @property {number} changes   - Total corrections in this class
 * @property {number} ups       - Positive corrections
 * @property {number} downs     - Negative corrections
 */

/**
 * Student identified as a repeating / risk case.
 * @typedef {Object} RiskStudent
 * @property {string}   name     - Student display name
 * @property {string}   iin      - Student IIN
 * @property {number}   count    - How many times their grade was changed
 * @property {number[]} changes  - Array of individual deltas
 * @property {number}   avgDelta - Average delta across all changes
 */

/**
 * Single bucket in the delta-magnitude histogram.
 * @typedef {Object} TrendBucket
 * @property {string} label - Bucket label ("+1", "+2", "+3+", "0", "-1", "-2", "-3-")
 * @property {number} count - Number of corrections in this bucket
 */

/**
 * Assessment type distribution slice (for the pie chart).
 * @typedef {Object} AssessmentTypeStat
 * @property {AssessmentType} name  - Assessment type label
 * @property {number}         value - Count of corrections of this type
 */

/**
 * Dashboard-level KPI totals.
 * @typedef {Object} DashboardTotals
 * @property {number} total   - Total grade changes
 * @property {number} ups     - Positive corrections
 * @property {number} downs   - Negative corrections
 * @property {number} neutral - Zero-delta corrections
 */

// ---------------------------------------------------------------------------
// API response wrappers — what the FastAPI endpoints actually return
// ---------------------------------------------------------------------------

/**
 * Generic paginated list response from FastAPI.
 * @template T
 * @typedef {Object} PaginatedResponse
 * @property {T[]}   items  - Page items
 * @property {number} total - Total record count (for pagination)
 * @property {number} page  - Current page number (1-based)
 * @property {number} size  - Page size
 */

/**
 * Query parameters accepted by GET /api/grade-changes.
 * @typedef {Object} GradeChangeFilters
 * @property {string}  [author]          - Filter by teacher name
 * @property {string}  [subject]         - Filter by subject
 * @property {string}  [classroom]       - Filter by classroom
 * @property {AssessmentType} [assessment_type] - Filter by type
 * @property {string}  [period]          - Filter by quarter
 * @property {string}  [date_from]       - ISO date lower bound
 * @property {string}  [date_to]         - ISO date upper bound
 * @property {number}  [page]            - Page number (default 1)
 * @property {number}  [size]            - Page size (default 50)
 */

// ---------------------------------------------------------------------------
// UI-only shapes
// ---------------------------------------------------------------------------

/**
 * Column descriptor for the generic DataTable component.
 * @template TRow
 * @typedef {Object} TableColumn
 * @property {keyof TRow | string} key    - Data key to read from the row object
 * @property {string}              label  - Column header label
 * @property {function(*,TRow):*}  [render] - Optional custom cell renderer
 */

// No runtime exports needed — types are consumed only via JSDoc references.
// In TypeScript you would: export type { GradeChange, TeacherStat, … }
