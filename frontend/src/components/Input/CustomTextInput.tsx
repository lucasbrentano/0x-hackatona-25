import React, { useState } from "react";

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  label?: string;
  className?: string;
  showPasswordToggle?: boolean;
  disabled?: boolean;
}

const EyeOpenIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeWidth="2" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeClosedIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeWidth="2" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function CustomTextInput({
  value,
  onChange,
  type = "text",
  placeholder,
  label,
  className = "",
  showPasswordToggle = false,
  disabled = false,
}: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleTogglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Determina o tipo do input
  const inputType = type === "password" && isPasswordVisible ? "text" : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={false}
          spellCheck={false}
          autoComplete="off"
          inputMode={type === "email" ? "email" : type === "number" ? "numeric" : "text"}
          onTouchStart={(e) => {
            e.stopPropagation();
            e.currentTarget.focus();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.focus();
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.currentTarget.focus();
          }}
          onFocus={(e) => {
            console.log("Input focou!");
            e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length);
          }}
          style={{
            WebkitAppearance: "none",
            WebkitTapHighlightColor: "transparent",
            fontSize: "16px" // Previne zoom no iOS/mobile
          }}
          className="
            w-full h-[60px] px-4 
            bg-white border border-gray-300 rounded-lg shadow-lg
            text-base text-gray-800 
            placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            pr-12
            touch-manipulation
            select-text
            cursor-text
          "
        />
        
        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            onClick={handleTogglePassword}
            disabled={disabled}
            className="
              absolute right-3 top-1/2 transform -translate-y-1/2
              p-1 text-gray-500 hover:text-gray-700
              focus:outline-none disabled:cursor-not-allowed
            "
          >
            {isPasswordVisible ? <EyeClosedIcon /> : <EyeOpenIcon />}
          </button>
        )}
      </div>
    </div>
  );
}