import React, { useState } from 'react';

const App: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const handleLogoClick = (): void => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-gray-700 bg-black bg-opacity-20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div 
                onClick={handleLogoClick}
                className={`w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center cursor-pointer transition-transform duration-300 ${
                  isAnimating ? 'rotate-180 scale-110' : 'hover:scale-105'
                }`}
              >
                <span className="text-white font-bold text-lg">0x</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">Equipe 0x</h1>
                <p className="text-gray-400 text-sm">Hackatona 2025</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Frontend Ready</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-purple-500 bg-opacity-20 text-purple-300 rounded-full text-sm font-medium border border-purple-500 border-opacity-30 mb-6">
              🚀 Boilerplate v1.0
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Frontend
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {' '}Boilerplate
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Base de desenvolvimento para a <strong className="text-white">Equipe 0x</strong> na Hackatona 2025.
            <br />
            React + TypeScript + Tailwind CSS configurado e pronto para uso.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-xl">
              Começar Desenvolvimento
            </button>
            <button className="px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-xl hover:bg-gray-800 hover:border-gray-500 transition-all duration-200">
              Ver Documentação
            </button>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* React */}
          <div className="group p-8 bg-gray-800 bg-opacity-50 border border-gray-700 border-opacity-50 rounded-2xl hover:border-blue-500 hover:border-opacity-50 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L3 7v6c0 5.55 3.84 9.74 7 10 3.16-.26 7-4.45 7-10V7l-7-5z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">React 18</h3>
            <p className="text-gray-400 leading-relaxed">
              Biblioteca JavaScript moderna para construção de interfaces de usuário reativas e componentizadas.
            </p>
          </div>

          {/* TypeScript */}
          <div className="group p-8 bg-gray-800 bg-opacity-50 border border-gray-700 border-opacity-50 rounded-2xl hover:border-blue-400 hover:border-opacity-50 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-lg">TS</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">TypeScript</h3>
            <p className="text-gray-400 leading-relaxed">
              Superset do JavaScript que adiciona tipagem estática, melhorando a qualidade e manutenibilidade do código.
            </p>
          </div>

          {/* Tailwind */}
          <div className="group p-8 bg-gray-800 bg-opacity-50 border border-gray-700 border-opacity-50 rounded-2xl hover:border-cyan-400 hover:border-opacity-50 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-lg">TW</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Tailwind CSS</h3>
            <p className="text-gray-400 leading-relaxed">
              Framework CSS utility-first que permite criar designs customizados rapidamente sem sair do HTML.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-gray-800 bg-opacity-30 border border-gray-700 border-opacity-50 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Recursos Incluídos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Configuração Completa</h4>
                <p className="text-gray-400 text-sm">Vite, ESLint, Prettier e todas as dependências configuradas</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Hot Reload</h4>
                <p className="text-gray-400 text-sm">Desenvolvimento rápido com recarga automática</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Componentes Reutilizáveis</h4>
                <p className="text-gray-400 text-sm">Estrutura organizada para componentes modulares</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Responsivo</h4>
                <p className="text-gray-400 text-sm">Layout adaptável para todos os dispositivos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Info */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-4 bg-gray-800 bg-opacity-50 border border-gray-700 border-opacity-50 rounded-2xl px-8 py-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">0x</span>
            </div>
            <div className="text-left">
              <h3 className="text-white font-bold text-lg">Equipe 0x</h3>
              <p className="text-gray-400">Hackatona 2025 • Ready to Code</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 border-opacity-50 bg-black bg-opacity-20 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-gray-400">
              Desenvolvido com ❤️ pela <span className="text-white font-semibold">Equipe 0x</span> para a Hackatona 2025
            </p>
            <p className="text-gray-500 text-sm mt-2">
              React • TypeScript • Tailwind CSS • Vite
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;