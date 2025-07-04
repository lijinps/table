import React from "react";

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 64,
        background: "#fff",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px 0",
        gap: 16,
      }}
    >
      <div style={{ marginBottom: 32 }}>
        <img
          src="https://i.imgur.com/0y0y0y0.png"
          alt="Logo"
          style={{ width: 40, height: 40, borderRadius: 8 }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          fontSize: 24,
          color: "#7b7b93",
        }}
      >
        <span title="Dashboard">🏠</span>
        <span title="Bookings">📄</span>
        <span title="Vehicles">🚗</span>
        <span title="Customers">👥</span>
        <span title="Calendar">🗓️</span>
        <span title="Settings">⚙️</span>
      </div>
    </aside>
  );
}
