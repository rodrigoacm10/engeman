# 🏡 Engimob (Desafio Técnico - Desenvolvedor Front-end)

Bem-vindo ao repositório do **Engimob**, uma plataforma desenvolvida para o desafio técnico de Front-end com foco no mercado imobiliário!

> 🔗 **Link do Deploy**: [https://engeman-sigma.vercel.app](https://engeman-sigma.vercel.app)

## 🎯 Objetivo do Projeto

Construir um front-end moderno, responsivo e performático em React (Next.js) que permita aos usuários comuns e corretores interagirem com anúncios imobiliários através da API fornecida. O sistema cobre uma jornada completa: desde visualização pública e filtros, até autenticação, favoritação e gestão completa (CRUD) de imóveis na área logada.

## 🚀 Tecnologias e Ferramentas Utilizadas

Este projeto foi construído pensando nas melhores práticas atuais de desenvolvimento front-end:

- **Framework**: [Next.js](https://nextjs.org/) (App Router) e [React 19](https://react.dev/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/) para tipagem estática e maior segurança.
- **Estilização e UI**: [Tailwind CSS](https://tailwindcss.com/) v4 e componentes acessíveis com [Radix UI](https://www.radix-ui.com/) (base do Shadcn UI).
- **Gerenciamento de Estado de Servidor e Cache**: [TanStack React Query](https://tanstack.com/query/latest) v5 (Para consumo performático da API, refetching e cache).
- **Formulários e Validação**: [React Hook Form](https://react-hook-form.com/) integrado ao [Zod](https://zod.dev/) para lidar com os DTOs e validação de forma robusta e otimizada.
- **Autenticação e Persistência**: Tokens JWT persistidos através de cookies ([nookies](https://github.com/maticzav/nookies)).
- **Upload de Imagens**: Integração nativa com CDN externa ([Cloudinary](https://cloudinary.com/)).
- **Requisições HTTP**: [Axios](https://axios-http.com/).

## 🌟 Funcionalidades Implementadas

O projeto atende **100% dos requisitos propostos**, divididos nas seguintes áreas:

### 1️⃣ Autenticação e Segurança

- [x] Telas de **Login** e **Registro** completas com validação de dados.
- [x] Autenticação via JWT (`Authorization: Bearer <token>`).
- [x] Persistência segura do token e proteção rigorosa de rotas privadas.

### 2️⃣ Área Pública (Deslogada)

- [x] **Listagem Principal (Home)**:
  - Consumo do endpoint `/api/property` com suporte completo à **paginação**.
  - **Filtros dinâmicos**: nome, tipo de imóvel, preço mínimo/máximo, e quantidade mínima de quartos.
  - Sincronização inteligente dos filtros com a URL (State ↔ Querystring).
  - Busca por nome com **debounce** (evitando múltiplas chamadas desnecessárias).
- [x] **Detalhes do Imóvel**:
  - Exibição de todas as informações da propriedade e galeria de imagens completa.

### 3️⃣ Área Autenticada ("Minha Conta")

- [x] **Meu Perfil**:
  - Consulta aos dados do usuário via API (`/api/user`).
  - Atualização de senha e nome do usuário.
- [x] **Meus Favoritos**:
  - Área exclusiva para listar os imóveis favoritados pelo usuário.
  - Interação fluida (favoritar/desfavoritar) com validação e refetch automático via React Query.

### 4️⃣ Área do Corretor/Admin ("Minhas Propriedades")

- [x] **Gerenciamento Completo de Imóveis**:
  - Listagem das próprias propriedades (`/getUserProperties`).
  - **Criação de novos anúncios**, com upload automático e transparente de imagens para o _Cloudinary_ (CDN).
  - **Edição** completa das informações dos imóveis.
  - Controle de visualização: **Ativar/Inativar** (Status) anúncios.
  - Deleção responsável com confirmação.

---

## 🛠️ Como Executar o Projeto Localmente

### Pré-requisitos

- Node.js (Versão 18.x ou superior recomendada)
- npm, yarn, pnpm ou bun instalados.

### Passos

1. **Clone o repositório**

   ```bash
   git clone https://github.com/rodrigoacm10/engeman.git
   cd engeman
   ```

2. **Instale as dependências**

   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

3. **Configure as Variáveis de Ambiente**
   Crie um arquivo `.env` na raiz do projeto utilizando o arquivo `.env.example` como base. Certifique-se de configurar as seguintes variáveis:

   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=seu_upload_preset
   NEXT_PUBLIC_API_URL=https://sua-api.com
   ```

4. **Inicie o servidor de desenvolvimento**

   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   ```

5. O aplicativo estará disponível acessando [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🏗️ Estrutura do Projeto

- `src/app`: Rotas da aplicação agrupadas utilizando os recursos do novo App Router do Next.js.
- `src/components`: Componentes desacoplados, de interface de usuário (UI), formulários e modais (Dialogs).
- `src/hooks`: Custom hooks contendo as lógicas de negócio e hooks unificados de mutação do servidor (React Query).
- `src/services`: Camadas de abstração puramente responsáveis pela comunicação via cliente Axios com a API base, e integração de CDN.
- `src/types`: Interfaces TypeScript rigorosas para os tipos de dados e os DTOs trafegados via API.
- `src/lib`: Bibliotecas auxiliares configuradas e classes utilitárias gerais.

## 💡 Destaques Técnicos Relevantes

- **Hooks e Abstrações Reutilizáveis**: O uso de padrões como Custom Hooks permitiu, por exemplo, unificar a lógica de edição/deleção de _cards_ em um único hook (`usePropertyCardAction`), reaproveitado tanto na Home, Favoritos e Área Logada.
- **Sincronização com URL Parameters**: A implementação avançada e sincronizada do filtro, onde todos os parâmetros preenchidos reagem dinamicamente para a URL, permitindo o compartilhamento seguro e robusto da tela que o usuário esta vendo com outra pessoa.
- **Cache Invalidation**: Ao realizar uma ação nas propriedades (criar, atualizar, inativar, deletar ou favoritar), a listagem correspondente tem a _query key_ imediatamente invalidada, renderizando o novo estado fluidamente pro usuário com ajuda da biblioteca `@tanstack/react-query`.

---

**Desenvolvido como solução para o desafio técnico Full Stack / Front-end.**
