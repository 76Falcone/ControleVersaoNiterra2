# Controle de Versão Niterra 🚗💻

Sistema web para **gerenciamento e controle de versões de programas** da Niterra, desenvolvido com arquitetura modular frontend (`HTML5`, `CSS3` customizado com suporte a modo escuro, `JavaScript ES6+` e `Phosphor Icons`).

---

## 📌 Visão Geral do Projeto

O sistema foi modelado para rastrear o ciclo de vida dos softwares desenvolvidos na Niterra. Permite acompanhar se um programa está **Em Desenvolvimento** (com o analista/desenvolvedor) ou **Disponível** (pronto para produção), vinculando a responsabilidade de envio ao perfil do usuário.

---

## 🗄️ Estrutura do Banco de Dados (`DB_ControleVersao.sql`)

A aplicação reflete diretamente o esquema do banco de dados relacional:

### Tabela `usuario`
- `registro` (INT, PK AUTO_INCREMENT): Identificador único do usuário.
- `nome` (VARCHAR 100): Nome completo do colaborador.
- `login` (VARCHAR 50, UNIQUE): Usuário para autenticação no sistema.
- `senha` (VARCHAR 255): Senha de acesso.
- `perfil` (`ADMIN` | `ANALISTA`): Nível de permissão de acesso.

### Tabela `programa`
- `id` (INT, PK AUTO_INCREMENT): Código de controle do programa.
- `nome` (VARCHAR 150, UNIQUE): Nome único do programa ou pacote de software.
- `descricao` (TEXT): Descrição detalhada da finalidade e alterações do programa.
- `status` (`EM_DESENVOLVIMENTO` | `DISPONIVEL`): Situação atual da versão.
- `registro_usuario` (INT, FK -> usuario.registro): Desenvolvedor/Analista responsável pelo envio.
- `data_envio` (DATETIME): Data e hora do cadastro ou envio da versão.

---

## 📁 Estrutura de Diretórios (`web/`)

Seguindo a arquitetura padrão de módulos do projeto:

```
ControleVersaoNiterra/
├── DB_ControleVersao.sql        # Script SQL oficial de criação do banco de dados
├── Imagens/
│   └── NiterraLogoPNG           # Logotipo original da Niterra
├── index.html                   # Dashboard principal e lista de controle de programas
└── web/
    ├── html/
    │   ├── login.html           # Tela de autenticação e login no sistema
    │   └── usuarios.html        # Tela de gestão e cadastro de usuários
    ├── css/
    │   ├── variables.css        # Tokens de design, paleta Niterra e temas (Claro/Escuro)
    │   ├── style.css            # Estilos globais, barra lateral, topbar, modais e notificações
    │   ├── login.css            # Layout de login com painel institucional
    │   ├── dashboard.css        # Cards de métricas e tabela de programas
    │   └── usuarios.css         # Componentes da gestão de usuários
    ├── js/
    │   ├── darkmode.js          # Gerenciamento de tema escuro com persistência
    │   ├── script.js            # Utilitários de navegação, modais e avisos
    │   ├── login.js             # Validação de credenciais e controle de sessão
    │   ├── programas.js         # Lógica CRUD de programas e filtros de status
    │   └── usuarios.js          # Lógica CRUD de usuários e permissões
    └── images/
        └── logo.png             # Ativo da logo Niterra
```

---

## 🚀 Como Executar o Projeto

1. Clone o repositório ou navegue até a pasta raiz do projeto.
2. Abra o arquivo `web/html/login.html` ou `index.html` em qualquer navegador web moderno.
3. Para testar o acesso inicial, utilize as credenciais padrão pré-configuradas:
   - **Administrador**: Login: `admin` | Senha: `123`
   - **Analista**: Login: `analista` | Senha: `123`

---

## ✨ Funcionalidades Principais

- 🔐 **Autenticação e Sessão**: Tela de login com validação em tempo real e alteração de visibilidade de senha.
- 🎨 **Identidade Niterra & Modo Escuro**: Cores oficiais da marca com alternância suave para o modo escuro.
- 📊 **Dashboard de Métricas**: Indicadores em tempo real do total de programas, status e desenvolvedores ativos.
- 🛠️ **Controle de Programas**: Cadastre, edite, altere o status (`EM_DESENVOLVIMENTO` ↔ `DISPONIVEL`) e filtre por nome ou desenvolvedor.
- 👥 **Gestão de Usuários**: Cadastro de novos analistas e administradores com verificação de login único.