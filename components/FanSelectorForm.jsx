"use client";
import React, { useState, useMemo } from "react";
import { m3hToCfm, cfmToM3h, paToInwg, inwgToPa } from "../utils/conversions";
import UnitSelector from "./UnitSelector";
import StepperInput from "./StepperInput";

const FanSelectorForm = ({ filters, onFilterChange }) => {
  const [units, setUnits] = useState({ airflow: "m³/h", pressure: "Pa" });

  const getDisplayValue = (value, type) => {
    if (type === "airflow") return units.airflow === "CFM" ? Math.round(m3hToCfm(value)) : value;
    if (type === "pressure") return units.pressure === "inWG" ? parseFloat(paToInwg(value).toFixed(2)) : value;
    return value;
  };

  const toBaseValue = (value, type) => {
    if (type === "airflow") return units.airflow === "CFM" ? cfmToM3h(value) : value;
    if (type === "pressure") return units.pressure === "inWG" ? inwgToPa(value) : value;
    return value;
  };

  const airflowProps = useMemo(() => {
    const baseMin = 1000, baseMax = 40000, baseStep = 500;
    return {
      min: units.airflow === "CFM" ? Math.round(m3hToCfm(baseMin)) : baseMin,
      max: units.airflow === "CFM" ? Math.round(m3hToCfm(baseMax)) : baseMax,
      step: units.airflow === "CFM" ? Math.round(m3hToCfm(baseStep)) : baseStep,
      value: getDisplayValue(filters.airflow, "airflow"),
    };
  }, [filters.airflow, units.airflow]);

  const pressureProps = useMemo(() => {
    const baseMin = 50, baseMax = 2000, baseStep = 10;
    return {
      min: units.pressure === "inWG" ? parseFloat(paToInwg(baseMin).toFixed(2)) : baseMin,
      max: units.pressure === "inWG" ? parseFloat(paToInwg(baseMax).toFixed(2)) : baseMax,
      step: units.pressure === "inWG" ? parseFloat(paToInwg(baseStep).toFixed(2)) : baseStep,
      value: getDisplayValue(filters.staticPressure, "pressure"),
    };
  }, [filters.staticPressure, units.pressure]);

  return (
    <div className="p-6 max-w-xl mx-auto bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl space-y-6">
      <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2 text-white">پارامترهای فنی پروژه</h2>

      {/* دبی هوا */}
      <div>
        <label className="flex justify-between items-center mb-1 text-sm font-medium text-white/80">
          <span>دبی هوا</span>
          <UnitSelector value={units.airflow} options={["m³/h", "CFM"]} onChange={(u) => setUnits(prev => ({ ...prev, airflow: u }))} />
        </label>
        <div className="text-center font-semibold text-white mb-2 text-lg">
          {Number(airflowProps.value).toLocaleString("fa-IR")} <span className="text-sm">{units.airflow}</span>
        </div>
        <StepperInput {...airflowProps} onChange={val => onFilterChange({ ...filters, airflow: toBaseValue(val, "airflow") })} />
      </div>

      {/* فشار استاتیک */}
      <div>
        <label className="flex justify-between items-center mb-1 text-sm font-medium text-white/80">
          <span>فشار استاتیک</span>
          <UnitSelector value={units.pressure} options={["Pa", "inWG"]} onChange={(u) => setUnits(prev => ({ ...prev, pressure: u }))} />
        </label>
        <div className="text-center font-semibold text-white mb-2 text-lg">
          {Number(pressureProps.value).toLocaleString("fa-IR")} <span className="text-sm">{units.pressure}</span>
        </div>
        <StepperInput {...pressureProps} onChange={val => onFilterChange({ ...filters, staticPressure: toBaseValue(val, "pressure") })} />
      </div>

      {/* دمای کاری */}
      <div>
        <label className="flex justify-between items-center mb-1 text-sm font-medium text-white/80">
          <span>دمای کاری</span>
          <span>°C</span>
        </label>
        <div className="text-center font-semibold text-white mb-2 text-lg">{filters.temperature.toLocaleString("fa-IR")}°C</div>
        <StepperInput value={filters.temperature} min={-30} max={100} step={1} onChange={val => onFilterChange({ ...filters, temperature: val })} />
      </div>

      <p className="text-center text-xs text-white/50 mt-2">
        مقادیر مورد نیاز پروژه خود را با استفاده از Stepper و واحدهای دلخواه تنظیم کنید.
      </p>
    </div>
  );
};

export default FanSelectorForm;
