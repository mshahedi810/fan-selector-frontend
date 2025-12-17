"use client";
import React from "react";

const ComparisonRow = ({ label, values, highlight }) => {
  let bestValue;
  if (highlight) {
    const numericValues = values
      .map(v => typeof v === "number" ? v : parseFloat(String(v).replace(/,/g, "")))
      .filter(v => !isNaN(v));
    if (numericValues.length > 1) {
      bestValue = highlight === "max" ? Math.max(...numericValues) : Math.min(...numericValues);
    }
  }

  return (
    <tr className="border-b border-white/20">
      <th className="p-3 text-sm font-medium text-white/80 text-right sticky left-0 z-10 bg-black/30">{label}</th>
      {values.map((value, index) => {
        const isBest = typeof value === "number" && value === bestValue;
        return (
          <td key={index} className={`p-3 text-sm text-center ${isBest ? "bg-green-600/30 font-bold text-green-400" : "text-white/90"}`}>
            {typeof value === "number" ? value.toLocaleString("fa-IR", { maximumFractionDigits: 2 }) : value}
          </td>
        );
      })}
    </tr>
  );
};

export default ComparisonRow;
