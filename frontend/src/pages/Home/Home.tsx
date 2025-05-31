import React, { useState } from 'react';
import HomeBottom from '../../components/Bottom/HomeBottom'; // Ajuste o caminho conforme sua estrutura
import HomeImage from '../../assets/Home.png';

const Home: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  // Função para renderizar conteúdo baseado na aba selecionada
  const renderContent = () => {
    switch (selectedTab) {
      case 0: // Home
        return (
          <div className="w-full max-w-md">
            <img
              src={HomeImage}
              alt="Home Screen Content"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        );
      case 1: // Add
        return (
          <div className="w-full max-w-md text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Adicionar Conteúdo</h2>
              <p className="text-gray-600">Funcionalidade de adicionar em desenvolvimento...</p>
            </div>
          </div>
        );
      case 2: // Messages
        return (
          <div className="w-full max-w-md text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Mensagens</h2>
              <p className="text-gray-600">Suas mensagens aparecerão aqui...</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Conteúdo principal da tela */}
      <div className="flex-1 flex items-center justify-center p-4 pb-20">
        {renderContent()}
      </div>
      
      {/* Componente HomeBottom fixo na parte inferior */}
      <HomeBottom
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
    </div>
  );
};

export default Home;