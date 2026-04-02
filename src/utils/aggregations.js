/**
 * @fileoverview Pure aggregation functions that operate on raw GradeChange arrays.
 *
 * These run CLIENT-SIDE when the FastAPI aggregation endpoints are not yet available.
 * Once the backend is ready, the hooks will call the service layer instead and
 * these helpers become unit-test fixtures.
 *
 * No React imports — 100 % pure JS, fully testable with Jest / Vitest.
 *
 * Usage:
 *   import { aggregateByTeacher, calculateTrends } from '@/utils/aggregations';
 */

// ---------------------------------------------------------------------------
// Teacher analytics
// ---------------------------------------------------------------------------

/**
 * Aggregate raw changes into per-teacher statistics.
 *
 * @param {import('../types').GradeChange[]} changes
 * @returns {import('../types').TeacherStat[]}
 */
export function aggregateByTeacher(changes) {
  /** @type {Record<string, import('../types').TeacherStat>} */
  const map = {};

  for (const r of changes) {
    if (!map[r.author]) {
      map[r.author] = {
        author: r.author,
        changes: 0,
        totalDelta: 0,
        avgDelta: 0,
        ups: 0,
        downs: 0,
        neutral: 0,
      };
    }
    const delta = r.score_after - r.score_before;
    map[r.author].changes++;
    map[r.author].totalDelta += delta;
    if (delta > 0) map[r.author].ups++;
    else if (delta < 0) map[r.author].downs++;
    else map[r.author].neutral++;
  }

  return Object.values(map)
    .map((t) => ({ ...t, avgDelta: +(t.totalDelta / t.changes).toFixed(2) }))
    .sort((a, b) => b.changes - a.changes);
}

// ---------------------------------------------------------------------------
// Subject analytics
// ---------------------------------------------------------------------------

/**
 * Aggregate raw changes into per-subject statistics.
 *
 * @param {import('../types').GradeChange[]} changes
 * @returns {import('../types').SubjectStat[]}
 */
export function aggregateBySubject(changes) {
  /** @type {Record<string, import('../types').SubjectStat>} */
  const map = {};

  for (const r of changes) {
    if (!map[r.subject]) {
      map[r.subject] = {
        subject: r.subject,
        changes: 0,
        totalDelta: 0,
        sections: {},
      };
    }
    map[r.subject].changes++;
    map[r.subject].totalDelta += r.score_after - r.score_before;
    map[r.subject].sections[r.section] =
      (map[r.subject].sections[r.section] ?? 0) + 1;
  }

  return Object.values(map).sort((a, b) => b.changes - a.changes);
}

// ---------------------------------------------------------------------------
// Classroom analytics
// ---------------------------------------------------------------------------

/**
 * Aggregate raw changes into per-classroom statistics.
 *
 * @param {import('../types').GradeChange[]} changes
 * @returns {import('../types').ClassroomStat[]}
 */
export function aggregateByClassroom(changes) {
  /** @type {Record<string, import('../types').ClassroomStat>} */
  const map = {};

  for (const r of changes) {
    if (!map[r.classroom]) {
      map[r.classroom] = { classroom: r.classroom, changes: 0, ups: 0, downs: 0 };
    }
    const delta = r.score_after - r.score_before;
    map[r.classroom].changes++;
    if (delta > 0) map[r.classroom].ups++;
    else if (delta < 0) map[r.classroom].downs++;
  }

  return Object.values(map).sort((a, b) => b.changes - a.changes);
}

// ---------------------------------------------------------------------------
// Risk student identification
// ---------------------------------------------------------------------------

/**
 * Identify students whose grade was changed more than `minChanges` times.
 *
 * @param {import('../types').GradeChange[]} changes
 * @param {number} [minChanges=2]
 * @returns {import('../types').RiskStudent[]}
 */
export function identifyRiskGroups(changes, minChanges = 2) {
  /** @type {Record<string, import('../types').RiskStudent>} */
  const map = {};

  for (const r of changes) {
    if (!map[r.student_iin]) {
      map[r.student_iin] = {
        name: r.student_name,
        iin: r.student_iin,
        count: 0,
        changes: [],
        avgDelta: 0,
      };
    }
    map[r.student_iin].count++;
    map[r.student_iin].changes.push(r.score_after - r.score_before);
  }

  return Object.values(map)
    .filter((s) => s.count >= minChanges)
    .map((s) => ({
      ...s,
      avgDelta: +(s.changes.reduce((a, b) => a + b, 0) / s.count).toFixed(2),
    }))
    .sort((a, b) => b.count - a.count);
}

// ---------------------------------------------------------------------------
// Delta-magnitude histogram (calculateTrends)
// ---------------------------------------------------------------------------

const BUCKET_KEYS = ["+3+", "+2", "+1", "0", "-1", "-2", "-3-"];

/**
 * Build a delta-magnitude histogram from raw change records.
 *
 * @param {import('../types').GradeChange[]} changes
 * @returns {import('../types').TrendBucket[]}
 */
export function calculateTrends(changes) {
  /** @type {Record<string, number>} */
  const buckets = Object.fromEntries(BUCKET_KEYS.map((k) => [k, 0]));

  for (const r of changes) {
    const d = r.score_after - r.score_before;
    if (d >= 3)       buckets["+3+"]++;
    else if (d === 2) buckets["+2"]++;
    else if (d === 1) buckets["+1"]++;
    else if (d === 0) buckets["0"]++;
    else if (d === -1) buckets["-1"]++;
    else if (d === -2) buckets["-2"]++;
    else               buckets["-3-"]++;
  }

  return BUCKET_KEYS.map((label) => ({ label, count: buckets[label] }));
}

// ---------------------------------------------------------------------------
// Assessment-type distribution
// ---------------------------------------------------------------------------

/**
 * Build a count-by-type slice array for the pie chart.
 *
 * @param {import('../types').GradeChange[]} changes
 * @returns {import('../types').AssessmentTypeStat[]}
 */
export function aggregateByAssessmentType(changes) {
  /** @type {Record<string, number>} */
  const map = {};
  for (const r of changes) {
    map[r.assessment_type] = (map[r.assessment_type] ?? 0) + 1;
  }
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

// ---------------------------------------------------------------------------
// Dashboard KPI totals
// ---------------------------------------------------------------------------

/**
 * Compute top-level KPI totals.
 *
 * @param {import('../types').GradeChange[]} changes
 * @returns {import('../types').DashboardTotals}
 */
export function computeTotals(changes) {
  const ups     = changes.filter((r) => r.score_after > r.score_before).length;
  const downs   = changes.filter((r) => r.score_after < r.score_before).length;
  return { total: changes.length, ups, downs, neutral: changes.length - ups - downs };
}
