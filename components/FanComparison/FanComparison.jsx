"use client";
import React, { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { m3hToCfm, paToInwg } from "@/utils/conversions";
import ComparisonRow from "./ComparisonRow";
import GeminiComparisonSummary from "./GeminiComparisonSummary";
import CustomComparisonTooltip from "./CustomComparisonTooltip";

const interpolate = (x, p1, p2) => {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  if (x1 === x2) return y1;
  return Number(y1) + ((Number(x) - Number(x1)) * (Number(y2) - Number(y1))) / (Number(x2) - Number(x1));
};

const FanComparison = ({ fans, onBack }) => {
  const [units, setUnits] = useState({ airflow: "m³/h", pressure: "Pa" });

  const { chartData, specRows, getSpecValue, colors } = useMemo(() => {
    const colors = ["#3b82f6", "#16a34a", "#ef4444", "#f97316"];
    const allAirflowPoints = [...new Set(fans.flatMap(f => f.performanceCurve.map(p => p.airflow)))].sort((a, b) => a - b);

    const chartData = allAirflowPoints.map(airflow => {
      const dataPoint = { airflow };
      fans.forEach(fan => {
        const curve = fan.performanceCurve;
        let pressure = 0;
        const exactPoint = curve.find(p => p.airflow === airflow);
        if (exactPoint) pressure = exactPoint.staticPressure;
        else {
          const lowerPoints = curve.filter(p => p.airflow < airflow);
          const upperPoints = curve.filter(p => p.airflow > airflow);
          if (lowerPoints.length > 0 && upperPoints.length > 0) {
            const p1 = [lowerPoints[lowerPoints.length - 1].airflow, lowerPoints[lowerPoints.length - 1].staticPressure];
            const p2 = [upperPoints[0].airflow, upperPoints[0].staticPressure];
            pressure = interpolate(airflow, p1, p2);
          }
        }
        dataPoint[`pressure_${fan.id}`] = pressure;
      });
      return dataPoint;
    });

    const convertedChartData = chartData.map(point => {
      const newPoint = { ...point };
      newPoint.airflow = units.airflow === "CFM" ? m3hToCfm(point.airflow) : point.airflow;
      Object.keys(point).forEach(key => {
        if (key.startsWith("pressure_")) {
          newPoint[key] = units.pressure === "inWG" ? paToInwg(point[key]) : point[key];
        }
      });
      return newPoint;
    });

    const getSpecValue = (fan, key) => {
      switch (key) {
        case "maxAirflow": return units.airflow === "CFM" ? m3hToCfm(fan.maxAirflow) : fan.maxAirflow;
        case "maxStaticPressure": return units.pressure === "inWG" ? paToInwg(fan.maxStaticPressure) : fan.maxStaticPressure;
        case "tempRange": return `${fan.minTemp} الی ${fan.maxTemp}`;
        case "dimensions": return `${fan.dimensions.height}x${fan.dimensions.width}x${fan.dimensions.depth}`;
        case "electrical": return `${fan.electricalSpecs.voltage}V / ${fan.electricalSpecs.phase}Ph / ${fan.electricalSpecs.frequency}Hz`;
        case "type": return fan.type;
        case "manufacturer": return fan.manufacturer;
        case "powerConsumption": return fan.powerConsumption;
        case "motorRpm": return fan.motorRpm;
        case "noiseLevel": return fan.noiseLevel;
        case "price": return fan.price;
        default: return "";
      }
    };

    const specRows = [
      { label: "نوع فن", key: "type" },
      { label: "سازنده", key: "manufacturer" },
      { label: `حداکثر دبی هوا (${units.airflow})`, key: "maxAirflow", highlight: "max" },
      { label: `حداکثر فشار استاتیک (${units.pressure})`, key: "maxStaticPressure", highlight: "max" },
      { label: "توان مصرفی (kW)", key: "powerConsumption", highlight: "min" },
      { label: "دور موتور (RPM)", key: "motorRpm" },
      { label: "سطح صدا (dB)", key: "noiseLevel", highlight: "min" },
      { label: "محدوده دمای کاری (°C)", key: "tempRange" },
      { label: "ابعاد (HxWxD mm)", key: "dimensions" },
      { label: "مشخصات الکتریکی", key: "electrical" },
      { label: "قیمت تخمینی (ریال)", key: "price", highlight: "min" },
    ];

    return { chartData: convertedChartData, specRows, getSpecValue, colors };
  }, [fans, units]);

  if (!fans || fans.length < 2) {
    return (
      <div className="text-center p-8 text-white/80 bg-black/40 rounded-xl">
        <p>برای مقایسه حداقل دو فن را انتخاب کنید.</p>
        <button onClick={onBack} className="mt-4 py-2 px-4 bg-black/40 text-white rounded-md hover:bg-black/60 transition-all">بازگشت</button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black p-6 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.1)] text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/20 pb-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold drop-shadow-[0_0_8px_rgb(255,255,255)]">مقایسه محصولات</h2>
          <p className="text-md text-white/70">مقایسه مشخصات فنی فن‌های انتخاب شده</p>
        </div>
        <button
          onClick={onBack}
          className="py-2 px-4 bg-black/40 text-white rounded-md hover:bg-black/60 transition-all drop-shadow-[0_0_6px_rgb(255,255,255)] flex items-center gap-2"
        >
          بازگشت به لیست
        </button>
      </div>

      {/* Units Selector */}
      <div className="flex justify-start items-center gap-4 text-sm mb-6 p-4 bg-black/30 rounded-md">
        <span className="font-medium text-white/80">واحد مقادیر:</span>
        <div className="flex items-center gap-2">
          <label className="text-white/70">دبی:</label>
          <select
            value={units.airflow}
            onChange={e => setUnits(u => ({ ...u, airflow: e.target.value }))}
            className="bg-black/50 border border-white/20 text-white/90 text-xs rounded p-1"
          >
            <option value="m³/h">m³/h</option>
            <option value="CFM">CFM</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-white/70">فشار:</label>
          <select
            value={units.pressure}
            onChange={e => setUnits(u => ({ ...u, pressure: e.target.value }))}
            className="bg-black/50 border border-white/20 text-white/90 text-xs rounded p-1"
          >
            <option value="Pa">Pa</option>
            <option value="inWG">inWG</option>
          </select>
        </div>
      </div>

      {/* Gemini Summary */}
      <GeminiComparisonSummary fans={fans} />

      {/* Table */}
      <div className="overflow-x-auto relative">
        <table className="w-full border-collapse text-right">
          <thead>
            <tr className="border-b-2 border-white/20">
              <th className="p-3 text-sm font-semibold text-white/80 text-right sticky left-0 z-10 bg-black/30">مشخصات</th>
              {fans.map(fan => (
                <th key={fan.id} className="p-3 text-sm font-semibold text-center text-white/90">
                  <img src={fan.imageUrl} alt={fan.model} className="w-32 h-24 object-cover mx-auto rounded-md mb-2 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                  {fan.model}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specRows.map(row => (
              <ComparisonRow
                key={row.label}
                label={row.label}
                values={fans.map(fan => getSpecValue(fan, row.key))}
                highlight={row.highlight}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart */}
      <div className="mt-12">
        <h3 className="text-xl font-bold mb-4 text-center drop-shadow-[0_0_8px_rgb(255,255,255)]">انطباق نمودار عملکرد</h3>
        <div className="h-96 w-full bg-black/40 p-2 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20"/>
              <XAxis dataKey="airflow" type="number" name={`دبی هوا (${units.airflow})`} unit={` ${units.airflow}`} domain={['dataMin', 'dataMax']} tickFormatter={tick => tick.toLocaleString('en-US')} stroke="white"/>
              <YAxis name={`فشار استاتیک (${units.pressure})`} unit={` ${units.pressure}`} domain={['auto', 'auto']} tickFormatter={tick => tick.toLocaleString('en-US')} stroke="white"/>
              <Tooltip content={<CustomComparisonTooltip units={units} />} />
              <Legend wrapperStyle={{ color: 'white' }} />
              {fans.map((fan, index) => (
                <Line key={fan.id} type="monotone" dataKey={`pressure_${fan.id}`} name={fan.model} stroke={colors[index % colors.length]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FanComparison;
