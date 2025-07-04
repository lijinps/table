import React, { useState } from "react";

// Utility to determine type
function getType(val: any): string {
  if (val === null) return "null";
  if (Array.isArray(val)) return "array";
  return typeof val;
}

// Color map for types
const typeColors: Record<string, string> = {
  string: "#228B22", // green
  number: "#1E40AF", // blue
  boolean: "#B45309", // orange
  null: "#6B7280", // gray
  array: "#6366F1", // purple
  object: "#0D9488", // teal
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
  rootLabel?: string;
  selectedPaths?: string[];
  onSelectionChange?: (
    selected: { path: string; value: any; type: string }[]
  ) => void;
}

function JsonNode({
  value,
  label,
  depth = 0,
  defaultOpen = false,
  path = "",
  selectedPaths = [],
  onToggleSelect,
}: {
  value: any;
  label?: string;
  depth?: number;
  defaultOpen?: boolean;
  path?: string;
  selectedPaths?: string[];
  onToggleSelect?: (path: string, value: any, type: string) => void;
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
    if (isPrimitive && onToggleSelect) {
      onToggleSelect(currentPath, value, type);
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
                onToggleSelect={onToggleSelect}
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
                onToggleSelect={onToggleSelect}
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
  rootLabel,
  selectedPaths: controlledSelectedPaths,
  onSelectionChange,
}: JsonTreeViewerProps) {
  // Internal state for uncontrolled usage
  const [selectedPaths, setSelectedPaths] = useState<string[]>(
    controlledSelectedPaths || []
  );

  // Keep internal state in sync with controlled prop
  React.useEffect(() => {
    if (controlledSelectedPaths) setSelectedPaths(controlledSelectedPaths);
  }, [controlledSelectedPaths]);

  // Toggle selection for a primitive node
  const handleToggleSelect = (path: string, value: any, type: string) => {
    setSelectedPaths((prev) => {
      const exists = prev.includes(path);
      let next: string[];
      if (exists) {
        next = prev.filter((p) => p !== path);
      } else {
        next = [...prev, path];
      }
      if (onSelectionChange) {
        // Build selected values array
        const selected: { path: string; value: any; type: string }[] = [];
        // Helper to traverse and collect selected values
        function collectSelected(val: any, currPath: string) {
          const t = getType(val);
          if (next.includes(currPath)) {
            selected.push({ path: currPath, value: val, type: t });
          }
          if (t === "object" && val !== null) {
            Object.keys(val).forEach((k) =>
              collectSelected(val[k], currPath ? `${currPath}.${k}` : k)
            );
          } else if (t === "array") {
            val.forEach((item: any, idx: number) =>
              collectSelected(
                item,
                currPath ? `${currPath}.${idx}` : String(idx)
              )
            );
          }
        }
        collectSelected(data, rootLabel || "");
        onSelectionChange(selected);
      }
      return next;
    });
  };

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
      }}
    >
      <JsonNode
        value={data}
        label={rootLabel}
        defaultOpen={true}
        path={rootLabel || ""}
        selectedPaths={selectedPaths}
        onToggleSelect={handleToggleSelect}
      />
    </div>
  );
}
