import React, { useState, useEffect } from "react";
import { HiSun, HiMoon } from "react-icons/hi";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("bg-[#1f1f1f]", "text-white");
      document.body.classList.remove("bg-[#f5f5f5]", "text-[#1a1a1a]");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.add("bg-[#f5f5f5]", "text-[#1a1a1a]");
      document.body.classList.remove("bg-[#1f1f1f]", "text-white");
    }
  }, [darkMode]);

  return (
    <>
      <div className="nav flex items-center justify-between px-5 sm:px-10 lg:px-[100px] h-[70px] lg:h-[90px] border-b-[1px] border-gray-800">
        {/* Logo */}
        <div className="logo">
          <h3 className="text-[20px] sm:text-[22px] lg:text-[25px] font-[700] sp-text">
            GenUI
          </h3>
        </div>

        {/* Icons */}
        <div className="icons flex items-center gap-[10px] sm:gap-[12px] lg:gap-[15px] text-lg sm:text-xl lg:text-2xl">
          <div
            className="icon cursor-pointer hover:text-purple-400 transition-colors p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? (
              <HiSun className="text-white" />
            ) : (
              <HiMoon className="text-white" />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
