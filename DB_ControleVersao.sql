create database controleVersao;

use controleVersao;

CREATE TABLE usuario (
    registro  INT AUTO_INCREMENT PRIMARY KEY,
    nome      VARCHAR(100) NOT NULL,
    login     VARCHAR(50)  NOT NULL UNIQUE,
    senha     VARCHAR(255) NOT NULL,
    perfil    ENUM('ADMIN', 'ANALISTA') NOT NULL DEFAULT 'ANALISTA'
);

CREATE TABLE programa (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    nome          VARCHAR(150) NOT NULL UNIQUE,
    descricao     TEXT,
    status        ENUM('EM_DESENVOLVIMENTO', 'DISPONIVEL') NOT NULL DEFAULT 'DISPONIVEL',
    registro_usuario    INT NOT NULL,
    desenvolvedor       VARCHAR(150) NULL,
    data_envio          DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (registro_usuario) REFERENCES usuario(registro)
);