"use client";

import { useState } from 'react';
import { FaTachometerAlt, FaChartLine, FaDollarSign, FaMicrochip } from 'react-icons/fa';
import SpecTab from './SpecTab';
import PerformanceSimulator from './PerformanceSimulator';
import EconomicAnalysis from './EconomicAnalysis';
import Monitoring from './Monitoring';

const FanDetails = ({ fan, onBack }) => {
  const [activeTab, setActiveTab] = useState('specs');

  const tabs = [
    { id: 'specs', label: 'مشخصات فنی', icon: <FaTachometerAlt /> },
    { id: 'simulation', label: 'شبیه‌سازی عملکرد', icon: <FaChartLine /> },
    { id: 'eco', label: 'آنالیز اقتصادی', icon: <FaDollarSign /> },
    { id: 'monitor', label: 'مانیتورینگ IoT', icon: <FaMicrochip /> },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black p-6 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_12px_rgb(255,255,255)]">{fan.model}</h2>
        <button onClick={onBack} className="py-2 px-4 bg-black/60 text-white rounded-lg hover:bg-black/80 transition-all shadow-[0_0_10px_rgba(255,255,255,0.2)]">بازگشت</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <img src={fan.imageUrl} alt={fan.model} className="w-full rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] object-cover" />
          <div className="mt-6 text-white/80">
            <h3 className="font-bold mb-2">توضیحات</h3>
            <p className="text-sm leading-relaxed">{fan.description}</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="border-b border-white/20 no-print">
            <nav className="-mb-px flex gap-x-6 overflow-x-auto" aria-label="Tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-3 px-3 border-b-2 font-medium text-sm flex items-center gap-2 transition-all duration-200
        ${activeTab === tab.id
                      ? 'border-blue-400 text-blue-400 drop-shadow-[0_0_8px_rgb(59,130,246)] bg-black/50'
                      : 'border-transparent text-white/80 hover:text-blue-400 hover:border-blue-400 hover:drop-shadow-[0_0_6px_rgb(59,130,246)] bg-black/30'}`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6 space-y-6">
            {activeTab === 'specs' && <SpecTab fan={fan} />}
            {activeTab === 'simulation' && <PerformanceSimulator fan={fan} />}
            {activeTab === 'eco' && <EconomicAnalysis fan={fan} />}
            {activeTab === 'monitor' && <Monitoring fan={fan} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FanDetails;
