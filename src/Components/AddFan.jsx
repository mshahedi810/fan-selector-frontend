const FanCard = ({ fan, onSelect, onToggleCompare, isSelectedForCompare }) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden">
      
      {/* تصویر */}
      <div className="w-full h-48 overflow-hidden rounded-t-2xl">
        <img
          src={fan.imageUrl}
          alt={fan.model}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* محتوا */}
      <div className="flex-1 flex flex-col justify-between p-4 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800 truncate">{fan.model}</h3>
          <p className="text-sm text-gray-500 line-clamp-3">{fan.description}</p>

          {/* مشخصات کلیدی */}
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
            <span>دبی هوا: {fan.maxAirflow} m³/h</span>
            <span>فشار استاتیک: {fan.maxStaticPressure} Pa</span>
            <span>توان: {fan.powerConsumption} kW</span>
            <span>RPM: {fan.motorRPM}</span>
          </div>
        </div>

        {/* دکمه‌ها */}
        <div className="flex justify-between items-center mt-2">
          <button
            onClick={onSelect}
            className="bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transition-all text-sm"
          >
            انتخاب
          </button>

          <button
            onClick={onToggleCompare}
            className={`py-1 px-3 rounded-lg text-sm transition-all ${
              isSelectedForCompare
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
