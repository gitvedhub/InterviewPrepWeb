import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, label, placeholder, type = "text" }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col space-y-1 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 placeholder-gray-400 pr-10"
        />
        {type === "password" && (
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FaRegEyeSlash size={16} /> : <FaRegEye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;


