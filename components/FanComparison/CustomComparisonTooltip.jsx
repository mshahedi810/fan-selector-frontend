"use client";
import React from "react";

const CustomComparisonTooltip = ({ active, payload, label, units }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-black/80 shadow-lg rounded-md border border-white/20 text-white/90">
        <p className="font-bold border-b pb-1 mb-2">{`دبی: ${typeof label === 'number' ? label.toLocaleString('fa-IR') : label} ${units.airflow}`}</p>
        <ul className="space-y-1 text-sm">
          {payload.map((entry, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="block w-3 h-3 rounded-full" style={{ backgroundColor: entry.stroke }}></span>
              <span className="font-semibold">{entry.name}:</span>
              <span>{typeof entry.value === "number" ? entry.value.toLocaleString("fa-IR", { maximumFractionDigits: 2 }) : entry.value} {units.pressure}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return null;
};

export default CustomComparisonTooltip;
