# API de Webhook n8n - DeckSoft Chat

Documentação completa da API de integração entre o chat da DeckSoft e o n8n.

---

## 📡 Endpoint

```
POST https://repetiva-n8n.hfnc82.easypanel.host/webhook/240b36f9-9d6d-4946-864b-8b681f3ec906
```

---

## 🔐 Autenticação

Atualmente, o webhook não requer autenticação. Recomenda-se implementar validação por token ou IP whitelist em produção.

---

## 📨 Eventos

O webhook recebe dois tipos de eventos:

### 1. Registro de Lead (`lead_registration`)

Enviado quando o usuário preenche o formulário inicial antes de iniciar o chat.

#### Request

```http
POST /webhook/240b36f9-9d6d-4946-864b-8b681f3ec906
Content-Type: application/json
```

```json
{
  "type": "lead_registration",
  "lead": {
    "name": "João Silva",
    "email": "joao@empresa.com.br",
    "phone": "11 99999-9999",
    "company": "Empresa LTDA",
    "message": "Gostaria de saber mais sobre o módulo de Materiais de Construção"
  },
  "timestamp": "2024-01-15T13:30:00.000Z"
}
```

#### Campos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `type` | string | ✅ | Sempre `"lead_registration"` |
| `lead.name` | string | ✅ | Nome completo do lead |
| `lead.email` | string | ✅ | E-mail validado |
| `lead.phone` | string | ✅ | Telefone no formato `XX XXXXX-XXXX` |
| `lead.company` | string | ❌ | Nome da empresa (opcional) |
| `lead.message` | string | ❌ | Mensagem inicial do lead (opcional) |
| `timestamp` | string | ✅ | Data/hora ISO 8601 |

#### Response Esperada

O evento de registro de lead não espera resposta específica. Qualquer status 2xx é considerado sucesso.

```json
{
  "success": true
}
```

---

### 2. Mensagem do Chat (`message`)

Enviado a cada mensagem que o usuário envia no chat.

#### Request

```http
POST /webhook/240b36f9-9d6d-4946-864b-8b681f3ec906
Content-Type: application/json
```

```json
{
  "message": "Olá, gostaria de saber mais sobre o módulo de Materiais de Construção",
  "timestamp": "2024-01-15T13:31:00-03:00",
  "history": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "role": "assistant",
      "content": "Olá! 👋 Seja bem-vindo(a) à DeckSoft!",
      "timestamp": "2024-01-15T13:30:30-03:00"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "role": "assistant",
      "content": "Estou aqui para entender seu negócio e identificar como posso ajudar.",
      "timestamp": "2024-01-15T13:30:32-03:00"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "role": "user",
      "content": "Olá, gostaria de saber mais sobre o módulo de Materiais de Construção",
      "timestamp": "2024-01-15T13:31:00-03:00"
    }
  ],
  "lead": {
    "name": "João Silva",
    "email": "joao@empresa.com.br",
    "phone": "11 99999-9999",
    "company": "Empresa LTDA"
  }
}
```

#### Campos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `message` | string | ✅ | Texto da mensagem atual do usuário |
| `timestamp` | string | ✅ | Data/hora no fuso de Brasília (UTC-3) |
| `history` | array | ✅ | Histórico completo da conversa |
| `history[].id` | string | ✅ | UUID único da mensagem |
| `history[].role` | string | ✅ | `"user"` ou `"assistant"` |
| `history[].content` | string | ✅ | Conteúdo da mensagem |
| `history[].timestamp` | string | ✅ | Data/hora da mensagem |
| `lead` | object | ✅ | Dados do lead (mesmo formato acima) |

#### Response Esperada

```json
{
  "text": "O módulo de Materiais de Construção da DeckSoft oferece gestão completa para sua loja! Inclui controle de estoque com múltiplos depósitos, vendas no balcão e por orçamento, emissão de notas fiscais e muito mais. Posso explicar alguma funcionalidade específica?"
}
```

#### Campos de Resposta

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `text` | string | ✅ (preferencial) | Resposta da IA para exibir ao usuário |
| `response` | string | ❌ | Fallback se `text` não existir |
| `message` | string | ❌ | Fallback se `response` não existir |

**Ordem de prioridade**: `text` → `response` → `message`

---

## 🔄 Fluxo Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                        FLUXO DO CHAT                            │
└─────────────────────────────────────────────────────────────────┘

1. Usuário acessa /chat
          │
          ▼
2. Preenche formulário de lead
   (nome, e-mail, telefone, empresa)
          │
          ▼
3. Frontend envia POST → Webhook
   { type: "lead_registration", lead: {...} }
          │
          ▼
4. n8n processa:
   - Salva lead no CRM/banco
   - Envia notificação (opcional)
          │
          ▼
