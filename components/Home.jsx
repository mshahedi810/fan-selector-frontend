"use client";

import { FiUsers, FiSettings } from "react-icons/fi";
import { motion } from "framer-motion";

const gradientMap = {
  blue: "from-blue-800/80 to-blue-900/90",
  green: "from-green-800/80 to-green-900/90",
};

const glowMap = {
  blue: "bg-blue-400/20",
  green: "bg-green-400/20",
};

const Home = ({ onNavigate }) => {
  const isAdminLoggedIn = () => {
    const loggedIn = localStorage.getItem("adminLoggedIn") === "true";
    const expire = parseInt(localStorage.getItem("adminExpire"), 10);
    if (!loggedIn || !expire) return false;
    if (Date.now() > expire) {
      localStorage.removeItem("adminLoggedIn");
      localStorage.removeItem("adminExpire");
      return false;
    }
    return true;
  };

  const cards = [
    {
      title: "بخش مشتریان و انتخاب محصول",
      description:
        "جستجو، فیلتر و شبیه‌سازی عملکرد فن‌ها بر اساس نیازهای پروژه شما.",
      icon: <FiUsers size={36} className="text-blue-400" />,
      gradientKey: "blue",
      glowColorKey: "blue",
      onClick: () => onNavigate("customer"),
    },
    {
      title: "بخش پرسنل و مشاوران",
      description:
        "مدیریت پایگاه داده محصولات، افزودن فن جدید و ویرایش پارامترهای فنی.",
      icon: <FiSettings size={36} className="text-green-400" />,
      gradientKey: "green",
      glowColorKey: "green",
      onClick: () => {
        if (isAdminLoggedIn()) onNavigate("admin");
        else onNavigate("login");
      },
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[82vh] px-4 bg-linear-to-br from-gray-900 via-gray-950 to-black">
      <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 text-center drop-shadow-[0_0_12px_rgba(0,0,0,0.7)]">
        به سیستم هوشمند انتخاب فن صنعتی خوش آمدید
      </h2>
      <p className="text-lg text-white/80 mb-12 text-center max-w-2xl drop-shadow-[0_0_6px_rgba(0,0,0,0.5)]">
        لطفاً بخش مورد نظر خود را برای ادامه انتخاب کنید.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {cards.map((card, idx) => (
          <motion.button
            key={idx}
            onClick={card.onClick}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className={`relative rounded-3xl shadow-lg p-8 text-center transition-all duration-300 transform overflow-hidden border border-white/10 bg-linear-to-br ${gradientMap[card.gradientKey]}`}
            style={{ minHeight: "360px" }}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/20">
              {card.icon}
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(0,0,0,0.7)]">
              {card.title}
            </h3>

            <p className="text-white/80 text-sm md:text-base drop-shadow-[0_0_6px_rgba(0,0,0,0.5)]">
              {card.description}
            </p>

            <div
              className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${glowMap[card.glowColorKey]} blur-3xl pointer-events-none animate-pulse`}
            ></div>
            <div
              className={`absolute -bottom-10 -left-10 w-32 h-32 rounded-full ${glowMap[card.glowColorKey]} blur-3xl pointer-events-none animate-pulse`}
            ></div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Home;
