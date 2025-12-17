"use client";

import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { m3hToCfm, cfmToM3h, paToInwg, inwgToPa } from '../../utils/conversions';

const CustomTooltip = ({ active, payload, label, units }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const airflowUnit = units?.airflow || 'm³/h';
    const pressureUnit = units?.pressure || 'Pa';
    return (
      <div className="p-3 bg-black/70 text-white rounded-lg border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
        <p className="font-bold border-b border-white/20 pb-1 mb-2">{`دبی: ${label?.toLocaleString('fa-IR')} ${airflowUnit}`}</p>
        <ul className="space-y-1 text-sm">
          {payload.map(p => (
            <li key={p.dataKey} className="flex items-center gap-2">
              <span className="block w-3 h-3 rounded-full" style={{ backgroundColor: p.stroke }}></span>
              <span>{`${p.name}: ${p.value.toLocaleString('fa-IR')} ${p.unit ?? ''}`}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return null;
};

const PerformanceSimulator = ({ fan }) => {
  const [systemInputs, setSystemInputs] = useState({
    airflow: Math.round(fan.maxAirflow * 0.6),
    pressure: fan.performanceCurve.find(p => p.airflow >= fan.maxAirflow * 0.6)?.staticPressure || fan.maxStaticPressure * 0.5,
  });

  const [units, setUnits] = useState({ airflow: 'm³/h', pressure: 'Pa' });

  const displayInputs = useMemo(() => ({
    airflow: units.airflow === 'CFM' ? Math.round(m3hToCfm(systemInputs.airflow)) : systemInputs.airflow,
    pressure: units.pressure === 'inWG' ? paToInwg(systemInputs.pressure).toFixed(2) : systemInputs.pressure,
  }), [systemInputs, units]);

  const simulationResults = useMemo(() => {
    const q_req_m3s = systemInputs.airflow / 3600;
    if (q_req_m3s <= 0) return { operatingPoint: null, chartData: fan.performanceCurve };

    const k = systemInputs.pressure / (q_req_m3s * q_req_m3s);
    const chartData = fan.performanceCurve.map(point => ({
      ...point,
      systemPressure: k * (point.airflow / 3600) ** 2,
    }));

    let operatingPoint = null;
    let minDiff = Infinity;
    chartData.forEach(point => {
      const diff = Math.abs(point.staticPressure - point.systemPressure);
      if (diff < minDiff) {
        minDiff = diff;
        operatingPoint = point;
      }
    });

    return { operatingPoint, chartData };
  }, [systemInputs, fan]);

  const { convertedChartData, convertedOperatingPoint } = useMemo(() => {
    const convertPoint = (p) => ({
      ...p,
      airflow: units.airflow === 'CFM' ? m3hToCfm(p.airflow) : p.airflow,
      staticPressure: units.pressure === 'inWG' ? paToInwg(p.staticPressure) : p.staticPressure,
      systemPressure: p.systemPressure !== undefined ? (units.pressure === 'inWG' ? paToInwg(p.systemPressure) : p.systemPressure) : undefined,
    });

    const convertedData = simulationResults.chartData.map(convertPoint);
    const convertedOpPoint = simulationResults.operatingPoint ? convertPoint(simulationResults.operatingPoint) : null;

    return { convertedChartData: convertedData, convertedOperatingPoint: convertedOpPoint };
  }, [simulationResults, units]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let baseValue = Number(value);

    if (name === 'airflow') baseValue = units.airflow === 'CFM' ? cfmToM3h(baseValue) : baseValue;
    if (name === 'pressure') baseValue = units.pressure === 'inWG' ? inwgToPa(baseValue) : baseValue;

    setSystemInputs(prev => ({ ...prev, [name]: baseValue < 0 ? 0 : baseValue }));
  };

  return (
    <div className="space-y-6 bg-black/50 p-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-white/80">دبی هوا ({units.airflow})</label>
          <input type="number" name="airflow" value={displayInputs.airflow} onChange={handleInputChange} className="w-full p-2 rounded-lg bg-black/40 border border-white/20 text-white" />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/80">فشار سیستم ({units.pressure})</label>
          <input type="number" name="pressure" value={displayInputs.pressure} onChange={handleInputChange} className="w-full p-2 rounded-lg bg-black/40 border border-white/20 text-white" />
        </div>
      </div>

      {convertedOperatingPoint && (
        <div className="p-4 border-l-4 border-green-400 bg-black/60 rounded-xl text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]">
          <h4 className="font-bold mb-3 text-green-400 drop-shadow-[0_0_8px_rgb(16,185,129)]">نقطه کارکرد شبیه‌سازی شده</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xs text-white/70">دبی واقعی</div>
              <div className="text-lg font-bold text-white mt-1">{Math.round(convertedOperatingPoint.airflow).toLocaleString('fa-IR')}<span className="text-sm font-normal">{units.airflow}</span></div>
            </div>
            <div>
              <div className="text-xs text-white/70">فشار واقعی</div>
              <div className="text-lg font-bold text-white mt-1">{Math.round(convertedOperatingPoint.staticPressure).toLocaleString('fa-IR')}<span className="text-sm font-normal">{units.pressure}</span></div>
            </div>
            <div>
              <div className="text-xs text-white/70">توان مصرفی</div>
              <div className="text-lg font-bold text-white mt-1">{(convertedOperatingPoint.power ?? 0).toLocaleString('fa-IR', { maximumFractionDigits: 2 })}<span className="text-sm font-normal">kW</span></div>
            </div>
            <div>
              <div className="text-xs text-white/70">راندمان</div>
              <div className="text-lg font-bold text-white mt-1">{convertedOperatingPoint.efficiency !== undefined ? convertedOperatingPoint.efficiency.toFixed(1).toLocaleString('fa-IR') : 'N/A'}<span className="text-sm font-normal">%</span></div>
            </div>
          </div>
        </div>
      )}

      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={convertedChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis dataKey="airflow" type="number" name={`دبی هوا (${units.airflow})`} unit={` ${units.airflow}`} domain={['dataMin', 'dataMax']} tickFormatter={(tick) => tick.toLocaleString('en-US')} stroke="white" />
            <YAxis name={`فشار استاتیک (${units.pressure})`} unit={` ${units.pressure}`} domain={['auto', 'auto']} tickFormatter={(tick) => tick.toLocaleString('en-US')} stroke="white" />
            <Tooltip content={<CustomTooltip units={units} />} />
            <Legend />
            <Line type="monotone" dataKey="staticPressure" name="فشار فن" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="systemPressure" name="فشار سیستم" stroke="#ef4444" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceSimulator;
