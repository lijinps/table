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

const bookings = [
  {
    id: "20240311001",
    created: "11-Mar-2025",
    testDate: "12-Mar-2025, 10:30 AM",
    arrival: "10:00 AM",
    duration: "30 mins",
    createdBy: "Admin",
    customer: "Ahmed Al Mansoori",
    phone: "+971 501234567",
    email: "ahmed.mansoori@email.com",
  },
  {
    id: "20240311002",
    created: "11-Mar-2025",
    testDate: "12-Mar-2025, 10:30 AM",
    arrival: "01:30 PM",
    duration: "45 mins",
    createdBy: "Admin",
    customer: "Fatima Al Nahyan",
    phone: "+971 502345678",
    email: "fatima.nahyan@email.com",
  },
  {
    id: "20240311003",
    created: "11-Mar-2025",
    testDate: "12-Mar-2025, 10:30 AM",
    arrival: "07:45 AM",
    duration: "30 mins",
    createdBy: "Admin",
    customer: "Khalid Bin Zayed",
    phone: "+971 503456789",
    email: "khalid.zayed@email.com",
  },
  {
    id: "20240311004",
    created: "12-Mar-2025",
    testDate: "12-Mar-2025, 10:30 AM",
    arrival: "11:15 AM",
    duration: "30 mins",
    createdBy: "Admin",
    customer: "Mariam Al Farsi",
    phone: "+971 504567890",
    email: "mariam.farsi@email.com",
  },
  {
    id: "20240311005",
    created: "12-Mar-2025",
    testDate: "12-Mar-2025, 10:30 AM",
    arrival: "03:00 PM",
    duration: "30 mins",
    createdBy: "Admin",
    customer: "Mohammed Al Rashid",
    phone: "+971 505678901",
    email: "mohammed.rashid@email.com",
  },
];

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
        setSavedConfigs(configs);

        // Create columns from saved config
        const dynamicColumns = configs.map((config: ColumnConfig) => ({
          key: config.columnName,
          label: config.columnName,
        }));
        console.log("Created dynamic columns:", dynamicColumns);
        setColumns(dynamicColumns);

        // Create table data from sample data using saved config
        const dynamicData = createTableDataFromConfig(sampleJsonData, configs);
        console.log("Setting table data:", dynamicData);
        setTableData(dynamicData);
      } catch (error) {
        console.error("Error loading saved configurations:", error);
        // Fallback to default data
        console.log("Falling back to default data");
        setTableData(bookings);
        setColumns([
          { key: "id" as const, label: "Booking ID" },
          { key: "created" as const, label: "Created Date" },
          { key: "testDate" as const, label: "Test Date & Time" },
          { key: "arrival" as const, label: "Arrival Time" },
          { key: "duration" as const, label: "Expected Test Duration" },
          { key: "createdBy" as const, label: "Created By" },
          { key: "customer" as const, label: "Customer Name" },
          { key: "phone" as const, label: "Phone" },
          { key: "email" as const, label: "Email" },
        ]);
      }
    } else {
      // No saved config, use default data
      console.log("No saved config found, using default data");
      setTableData(bookings);
      setColumns([
        { key: "id" as const, label: "Booking ID" },
        { key: "created" as const, label: "Created Date" },
        { key: "testDate" as const, label: "Test Date & Time" },
        { key: "arrival" as const, label: "Arrival Time" },
        { key: "duration" as const, label: "Expected Test Duration" },
        { key: "createdBy" as const, label: "Created By" },
        { key: "customer" as const, label: "Customer Name" },
        { key: "phone" as const, label: "Phone" },
        { key: "email" as const, label: "Email" },
      ]);
    }
  }, []);

  // Listen for changes in localStorage to update table when config is saved
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("columnConfigs");
      if (saved) {
        try {
          const configs = JSON.parse(saved);
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
        } catch (error) {
          console.error("Error loading saved configurations:", error);
        }
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
