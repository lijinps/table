"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DataTable from "../components/DataTable";
import VisualModal from "../components/VisualModal";
import { sampleJsonData } from "@/data/sampleData";

interface ColumnConfig {
  path: string;
  columnName: string;
}

// Helper function to get nested value from object using path
function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
}

// Helper function to create table data from sample data using saved config
function createTableDataFromConfig(
  sampleData: any[],
  savedConfigs: ColumnConfig[]
): any[] {
  console.log("Creating table data from config:", { sampleData, savedConfigs });

  if (savedConfigs.length === 0) {
    console.log("No saved configs, returning empty array");
    return [];
  }

  const result = sampleData.map((item, index) => {
    const row: any = {};
    savedConfigs.forEach((config) => {
      const value = getNestedValue(item, config.path);
      row[config.columnName] = value;
      console.log(`Extracted ${config.path} -> ${config.columnName}:`, value);
    });
    console.log("Created row:", row);
    return row;
  });

  console.log("Final table data:", result);
  return result;
}

export default function Home() {
  const [isVisualModalOpen, setIsVisualModalOpen] = useState(false);
  const [savedConfigs, setSavedConfigs] = useState<ColumnConfig[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);

  // Load saved configurations and create table data
  useEffect(() => {
    console.log("Loading saved configurations...");
    const saved = localStorage.getItem("columnConfigs");
    console.log("Saved config from localStorage:", saved);

    if (saved) {
      try {
        const configs = JSON.parse(saved);
        console.log("Parsed configs:", configs);

        if (configs && configs.length > 0) {
          setSavedConfigs(configs);

          // Create columns from saved config
          const dynamicColumns = configs.map((config: ColumnConfig) => ({
            key: config.columnName,
            label: config.columnName,
          }));
          console.log("Created dynamic columns:", dynamicColumns);
          setColumns(dynamicColumns);

          // Create table data from sample data using saved config
          const dynamicData = createTableDataFromConfig(
            sampleJsonData,
            configs
          );
          console.log("Setting table data:", dynamicData);
          setTableData(dynamicData);
        } else {
          // Empty config - show empty state
          console.log("Empty config found");
          setTableData([]);
          setColumns([]);
        }
      } catch (error) {
        console.error("Error loading saved configurations:", error);
        // Error - show empty state
        setTableData([]);
        setColumns([]);
      }
    } else {
      // No saved config - show empty state
      console.log("No saved config found");
      setTableData([]);
      setColumns([]);
    }
  }, []);

  // Listen for changes in localStorage to update table when config is saved
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("columnConfigs");
      if (saved) {
        try {
          const configs = JSON.parse(saved);
          if (configs && configs.length > 0) {
            setSavedConfigs(configs);

            // Create columns from saved config
            const dynamicColumns = configs.map((config: ColumnConfig) => ({
              key: config.columnName,
              label: config.columnName,
            }));
            setColumns(dynamicColumns);

            // Create table data from sample data using saved config
            const dynamicData = createTableDataFromConfig(
              sampleJsonData,
              configs
            );
            setTableData(dynamicData);
          } else {
            // Empty config - show empty state
            setTableData([]);
            setColumns([]);
          }
        } catch (error) {
          console.error("Error loading saved configurations:", error);
          setTableData([]);
          setColumns([]);
        }
      } else {
        // No saved config - show empty state
        setTableData([]);
        setColumns([]);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    // Also listen for custom event when config is saved in the same window
    window.addEventListener("columnConfigSaved", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("columnConfigSaved", handleStorageChange);
    };
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f8fa" }}>
      {(() => {
        console.log(
          "Rendering with tableData:",
          tableData,
          "columns:",
          columns
        );
        return null;
      })()}
      <Sidebar />
      <main
        style={{
          flex: 1,
          padding: "32px 0 0 0",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Header onSettingsClick={() => setIsVisualModalOpen(true)} />

        <DataTable data={tableData} columns={columns} />

        {/* Visual Modal */}
        <VisualModal
          isOpen={isVisualModalOpen}
          onClose={() => setIsVisualModalOpen(false)}
        />
      </main>
    </div>
  );
}
