"use client";

import React, { useState } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const INITIAL_STATE = {
  model: "",
  type: "فن محوری (Axial)",
  manufacturer: "",
  imageUrl: `https://picsum.photos/seed/fan${Date.now()}/400/300`,
  description: "",
  maxAirflow: 0,
  maxStaticPressure: 0,
  powerConsumption: 0,
  motorRpm: 0,
  noiseLevel: 0,
  minTemp: -20,
  maxTemp: 60,
  fluidType: ["هوای تمیز"],
  price: 0,
  electricalSpecs: { voltage: 380, phase: 3, frequency: 50 },
  dimensions: { height: 0, width: 0, depth: 0 },
  performanceCurve: [{ airflow: 0, staticPressure: 0, power: 0, efficiency: 0 }],
};

const calculateEfficiency = (point) => {
  if (!point.airflow || !point.staticPressure || !point.power) return 0;
  const airflowM3s = point.airflow / 3600;
  const powerW = point.power * 1000;
  return parseFloat(((airflowM3s * point.staticPressure) / powerW * 100).toFixed(1));
};

export default function FanForm({ fanToEdit, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(() => {
    const initialData = fanToEdit
      ? JSON.parse(JSON.stringify(fanToEdit))
      : JSON.parse(JSON.stringify(INITIAL_STATE));
    const curveWithTempId = initialData.performanceCurve.map((p, i) => ({
      ...p,
      tempId: `point-${Date.now()}-${i}`,
      efficiency: calculateEfficiency(p),
    }));
    return { ...initialData, performanceCurve: curveWithTempId };
  });

  const [hoveredPointId, setHoveredPointId] = useState(null);
  const isEditing = !!fanToEdit;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
  };

  const handleNestedChange = (e, category) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [category]: { ...prev[category], [name]: Number(value) },
    }));
  };

  const handleFluidTypeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      fluidType: e.target.value.split(",").map((s) => s.trim()),
    }));
  };

  const handlePerfPointChange = (tempId, e) => {
    const { name, value } = e.target;
    const newCurve = formData.performanceCurve
      .map((p) => {
        if (p.tempId === tempId) {
          const updated = { ...p, [name]: Number(value) || 0 };
          if (["airflow", "staticPressure", "power"].includes(name))
            updated.efficiency = calculateEfficiency(updated);
          return updated;
        }
        return p;
      })
      .sort((a, b) => a.airflow - b.airflow);
    setFormData((prev) => ({ ...prev, performanceCurve: newCurve }));
  };

  const addPerfPoint = () => {
    setFormData((prev) => {
      const curve = [...prev.performanceCurve];
      const last = curve[curve.length - 1] || {};
      const newPoint = {
        tempId: `point-${Date.now()}`,
        airflow: last.airflow ? last.airflow + 5000 : 0,
        staticPressure: last.staticPressure ? Math.max(0, last.staticPressure * 0.9) : 0,
        power: last.power ? last.power + 0.5 : 0,
        efficiency: 0,
      };
      newPoint.efficiency = calculateEfficiency(newPoint);
      return { ...prev, performanceCurve: [...curve, newPoint].sort((a, b) => a.airflow - b.airflow) };
    });
  };

  const removePerfPoint = (tempId) => {
    if (formData.performanceCurve.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      performanceCurve: prev.performanceCurve.filter((p) => p.tempId !== tempId),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      performanceCurve: formData.performanceCurve.map(({ tempId, ...rest }) => rest),
    };
    onSubmit(finalData);
  };

  const CustomDot = ({ cx, cy, stroke, payload }) => (
    <circle
      cx={cx}
      cy={cy}
      r={hoveredPointId === payload.tempId ? 8 : 5}
      fill={stroke}
      stroke="#0ff"
      strokeWidth={hoveredPointId === payload.tempId ? 3 : 2}
    />
  );

  const formInputClass =
    "mt-1 w-full p-2 border rounded-md bg-[#111] text-[#0ff] border-[#0ff] focus:border-[#0ff] focus:ring focus:ring-[#0ff33] focus:ring-opacity-40 placeholder-[#0ff99]";

  return (
    <div className="fixed inset-0 bg-[#000b] z-50 flex justify-center items-start pt-12 overflow-y-auto">
      <div className="bg-[#111] rounded-lg shadow-2xl w-full max-w-5xl my-8 border border-[#0ff]">
        <form onSubmit={handleSubmit}>
          {/* هدر فرم */}
          <div className="p-6 border-b border-[#0ff33]">
            <h3 className="text-lg font-bold text-[#0ff]">
              {isEditing ? `ویرایش محصول: ${formData.model}` : "افزودن محصول جدید"}
            </h3>
          </div>

          {/* بدنه فرم */}
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {/* اطلاعات عمومی */}
            <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-[#0ff33] p-4 rounded-md">
              <legend className="px-2 font-semibold text-sm text-[#0ff]">اطلاعات عمومی</legend>
              <div>
                <label className="block text-sm font-medium text-[#0ff]">مدل</label>
                <input name="model" value={formData.model} onChange={handleChange} required className={formInputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0ff]">سازنده</label>
                <input name="manufacturer" value={formData.manufacturer} onChange={handleChange} required className={formInputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0ff]">نوع فن</label>
                <select name="type" value={formData.type} onChange={handleChange} className={formInputClass}>
                  <option>فن محوری (Axial)</option>
                  <option>فن سانتریفیوژ (Centrifugal)</option>
                  <option>جت فن (Jet Fan)</option>
                  <option>فن سقفی (Roof Fan)</option>
                  <option>فن ضد انفجار (Explosion Proof)</option>
                  <option>سایر</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0ff]">آدرس تصویر</label>
                <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} className={formInputClass} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#0ff]">توضیحات</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className={formInputClass} />
              </div>
            </fieldset>

            {/* مشخصات عملکردی */}
            <fieldset className="grid grid-cols-2 md:grid-cols-3 gap-4 border border-[#0ff33] p-4 rounded-md">
              <legend className="px-2 font-semibold text-sm text-[#0ff]">مشخصات عملکردی</legend>
              <div>
                <label className="block text-sm font-medium text-[#0ff]">حداکثر دبی (m³/h)</label>
                <input type="number" name="maxAirflow" value={formData.maxAirflow} onChange={handleChange} required className={formInputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0ff]">حداکثر فشار (Pa)</label>
                <input type="number" name="maxStaticPressure" value={formData.maxStaticPressure} onChange={handleChange} required className={formInputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0ff]">توان (kW)</label>
                <input type="number" step="0.1" name="powerConsumption" value={formData.powerConsumption} onChange={handleChange} required className={formInputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0ff]">دور موتور (RPM)</label>
                <input type="number" name="motorRpm" value={formData.motorRpm} onChange={handleChange} required className={formInputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0ff]">سطح صدا (dB)</label>
                <input type="number" name="noiseLevel" value={formData.noiseLevel} onChange={handleChange} required className={formInputClass} />
              </div>
            </fieldset>

            {/* شرایط کاری و قیمت */}
            <fieldset className="grid grid-cols-2 md:grid-cols-4 gap-4 border border-[#0ff33] p-4 rounded-md">
              <legend className="px-2 font-semibold text-sm text-[#0ff]">شرایط کاری و قیمت</legend>
              <div>
                <label className="block text-sm font-medium text-[#0ff]">حداقل دما (°C)</label>
                <input type="number" name="minTemp" value={formData.minTemp} onChange={handleChange} required className={formInputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0ff]">حداکثر دما (°C)</label>
                <input type="number" name="maxTemp" value={formData.maxTemp} onChange={handleChange} required className={formInputClass} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#0ff]">نوع سیال</label>
                <input name="fluidType" value={Array.isArray(formData.fluidType) ? formData.fluidType.join(", ") : ""} onChange={handleFluidTypeChange} className={formInputClass} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#0ff]">قیمت (ریال)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required className={formInputClass} />
              </div>
            </fieldset>

            {/* ابعاد و مشخصات الکتریکی */}
            <fieldset className="grid grid-cols-2 md:grid-cols-3 gap-4 border border-[#0ff33] p-4 rounded-md">
              <legend className="px-2 font-semibold text-sm text-[#0ff]">ابعاد و مشخصات الکتریکی</legend>
              <div>
                <label className="block text-sm font-medium text-[#0ff]">ارتفاع (mm)</label>
                <input type="number" name="height" value={formData.dimensions.height} onChange={(e) => handleNestedChange(e, "dimensions")} required className={formInputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0ff]">عرض (mm)</label>
                <input type="number" name="width" value={formData.dimensions.width} onChange={(e) => handleNestedChange(e, "dimensions")} required className={formInputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0ff]">عمق (mm)</label>
                <input type="number" name="depth" value={formData.dimensions.depth} onChange={(e) => handleNestedChange(e, "dimensions")} required className={formInputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0ff]">ولتاژ (V)</label>
                <input type="number" name="voltage" value={formData.electricalSpecs.voltage} onChange={(e) => handleNestedChange(e, "electricalSpecs")} required className={formInputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0ff]">فاز</label>
                <input type="number" name="phase" value={formData.electricalSpecs.phase} onChange={(e) => handleNestedChange(e, "electricalSpecs")} required className={formInputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0ff]">فرکانس (Hz)</label>
                <input type="number" name="frequency" value={formData.electricalSpecs.frequency} onChange={(e) => handleNestedChange(e, "electricalSpecs")} required className={formInputClass} />
              </div>
            </fieldset>

            {/* منحنی عملکرد */}
            <fieldset className="border border-[#0ff33] p-4 rounded-md">
              <legend className="px-2 font-semibold text-sm text-[#0ff]">منحنی عملکرد</legend>

              <div className="h-80 w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={formData.performanceCurve} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid stroke="#0ff33" strokeDasharray="3 3" />
                    <XAxis dataKey="airflow" type="number" unit=" m³/h" domain={['dataMin', 'dataMax + 1000']} allowDataOverflow />
                    <YAxis dataKey="staticPressure" type="number" unit=" Pa" domain={['dataMin', 'dataMax + 50']} allowDataOverflow />
                    <Tooltip />
                    <Legend />
                    <Line dataKey="staticPressure" name="فشار استاتیک" stroke="#0ff" strokeWidth={2} type="monotone" dot={<CustomDot />} activeDot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <p className="text-xs text-[#0ff99] mb-3 text-center">
                مقادیر را در جدول زیر ویرایش کنید. نمودار به صورت زنده بروزرسانی خواهد شد.
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-[#0ff]">
                  <thead className="text-right">
                    <tr>
                      <th className="p-2 font-medium">دبی (m³/h)</th>
                      <th className="p-2 font-medium">فشار (Pa)</th>
                      <th className="p-2 font-medium">توان (kW)</th>
                      <th className="p-2 font-medium">راندمان (%)</th>
                      <th className="w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.performanceCurve.map((point) => (
                      <tr
                        key={point.tempId}
                        className={`transition-colors ${hoveredPointId === point.tempId ? "bg-[#0ff22]" : ""}`}
                        onMouseEnter={() => setHoveredPointId(point.tempId)}
                        onMouseLeave={() => setHoveredPointId(null)}
                      >
                        <td className="p-1">
                          <input
                            type="number"
                            name="airflow"
                            value={point.airflow}
                            onChange={(e) => handlePerfPointChange(point.tempId, e)}
                            className="p-2 border rounded-md text-sm w-full bg-[#111] border-[#0ff] text-[#0ff]"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="number"
                            name="staticPressure"
                            value={point.staticPressure}
                            onChange={(e) => handlePerfPointChange(point.tempId, e)}
                            className="p-2 border rounded-md text-sm w-full bg-[#111] border-[#0ff] text-[#0ff]"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="number"
                            name="power"
                            value={point.power}
                            onChange={(e) => handlePerfPointChange(point.tempId, e)}
                            step="0.1"
                            className="p-2 border rounded-md text-sm w-full bg-[#111] border-[#0ff] text-[#0ff]"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="number"
                            name="efficiency"
                            value={point.efficiency || ""}
                            readOnly
                            className="p-2 border rounded-md text-sm w-full bg-black border-[#0ff44] text-[#0ff88] cursor-not-allowed"
                          />
                        </td>
                        <td className="p-1 text-center">
                          <button
                            type="button"
                            onClick={() => removePerfPoint(point.tempId)}
                            disabled={formData.performanceCurve.length <= 1}
                            className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold p-2"
                          >
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={addPerfPoint}
                className="mt-3 text-sm text-[#0ff] hover:text-[#0ffcc] font-semibold"
              >
                افزودن نقطه جدید
              </button>
            </fieldset>
          </div>

          {/* فوتر فرم */}
          <div className="p-4 bg-black flex justify-end gap-x-3 border-t border-[#0ff33]">
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-4 bg-[#222] text-[#0ff] rounded-md hover:bg-[#333]"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-[#0ff] text-black rounded-md hover:bg-[#0cc]"
            >
              {isEditing ? "ذخیره تغییرات" : "ایجاد محصول"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
