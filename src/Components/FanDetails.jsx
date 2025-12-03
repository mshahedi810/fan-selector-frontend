import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { m3hToCfm, cfmToM3h, paToInwg, inwgToPa } from '../utils/conversions';
import { FaTachometerAlt, FaChartLine, FaDollarSign, FaMicrochip } from 'react-icons/fa';

const SpecRow = ({ label, value, unit }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-200">
    <dt className="text-sm font-medium text-slate-600">{label}</dt>
    <dd className="text-sm font-semibold text-slate-800">
      {typeof value === 'number' ? value.toLocaleString('fa-IR') : value} {unit}
    </dd>
  </div>
);

const EconomicAnalysis = ({ fan }) => {
  const [cost, setCost] = useState(5000);
  const [hours, setHours] = useState(8);
  const [days, setDays] = useState(250);

  const annualCost = useMemo(() => {
    const totalHours = hours * days;
    const totalKwh = fan.powerConsumption * totalHours;
    return totalKwh * cost;
  }, [cost, hours, days, fan.powerConsumption]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-500">هزینه برق (ریال/kWh)</label>
          <input type="number" value={cost} onChange={e => setCost(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-md bg-white"/>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500">ساعات کار روزانه</label>
          <input type="number" value={hours} onChange={e => setHours(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-md bg-white"/>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500">روزهای کاری سال</label>
          <input type="number" value={days} onChange={e => setDays(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-md bg-white"/>
        </div>
      </div>
      <div className="bg-blue-50 border-r-4 border-blue-500 p-4 rounded-md text-center transition-all duration-300 hover:bg-blue-100">
        <p className="text-sm text-slate-700">هزینه تخمینی کارکرد سالانه:</p>
        <p className="text-2xl font-bold text-blue-700 mt-1">
          {annualCost.toLocaleString('fa-IR', { maximumFractionDigits: 0 })}
          <span className="text-lg font-normal"> ریال</span>
        </p>
      </div>
    </div>
  );
};

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
      <div className="bg-slate-100 p-4 rounded-lg shadow hover:shadow-lg transition-all duration-300">
        <div className="text-sm text-slate-500">سرعت موتور (RPM)</div>
        <div className="text-3xl font-bold text-slate-800 mt-2">{monitoringData.rpm.toLocaleString('fa-IR')}</div>
      </div>
      <div className="bg-slate-100 p-4 rounded-lg shadow hover:shadow-lg transition-all duration-300">
        <div className="text-sm text-slate-500">دمای موتور (°C)</div>
        <div className="text-3xl font-bold text-slate-800 mt-2">{monitoringData.temp.toLocaleString('fa-IR', {maximumFractionDigits: 1})}</div>
      </div>
      <div className="bg-slate-100 p-4 rounded-lg shadow hover:shadow-lg transition-all duration-300">
        <div className="text-sm text-slate-500">لرزش (mm/s)</div>
        <div className="text-3xl font-bold text-slate-800 mt-2">{monitoringData.vibration.toLocaleString('fa-IR', {maximumFractionDigits: 2})}</div>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label, units }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const airflowUnit = units?.airflow || 'm³/h';
    const pressureUnit = units?.pressure || 'Pa';
    return (
      <div className="p-3 bg-white shadow-lg rounded-md border border-slate-200">
        <p className="font-bold text-slate-800 border-b pb-1 mb-2">{`دبی: ${label?.toLocaleString('fa-IR')} ${airflowUnit}`}</p>
        <ul className="space-y-1 text-sm">
          {payload.find(p => p.dataKey === 'staticPressure') && (
            <li className="flex items-center gap-2">
              <span className="block w-3 h-3 rounded-full" style={{backgroundColor: payload.find(p => p.dataKey === 'staticPressure')?.stroke}}></span>
              <span>{`فشار فن: ${data.staticPressure.toLocaleString('fa-IR', {maximumFractionDigits: 2})} ${pressureUnit}`}</span>
            </li>
          )}
          {payload.find(p => p.dataKey === 'systemPressure') && data.systemPressure && (
            <li className="flex items-center gap-2">
              <span className="block w-3 h-3 rounded-full" style={{backgroundColor: payload.find(p => p.dataKey === 'systemPressure')?.stroke}}></span>
              <span>{`فشار سیستم: ${data.systemPressure.toLocaleString('fa-IR', {maximumFractionDigits: 2})} ${pressureUnit}`}</span>
            </li>
          )}
          {payload.find(p => p.dataKey === 'efficiency') && data.efficiency !== undefined && (
            <li className="flex items-center gap-2">
              <span className="block w-3 h-3 rounded-full" style={{backgroundColor: payload.find(p => p.dataKey === 'efficiency')?.stroke}}></span>
              <span>{`راندمان: ${data.efficiency?.toFixed(1).toLocaleString('fa-IR')} %`}</span>
            </li>
          )}
          <li className="text-slate-600">{`توان مصرفی: ${data.power?.toLocaleString('fa-IR') ?? 0} kW`}</li>
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

  const [units, setUnits] = useState({
    airflow: 'm³/h',
    pressure: 'Pa'
  });

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
      systemPressure: k * (point.airflow / 3600) * (point.airflow / 3600),
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
    const displayValue = Number(value);
    let baseValue = displayValue;

    if (name === 'airflow') baseValue = units.airflow === 'CFM' ? cfmToM3h(displayValue) : displayValue;
    if (name === 'pressure') baseValue = units.pressure === 'inWG' ? inwgToPa(displayValue) : displayValue;

    setSystemInputs(prev => ({ ...prev, [name]: baseValue < 0 ? 0 : baseValue }));
  };

  return (
    <div className="space-y-6">
      {/* ورودی‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-500">دبی هوا ({units.airflow})</label>
          <input type="number" name="airflow" value={displayInputs.airflow} onChange={handleInputChange} className="w-full p-2 border rounded-md"/>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500">فشار سیستم ({units.pressure})</label>
          <input type="number" name="pressure" value={displayInputs.pressure} onChange={handleInputChange} className="w-full p-2 border rounded-md"/>
        </div>
      </div>

      {/* نقطه کارکرد */}
      {convertedOperatingPoint && (
        <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-lg transition-all duration-300 hover:bg-green-100">
          <h4 className="font-bold mb-3 text-green-800">نقطه کارکرد شبیه‌سازی شده</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xs text-slate-500">دبی واقعی</div>
              <div className="text-lg font-bold text-slate-800 mt-1">{Math.round(convertedOperatingPoint.airflow).toLocaleString('fa-IR')}<span className="text-sm font-normal">{units.airflow}</span></div>
            </div>
            <div>
              <div className="text-xs text-slate-500">فشار واقعی</div>
              <div className="text-lg font-bold text-slate-800 mt-1">{Math.round(convertedOperatingPoint.staticPressure).toLocaleString('fa-IR')}<span className="text-sm font-normal">{units.pressure}</span></div>
            </div>
            <div>
              <div className="text-xs text-slate-500">توان مصرفی</div>
              <div className="text-lg font-bold text-slate-800 mt-1">{(convertedOperatingPoint.power ?? 0).toLocaleString('fa-IR', { maximumFractionDigits: 2 })}<span className="text-sm font-normal">kW</span></div>
            </div>
            <div>
              <div className="text-xs text-slate-500">راندمان</div>
              <div className="text-lg font-bold text-slate-800 mt-1">{convertedOperatingPoint.efficiency !== undefined ? convertedOperatingPoint.efficiency.toFixed(1).toLocaleString('fa-IR') : 'N/A'}<span className="text-sm font-normal">%</span></div>
            </div>
          </div>
        </div>
      )}

      {/* نمودار عملکرد */}
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={convertedChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="airflow" type="number" name={`دبی هوا (${units.airflow})`} unit={` ${units.airflow}`} domain={['dataMin', 'dataMax']} tickFormatter={(tick) => tick.toLocaleString('en-US')} />
            <YAxis name={`فشار استاتیک (${units.pressure})`} unit={` ${units.pressure}`} domain={['auto', 'auto']} tickFormatter={(tick) => tick.toLocaleString('en-US')} />
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

const FanDetails = ({ fan, onBack }) => {
  const [activeTab, setActiveTab] = useState('specs');

  const handlePrint = () => window.print();

  const tabs = [
    { id: 'specs', label: 'مشخصات فنی', icon: <FaTachometerAlt /> },
    { id: 'simulation', label: 'شبیه‌سازی عملکرد', icon: <FaChartLine /> },
    { id: 'eco', label: 'آنالیز اقتصادی', icon: <FaDollarSign /> },
    { id: 'monitor', label: 'مانیتورینگ IoT', icon: <FaMicrochip /> },
  ];

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg" id="print-section">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">{fan.model}</h2>
        <button onClick={onBack} className="py-2 px-4 bg-slate-500 text-white rounded-md hover:bg-slate-600">بازگشت</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <img src={fan.imageUrl} alt={fan.model} className="w-full rounded-lg shadow-md object-cover" />
          <div className="mt-6">
            <h3 className="font-bold mb-2">توضیحات</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{fan.description}</p>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="border-b border-slate-200 no-print">
            <nav className="-mb-px flex gap-x-6 overflow-x-auto" aria-label="Tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-3 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-all duration-200 ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === 'specs' && (
              <dl>
                <SpecRow label="حداکثر دبی هوا" value={fan.maxAirflow} unit="m³/h" />
                <SpecRow label="حداکثر فشار استاتیک" value={fan.maxStaticPressure} unit="Pa" />
                <SpecRow label="توان مصرفی" value={fan.powerConsumption} unit="kW" />
                <SpecRow label="دور موتور" value={fan.motorRpm} unit="RPM" />
                <SpecRow label="سطح صدا" value={fan.noiseLevel} unit="dB" />
                <SpecRow label="محدوده دمای کاری" value={`${fan.minTemp} الی ${fan.maxTemp}`} unit="°C" />
                <SpecRow label="ابعاد (HxWxD)" value={`${fan.dimensions.height}x${fan.dimensions.width}x${fan.dimensions.depth}`} unit="mm" />
                <SpecRow label="مشخصات الکتریکی" value={`${fan.electricalSpecs.voltage}V / ${fan.electricalSpecs.phase}Ph / ${fan.electricalSpecs.frequency}Hz`} />
                <SpecRow label="نوع سیال مناسب" value={fan.fluidType.join('، ')} />
                <SpecRow label="قیمت تخمینی" value={fan.price.toLocaleString('fa-IR')} unit="ریال" />
              </dl>
            )}
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
