"use client";
import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GeminiComparisonSummary = ({ fans }) => {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const getSummary = async () => {
    setIsLoading(true);
    setError("");
    setSummary("");

    if (!process.env.NEXT_PUBLIC_GOOGLE_API_KEY) {
      setError("API key is not configured.");
      setIsLoading(false);
      return;
    }

    try {
      const ai = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
      const fanDataString = fans.map(f => `Model: ${f.model}, Type: ${f.type}, Airflow: ${f.maxAirflow} m3/h, Pressure: ${f.maxStaticPressure} Pa, Power: ${f.powerConsumption} kW, Noise: ${f.noiseLevel} dB, Price: ${f.price} ریال`).join("\n");
      const prompt = `As an expert HVAC engineer, compare the following industrial fans. Provide a concise, professional comparison in Persian, highlighting pros and cons.\n\nFan Data:\n${fanDataString}`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      setSummary(response.text);
    } catch (e) {
      console.error(e);
      setError("خطا در تولید تحلیل.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black/40 border border-white/20 rounded-lg p-4 my-6 text-white/90">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-white/80 drop-shadow-[0_0_6px_rgb(255,255,255)]">تحلیل مقایسه‌ای هوشمند</h3>
        <button
          onClick={getSummary}
          disabled={isLoading || fans.length < 2}
          className="bg-blue-600 text-white text-xs py-1 px-3 rounded-md hover:bg-blue-700 disabled:bg-white/20 transition-all"
        >
          {isLoading ? "در حال پردازش..." : "تولید تحلیل"}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {summary && <div className="mt-4 text-sm text-white/80 whitespace-pre-wrap prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, "<br />") }}></div>}
    </div>
  );
};

export default GeminiComparisonSummary;
