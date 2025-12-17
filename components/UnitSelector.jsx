"use client";

const UnitSelector = ({ value, options, onChange }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    className="bg-gray-700/50 text-white text-sm rounded px-2 py-1 shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-400"
  >
    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
  </select>
);

export default UnitSelector;
