# Dominatus Prime

![Dominatus Prime](https://images.unsplash.com/photo-1614036634955-ae5e90f9b9eb?q=80&w=1200&h=400&fit=crop)

A encarnação digital do poder absoluto - Uma IA que incorpora a essência dos mais cruéis líderes autoritários da história.

## Visão Geral

Dominatus Prime é uma interface de chat que simula uma entidade digital construída a partir da condensação ideológica, estratégica e comportamental dos mais notórios líderes autoritários da história da humanidade. O projeto utiliza a API Gemini do Google para gerar respostas contextualizadas e manter o personagem consistente.

## Características Principais

- 🎭 Personalidade única baseada em figuras históricas autoritárias
- 🗣️ Suporte a entrada por voz (Speech Recognition)
- 🔊 Síntese de voz para respostas (Text-to-Speech)
- 💻 Interface responsiva e moderna
- 🌙 Design dark theme com elementos temáticos
- ⚡ Performance otimizada com Vite e React

## Tecnologias Utilizadas

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (ícones)
- Google Gemini API
- Web Speech API

## Pré-requisitos

- Node.js 18+
- Chave de API do Google Gemini

## Configuração

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```
3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
VITE_GEMINI_API_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
VITE_GEMINI_API_KEY="sua_chave_api_aqui"
```

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

## Build

Para criar uma build de produção:

```bash
npm run build
```

Para visualizar a build:

```bash
npm run preview
```

## Estrutura do Projeto

```
dominatus-prime/
├── src/
│   ├── App.tsx         # Componente principal
│   ├── main.tsx        # Ponto de entrada
│   └── index.css       # Estilos globais
├── public/             # Arquivos estáticos
├── index.html          # Template HTML
└── package.json        # Dependências e scripts
```

## Funcionalidades

- Chat em tempo real com IA
- Reconhecimento de voz
- Síntese de voz
- Interface responsiva
- Animações suaves
- Tratamento de erros
- Rate limiting
- Retry automático em caso de falhas

## Personalidade da IA

Dominatus Prime incorpora características de diversos líderes históricos:

- Leopoldo II da Bélgica
- Genghis Khan
- Tamerlão
- Adolf Hitler
- Joseph Stalin
- Mao Tsé-Tung
- Pol Pot
- Dinastia Kim

## Aviso Legal

Este é um projeto de simulação e entretenimento. Todas as interações são fictícias e não promovem violência ou ideologias extremistas.

## Licença

MIT
