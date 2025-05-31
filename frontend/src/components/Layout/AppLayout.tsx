import React, { ReactNode } from "react";
import { layoutStyle } from "./layoutStyle";

type Props = {
  children: ReactNode;
  fixedTop?: ReactNode;
  fixedBottom?: ReactNode;
};

const backgroundImageUrl = "/assets/fundoApp.png"; // Ajuste o caminho conforme sua estrutura pública

export default function AppLayout({ children, fixedTop, fixedBottom }: Props) {
  // Para esconder teclado no mobile web, usamos onClick fora do input. 
  // O comportamento exato do KeyboardAvoidingView não existe na web.
  
  const dismissKeyboard = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <div
      style={{
        ...layoutStyle.background,
        backgroundImage: `url(${backgroundImageUrl})`,
      }}
    >
      {fixedTop && <div style={layoutStyle.fixedTop}>{fixedTop}</div>}

      <div
        style={layoutStyle.container}
        onClick={dismissKeyboard}
      >
        <div style={layoutStyle.scrollContainer}>{children}</div>
      </div>

      {fixedBottom && <div style={layoutStyle.fixedBottom}>{fixedBottom}</div>}
    </div>
  );
}
