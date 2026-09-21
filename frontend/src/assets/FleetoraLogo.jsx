import React from "react";

export default function FleetoraLogo({ className = "", style = {}, width = 280, height = 135 }) {
  return (
    <div className={`fleetora-logo-container ${className}`} style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", ...style }}>
      <img 
        src="/fleetora-logo.svg" 
        alt="FLEETORA - SINCE 2026" 
        style={{ width: typeof width === "number" ? `${width}px` : width, height: typeof height === "number" ? `${height}px` : height, objectFit: "contain" }} 
      />
    </div>
  );
}
