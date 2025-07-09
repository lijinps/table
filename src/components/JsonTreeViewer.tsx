import React, { useState } from "react";

// Utility to determine type
function getType(val: any): string {
  if (val === null) return "null";
  if (Array.isArray(val)) return "array";
  return typeof val;
}

// Color map for types
const typeColors: Record<string, string> = {
  string: "#228B22",
  number: "#1E40AF",
  boolean: "#B45309",
  null: "#6B7280",
  array: "#6366F1",
  object: "#0D9488",
};

// Icon for expand/collapse
const Arrow = ({ open }: { open: boolean }) => (
  <span
    style={{
      display: "inline-block",
      transition: "transform 0.15s",
      transform: open ? "rotate(90deg)" : "rotate(0deg)",
      marginRight: 4,
      cursor: "pointer",
      userSelect: "none",
    }}
  >
    ▶
  </span>
);

interface JsonTreeViewerProps {
  data: any;
  selectedPaths: string[];
  onPathSelect: (path: string) => void;
}

function JsonNode({
  value,
  label,
  depth = 0,
  defaultOpen = false,
  path = "",
  selectedPaths = [],
  onPathSelect,
}: {
  value: any;
  label?: string;
  depth?: number;
  defaultOpen?: boolean;
  path?: string;
  selectedPaths?: string[];
  onPathSelect?: (path: string) => void;
}) {
  const type = getType(value);
  const [open, setOpen] = useState(defaultOpen);
  const isExpandable = type === "object" || type === "array";
  const isPrimitive = !isExpandable;

  // Build the path for this node
  const currentPath = path
    ? label !== undefined
      ? `${path}.${label}`
      : path
    : label || "";

  // Indentation
  const indent = { paddingLeft: depth * 18 };

  // Selection logic for primitives
  const isSelected = isPrimitive && selectedPaths.includes(currentPath);
  const handleValueClick = () => {
    if (isPrimitive && onPathSelect) {
      onPathSelect(currentPath);
    }
  };

  // Render for objects
  if (type === "object" && value !== null) {
    const keys = Object.keys(value);
    return (
      <div style={indent}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {isExpandable && (
            <span onClick={() => setOpen((o) => !o)}>
              <Arrow open={open} />
            </span>
          )}
          {label !== undefined && (
            <span style={{ color: "#0D9488", fontWeight: 500 }}>{label}:</span>
          )}
          <span style={{ color: typeColors.object, fontWeight: 500 }}>
            &#123;object&#125;{!open && ` (${keys.length})`}
          </span>
        </div>
        {open && (
          <div>
            {keys.length === 0 && (
              <span style={{ color: "#6B7280", marginLeft: 24 }}>
                &#123;&#125;
              </span>
            )}
            {keys.map((k) => (
              <JsonNode
                key={k}
                value={value[k]}
                label={k}
                depth={depth + 1}
                path={currentPath}
                selectedPaths={selectedPaths}
                onPathSelect={onPathSelect}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Render for arrays
  if (type === "array") {
    return (
      <div style={indent}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {isExpandable && (
            <span onClick={() => setOpen((o) => !o)}>
              <Arrow open={open} />
            </span>
          )}
          {label !== undefined && (
            <span style={{ color: "#6366F1", fontWeight: 500 }}>{label}:</span>
          )}
          <span style={{ color: typeColors.array, fontWeight: 500 }}>
            [array]{!open && ` (${value.length})`}
          </span>
        </div>
        {open && (
          <div>
            {value.length === 0 && (
              <span style={{ color: "#6B7280", marginLeft: 24 }}>[]</span>
            )}
            {value.map((item: any, idx: number) => (
              <JsonNode
                key={idx}
                value={item}
                label={String(idx)}
                depth={depth + 1}
                path={currentPath}
                selectedPaths={selectedPaths}
                onPathSelect={onPathSelect}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Render for primitives (selectable)
  let displayValue = String(value);
  if (type === "string") displayValue = `"${value}"`;
  if (type === "null") displayValue = "null";

  return (
    <div style={indent}>
      {label !== undefined && (
        <span style={{ color: "#64748b" }}>{label}:</span>
      )}
      <span
        style={{
          color: typeColors[type],
          marginLeft: 4,
          cursor: isPrimitive ? "pointer" : undefined,
          padding: isPrimitive ? "2px 4px" : undefined,
          borderRadius: isPrimitive ? 4 : undefined,
          backgroundColor: isSelected ? "#dbeafe" : "transparent",
          transition: "background-color 0.15s",
          userSelect: "none",
        }}
        onClick={handleValueClick}
        title={
          isPrimitive
            ? `Click to select: ${currentPath} = ${displayValue}`
            : undefined
        }
      >
        {displayValue}
      </span>
      <span style={{ color: "#a3a3a3", fontSize: 12, marginLeft: 6 }}>
        {type !== "string" && type !== "null" ? <em>({type})</em> : null}
      </span>
    </div>
  );
}

export default function JsonTreeViewer({
  data,
  selectedPaths,
  onPathSelect,
}: JsonTreeViewerProps) {
  return (
    <div
      style={{
        fontFamily: "monospace",
        fontSize: 15,
        background: "#f9fafb",
        borderRadius: 8,
        padding: 16,
        border: "1px solid #e5e7eb",
        overflowX: "auto",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <JsonNode
        value={data}
        defaultOpen={true}
        selectedPaths={selectedPaths}
        onPathSelect={onPathSelect}
      />
    </div>
  );
}
