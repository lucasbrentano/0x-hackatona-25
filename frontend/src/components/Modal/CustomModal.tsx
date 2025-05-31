import React from "react";
import CustomButton from "../Button/CustomButton";
import { modalStyles } from "./modalStyle";

interface CustomModalProps {
  visible: boolean;
  title: string;
  icon?: string; // URL ou caminho da imagem
  buttons?: { text: string; onPress: () => void }[];
  onClose?: () => void;
}

export default function CustomModal({
  visible,
  title,
  icon,
  buttons,
  onClose,
}: CustomModalProps) {
  if (!visible) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.container}>
        {/* Botão de fechar */}
        {onClose && (
          <button onClick={onClose} style={modalStyles.closeButton} aria-label="Close modal">
            {/* Ícone de fechar simples */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              fill={modalStyles.closeIcon.color}
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        )}

        <h2 style={modalStyles.title}>{title}</h2>

        {icon && <img src={icon} alt="" style={modalStyles.icon} />}

        <div style={modalStyles.buttonWrapper}>
          {buttons?.map((button, idx) => (
            <CustomButton
              key={idx}
              title={button.text}
              onPress={button.onPress}
              variant="tertiary"
              style={modalStyles.button}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
