# Financeiro Turbinado - Frontend React

Frontend React para o sistema de gerenciamento financeiro, completamente integrado com a API Java.

## 🚀 Tecnologias Utilizadas

- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **React Router DOM**
- **Axios** (para comunicação com API)
- **React Hot Toast** (notificações)
- **Lucide React** (ícones)

## 📋 Pré-requisitos

- Node.js 18 ou superior
- API Java rodando em `http://localhost:8000`

## 🛠️ Como Executar o Projeto

### 1. Instalar Dependências
```bash
npm install
```

### 2. Executar o Projeto
```bash
npm run dev
```

O projeto estará disponível em: `http://localhost:5174`

## 🔗 Integração com API Java

O frontend está **completamente integrado** com a API Java e **não possui mocks**. Todas as funcionalidades utilizam dados reais da API:

### ✅ Funcionalidades Integradas

- **Autenticação JWT** - Login/logout com tokens
- **Dashboard** - Dados em tempo real do usuário
- **Relatórios** - Gráficos e estatísticas da API
- **Despesas** - CRUD completo
- **Receitas** - CRUD completo  
- **Categorias** - CRUD completo
- **Cartões de Crédito** - CRUD completo
- **Próximos Vencimentos** - Dados da API

### 📊 Endpoints Utilizados

- `POST /user/login` - Autenticação
- `POST /user/` - Registro de usuário
- `GET /dashboard` - Dados do dashboard
- `GET /dashboard/upcoming-due` - Próximos vencimentos
- `GET /dashboard/reports/*` - Todos os relatórios
- `GET/POST /expense/` - Despesas
- `GET/POST /receipt/` - Receitas
- `GET/POST /category/` - Categorias
- `GET/POST /credit-cards` - Cartões de crédito

## 🎨 Interface

### Design System
- **Tema escuro** com gradientes modernos
- **Responsivo** para mobile e desktop
- **Animações suaves** e feedback visual
- **Ícones intuitivos** do Lucide React

### Componentes Principais
- **Dashboard** - Visão geral das finanças
- **Relatórios** - Gráficos e estatísticas
- **Formulários** - Adicionar despesas, receitas, categorias
- **Navegação** - Header com usuário e logout

## 🔐 Autenticação

- **JWT Token** armazenado no localStorage
- **Interceptor Axios** adiciona token automaticamente
- **Redirecionamento** para login quando não autenticado
- **Logout** limpa dados do localStorage

## 📱 Responsividade

- **Mobile-first** design
- **Grid responsivo** para diferentes telas
- **Navegação adaptativa** para mobile
- **Formulários otimizados** para touch

## 🚀 Funcionalidades

### Dashboard
- Saldo atual em tempo real
- Receitas e despesas do mês
- Total de cartões ativos
- Próximos vencimentos
- Ações rápidas para navegação

### Relatórios
- **Visão Geral** - Gráficos de barras e linha
- **Receitas** - Por mês, categoria e top receitas
- **Despesas** - Por mês, categoria e top despesas
- **Categorias** - Gráficos de pizza

### Formulários
- **Validação em tempo real**
- **Formatação automática** de valores
- **Seleção de categorias** dinâmica
- **Feedback visual** de erros/sucesso

## 🔧 Configuração

### Variáveis de Ambiente
O projeto está configurado para conectar com a API em `http://localhost:8000` por padrão.

### API Base URL
```typescript
const API_BASE_URL = 'http://localhost:8000';
```

## 🧪 Testando

### 1. Criar Usuário
- Acesse `/register`
- Preencha os dados
- Clique em "Criar Conta"

### 2. Fazer Login
- Acesse `/login`
- Use as credenciais criadas
- Será redirecionado para o dashboard

### 3. Adicionar Dados
- Use "Adicionar Receita" para criar entradas
- Use "Adicionar Despesa" para criar saídas
- Use "Nova Categoria" para organizar

### 4. Ver Relatórios
- Acesse "Ver Relatórios" no dashboard
- Explore as diferentes abas
- Visualize os gráficos em tempo real

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Button.tsx
│   └── Input.tsx
├── pages/              # Páginas da aplicação
│   ├── Dashboard.tsx
│   ├── Reports.tsx
│   ├── AddExpense.tsx
│   ├── AddIncome.tsx
│   ├── AddCategory.tsx
│   ├── Login.tsx
│   └── Register.tsx
├── services/           # Serviços de API
│   └── api.ts
├── types/              # Tipos TypeScript
│   └── index.ts
└── App.tsx            # Componente principal
```

## 🔄 Estado da Aplicação

- **Dados do usuário** no localStorage
- **Token JWT** para autenticação
- **Estado de loading** para feedback
- **Tratamento de erros** com toast notifications

## 🎯 Próximos Passos

- [ ] Implementar testes unitários
- [ ] Adicionar PWA capabilities
- [ ] Implementar cache offline
- [ ] Adicionar mais tipos de gráficos
- [ ] Implementar exportação de relatórios

---

**Desenvolvido com ❤️ usando React + TypeScript**

> **Nota**: Este frontend está 100% integrado com a API Java e não possui mocks. Todos os dados são reais e em tempo real.
