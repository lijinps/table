import React, { useState, useEffect } from "react";
import JsonTreeViewer from "./JsonTreeViewer";
import ColumnConfigPanel from "./ColumnConfigPanel";
import { sampleJsonData } from "../data/sampleData";

interface ColumnConfig {
  path: string;
  columnName: string;
}

interface VisualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VisualModal({ isOpen, onClose }: VisualModalProps) {
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const [savedConfigs, setSavedConfigs] = useState<ColumnConfig[]>([]);

  // Load saved configurations from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("columnConfigs");
    if (saved) {
      try {
        const configs = JSON.parse(saved);
        setSavedConfigs(configs);
        // Also set the selected paths from saved configs
        setSelectedPaths(configs.map((config: ColumnConfig) => config.path));
      } catch (error) {
        console.error("Error loading saved configurations:", error);
      }
    }
  }, []);

  const handlePathSelect = (path: string) => {
    setSelectedPaths((prev) => {
      const exists = prev.includes(path);
      return exists ? prev.filter((p) => p !== path) : [...prev, path];
    });
  };

  const handlePathRemove = (path: string) => {
    setSelectedPaths((prev) => prev.filter((p) => p !== path));
  };

  const handleSaveConfig = (configs: ColumnConfig[]) => {
    console.log("configs", configs);
    setSavedConfigs(configs);
    localStorage.setItem("columnConfigs", JSON.stringify(configs));

    // Dispatch custom event to notify main page
    window.dispatchEvent(new CustomEvent("columnConfigSaved"));

    alert("Configuration saved successfully!");
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: 12,
          width: "90vw",
          height: "90vh",
          maxWidth: "1400px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 24px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
            JSON Property Selector
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              color: "#6b7280",
              padding: 0,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            padding: 24,
            display: "flex",
            gap: 16,
            minHeight: 0,
          }}
        >
          {/* Left side - JSON Tree Viewer */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: 16, fontWeight: 600 }}>
              JSON Tree
            </h3>
            <div style={{ flex: 1, minHeight: 0 }}>
              <JsonTreeViewer
                data={sampleJsonData.length > 0 ? sampleJsonData[0] : {}}
                selectedPaths={selectedPaths}
                onPathSelect={handlePathSelect}
              />
            </div>
          </div>

          {/* Right side - Column Configuration Panel */}
          <div style={{ width: 350, display: "flex", flexDirection: "column" }}>
            <ColumnConfigPanel
              selectedPaths={selectedPaths}
              onSave={handleSaveConfig}
              onPathRemove={handlePathRemove}
              savedConfigs={savedConfigs}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
