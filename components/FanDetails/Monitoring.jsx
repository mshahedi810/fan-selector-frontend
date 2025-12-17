"use client";

import { useState, useEffect } from 'react';

const Monitoring = ({ fan }) => {
  const [monitoringData, setMonitoringData] = useState({
    rpm: fan.motorRpm,
    temp: 45,
    vibration: 0.5
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMonitoringData({
        rpm: fan.motorRpm + Math.floor(Math.random() * 50) - 25,
        temp: 45 + Math.random() * 5 - 2.5,
        vibration: 0.5 + Math.random() * 0.2 - 0.1
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [fan.motorRpm]);

  const cards = [
    { label: "سرعت موتور (RPM)", value: monitoringData.rpm, color: "text-pink-400" },
    { label: "دمای موتور (°C)", value: monitoringData.temp.toFixed(1), color: "text-green-400" },
    { label: "لرزش (mm/s)", value: monitoringData.vibration.toFixed(2), color: "text-blue-400" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((c, idx) => (
        <div key={idx} className={`bg-black/50 rounded-xl p-4 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all text-center`}>
          <div className="text-xs text-white/70">{c.label}</div>
          <div className={`text-3xl font-bold mt-2 ${c.color} drop-shadow-[0_0_8px]`}>{c.value}</div>
        </div>
      ))}
    </div>
  );
};

export default Monitoring;
