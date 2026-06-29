import React from "react";

/** Shared compass mark for Next.js `app/icon.tsx` / `app/apple-icon.tsx` (ImageResponse). */
export function EmigroIconMark() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1d4ed8",
        borderRadius: 24,
        position: "relative",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          border: "3px solid rgba(255,255,255,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderBottom: "28px solid rgba(255,255,255,0.95)",
            marginTop: -6,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          width: 10,
          height: 10,
          borderRadius: 5,
          background: "#fff",
        }}
      />
    </div>
  );
}
