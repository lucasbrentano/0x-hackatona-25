import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/Layout/AppLayout";
import CustomTextInput from "../../components/Input/CustomTextInput";
import CustomButton from "../../components/Button/CustomButton";
import { login } from "../../services/userService";
import CustomSnackbar from "../../components/Snackbar/CustomSnackbar";
import { privacyPolicyMock } from "../../mocks/privacyPolicyMock";
import { AuthContext } from "../../AuthContext";
import logoTownSquare from "../../assets/logoTownSquare.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarVisible, setVisible] = useState(false);
  const [snackbarMessage, setMessage] = useState("");

  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Por favor, preencha todos os campos");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      alert("Por favor, insira um email válido");
      return;
    }

    setIsLoading(true);
    try {
      const response = await login({ email, password });
      const { token, refreshToken, expiresIn, isAdmin } = response.data;

      await signIn({
        token,
        refreshToken,
        expiresIn,
        isAdmin,
        userID: ""
      });

      // Redirecionar para a tela Home após login bem-sucedido
      navigate("/home");

    } catch (error: any) {
      console.log('Erro Axios:', error.message);
      console.log('Status:', error.response?.status);
      console.log('Dados do erro:', error.response?.data);
      const msg =
        error?.response?.data?.message ??
        "Erro ao entrar. Tente novamente.";
      setMessage(msg);
      setVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col justify-between min-h-screen p-5 bg-[#E3E3E3]">
        {/* Container principal */}
        <div className="flex-1 flex flex-col justify-center items-center pt-25">
          {/* Logo */}
          <img
            src={logoTownSquare}
            alt="Town Square Logo"
            className="w-[450px] h-[450px] object-contain mb-4"
          />

          {/* Container dos inputs - mesmo tamanho do botão */}
          <div className="w-full max-w-[340px] space-y-4 mb-5">
            <div className="w-full">
              <CustomTextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
                className="w-full rounded-sm"
              />
            </div>
            <div className="w-full">
              <CustomTextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Senha"
                secureTextEntry
                withVisibilityToggle
                className="w-full rounded-sm"
              />
            </div>
          </div>

          {/* Botão de login */}
          <CustomButton
            title="Entrar"
            onPress={handleLogin}
            variant="primary"
            fontSize={20}
            className="w-full max-w-[340px] self-center my-1 mb-2 mt-2.5"
            disabled={isLoading}
          />

          {/* Link esqueci a senha */}
          <button
            onClick={() => navigate("/recover-password")}
            className="mt-4 self-center cursor-pointer"
          >
            <span className="text-gray-600 text-base font-sans">
              Esqueci a senha
            </span>
          </button>
        </div>

        {/* Footer com termos */}
        <div className="mt-[90px] px-6 pb-6 flex items-center justify-center">
          <p className="text-xs text-gray-600 text-center font-sans leading-relaxed">
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
          
          <CustomSnackbar
            visible={snackbarVisible}
            onDismiss={() => setVisible(false)}
          >
            {snackbarMessage}
          </CustomSnackbar>
        </div>
      </div>
    </AppLayout>
  );
}