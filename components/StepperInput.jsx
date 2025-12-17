"use client";

const StepperInput = ({ value, min, max, step, onChange }) => {
  const decrement = () => onChange(Math.max(value - step, min));
  const increment = () => onChange(Math.min(value + step, max));

  return (
    <div className="flex items-center gap-2 justify-center mt-1">
      <button onClick={decrement} className="bg-pink-500 text-white px-3 py-1 rounded-lg hover:bg-pink-600 transition-all shadow">-</button>
      <input type="number" value={value} min={min} max={max} step={step} onChange={e => onChange(Number(e.target.value))} className="w-20 text-center border border-gray-600 rounded px-2 py-1 bg-gray-700/50 text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-400"/>
      <button onClick={increment} className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-all shadow">+</button>
    </div>
  );
};

export default StepperInput;
