# Midnight Tech - Cockpit de Suporte Técnico

Painel administrativo premium para gerenciamento de chamados técnicos, desenvolvido com React, Vite, Tailwind 4 e Supabase.

## 🚀 Funcionalidades

- **Dashboard Geral**: Visão consolidada de chamados, SLAs e status em tempo real.
- **Gestão de Chamados**: Tabela interativa com filtros por categoria e busca global.
- **Catálogo de Serviços**: Interface intuitiva para abertura rápida de chamados.
- **Integração Supabase**: Persistência de dados em tempo real.
- **Design Ultra-Moderno**: Estética "Midnight" com glassmorphism e animações fluidas (Framer Motion).
- **Busca Global**: Filtragem instantânea por título ou ID de ticket.

## 🛠️ Tecnologias

- **Framework**: [React 19](https://reactjs.org/)
- **Bundler**: [Vite 8](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animações**: [Framer Motion](https://www.framer.com/motion/)
- **Backend**: [Supabase](https://supabase.com/)
- **Ícones**: Material Symbols Outlined

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o arquivo `.env` com suas credenciais do Supabase (veja `.env.example`).
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## 📝 Banco de Dados

Certifique-se de ter uma tabela `tickets` no Supabase com as seguintes colunas:
- `id`: uuid (Primary Key)
- `ticket_number`: text (Ex: #TK-1234)
- `title`: text
- `type`: text
- `priority`: text
- `status`: text (Default: 'Aberto')
- `requester`: text
- `user_id`: uuid (opcional)
- `created_at`: timestamptz (Default: now())

---
Desenvolvido com ❤️ por Antigravity.
