"use client";

import JsonTreeViewer from "@/components/JsonTreeViewer";
import ColumnConfigPanel from "@/components/ColumnConfigPanel";
import React, { useState, useEffect } from "react";
import { sampleJsonData } from "@/data/sampleData";

interface ColumnConfig {
  path: string;
  columnName: string;
}

export default function VisualPage() {
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
    alert("Configuration saved successfully!");
  };

  return (
    <div
      style={{
        padding: 16,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
        JSON Property Selector
      </h1>

      <div
        style={{
          display: "flex",
          gap: 16,
          flex: 1,
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
  );
}
