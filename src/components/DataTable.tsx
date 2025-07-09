"use client";

import React, { useState, useRef, useEffect } from "react";

interface Column<T> {
  key: keyof T;
  label: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

const MIN_WIDTH = 80;
const MAX_WIDTH = 600;
const STORAGE_KEY_WIDTHS = "datatable_colwidths";
const STORAGE_KEY_ORDER = "datatable_colorder";

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T>(
    columns[0]?.key || ({} as keyof T)
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [colWidths, setColWidths] = useState<number[]>(
    Array(columns.length).fill(160)
  );
  const [colOrder, setColOrder] = useState<number[]>(
    Array.from({ length: columns.length }, (_, i) => i)
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const settingsBtnRef = useRef<HTMLButtonElement>(null);
  const resizingCol = useRef<number | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);
  const dragCol = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingWidth = useRef<number | null>(null);

  // Handle client-side initialization to prevent hydration issues
  useEffect(() => {
    setIsClient(true);

    // Load saved column widths
    const savedWidths = localStorage.getItem(STORAGE_KEY_WIDTHS);
    if (savedWidths) {
      try {
        const parsed = JSON.parse(savedWidths);
        if (Array.isArray(parsed) && parsed.length === columns.length) {
          setColWidths(parsed);
        }
      } catch {}
    }

    // Load saved column order
    const savedOrder = localStorage.getItem(STORAGE_KEY_ORDER);
    if (savedOrder) {
      try {
        const parsed = JSON.parse(savedOrder);
        if (Array.isArray(parsed) && parsed.length === columns.length) {
          setColOrder(parsed);
        }
      } catch {}
    }
  }, [columns.length]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        settingsBtnRef.current &&
        !settingsBtnRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Save column widths to localStorage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem(STORAGE_KEY_WIDTHS, JSON.stringify(colWidths));
    }
  }, [colWidths, isClient]);

  // Save column order to localStorage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem(STORAGE_KEY_ORDER, JSON.stringify(colOrder));
    }
  }, [colOrder, isClient]);

  function sortData(data: T[], sortKey: keyof T, direction: "asc" | "desc") {
    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      // Handle different data types
      if (typeof aVal === "string" && typeof bVal === "string") {
        return direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      if (
        aVal &&
        bVal &&
        typeof aVal === "object" &&
        typeof bVal === "object" &&
        "getTime" in aVal &&
        "getTime" in bVal
      ) {
        return direction === "asc"
          ? (aVal as Date).getTime() - (bVal as Date).getTime()
          : (bVal as Date).getTime() - (aVal as Date).getTime();
      }

      // Fallback to string comparison
      const aStr = String(aVal || "");
      const bStr = String(bVal || "");
      return direction === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
    return sorted;
  }

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Column drag and drop handlers
  const onDragStart = (idx: number, e: React.DragEvent) => {
    if (resizingCol.current !== null) {
      e.preventDefault();
      return;
    }
    dragCol.current = idx;
  };

  const onDragOver = (idx: number, e: React.DragEvent) => {
    if (resizingCol.current !== null) return;
    e.preventDefault();
  };

  const onDrop = (idx: number) => {
    if (resizingCol.current !== null) return;
    const from = dragCol.current;
    if (from === null || from === idx) return;
    setColOrder((order) => {
      const newOrder = [...order];
      const [removed] = newOrder.splice(from, 1);
      newOrder.splice(idx, 0, removed);
      return newOrder;
    });
    dragCol.current = null;
  };

  // Column resize handlers
  const onResizeMouseDown = (e: React.MouseEvent, colIdx: number) => {
    resizingCol.current = colIdx;
    setIsResizing(true);
    startX.current = e.clientX;
    startWidth.current = colWidths[colIdx];
    document.addEventListener("mousemove", onResizeMouseMove);
    document.addEventListener("mouseup", onResizeMouseUp);
    e.stopPropagation();
  };

  const onResizeMouseMove = (e: MouseEvent) => {
    if (resizingCol.current === null) return;
    const delta = e.clientX - startX.current;
    let newWidth = startWidth.current + delta;
    newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
    pendingWidth.current = newWidth;

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        setColWidths((widths) => {
          const newWidths = [...widths];
          if (resizingCol.current !== null && pendingWidth.current !== null) {
            newWidths[resizingCol.current] = pendingWidth.current;
          }
          return newWidths;
        });
        rafRef.current = null;
      });
    }
  };

  const onResizeMouseUp = () => {
    resizingCol.current = null;
    setIsResizing(false);
    document.removeEventListener("mousemove", onResizeMouseMove);
    document.removeEventListener("mouseup", onResizeMouseUp);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    pendingWidth.current = null;
  };

  const sortedData = sortData(data, sortKey, sortDirection);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 0,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        overflow: "auto",
        width: "100%",
        flex: 1,
        position: "relative",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          minWidth: 600,
          fontSize: 15,
          tableLayout: "fixed",
        }}
      >
        <colgroup>
          {colOrder.map((colIdx) => (
            <col key={colIdx} style={{ width: colWidths[colIdx] }} />
          ))}
        </colgroup>
        <thead>
          <tr style={{ background: "#f3f4f6" }}>
            {colOrder.map((colIdx, idx) => {
              const col = columns[colIdx];
              const isLast = idx === colOrder.length - 1;
              return (
                <th
                  key={col.key as string}
                  draggable={!isResizing}
                  onDragStart={(e) => onDragStart(idx, e)}
                  onDragOver={(e) => onDragOver(idx, e)}
                  onDrop={() => onDrop(idx)}
                  onClick={() => handleSort(col.key)}
                  style={{
                    padding: "14px 8px",
                    border: "1px solid #e5e7eb",
                    fontWeight: 600,
                    cursor: !isResizing ? "pointer" : "default",
                    userSelect: "none",
                    textAlign: "left",
                    position: "relative",
                    background: "#f3f4f6",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      justifyContent: isLast ? "space-between" : undefined,
                      position: "relative",
                    }}
                  >
                    <span>{col.label}</span>
                    {/* Sort indicator */}
                    {sortKey === col.key && (
                      <span style={{ fontSize: 12 }}>
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                    {/* Resize handle */}
                    <div
                      onMouseDown={(e) => onResizeMouseDown(e, colIdx)}
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        width: 12,
                        height: "100%",
                        cursor: "col-resize",
                        zIndex: 2,
                        userSelect: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "transparent",
                        transition: "background 0.15s",
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#e5e7eb";
                        const bar = e.currentTarget.querySelector(
                          ".resize-bar"
                        ) as HTMLElement | null;
                        if (bar) bar.style.opacity = "1";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        const bar = e.currentTarget.querySelector(
                          ".resize-bar"
                        ) as HTMLElement | null;
                        if (bar && resizingCol.current !== colIdx)
                          bar.style.opacity = "0.3";
                      }}
                    >
                      <span
                        className="resize-bar"
                        style={{
                          width: 3,
                          height: "60%",
                          background:
                            resizingCol.current === colIdx
                              ? "#1976d2"
                              : "#6b7280",
                          borderRadius: 2,
                          display: "inline-block",
                          opacity: resizingCol.current === colIdx ? 1 : 0.3,
                          transition: "opacity 0.15s, background 0.15s",
                        }}
                      />
                    </div>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
              {colOrder.map((colIdx) => {
                const col = columns[colIdx];
                const value = row[col.key];
                return (
                  <td
                    key={col.key as string}
                    style={{
                      padding: "12px 8px",
                      border: "1px solid #e5e7eb",
                      whiteSpace:
                        typeof value === "string" && value.length > 50
                          ? "nowrap"
                          : undefined,
                      textOverflow:
                        typeof value === "string" && value.length > 50
                          ? "ellipsis"
                          : undefined,
                      overflow:
                        typeof value === "string" && value.length > 50
                          ? "hidden"
                          : undefined,
                    }}
                  >
                    {value !== null && value !== undefined ? String(value) : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
