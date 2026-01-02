// CustomerPortal.jsx
"use client";

import { useState, useMemo, useEffect } from 'react';
import FanDetails from './FanDetails/FanDetails';
import FanComparison from './FanComparison/FanComparison';
import AIVoiceFilter from './AIVoiceFilter';
import FanSelectorForm from './FanSelectorForm';
import FanResults from './FanResults';
import AITextInput from './AITextInput';

const CustomerPortal = () => {
  const [fans, setFans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    airflow: 0,
    staticPressure: 0,
    temperature: 25,
  });

  const [selectedFan, setSelectedFan] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [view, setView] = useState('list'); // 'list' | 'details' | 'compare'
  const [aiResponse, setAiResponse] = useState(''); // پاسخ AI Agent

  useEffect(() => {
    const fetchFans = async () => {
      try {
        const res = await fetch('api/fans/variants');
        if (!res.ok) throw new Error('Failed to fetch fans from API');
        const data = await res.json();

        const fansWithSeries = data.map(f => ({
          ...f,
          _id: f._id || f.id,
          model: f.fanSeries?.model || '',
          imageUrl: f.fanSeries?.imageUrl || '',
          type: f.fanSeries?.type || '',
          manufacturer: f.fanSeries?.manufacturer || '',
          minTemp: f.fanSeries?.minTemp ?? 0,
          maxTemp: f.fanSeries?.maxTemp ?? 100,
          maxStaticPressure: f.fanSeries?.maxStaticPressure ?? 0,
          maxAirflow: f.fanSeries?.maxAirflow ?? 0,
        }));

        setFans(fansWithSeries);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFans();
  }, []);

  const filteredFans = useMemo(() => {
    return fans.filter(fan =>
      fan.maxAirflow >= filters.airflow &&
      fan.maxStaticPressure >= filters.staticPressure &&
      fan.minTemp <= filters.temperature &&
      fan.maxTemp >= filters.temperature
    );
  }, [fans, filters]);

  const handleSelectFan = (fan) => {
    setSelectedFan(fan);
    setView('details');
  };

  const handleToggleCompare = (fan) => {
    setCompareList(prev => {
      const exists = prev.find(f => f._id === fan._id);
      if (exists) {
        return prev.filter(f => f._id !== fan._id);
      }
      if (prev.length < 4) {
        return [...prev, fan];
      }
      return prev;
    });
  };

  const handleShowComparison = () => {
    if (compareList.length > 1) setView('compare');
  };

  const handleBackToList = () => setView('list');
  const handleBackFromCompare = () => setView('list');

  const renderContent = () => {
    if (loading) return <div className="text-center py-16">در حال بارگذاری...</div>;
    if (error) return <div className="text-center py-16 text-red-600">خطا در دریافت داده‌ها: {error}</div>;

    if (view === 'details' && selectedFan) {
      return <FanDetails fan={selectedFan} onBack={handleBackToList} />;
    }

    if (view === 'compare' && compareList.length > 1) {
      return <FanComparison fans={compareList} onBack={handleBackFromCompare} />;
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* سمت چپ: فرم و AI */}
        <div className="lg:col-span-1 space-y-6">
          <FanSelectorForm filters={filters} onFilterChange={setFilters} />

          <AIVoiceFilter
            onAiResponse={setAiResponse}
            webhookUrl="https://n8n.ftp-co.com/webhook/fan-session"
          />

          <AITextInput
            webhookUrl="https://n8n.ftp-co.com/webhook/fan-session"
            onAiResponse={setAiResponse}
          />

          {aiResponse && (
            <div className="p-4 bg-green-50 rounded-xl shadow-md text-sm text-gray-800 space-y-2">
              <h4 className="font-semibold mb-2">پیشنهاد AI Agent:</h4>
              <pre className="whitespace-pre-wrap">{aiResponse}</pre>
            </div>
          )}
        </div>

        {/* سمت راست: نتایج */}
        <div className="lg:col-span-3">
          <FanResults
            fans={filteredFans}
            onSelectFan={handleSelectFan}
            onToggleCompare={handleToggleCompare}
            compareList={compareList}
            onShowComparison={handleShowComparison}
          />
        </div>
      </div>
    );
  };

  return <>{renderContent()}</>;
};

export default CustomerPortal;
