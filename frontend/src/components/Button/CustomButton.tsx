import React from "react";
import { ButtonProps } from "./ButtonProps";
import { buttonStyles } from "./buttonStyles";
import { IconType } from "react-icons";
import * as FeatherIcons from "react-icons/fi"; // Importa todos os ícones Feather

interface CustomButtonProps extends ButtonProps {
  icon?: keyof typeof FeatherIcons; // nome do ícone como string, opcional
  iconColor?: string;
  className?: string; // Adicionar suporte para className
}

export default function CustomButton({
  title,
  onPress,
  variant = "primary",
  style,
  fontSize = 24,
  icon,
  iconColor,
  className = "",
}: CustomButtonProps) {
  const isSecondary = variant === "secondary";
  const isTertiary = variant === "tertiary";

  // Pega o componente do ícone dinamicamente, ou null se não passar icon
  const IconComponent: IconType | null = icon ? FeatherIcons[icon] : null;

  // Define os estilos baseados no variant
  const variantStyles =
    variant === "primary"
      ? buttonStyles.primary
      : variant === "secondary"
      ? buttonStyles.secondary
      : buttonStyles.tertiary;

  // Define a cor do texto baseado no variant
  const textColor =
    isTertiary
      ? buttonStyles.tertiary.color
      : isSecondary
      ? buttonStyles.secondary.color
      : buttonStyles.primary.color;

  // Define a cor do ícone, padrão para primary é texto, para secondary é primary bg, pode ser sobrescrito via iconColor
  const iconFillColor =
    iconColor ??
    (isSecondary
      ? buttonStyles.primary.backgroundColor
      : buttonStyles.primary.color);

  return (
    <button
      className={className}
      onClick={onPress}
      style={{
        ...buttonStyles.base,
        ...buttonStyles.shadow,
        ...variantStyles,
        ...style,
        fontSize,
        color: textColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "14px 18px",
        fontFamily: "Arial, sans-serif",
        fontWeight: "500", // Aumentar um pouco o peso da fonte
        cursor: "pointer",
        borderRadius: "8px", // Bordas mais arredondadas
        minHeight: "48px", // Altura mínima consistente
        border:
          variant === "secondary"
            ? `0px solid ${buttonStyles.primary.backgroundColor}`
            : "none",
        gap: IconComponent ? 8 : 0, // Espaço entre ícone e texto se tiver ícone
      }}
    >
      {IconComponent && (
        <IconComponent
          size={16}
          color={iconFillColor}
          style={buttonStyles.icon}
          aria-hidden="true"
          focusable="false"
        />
      )}
      {title}
    </button>
  );
}