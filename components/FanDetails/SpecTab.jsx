const SpecRow = ({ label, value, unit }) => (
  <div className="flex justify-between items-center py-2 border-b border-white/20">
    <dt className="text-sm font-medium text-white/80">{label}</dt>
    <dd className="text-sm font-semibold text-white/90">
      {typeof value === 'number' ? value.toLocaleString('fa-IR') : value} {unit}
    </dd>
  </div>
);

const SpecTab = ({ fan }) => (
  <dl className="bg-black/50 p-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
    <SpecRow label="حداکثر دبی هوا" value={fan.maxAirflow} unit="m³/h" />
    <SpecRow label="حداکثر فشار استاتیک" value={fan.maxStaticPressure} unit="Pa" />
    <SpecRow label="توان مصرفی" value={fan.powerConsumption} unit="kW" />
    <SpecRow label="دور موتور" value={fan.motorRpm} unit="RPM" />
    <SpecRow label="سطح صدا" value={fan.noiseLevel} unit="dB" />
    <SpecRow label="محدوده دمای کاری" value={`${fan.minTemp} الی ${fan.maxTemp}`} unit="°C" />
  </dl>
);

export default SpecTab;
