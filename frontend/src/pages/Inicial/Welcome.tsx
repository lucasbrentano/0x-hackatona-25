import React from "react";
import { useNavigate } from "react-router-dom";
import logoTownSquare from "../../assets/logoTownSquare.png";
import CustomButton from "../../components/Button/CustomButton";
import AppLayout from "../../components/Layout/AppLayout";
import { privacyPolicyMock } from "../../mocks/privacyPolicyMock";

export default function Welcome() {
  const navigate = useNavigate();
  
  return (
    <AppLayout>
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#E3E3E3] px-6">
        {/* Container principal centralizado */}
        <div className="flex flex-col items-center justify-center flex-1 w-full max-w-sm">
          {/* Logo */}
          <div className="flex flex-col items-center mb-12">
            <img
              src={logoTownSquare}
              alt="Town Square Logo"
              className="w-100 h-100 object-contain"
            />
          </div>

          {/* Botões */}
          <div className="w-full space-y-3">
            <CustomButton
              className="w-full"
              title="Entrar"
              onPress={() => navigate("/Entrar")}
              variant="primary"
            />
            <CustomButton
              className="w-full"
              title="Registrar"
              onPress={() => navigate("/Registrar")}
              variant="secondary"
            />
          </div>
        </div>

        {/* Texto dos termos na parte inferior */}
        <div className="w-full max-w-sm pb-6">
          <p className="text-xs text-gray-500 font-sans text-center leading-relaxed">
            Ao entrar no Town Square, você concorda com nossos{" "}
            <span
              className="underline cursor-pointer font-bold"
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