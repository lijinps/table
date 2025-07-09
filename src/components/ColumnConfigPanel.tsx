import React, { useState, useEffect } from "react";

interface ColumnConfig {
  path: string;
  columnName: string;
}

interface ColumnConfigPanelProps {
  selectedPaths: string[];
  onSave: (configs: ColumnConfig[]) => void;
  onPathRemove: (path: string) => void;
  savedConfigs: ColumnConfig[];
}

export default function ColumnConfigPanel({
  selectedPaths,
  onSave,
  onPathRemove,
  savedConfigs,
}: ColumnConfigPanelProps) {
  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>([]);
  const [activeTab, setActiveTab] = useState<"config" | "saved">("config");

  // Update column configs when selected paths change
  useEffect(() => {
    const newConfigs: ColumnConfig[] = selectedPaths.map((path) => {
      // Check if we already have a config for this path
      const existing = columnConfigs.find((config) => config.path === path);
      if (existing) {
        return existing;
      }

      // Create default column name from path
      const pathParts = path.split(".");
      const defaultName = pathParts[pathParts.length - 1] || path;
      return {
        path,
        columnName: defaultName,
      };
    });

    // Remove configs for paths that are no longer selected
    const filteredConfigs = newConfigs.filter((config) =>
      selectedPaths.includes(config.path)
    );

    setColumnConfigs(filteredConfigs);
  }, [selectedPaths]);

  const handleColumnNameChange = (path: string, columnName: string) => {
    setColumnConfigs((prev) =>
      prev.map((config) =>
        config.path === path ? { ...config, columnName } : config
      )
    );
  };

  const handleSave = () => {
    onSave(columnConfigs);
  };

  const removePath = (path: string) => {
    // Call the parent component to remove the path from selected paths
    onPathRemove(path);
  };

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Tab Headers */}
      <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}>
        <button
          onClick={() => setActiveTab("config")}
          style={{
            flex: 1,
            padding: "12px 16px",
            background: activeTab === "config" ? "#3b82f6" : "transparent",
            color: activeTab === "config" ? "white" : "#374151",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
            borderTopLeftRadius: 8,
          }}
        >
          Configuration
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          style={{
            flex: 1,
            padding: "12px 16px",
            background: activeTab === "saved" ? "#3b82f6" : "transparent",
            color: activeTab === "saved" ? "white" : "#374151",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
            borderTopRightRadius: 8,
          }}
        >
          Saved
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
        {activeTab === "config" ? (
          // Configuration Tab
          <>
            <h3 style={{ margin: "0 0 16px 0", fontSize: 16, fontWeight: 600 }}>
              Column Configuration
            </h3>

            {columnConfigs.length === 0 ? (
              <div
                style={{
                  color: "#6b7280",
                  textAlign: "center",
                  padding: "32px 16px",
                  fontSize: 14,
                }}
              >
                Select properties from the JSON tree to configure columns
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 16 }}>
                  {columnConfigs.map((config) => (
                    <div
                      key={config.path}
                      style={{
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        borderRadius: 6,
                        padding: 12,
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            color: "#6b7280",
                            fontFamily: "monospace",
                            wordBreak: "break-all",
                          }}
                          title={config.path}
                        >
                          {config.path}
                        </span>
                        <button
                          onClick={() => removePath(config.path)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#ef4444",
                            cursor: "pointer",
                            fontSize: 16,
                            padding: 0,
                            width: 20,
                            height: 20,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                      <input
                        type="text"
                        value={config.columnName}
                        onChange={(e) =>
                          handleColumnNameChange(config.path, e.target.value)
                        }
                        placeholder="Enter column name"
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: 4,
                          fontSize: 14,
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSave}
                  style={{
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    padding: "12px 24px",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  Save Configuration
                </button>
              </>
            )}
          </>
        ) : (
          // Saved Tab
          <>
            <h3 style={{ margin: "0 0 16px 0", fontSize: 16, fontWeight: 600 }}>
              Saved Configuration
            </h3>

            {savedConfigs.length === 0 ? (
              <div
                style={{
                  color: "#6b7280",
                  textAlign: "center",
                  padding: "32px 16px",
                  fontSize: 14,
                }}
              >
                No saved configurations yet
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {savedConfigs.map((config) => (
                  <div
                    key={config.path}
                    style={{
                      background: "#f0f9ff",
                      border: "1px solid #0ea5e9",
                      borderRadius: 6,
                      padding: 12,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#0369a1",
                        marginBottom: 4,
                      }}
                    >
                      {config.columnName}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6b7280",
                        fontFamily: "monospace",
                        wordBreak: "break-all",
                      }}
                    >
                      {config.path}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