5. Chat inicia com mensagens de boas-vindas
   (automáticas, sem chamada ao webhook)
          │
          ▼
6. Usuário envia mensagem
          │
          ▼
7. Frontend envia POST → Webhook
   { message: "...", history: [...], lead: {...} }
          │
          ▼
8. n8n processa:
   - Envia para modelo de IA
   - Recebe resposta
   - Retorna { text: "..." }
          │
          ▼
9. Frontend exibe resposta da Ana
          │
          ▼
   [Loop: passos 6-9 para cada mensagem]
```

---

## 🛠 Exemplo de Fluxo n8n

### Nodes Recomendados

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Webhook    │────▶│    Switch    │────▶│  IF: lead_   │
│   Trigger    │     │  (by type)   │     │ registration │
└──────────────┘     └──────────────┘     └──────────────┘
                                                   │
                     ┌─────────────────────────────┤
                     │                             │
                     ▼                             ▼
              ┌──────────────┐             ┌──────────────┐
              │   Save to    │             │   OpenAI /   │
              │   Airtable   │             │   Claude     │
              └──────────────┘             └──────────────┘
                     │                             │
                     ▼                             ▼
              ┌──────────────┐             ┌──────────────┐
              │   Respond    │             │   Format     │
              │  to Webhook  │             │   Response   │
              └──────────────┘             └──────────────┘
                                                   │
                                                   ▼
                                           ┌──────────────┐
                                           │   Respond    │
                                           │  to Webhook  │
                                           └──────────────┘
```

### Configuração do Switch Node

```javascript
// Expressão para verificar tipo
{{ $json.type === 'lead_registration' }}
```

### Configuração do OpenAI Node

**System Prompt sugerido:**

```
Você é Ana, atendente virtual da DeckSoft, empresa especializada em sistemas ERP.

Seu objetivo é:
1. Entender as necessidades do cliente
2. Apresentar as soluções adequadas (Materiais de Construção, Agronegócios ou Combustíveis)
3. Agendar uma demonstração com um especialista

Seja cordial, profissional e objetiva. Use emojis com moderação.

Informações do lead:
- Nome: {{ $json.lead.name }}
- Empresa: {{ $json.lead.company || 'Não informada' }}
- E-mail: {{ $json.lead.email }}
- Telefone: {{ $json.lead.phone }}
```

### Configuração do Respond to Webhook

```json
{
  "text": "{{ $json.choices[0].message.content }}"
}
```

---

## ⚠️ Tratamento de Erros

### Erros do Cliente (Frontend)

| Cenário | Comportamento |
|---------|---------------|
| Sem conexão | Mensagem: "Sem conexão com a internet" |
| Resposta inválida | Mensagem: "Ocorreu um erro. Tente novamente." |
| Resposta vazia | Usa mensagem padrão de erro |

### Erros do Servidor (n8n)

| Status | Significado | Ação Recomendada |
|--------|-------------|------------------|
| 200 | Sucesso | Processar resposta |
| 4xx | Erro do cliente | Verificar payload |
| 5xx | Erro do servidor | Retry automático |

---

## 📊 Logs e Monitoramento

### Campos úteis para logging

```json
{
  "event_id": "uuid",
  "timestamp": "ISO 8601",
  "type": "lead_registration | message",
  "lead_email": "email identificador",
  "message_length": 150,
  "response_time_ms": 1200
}
```

### Métricas recomendadas

- Tempo médio de resposta
- Taxa de erros
- Número de conversas iniciadas
- Mensagens por conversa
- Taxa de conversão (lead → agendamento)

---

## 🔒 Segurança (Recomendações)

1. **Validação de origem**: Verificar header `Origin` ou `Referer`
2. **Rate limiting**: Limitar requisições por IP/lead
3. **Sanitização**: Limpar inputs antes de enviar para IA
4. **Tokens**: Implementar token de autenticação no header
5. **HTTPS**: Sempre usar conexão segura

### Exemplo de validação no n8n

```javascript
// Code node para validar requisição
const allowedOrigins = [
  'https://decksoft.com.br',
  'https://decksoft.lovable.app'
];

const origin = $input.first().headers.origin;

if (!allowedOrigins.includes(origin)) {
  throw new Error('Origem não autorizada');
}

return $input.all();
```

---

## 📝 Changelog

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0.0 | 2024-01 | Versão inicial |
| 1.1.0 | 2024-01 | Adicionado timestamp em Brasília |
| 1.2.0 | 2024-01 | Removido timeout, resposta sem limite |

---

## 🆘 Suporte

Para dúvidas sobre a integração:
- **E-mail**: suporte@decksoft.com.br
- **Documentação n8n**: [docs.n8n.io](https://docs.n8n.io)
