import React from "react";

const Header = ({ onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-gradient-to-r from-blue-800 via-indigo-700 to-purple-700 shadow-2xl">
      
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 md:py-5">

        {/* Navbar سمت چپ */}
        <nav className="flex items-center gap-3 md:gap-5">
          {["خانه", "محصولات", "تماس با ما", "درباره ما"].map((item, idx) => (
            <button
              key={idx}
              onClick={() =>
                onNavigate(
                  item === "محصولات"
                    ? "products"
                    : item === "تماس با ما"
                    ? "allfan"
                    : item === "درباره ما"
                    ? "aboutus"
                    : "home"
                )
              }
              className="px-4 py-2 rounded-lg bg-white/20 text-white font-semibold text-sm md:text-base 
              hover:bg-white/30 hover:scale-105 transition-all shadow-md"
            >
              {item}
            </button>
          ))}
        </nav>

        {/* لوگو سمت راست */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-2 shadow-lg hover:scale-105 transition-transform">
            <img
              src="./images/ftpe.png"
              alt="Logo"
              className="w-12 h-12 md:w-14 md:h-14 rounded-lg"
            />
          </div>
          <h1 className="text-white text-lg md:text-2xl font-extrabold tracking-wide drop-shadow-md">
            فن‌آوران تهویه پیام
          </h1>
        </div>

        {/* منوی موبایل */}
        <div className="md:hidden text-white">
          <button className="focus:outline-none hover:scale-110 transition-transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;
