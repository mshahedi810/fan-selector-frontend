"use client";

const FanCard = ({ fan, onSelect, onToggleCompare, isSelectedForCompare }) => {
  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-shadow duration-300 overflow-hidden">
      
      {/* تصویر */}
      <div className="w-full h-48 overflow-hidden rounded-t-2xl">
        <img
          src={fan.imageUrl}
          alt={fan.model}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* محتوا */}
      <div className="flex-1 flex flex-col justify-between p-4 space-y-3 text-white">
        <div>
          <h3 className="text-lg font-bold truncate drop-shadow-[0_0_6px_cyan]">{fan.model}</h3>
          <p className="text-sm text-white/70 line-clamp-3">{fan.description}</p>

          {/* مشخصات کلیدی */}
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-white/60">
            <span>دبی هوا: {fan.maxAirflow} m³/h</span>
            <span>فشار استاتیک: {fan.maxStaticPressure} Pa</span>
            <span>توان: {fan.powerConsumption} kW</span>
            <span>RPM: {fan.motorRpm}</span>
          </div>
        </div>

        {/* دکمه‌ها */}
        <div className="flex justify-between items-center mt-2">
          <button
            onClick={onSelect}
            className="bg-cyan-600 hover:bg-cyan-500 text-white py-1 px-3 rounded-lg shadow-[0_0_10px_cyan] transition-all text-sm font-semibold"
          >
            انتخاب
          </button>

          <button
            onClick={onToggleCompare}
            className={`py-1 px-3 rounded-lg text-sm font-semibold transition-all ${
              isSelectedForCompare
                ? 'bg-green-500 text-white hover:bg-green-600 shadow-[0_0_10px_green]'
                : 'bg-gray-700 text-white/80 hover:bg-gray-600 shadow-[0_0_5px_white/20]'
            }`}
          >
            {isSelectedForCompare ? 'مقایسه شده' : 'مقایسه'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FanCard;
