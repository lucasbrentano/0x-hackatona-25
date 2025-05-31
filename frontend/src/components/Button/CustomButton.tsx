import React from "react";
import { ButtonProps } from "./ButtonProps";
import { buttonStyles } from "./buttonStyles";
import { IconType } from "react-icons";
import * as FeatherIcons from "react-icons/fi"; // react-icons Feather set

interface CustomButtonProps extends ButtonProps {
  icon?: keyof typeof FeatherIcons; // nome do ícone disponível em react-icons/fi
}

export default function CustomButton({
  title,
  onPress,
  variant = "primary",
  style,
  fontSize = 16,
  icon,
  iconColor,
}: CustomButtonProps) {
  const isSecondary = variant === "secondary";
  const isTertiary = variant === "tertiary";

  const IconComponent: IconType | null = icon ? FeatherIcons[icon] : null;

  // Seleciona estilos baseado no variant
  const variantStyles =
    variant === "primary"
      ? buttonStyles.primary
      : variant === "secondary"
      ? buttonStyles.secondary
      : buttonStyles.tertiary;

  const textColor =
    isTertiary
      ? buttonStyles.tertiary.color
      : isSecondary
      ? buttonStyles.secondary.color
      : buttonStyles.primary.color;

  return (
    <button
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
        padding: "14px 20px",
        fontFamily: "Arial, sans-serif",
        fontWeight: "normal",
        cursor: "pointer",
        border: variant === "secondary" ? `2px solid ${buttonStyles.primary.backgroundColor}` : "none",
      }}
    >
      {IconComponent && (
        <IconComponent
          size={16}
          color={iconColor ?? (isSecondary ? buttonStyles.primary.backgroundColor : buttonStyles.primary.color)}
          style={buttonStyles.icon}
        />
      )}
      {title}
    </button>
  );
}
