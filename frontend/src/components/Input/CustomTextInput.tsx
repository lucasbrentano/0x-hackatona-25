import React, { useState, ChangeEvent, FocusEvent } from "react";
import { InputProps } from "./inputProps";
import { inputStyle } from "./inputStyle";

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
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.52 21.52 0 0 1 5.66-7.19"></path>
        <path d="M1 1l22 22"></path>
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
    <div style={inputStyle.shadowWrapper}>
      {label && <label style={inputStyle.label}>{label}</label>}

      <div style={inputStyle.inputWrapper}>
        <input
          type={inputType}
          value={value}
          placeholder={isFocused ? "" : placeholder}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={inputStyle.input}
          autoComplete="off"
        />
        {withVisibilityToggle && secureTextEntry && (
          <span
            onClick={() => setHidePassword(!hidePassword)}
            style={inputStyle.visibilityToggle}
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
