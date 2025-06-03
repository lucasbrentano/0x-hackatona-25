import React from "react";
import { AppBarProps } from "./AppBarProps";
import { appBarStyles } from "./appBarStyles";
import coinImg from "../../assets/coin.png"; // Coloque seu ícone na pasta assets
import configIcon from "../../assets/config-icon.png"; // Ícone de configuração
import avatarPlaceholder from "../../assets/avatar-placeholder.png"; // Avatar default

export default function CustomAppBar({
  coins,
  onConfigPress,
  rightButtonType = "config",
  avatarUri,
}: AppBarProps) {
  return (
    <header style={appBarStyles.header}>
      {/* Coins display */}
      <div style={appBarStyles.coinWrapper}>
        <div style={appBarStyles.coinCircle}>
          <img src={coinImg} alt="Moeda" style={appBarStyles.coinIcon} />
        </div>
        <div style={appBarStyles.coinValueBox}>
          <span style={appBarStyles.coinText}>{coins}</span>
        </div>
      </div>

      {/* Right button */}
      {rightButtonType === "config" && (
        <img
          src={configIcon}
          alt="Configurações"
          style={appBarStyles.configIcon}
          onClick={onConfigPress}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onConfigPress?.()}
        />
      )}

      {rightButtonType === "avatar" && (
        <img
          src={avatarUri || avatarPlaceholder}
          alt="Avatar"
          style={appBarStyles.avatarIcon}
          onClick={onConfigPress}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onConfigPress?.()}
        />
      )}
    </header>
  );
}
