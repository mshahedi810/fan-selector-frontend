"use client";

import { GiComputerFan } from "react-icons/gi";
import { FaWind, FaTachometerAlt, FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const FanCard = ({ fan, onSelect, onToggleCompare, isSelectedForCompare }) => {
  return (
    <motion.div
      className={`fan-card flex flex-col h-full relative bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 border ${
        isSelectedForCompare ? "ring-2 ring-red-400" : "border-gray-700"
      }`}
      whileHover={{ scale: 1.03 }}
    >
      {/* تصویر */}
      <div className="relative group">
        <img
          src={fan.imageUrl}
          alt={fan.model}
          className="w-full h-44 md:h-48 object-cover transition-transform duration-300 group-hover:scale-105 rounded-t-3xl"
        />
        {isSelectedForCompare && (
          <div className="absolute top-3 right-3 bg-red-100/20 text-red-400 px-3 py-1 text-xs rounded-md font-semibold shadow backdrop-blur-sm">
            در مقایسه
          </div>
        )}
      </div>

      {/* محتوا */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="text-lg md:text-xl font-extrabold text-white flex items-center gap-2 line-clamp-2">
          <FaInfoCircle className="text-pink-400" />
          {fan.model}
        </h3>

        <p className="flex items-center gap-2 text-white/80 font-semibold line-clamp-1">
          <GiComputerFan className="text-green-400" size={22} />
          {fan.manufacturer} • {fan.type}
        </p>

        <p className="text-white/70 text-sm line-clamp-3 leading-relaxed flex-1">
          {fan.description}
        </p>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 bg-gray-700/50 p-2 rounded-xl shadow-inner hover:bg-gray-700/70 transition-colors">
            <FaWind className="text-pink-400" />
            <div>
              <div className="text-xs font-semibold text-pink-400">دبی هوا</div>
              <div className="text-sm text-white/80">{fan.maxAirflow.toLocaleString('fa-IR')} m³/h</div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-700/50 p-2 rounded-xl shadow-inner hover:bg-gray-700/70 transition-colors">
            <FaTachometerAlt className="text-green-400" />
            <div>
              <div className="text-xs font-semibold text-green-400">فشار استاتیک</div>
              <div className="text-sm text-white/80">{fan.maxStaticPressure.toLocaleString('fa-IR')} Pa</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <button
            onClick={onSelect}
            className="w-full sm:flex-1 py-2 px-3 bg-pink-500 text-white font-bold rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-transform text-center"
          >
            مشاهده جزئیات
          </button>

          <button
            onClick={onToggleCompare}
            className={`w-full sm:flex-1 py-2 px-3 rounded-2xl font-bold text-center border-2 transition-transform hover:scale-105 ${
              isSelectedForCompare
                ? "bg-red-100/20 text-red-400 border-red-400 hover:bg-red-200/30"
                : "bg-gray-700/50 text-white/80 border-gray-600 hover:bg-gray-700/70 hover:text-pink-400 hover:border-pink-400"
            }`}
          >
            {isSelectedForCompare ? "حذف از مقایسه" : "افزودن به مقایسه"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FanCard;
