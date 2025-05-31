import React, { useState, ChangeEvent, FocusEvent } from "react";
import { InputProps } from "./inputProps";

// Ícones simples em SVG para o olho (visibilidade)
const EyeIcon = ({ visible }: { visible: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {visible ? (
      <>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </>
    ) : (
      <>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
        <line x1="2" x2="22" y1="2" y2="22"></line>
      </>
    )}
  </svg>
);

export default function CustomTextInput({
  value,
  label,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  placeholder,
  withVisibilityToggle = false,
  onBlur,
  height = 60, // Altura padrão de 60px
}: InputProps) {
  const [hidePassword, setHidePassword] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeText(e.target.value);
  };

  const handleFocus = () => setIsFocused(true);

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  // Mapeia keyboardType para input type
  let inputType = "text";
  if (keyboardType === "email-address") inputType = "email";
  else if (keyboardType === "numeric") inputType = "number";
  if (secureTextEntry) inputType = hidePassword ? "password" : "text";

  return (
    <div className="w-full my-2 p-0.5">
      {label && (
        <label className="block mb-1 text-gray-800 font-medium text-sm">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          type={inputType}
          value={value}
          placeholder={isFocused ? "" : placeholder}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full px-4 bg-white rounded-lg shadow-lg border-none text-base text-gray-800 outline-none font-sans box-border"
          style={{ height: `${height}px` }}
          autoComplete="off"
        />
        {withVisibilityToggle && secureTextEntry && (
          <span
            onClick={() => setHidePassword(!hidePassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 select-none"
            aria-label={hidePassword ? "Mostrar senha" : "Ocultar senha"}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setHidePassword(!hidePassword)}
          >
            <EyeIcon visible={!hidePassword} />
          </span>
        )}
      </div>
    </div>
  );
}