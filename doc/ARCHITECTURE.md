
# Estratégia de Deploy Z-Funnels

Para transformar este projeto em um SaaS comercial, utilizaremos uma arquitetura de **Nuvem Híbrida**.

## 1. Frontend (Interface do Usuário)
- **Hospedagem:** Vercel.
- **Motivo:** Deploy contínuo, CDN global (carregamento instantâneo) e custo zero inicial.
- **Função:** Gerenciar funis, editar mensagens e disparar comandos.

## 2. Motor de Conexão (WhatsApp Engine)
- **Hospedagem:** Railway ou VPS Dedicada.
- **Tecnologia:** Evolution API (Node.js/Baileys).
- **Motivo:** O WhatsApp exige um processo **Stateful** (que mantém estado) para segurar a conexão WebSocket. A Vercel (Serverless) derrubaria a conexão a cada 30 segundos.
- **Segurança:** O motor roda isolado, protegendo as sessões dos usuários.

## 3. Banco de Dados e Persistência
- **Opção A (Pro):** Supabase (PostgreSQL + Auth).
- **Opção B (Simples):** MongoDB Atlas.
- **O que guarda:** Dados dos usuários, estrutura dos funis, histórico de disparos e variáveis de leads.

## 4. Fluxo de Dados Real
1. Usuário clica em "Disparar" no React (Vercel).
2. O React envia um comando via HTTPS para a Evolution API (Railway).
3. A Evolution API utiliza a sessão ativa do WhatsApp para enviar a mensagem instantaneamente.
4. O Webhook da Evolution API avisa o React que a mensagem foi entregue.

## 5. Próximos Passos para Escala
- Implementar **Multi-tenancy** (cada usuário tem sua própria instância de WhatsApp).
- Adicionar **Fila de Mensagens (RabbitMQ/Redis)** para evitar bloqueios por disparos em massa muito rápidos.
- Criar dashboard de métricas (CTR de mensagens).
