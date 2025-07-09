"use client";

import JsonTreeViewer from "@/components/JsonTreeViewer";
import ColumnConfigPanel from "@/components/ColumnConfigPanel";
import React, { useState, useEffect } from "react";

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
              data={yourJsonObject.length > 0 ? yourJsonObject[0] : {}}
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

const yourJsonObject = [
  {
    _id: "6867a16bc62e399ad738d8e9",
    customerId: "68661cd2fc96cacfc0ee0c8a",
    customerDetails: {
      _id: "68661cd2fc96cacfc0ee0c8a",
      firstName: "abhishek",
      lastName: "dev",
      fullName: "abhishek dev",
      primaryEmail: "abhishekdev@mail.com",
      primaryPhone: "97150225555",
    },
    productIds: ["684f9f02dbf4906e1bda8209", "684fa042f00e9d2254d061f4"],
    products: [
      {
        _id: "684f9f02dbf4906e1bda8209",
        vehicleId: "68677d70e09959d95a706da7",
        name: "Test",
        description: "aber test service",
        netValue: 105,
        taxValue: 0,
        discount: 0,
        currencyCode: "AED",
        grossValue: 105,
        quantity: 1,
        serviceType: "product",
      },
      {
        _id: "684fa042f00e9d2254d061f4",
        vehicleId: "68677d70e09959d95a706da7",
        name: "Doorstep Delivery",
        description: "aber test service",
        netValue: 557,
        taxRate: 5,
        taxValue: 0,
        discount: 0,
        currencyCode: "AED",
        grossValue: 557,
        quantity: 1,
        serviceType: "product",
      },
    ],
    totalNetValue: 662,
    totalTax: 0,
    totalDiscount: 0,
    totalGrossValue: 662,
    totalWithDiscount: 662,
    amountPaid: 0,
    amountPaidViaOnline: 0,
    note: "",
    customerVehicleIds: ["68677d70e09959d95a706da7"],
    customerVehicles: [
      {
        class: "CAR",
        make: "ford",
        model: "mustang",
        modelYear: 2014,
        registrationDocument: [
          "https://aber-devs3.s3.ap-south-1.amazonaws.com/1751612763140/be1543f2-b99c-4c46-be14-ae2a6960f6dd-front.jpeg",
          "https://aber-devs3.s3.ap-south-1.amazonaws.com/1751612763155/3f81714b-7424-492b-bafe-05901d1455fd-back.jpeg",
        ],
        identification: {
          vin: "1N4BL3AP1EC178878123123",
          licensePlate: "387892341",
        },
        isBookingAllowed: false,
        relations: [],
        odometerReading: {
          unit: "KM",
        },
        tradeInRequested: false,
        registrationData: {
          registrationDateObject: null,
        },
        contracts: [],
        isDeleted: false,
        deletedAt: null,
        bookingStage: "pending",
        bookingStatus: "todo",
        documents: [],
        _id: "68677d70e09959d95a706da7",
        createdAt: "2025-07-04T07:06:24.442Z",
        updatedAt: "2025-07-04T07:06:24.442Z",
      },
    ],
    appointmentDateAndTime: "2025-07-15T00:00:00.000Z",
    bookedSlot: {
      start: "7:00 AM",
      end: "8:00 AM",
      _id: "6867a16bc62e399ad738d8eb",
    },
    status: "booked",
    bookingId: "OORJ-059986",
    createdAt: "2025-07-04T09:39:55.413Z",
  },
];
