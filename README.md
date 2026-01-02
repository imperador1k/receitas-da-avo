# 🍳 Receitas da Avó

Uma aplicação web de receitas tradicionais portuguesas, desenvolvida em React.js para a disciplina de Interfaces Web.

## 📋 Sobre o Projeto

O "Receitas da Avó" é um livro de receitas digital que permite aos utilizadores descobrir e explorar receitas tradicionais passadas de geração em geração. A aplicação inclui um **frontoffice** público para consulta das receitas e um **backoffice** privado para gestão das mesmas.

## 🚀 Tecnologias Utilizadas

- **React.js** (v19) - Biblioteca de interface
- **Vite** - Build tool
- **Bootstrap 5** - Framework CSS
- **React Router v6** - Navegação
- **Axios** - Chamadas HTTP
- **Sheety API** - Backend (Google Sheets)

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Navbar.jsx       # Barra de navegação
│   ├── RecipeCard.jsx   # Card de receita
│   └── PrivateRoute.jsx # Proteção de rotas
├── pages/               # Páginas da aplicação
│   ├── Home.jsx         # Lista de receitas
│   ├── RecipeDetail.jsx # Detalhe da receita
│   ├── Login.jsx        # Autenticação
│   └── AdminDashboard.jsx # CRUD de receitas
├── services/
│   └── api.js           # Integração com Sheety
├── App.jsx              # Configuração de rotas
├── main.jsx             # Entry point
└── index.css            # Estilos customizados
```

## 🗄️ Modelo de Dados

### Entidade: Receitas
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | Number | Identificador único |
| titulo | String | Nome da receita |
| imagem | String | URL da imagem |
| tempo | String | Tempo de preparação |
| ingredientes | String | Lista de ingredientes |
| preparacao | String | Instruções |
| likes | Number | Contador de likes |
| categoria | String | Categoria da receita |

### Entidade: Categorias
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | Number | Identificador único |
| nome | String | Nome da categoria |

## 🔗 Endpoints da API (Sheety)

Base URL: `https://api.sheety.co/231b2b4d7d020f5d98082048ef3ae23a/bd`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /receitas | Lista todas as receitas |
| GET | /receitas/{id} | Obtém uma receita |
| POST | /receitas | Cria nova receita |
| PUT | /receitas/{id} | Atualiza receita |
| DELETE | /receitas/{id} | Elimina receita |
| GET | /categorias | Lista categorias |

## 💻 Como Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🔑 Credenciais de Acesso

Para aceder ao backoffice:
- **Utilizador:** admin
- **Password:** admin

## ✨ Funcionalidades

### Frontoffice
- ✅ Listagem de receitas em grid responsivo
- ✅ Pesquisa por nome
- ✅ Paginação (6 receitas por página)
- ✅ Página de detalhe com ingredientes e instruções
- ✅ Botão de Like (interação com visitantes)

### Backoffice
- ✅ Login protegido
- ✅ Dashboard com estatísticas
- ✅ CRUD completo (Criar, Ler, Atualizar, Eliminar)
- ✅ Modais para formulários

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- 💻 Desktop
- 📱 Tablet
- 📱 Smartphone

## ⚠️ Limitações

- A autenticação é simulada (não usa JWT real)
- As credenciais são fixas (admin/admin)
- Não há registo de novos utilizadores

## 👨‍💻 Autor

Projeto desenvolvido para a disciplina de **Interfaces Web**.

---

*Receitas da Avó © 2026*
