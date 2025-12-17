"use client";
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FiRefreshCw, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const GeminiSummary = ({ fans }) => {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const getSummary = async () => {
    if (!fans || fans.length === 0) return;

    setIsLoading(true);
    setError("");
    setSummary("");

    try {
      if (!process.env.NEXT_PUBLIC_GOOGLE_API_KEY) {
        setError("API Key تنظیم نشده است.");
        setIsLoading(false);
        return;
      }

      const ai = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
      const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

      const fanDataString = fans
        .map(
          (f) =>
            `Model: ${f.model}, Type: ${f.type}, Airflow: ${f.maxAirflow} m³/h, Pressure: ${f.maxStaticPressure} Pa, Power: ${f.powerConsumption} kW, Noise: ${f.noiseLevel} dB`
        )
        .join("\n");

      const prompt = `به عنوان یک مهندس حرفه‌ای HVAC، یک خلاصه فارسی کوتاه و روان برای فن‌های صنعتی زیر ارائه دهید. نقاط قوت، کاربرد مناسب و ویژگی برجسته هر مدل را ذکر کنید.

Fan Data:
${fanDataString}`;

      const result = await model.generateContent({ contents: prompt });
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
    <motion.div
      className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-shadow duration-300 flex flex-col"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <h3 className="flex items-center gap-3 text-lg md:text-xl font-extrabold bg-lniear-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-2xl shadow-md">
          🧠 خلاصه هوشمند
        </h3>

        <button
          onClick={getSummary}
          disabled={isLoading || fans.length === 0}
          className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-500 text-white text-sm py-2 px-6 rounded-2xl shadow-md hover:scale-105 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            "⏳ در حال پردازش..."
          ) : (
            <>
              <FiRefreshCw className="animate-spin-slow" /> تولید خلاصه
            </>
          )}
        </button>
      </div>

      <div className="border-b border-gray-700 mb-3"></div>

      {error && (
        <p className="flex items-center gap-2 text-red-400 text-sm mb-3 bg-red-900/20 p-3 rounded-2xl shadow-inner backdrop-blur-sm">
          <FiAlertCircle /> {error}
        </p>
      )}

      {summary && (
        <div className="mt-3 bg-gray-800/70 p-5 rounded-2xl shadow-inner border border-gray-700 text-sm text-white/90 whitespace-pre-wrap leading-relaxed hover:shadow-md transition-shadow duration-200 flex-1">
          {summary}
        </div>
      )}

      <div className="flex flex-wrap justify-between items-center mt-5 text-xs text-gray-300 gap-2">
        <span className="flex items-center gap-1">
          <FiCheckCircle className="text-green-400" /> تعداد فن‌ها: {fans.length}
        </span>
        <span className="flex items-center gap-1">
          <FiRefreshCw className="text-blue-400" /> آخرین بروزرسانی: {new Date().toLocaleDateString("fa-IR")}
        </span>
      </div>

      <p className="mt-4 text-xs text-gray-400 italic">
        نکته: برای بهترین نتیجه، از داده‌های دقیق هر فن استفاده کنید تا خلاصه دقیق و کاربردی تولید شود.
      </p>
    </motion.div>
  );
};

export default GeminiSummary;
