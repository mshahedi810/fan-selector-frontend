"use client";

import { useState } from "react";

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const ADMIN_USER = "admin";
  const ADMIN_PASS = "391371";

  const handleLoginSuccess = () => {
    const expireTime = Date.now() + 10 * 60 * 1000; 
    localStorage.setItem("adminLoggedIn", "true");
    localStorage.setItem("adminExpire", expireTime);
    onLoginSuccess();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      handleLoginSuccess();
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-gray-900 via-gray-950 to-black">
      
      {/* Box - Glass Effect */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-black/40 backdrop-blur-xl border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)] p-8 rounded-2xl flex flex-col gap-5 animate-fadeIn"
      >
        <h1 className="text-3xl font-extrabold text-center text-white drop-shadow-[0_0_8px_rgb(0,255,255)]">
          ورود مدیر
        </h1>

        <div className="flex flex-col gap-2">
          <label className="text-white/80">نام کاربری</label>
          <input
            type="text"
            className="p-3 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:border-cyan-400 transition-all"
            placeholder="نام کاربری را وارد کنید"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-white/80">رمز عبور</label>
          <input
            type="password"
            className="p-3 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:border-cyan-400 transition-all"
            placeholder="رمز عبور را وارد کنید"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="mt-2 bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl shadow-[0_0_20px_cyan] transition-all font-bold tracking-wide"
        >
          ورود
        </button>
      </form>

      {/* Error Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-black/80 border border-white/20 rounded-xl shadow-lg p-6 w-full max-w-md text-white">
            <h2 className="text-xl font-bold mb-4 drop-shadow-[0_0_6px_red]">ورود ناموفق</h2>
            <p className="mb-6 text-white/80">
              لطفاً از صحت نام کاربری و رمز عبور اطمینان حاصل کنید.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-red-600 hover:bg-red-500 py-2 px-4 rounded-lg shadow-[0_0_10px_red] transition-all font-semibold"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
