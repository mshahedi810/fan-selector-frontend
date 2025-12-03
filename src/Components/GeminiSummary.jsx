import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FiRefreshCw, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const GeminiSummary = ({ fans }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getSummary = async () => {
    if (!fans || fans.length === 0) return;

    setIsLoading(true);
    setError('');
    setSummary('');

    try {
      if (!process.env.REACT_APP_GOOGLE_API_KEY) {
        setError("API Key تنظیم نشده است.");
        setIsLoading(false);
        return;
      }

      const ai = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_API_KEY);
      const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

      const fanDataString = fans.map(f =>
        `Model: ${f.model}, Type: ${f.type}, Airflow: ${f.maxAirflow} m3/h, Pressure: ${f.maxStaticPressure} Pa, Power: ${f.powerConsumption} kW, Noise: ${f.noiseLevel} dB`
      ).join('\n');

      const prompt = `به عنوان یک مهندس حرفه‌ای HVAC، یک خلاصه فارسی کوتاه برای فن‌های صنعتی زیر ارائه دهید. نقاط قوت و کاربرد ایده‌آل هر مدل را ذکر کنید.

Fan Data:
${fanDataString}`;

      const result = await model.generateContent({
        contents: prompt
      });

      const text = result.output_text || result.contents?.[0]?.text || "خطا: پاسخی دریافت نشد";
      setSummary(text);

    } catch (e) {
      console.error(e);
      setError("خطا در تولید خلاصه رخ داد.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-tr from-indigo-50 to-blue-50 border border-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <h3 className="flex items-center gap-3 text-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-2xl shadow-md">
          🧠 خلاصه هوشمند
        </h3>

        <button
          onClick={getSummary}
          disabled={isLoading || fans.length === 0}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm py-2 px-6 rounded-2xl shadow-md hover:scale-105 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '⏳ در حال پردازش...' : <><FiRefreshCw /> تولید خلاصه</>}
        </button>
      </div>

      {/* Divider */}
      <div className="border-b border-blue-200 mb-3"></div>

      {/* Error */}
      {error && (
        <p className="flex items-center gap-2 text-red-600 text-sm mb-2 bg-red-100 p-2 rounded-lg shadow-inner">
          <FiAlertCircle /> {error}
        </p>
      )}

      {/* Summary */}
      {summary && (
        <div className="mt-3 bg-white p-5 rounded-2xl shadow-inner border border-blue-100 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed hover:shadow-md transition-shadow duration-200">
          {summary}
        </div>
      )}

      {/* Footer / Info */}
      <div className="flex flex-wrap justify-between items-center mt-4 text-xs text-blue-600 gap-2">
        <span className="flex items-center gap-1"><FiCheckCircle /> تعداد فن‌ها: {fans.length}</span>
        <span className="flex items-center gap-1"><FiRefreshCw /> آخرین بروزرسانی: {new Date().toLocaleDateString('fa-IR')}</span>
      </div>
    </div>
  );
};

export default GeminiSummary;
