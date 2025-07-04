"use client";

import React, { useState, useRef, useEffect } from "react";

interface Booking {
  id: string;
  created: string;
  testDate: string;
  arrival: string;
  duration: string;
  createdBy: string;
  customer: string;
  phone: string;
  email: string;
}

interface Column {
  key: keyof Booking;
  label: string;
}

interface DataTableProps {
  bookings: Booking[];
  columns: Column[];
}

const MIN_WIDTH = 80;
const MAX_WIDTH = 600;
const STORAGE_KEY_WIDTHS = "datatable_colwidths";
const STORAGE_KEY_ORDER = "datatable_colorder";

export default function DataTable({ bookings, columns }: DataTableProps) {
  const [sortKey, setSortKey] = useState<keyof Booking>("id");
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

  function sortData(
    data: Booking[],
    sortKey: keyof Booking,
    direction: "asc" | "desc"
  ) {
    const sorted = [...data].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return direction === "asc" ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }

  const handleSort = (key: keyof Booking) => {
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

  const sortedBookings = sortData(bookings, sortKey, sortDirection);

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
                  key={col.key}
                  draggable={!isResizing}
                  onDragStart={(e) => onDragStart(idx, e)}
                  onDragOver={(e) => onDragOver(idx, e)}
                  onDrop={() => onDrop(idx)}
                  style={{
                    padding: "14px 8px",
                    border: "1px solid #e5e7eb",
                    fontWeight: 600,
                    cursor: !isResizing ? "move" : "default",
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
          {sortedBookings.map((b, i) => (
            <tr key={b.id + i} style={{ borderBottom: "1px solid #f0f0f0" }}>
              {colOrder.map((colIdx) => {
                const col = columns[colIdx];
                return (
                  <td
                    key={col.key}
                    style={{
                      padding: "12px 8px",
                      border: "1px solid #e5e7eb",
                      whiteSpace: col.key === "email" ? "nowrap" : undefined,
                      textOverflow:
                        col.key === "email" ? "ellipsis" : undefined,
                      overflow: col.key === "email" ? "hidden" : undefined,
                    }}
                  >
                    {b[col.key]}
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
