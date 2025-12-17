"use client";

import { useState, useEffect, useRef } from "react";
import FanForm from "./FanForm.jsx";

export default function AdminDashboard({ fans = [], onAddFan, onUpdateFan, onDeleteFan, onAddFansBatch }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFan, setEditingFan] = useState(null);
  const fileInputRef = useRef(null);

  const handleAddNew = () => {
    setEditingFan(null);
    setIsFormOpen(true);
  };

  const handleEdit = (fan) => {
    setEditingFan(fan);
    setIsFormOpen(true);
  };

  const handleDelete = (fanId) => {
    if (window.confirm("آیا از حذف این محصول اطمینان دارید؟")) {
      onDeleteFan(fanId);
    }
  };

  const handleFormSubmit = (fanData) => {
    if ("id" in fanData) onUpdateFan(fanData);
    else onAddFan(fanData);

    setIsFormOpen(false);
  };

  return (
    <div className="p-6 bg-gray-900 rounded-xl shadow-lg text-white min-h-screen">
      {/* هدر و دکمه‌ها */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">مدیریت محصولات</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-500 transition-colors text-white py-2 px-4 rounded-md shadow-md font-semibold"
          >
            افزودن فن جدید
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-green-600 hover:bg-green-500 transition-colors text-white py-2 px-4 rounded-md shadow-md font-semibold"
          >
            ورود از اکسل
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={() => {}}
          />
        </div>
      </div>

      {/* جدول دسکتاپ */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full bg-gray-800 rounded-xl overflow-hidden">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-right px-4 py-2">مدل</th>
              <th className="text-right px-4 py-2">سازنده</th>
              <th className="text-right px-4 py-2">نوع</th>
              <th className="text-right px-4 py-2">حداکثر دبی</th>
              <th className="text-center px-4 py-2">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {fans.map((fan) => (
              <tr key={fan.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                <td className="text-right px-4 py-2">{fan.model}</td>
                <td className="text-right px-4 py-2">{fan.manufacturer}</td>
                <td className="text-right px-4 py-2">{fan.type}</td>
                <td className="text-right px-4 py-2">{fan.maxAirflow.toLocaleString("fa-IR")} m³/h</td>
                <td className="text-center px-4 py-2 flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(fan)}
                    className="bg-cyan-500 hover:bg-cyan-400 text-white px-2 py-1 rounded-md text-sm"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(fan.id)}
                    className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded-md text-sm"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* کارت موبایل */}
      <div className="md:hidden flex flex-col gap-4">
        {fans.map((fan) => (
          <div key={fan.id} className="bg-gray-800 rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-4">
              <img
                src={fan.imageUrl}
                alt={fan.model}
                className="w-16 h-16 rounded-full object-cover border border-gray-700"
              />
              <div className="flex flex-col flex-1">
                <span className="font-bold">{fan.model}</span>
                <span className="text-gray-300 text-sm">{fan.manufacturer}</span>
                <span className="text-gray-400 text-sm">{fan.type}</span>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-gray-300">{fan.maxAirflow.toLocaleString("fa-IR")} m³/h</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(fan)}
                  className="bg-cyan-500 hover:bg-cyan-400 text-white px-2 py-1 rounded-md text-sm"
                >
                  ویرایش
                </button>
                <button
                  onClick={() => handleDelete(fan.id)}
                  className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded-md text-sm"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <FanForm
          fanToEdit={editingFan}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
