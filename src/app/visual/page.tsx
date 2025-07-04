"use client";

import JsonTreeViewer from "@/components/JsonTreeViewer";
import React, { useState } from "react";

export default function VisualPage() {
  const [selectedValue, setSelectedValue] = useState<{
    path: string;
    value: any;
    type: string;
  } | null>(null);

  const handleSelectionChange = (
    selected: { path: string; value: any; type: string }[]
  ) => {
    // Take the last selected value for single selection display
    const lastSelected = selected[selected.length - 1] || null;
    setSelectedValue(lastSelected);
    console.log(`Selected ${selected.length} values:`, selected);
  };

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>
        Visual Page
      </h1>
      <p style={{ fontSize: 18, color: "#555" }}>
        This is a placeholder for the Visual page. Add your visualizations or
        content here.
      </p>

      {selectedValue && (
        <div
          style={{
            background: "#dbeafe",
            border: "1px solid #3b82f6",
            borderRadius: 8,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <h3 style={{ margin: "0 0 8px 0", color: "#1e40af" }}>
            Selected Value:
          </h3>
          <p style={{ margin: 0, fontFamily: "monospace" }}>
            <strong>Path:</strong> {selectedValue.path}
            <br />
            <strong>Value:</strong> {String(selectedValue.value)}
            <br />
            <strong>Type:</strong> {selectedValue.type}
          </p>
        </div>
      )}

      <JsonTreeViewer
        data={yourJsonObject}
        rootLabel="Root"
        onSelectionChange={handleSelectionChange}
      />
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
