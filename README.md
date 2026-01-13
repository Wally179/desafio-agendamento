# 📅 Portal de Agendamentos

![Badge Status](https://img.shields.io/badge/STATUS-CONCLUÍDO-brightgreen)
![Badge License](https://img.shields.io/badge/LICENSE-MIT-blue)
![Badge Stack](https://img.shields.io/badge/STACK-NEXTJS%20%7C%20NODE%20%7C%20MYSQL-blueviolet)

> Sistema completo para gestão de agendamentos de salas corporativas, com autenticação segura, histórico de atividades e integração de endereço via CEP.

##

## 💻 Sobre o Projeto

Este projeto foi desenvolvido como um **Desafio Técnico Full Stack**. O objetivo foi arquitetar e desenvolver uma aplicação web robusta que permitisse aos usuários agendar horários em salas, gerenciar seus dados de perfil e visualizar logs de auditoria de todas as ações realizadas.

A aplicação utiliza uma arquitetura moderna, separando **Frontend** e **Backend**, garantindo escalabilidade, segurança e organização de código (Clean Code).

### 🌟 Funcionalidades Principais

**Autenticação Segura:** Login e Cadastro com criptografia (Bcrypt) e tokens de sessão (JWT).
**Dashboard Interativo:** Painel administrativo com Sidebar fixa e navegação fluida.
**Gestão de Agendamentos:**
Listagem visual de horários.
Criação de novos agendamentos (Modal com validação de dados).
Cancelamento de reservas.
**Logs de Auditoria:** Rastreabilidade completa (quem fez o quê e quando) para segurança e compliance.
**Integração ViaCEP:** Preenchimento automático de endereço (Rua, Bairro, Cidade, Estado) ao digitar o CEP.
**Perfil de Usuário:** Área dedicada para atualização de dados cadastrais.
**Design Responsivo:** Interface adaptável para dispositivos móveis e desktops.

---

## 🛠 Tecnologias Utilizadas

O projeto foi construído com as tecnologias mais atuais do mercado:

### Frontend (Web)

**Next.js 15 (App Router):** Framework React para produção.
**TypeScript:** Tipagem estática para maior segurança.
**Tailwind CSS:** Estilização utilitária e responsiva.
**React Hook Form + Zod:** Gerenciamento de formulários e validação de schemas.
**Axios:** Consumo de API REST.
**Lucide React:** Ícones leves e modernos.

### Backend (API)

**Node.js:** Runtime JavaScript.
**Express:** Framework para servidor web.
**Sequelize ORM:** Abstração de banco de dados SQL.
**MySQL:** Banco de dados relacional (Hospedado no Aiven).
\ **JWT:** Autenticação via Json Web Token.

---

## 📸 Screenshots

|           Tela de Login           |                  Dashboard                   |
| :-------------------------------: | :------------------------------------------: |
| ![Login](./screenshots/login.png) | ![Dashboard](./screenshots/agendamentos.png) |

|        Logs de Auditoria        |          Perfil do Usuário          |
| :-----------------------------: | :---------------------------------: |
| ![Logs](./screenshots/logs.png) | ![Perfil](./screenshots/perfil.png) |

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para rodar a aplicação localmente.

### Pré-requisitos

Node.js (v18+)
Git

### 1. Clonar o repositório

`bash
git clone [https://github.com/Wally179/desafio-agendamento.git](https://github.com/Wally179/desafio-agendamento.git)
cd desafio-agendamento
`

### 2. Configurar o Backend (Servidor)

`bash
cd server
npm install
`

Crie um arquivo `.env` na pasta `server` com as credenciais do banco:
`env
DB_HOST=seu_host_mysql
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=defaultdb
DB_PORT=3306
JWT_SECRET=chave_secreta
PORT=3001
`

Inicie a API:
`bash
npm start

# O servidor rodará em http://localhost:3001

`

### 3. Configurar o Frontend (Web)

Em outro terminal:
`bash
cd web
npm install
`

Crie um arquivo `.env.local` na pasta `web`:
`env
NEXT_PUBLIC_API_URL=http://localhost:3001
`

Inicie o site:
`bash
npm run dev

# Acesse em http://localhost:3000

---

## 🌐 Deploy

O projeto está online para visualização:

**Frontend (Vercel):** [Acesse o Site](https://desafio-agendamento.vercel.app/login)
**Backend (Render):** [Acesse a API](https://agendamento-api-jt9d.onrender.com)

---

## 👨‍💻 Autor

Desenvolvido por **Wallace Santos**.

**LinkedIn:** [Seu LinkedIn](https://www.linkedin.com/in/wallace-santos-925a75106/)
**GitHub:** [Seu GitHub](https://github.com/wally179)
\ **Email:** [Wallace-179@hotmail.com](mailto:Wallace-179@hotmail.com)
