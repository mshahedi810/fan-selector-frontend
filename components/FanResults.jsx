"use client";
import React from "react";
import GeminiSummary from "./GeminiSummary";
import FanCard from "./FanCard";

const FanResults = ({ fans, onSelectFan, onToggleCompare, compareList, onShowComparison }) => {
  return (
    <div className="space-y-6">
      {/* Banner مقایسه */}
      {compareList.length > 0 && (
        <div className="bg-green-500 text-white p-4 rounded-xl shadow-lg sticky top-8 z-20 flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0 transition-all">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 font-medium">
            <span className="font-bold">{compareList.length}</span> محصول برای مقایسه انتخاب شده:
            {compareList.map((f) => (
              <span key={f.id} className="bg-white/20 px-2 py-1 rounded text-sm">
                {f.model}
              </span>
            ))}
          </div>

          <button
            onClick={onShowComparison}
            disabled={compareList.length < 2}
            className="bg-white text-green-700 font-semibold py-2 px-5 rounded-lg hover:bg-white/90 transition-all disabled:bg-slate-400 disabled:cursor-not-allowed shadow-md mt-2 md:mt-0"
          >
            مقایسه کن ({compareList.length}/4)
          </button>
        </div>
      )}

      {/* Gemini Summary */}
      {fans.length > 0 && <GeminiSummary fans={fans} />}

      {/* لیست فن‌ها */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2 md:p-4">
        {fans.map((fan) => (
          <div key={fan.id} className="flex flex-col h-full">
            <FanCard
              fan={fan}
              onSelect={() => onSelectFan(fan)}
              onToggleCompare={() => onToggleCompare(fan)}
              isSelectedForCompare={compareList.some((f) => f.id === fan.id)}
            />
          </div>
        ))}
      </div>

      {/* نمایش وقتی فن پیدا نشد */}
      {fans.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-md border border-slate-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-14 w-14 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <h3 className="mt-4 text-lg font-semibold text-slate-900">نتیجه‌ای یافت نشد</h3>
          <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
            لطفاً پارامترهای فنی پروژه را تغییر دهید و مجدداً تلاش کنید.
          </p>
        </div>
      )}
    </div>
  );
};

export default FanResults;
