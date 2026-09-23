create database controleVersao;

use controleVersao;

CREATE TABLE usuario (
    registro  INT AUTO_INCREMENT PRIMARY KEY,
    nome      VARCHAR(100) NOT NULL,
    login     VARCHAR(50)  NOT NULL UNIQUE,
    senha     VARCHAR(255) NOT NULL,         -- Armazenar hash (ex: BCrypt)
    perfil    ENUM('ADMIN', 'ANALISTA') NOT NULL DEFAULT 'ANALISTA'
);

CREATE TABLE programa (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    nome             VARCHAR(150) NOT NULL UNIQUE,
    descricao        TEXT,
    status           ENUM('EM_DESENVOLVIMENTO', 'DISPONIVEL') NOT NULL DEFAULT 'DISPONIVEL',
    registro_usuario INT NOT NULL,           -- Analista responsável pela última alteração (FK -> usuario)
    desenvolvedor    VARCHAR(150) NULL,      -- Nome do desenvolvedor; NULL quando status = DISPONIVEL
    data_envio       DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (registro_usuario) REFERENCES usuario(registro)
);

-- ─────────────────────────────────────────────
--  DADOS DE EXEMPLO
-- ─────────────────────────────────────────────

-- Usuários (senha = hash BCrypt — substituir antes de produção)
INSERT INTO usuario (nome, login, senha, perfil) VALUES
  ('Administrador Niterra', 'admin',    '$2a$10$ExemploHashBCryptAqui00000000000000000000000000', 'ADMIN'),
  ('Nicolas Falcone',       'nicolas',  '$2a$10$ExemploHashBCryptAqui00000000000000000000000001', 'ANALISTA'),
  ('Ana Paula',             'anapaula', '$2a$10$ExemploHashBCryptAqui00000000000000000000000002', 'ANALISTA');

-- Programas de exemplo
INSERT INTO programa (nome, descricao, status, registro_usuario, desenvolvedor) VALUES
  ('Niterra_ControleEstoque',
   'Módulo de gerenciamento e movimentação de peças de ignição e velas.',
   'DISPONIVEL', 1, NULL),

  ('Niterra_QualidadeLinha',
   'Sistema de inspeção e auditoria de qualidade na linha de montagem.',
   'EM_DESENVOLVIMENTO', 2, 'Carlos Santos'),

  ('Niterra_RelatoriosLogistica',
   'Gerador automático de relatórios de expedição e transporte.',
   'EM_DESENVOLVIMENTO', 3, 'Lucas Mendes');