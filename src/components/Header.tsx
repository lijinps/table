import React from "react";

interface HeaderProps {
  onSettingsClick?: () => void;
}

export default function Header({ onSettingsClick }: HeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
        padding: "0 32px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
            Test Bookings
          </h1>
          <button
            onClick={onSettingsClick}
            style={{
              border: "1px solid #e5e7eb",
              background: "#fff",
              borderRadius: 6,
              padding: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Configure Columns"
          >
            <span style={{ fontSize: 18 }}>⚙️</span>
          </button>
        </div>
        <div style={{ color: "#7b7b93", fontSize: 14 }}>
          <span>35 Total</span> <span style={{ margin: "0 8px" }}>•</span>{" "}
          <span>Updated 11 Minutes Ago</span>
        </div>
        <button
          style={{
            border: "1px solid #e5e7eb",
            background: "#fff",
            borderRadius: 6,
            padding: 8,
            cursor: "pointer",
          }}
          title="Sort/Filter"
        >
          <span style={{ fontSize: 20 }}>⏷</span>
        </button>
        <button
          style={{
            border: "1px solid #e5e7eb",
            background: "#fff",
            borderRadius: 6,
            padding: 8,
            cursor: "pointer",
          }}
          title="Filter"
        >
          <span style={{ fontSize: 20 }}>🔍</span>
        </button>
        <span
          style={{
            color: "#2e5bff",
            fontWeight: 500,
            cursor: "pointer",
            marginLeft: 8,
          }}
        >
          Filter: ALL
        </span>
        <span
          style={{
            color: "#7b7b93",
            fontWeight: 500,
            cursor: "pointer",
            marginLeft: 8,
          }}
        >
          ADD FILTER
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <input
          type="text"
          placeholder="Booking ID, Customer, Test Name"
          style={{
            padding: "8px 16px",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            fontSize: 16,
            width: 260,
          }}
        />
        <input
          type="date"
          style={{
            padding: "8px 12px",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            fontSize: 16,
          }}
        />
        <button
          style={{
            background: "#2e5bff",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "10px 24px",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          New Booking
        </button>
        <button
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            padding: 10,
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 20 }}>⤓</span>
        </button>
        <div style={{ position: "relative" }}>
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="User"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "2px solid #e5e7eb",
            }}
          />
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "#ff3b30",
              color: "#fff",
              borderRadius: "50%",
              fontSize: 12,
              padding: "2px 6px",
              fontWeight: 700,
            }}
          >
            06
          </span>
        </div>
      </div>
    </div>
  );
}
