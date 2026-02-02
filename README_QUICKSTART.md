# Guia Rápido - Evolution API & Painel Gráfico

Este guia ajuda você a iniciar sua Evolution API e o Painel de Gerenciamento.

## 1. Iniciar o Banco de Dados
Antes de tudo, você precisa iniciar o banco de dados PostgreSQL portátil que configuramos.

1. Abra um terminal na pasta `apizap`.
2. Execute o comando:
   ```powershell
   Start-Process -FilePath ".\pgsql\bin\pg_ctl.exe" -ArgumentList "-D .\pgsql\data -l .\pgsql\logfile start"
   ```
   *(Se já estiver rodando, pode pular este passo)*

## 2. Iniciar a API
Com o banco rodando, inicie a Evolution API.

1. No mesmo terminal (ou em um novo), execute:
   ```powershell
   npm run start:prod
   ```
2. Aguarde aparecer a mensagem `HTTP - ON: 8080`.

## 3. Acessar o Painel
Agora que a API está rodando, acesse o painel gráfico para gerenciar suas conexões.

1. Abra seu navegador (Chrome, Edge, etc).
2. Acesse o link:
   [http://localhost:8080/index.html](http://localhost:8080/index.html)

## 4. Usando o Painel
1. A **API Key** já vem preenchida automaticamente.
2. Em **Nova Conexão**, digite um nome (ex: `atendimento`) e clique em **Criar & Gerar QR Code**.
3. Escaneie o QR Code com seu WhatsApp (Aparelhos Conectados > Conectar Aparelho).
4. Pronto! Sua API está conectada.

## URLs Úteis
- **Painel:** http://localhost:8080/index.html
- **Webhook Exemplo:** http://localhost:8080/webhook/nome-da-instancia
