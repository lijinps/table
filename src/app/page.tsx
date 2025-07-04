"use client";

import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DataTable from "../components/DataTable";

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

const columns = [
  { key: "id" as const, label: "Booking ID" },
  { key: "created" as const, label: "Created Date" },
  { key: "testDate" as const, label: "Test Date & Time" },
  { key: "arrival" as const, label: "Arrival Time" },
  { key: "duration" as const, label: "Expected Test Duration" },
  { key: "createdBy" as const, label: "Created By" },
  { key: "customer" as const, label: "Customer Name" },
  { key: "phone" as const, label: "Phone" },
  { key: "email" as const, label: "Email" },
];

export default function Home() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f8fa" }}>
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
        <Header />
        <DataTable bookings={bookings} columns={columns} />
      </main>
    </div>
  );
}
