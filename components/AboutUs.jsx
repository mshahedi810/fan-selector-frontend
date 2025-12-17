"use client";

import { FaUsers, FaLightbulb, FaRocket } from "react-icons/fa";

const AboutUs = ({ onNavigate }) => {
  return (
    <div className="p-8 max-w-5xl mx-auto text-[#0ff] bg-[#111] rounded-xl shadow-2xl border border-[#0ff33] space-y-6">
      <h2 className="text-4xl font-extrabold mb-4 text-[#0ff] flex items-center gap-3">
        <FaUsers /> درباره ما
      </h2>
      <p className="text-[#0ff88] text-lg leading-relaxed">
        ما یک تیم متخصص در زمینه طراحی و تولید فن‌های صنعتی هستیم. هدف ما ارائه 
        محصولاتی با کیفیت بالا و کارایی بهینه برای مشتریان است. تجربه، خلاقیت و تعهد، 
        ارزش‌های اصلی ما هستند.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center text-center p-4 border border-[#0ff33] rounded-lg hover:shadow-[0_0_20px_#0ff33] transition-all">
          <FaLightbulb size={40} className="mb-2 text-[#0ff]" />
          <h3 className="font-bold text-lg text-[#0ff]">ایده‌های نوآورانه</h3>
          <p className="text-[#0ff88] text-sm">همیشه در تلاشیم ایده‌های خلاقانه را در محصولات خود اجرا کنیم.</p>
        </div>
        <div className="flex flex-col items-center text-center p-4 border border-[#0ff33] rounded-lg hover:shadow-[0_0_20px_#0ff33] transition-all">
          <FaRocket size={40} className="mb-2 text-[#0ff]" />
          <h3 className="font-bold text-lg text-[#0ff]">پیشرفت سریع</h3>
          <p className="text-[#0ff88] text-sm">با سرعت و کیفیت، پروژه‌ها را به موقع و با بهترین عملکرد تحویل می‌دهیم.</p>
        </div>
        <div className="flex flex-col items-center text-center p-4 border border-[#0ff33] rounded-lg hover:shadow-[0_0_20px_#0ff33] transition-all">
          <FaUsers size={40} className="mb-2 text-[#0ff]" />
          <h3 className="font-bold text-lg text-[#0ff]">تیم حرفه‌ای</h3>
          <p className="text-[#0ff88] text-sm">تیمی متعهد و متخصص که همواره پشتیبان مشتریان است.</p>
        </div>
      </div>

      <button
        onClick={() => onNavigate('home')}
        className="mt-6 px-6 py-3 bg-[#0ff] text-[#111] font-bold rounded-lg hover:bg-[#0cc] transition-all flex items-center gap-2"
      >
        بازگشت به صفحه اصلی
        <FaRocket />
      </button>
    </div>
  );
};

export default AboutUs;
