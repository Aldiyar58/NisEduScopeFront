/**
 * @fileoverview DataTable — generic sortable + searchable table component.
 *
 * Usage:
 *   import { DataTable } from '@/components/DataTable';
 *
 *   const columns = [
 *     { key: 'author', label: 'Учитель' },
 *     { key: 'changes', label: 'Правок' },
 *     { key: 'avgDelta', label: 'Ср. Δ', render: (v) => <DeltaBadge delta={v} /> },
 *   ];
 *   <DataTable columns={columns} rows={teacherStats} searchable />
 */

import { useState, useMemo } from "react";
import { Search, ChevronUp, ChevronDown } from "lucide-react";

/**
 * @template TRow
 * @param {{
 *   columns: import('../types').TableColumn<TRow>[],
 *   rows: TRow[],
 *   searchable?: boolean,
 * }} props
 */
export function DataTable({ columns, rows, searchable = false }) {
  const [search,  setSearch]  = useState("");
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const filtered = useMemo(() => {
    let result = rows;

    // Search across all column values
    if (searchable && search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        columns.some((c) => String(row[c.key] ?? "").toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortCol) {
      result = [...result].sort((a, b) => {
        const av = a[sortCol], bv = b[sortCol];
        const cmp = av > bv ? 1 : av < bv ? -1 : 0;
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [rows, search, sortCol, sortDir, columns, searchable]);

  const handleSort = (colKey) => {
    if (sortCol === colKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(colKey); setSortDir("asc"); }
  };

  return (
    <div>
      {/* Search bar */}
      {searchable && (
        <div style={{ marginBottom: 12, position: "relative" }}>
          <Search size={14} style={{
            position: "absolute", left: 10, top: "50%",
            transform: "translateY(-50%)", color: "var(--muted)",
          }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск..."
            style={{
              width: "100%", padding: "8px 12px 8px 32px",
              borderRadius: 8, border: "1px solid var(--border)",
              background: "var(--input-bg)", color: "var(--text)",
              fontSize: 13, outline: "none", boxSizing: "border-box",
            }}
          />
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--border)" }}>
              {columns.map((c) => (
                <th
                  key={c.key}
                  onClick={() => handleSort(c.key)}
                  style={{
                    textAlign: "left", padding: "10px 12px",
                    color: "var(--muted)", fontWeight: 600,
                    cursor: "pointer", userSelect: "none",
                    whiteSpace: "nowrap", fontSize: 12, letterSpacing: 0.5,
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {c.label}
                    {sortCol === c.key
                      ? sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      : null}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((row, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: "1px solid var(--border)",
                  background: i % 2 === 0 ? "transparent" : "var(--row-alt)",
                }}
              >
                {columns.map((c) => (
                  <td key={c.key} style={{ padding: "10px 12px", color: "var(--text)" }}>
                    {c.render ? c.render(row[c.key], row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 32, color: "var(--muted)" }}>
            Нет данных
          </div>
        )}
      </div>
    </div>
  );
}
