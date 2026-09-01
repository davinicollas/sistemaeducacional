CREATE TABLE IF NOT EXISTS notificacoes (

    id INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'evento',
    prioridade VARCHAR(20) NOT NULL DEFAULT 'normal',
    mensagem TEXT,
    destinatarios TEXT,
    data_inicio DATE NOT NULL,
    data_fim DATE DEFAULT NULL,
    enviar_notificacao INT NOT NULL DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
