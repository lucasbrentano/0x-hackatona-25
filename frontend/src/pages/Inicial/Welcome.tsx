// Welcome.tsx (React Web)
import React from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePageStyles.css"; // versão CSS para web
import CustomButton from "../../components/Button/CustomButton";
import AppLayout from "../../components/Layout/AppLayout";
import { privacyPolicyMock } from "../../mocks/privacyPolicyMock";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="welcome-wrapper">
        <div className="welcome-container">
          <img
            src="../../assets/logoTownSquare.png"
            alt="Town Square Logo"
            className="welcome-logo"
          />

          <CustomButton
            className="welcome-button"
            title="Entrar"
            onClick={() => navigate("/login")}
            variant="primary"
          />

          <CustomButton
            className="welcome-button"
            title="Cadastre-se"
            onClick={() => navigate("/register")}
            variant="secondary"
          />
        </div>

        <div className="welcome-footer">
          <p className="footer-text">
            Ao entrar no LuckyDraw, você concorda com nossos{" "}
            <span
              className="footer-link"
              onClick={() =>
                navigate("/privacy-policy", {
                  state: {
                    policyText: privacyPolicyMock.policyText,
                    lastUpdated: privacyPolicyMock.lastUpdated,
                  },
                })
              }
            >
              Termos e Políticas de Privacidade
            </span>
            .
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
