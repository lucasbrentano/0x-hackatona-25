# Nome do Projeto

Uma aplicação React desenvolvida com TypeScript e estilizada com TailwindCSS.

## 🚀 Tecnologias

- [React](https://reactjs.org/) - Biblioteca JavaScript para construção de interfaces
- [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript com tipagem estática
- [TailwindCSS](https://tailwindcss.com/) - Framework CSS utilitário
- [Vite](https://vitejs.dev/) - Build tool rápida para desenvolvimento

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [npm](https://www.npmjs.com/)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/lucasbrentano/0x-hackatona-25.git
```

2. Navegue até o diretório do projeto:
```bash
cd ./frontend
```

3. Instale as dependências:
```bash
npm install
```

## ⚡ Como executar

### Modo de desenvolvimento
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

### Build para produção
```bash
npm run build
```

### Preview da build de produção
```bash
npm run preview
```

## 🛠️ Scripts disponíveis

- `dev` - Inicia o servidor de desenvolvimento
- `build` - Cria a build de produção
- `preview` - Visualiza a build de produção localmente
- `lint` - Executa o ESLint para verificar o código

## 📁 Estrutura do projeto

```
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🎨 TailwindCSS

O projeto utiliza TailwindCSS para estilização. As configurações personalizadas podem ser encontradas em `tailwind.config.js`.

Para adicionar estilos customizados, edite o arquivo `src/index.css` ou crie novos arquivos CSS conforme necessário.

## 📝 TypeScript

O projeto está configurado com TypeScript para garantir tipagem estática. Os tipos personalizados devem ser adicionados na pasta `src/types/`.

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 👨‍💻 Autores

**Equipe 0x** - Hackatona 2025 de Engenharia de Software PUCRS

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!