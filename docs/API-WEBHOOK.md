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

O webhook recebe três tipos de eventos:

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

### 2. Mensagem de Texto (`messageType: "text"`)

Enviado a cada mensagem de texto que o usuário envia no chat.

#### Request

```http
POST /webhook/240b36f9-9d6d-4946-864b-8b681f3ec906
Content-Type: application/json
```

```json
{
  "messageType": "text",
  "message": "Oi Ana, tudo bem? Sou o João da Empresa LTDA (11 99999-9999 | joao@empresa.com.br). Gostaria de saber mais sobre o módulo de Materiais de Construção.",
  "timestamp": "2024-01-15T13:31:00-03:00",
  "history": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "role": "user",
      "content": "Oi Ana, tudo bem? Sou o João da Empresa LTDA (11 99999-9999 | joao@empresa.com.br). Gostaria de saber mais sobre o módulo de Materiais de Construção.",
      "timestamp": "2024-01-15T13:31:00-03:00"
    }
  ],
  "lead": {
    "name": "João Silva",
    "email": "joao@empresa.com.br",
    "phone": "11 99999-9999",
    "company": "Empresa LTDA",
    "message": "Gostaria de saber mais sobre o módulo de Materiais de Construção"
  }
}
```

#### Campos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `messageType` | string | ✅ | Sempre `"text"` para mensagens de texto |
| `message` | string | ✅ | Texto da mensagem atual do usuário |
| `timestamp` | string | ✅ | Data/hora no fuso de Brasília (UTC-3) |
| `history` | array | ✅ | Histórico completo da conversa |
| `history[].id` | string | ✅ | UUID único da mensagem |
| `history[].role` | string | ✅ | `"user"` ou `"assistant"` |
| `history[].content` | string | ✅ | Conteúdo da mensagem |
| `history[].timestamp` | string | ✅ | Data/hora da mensagem |
| `lead` | object | ✅ | Dados do lead (mesmo formato acima) |

#### Formato da Mensagem Inicial

A primeira mensagem do usuário sempre inclui uma apresentação automática com os dados do lead:

```
Oi Ana, tudo bem? Sou o [NOME] da [EMPRESA] ([TELEFONE] | [EMAIL]). [MENSAGEM DO LEAD]
```

Exemplo:
```
Oi Ana, tudo bem? Sou o João da Empresa LTDA (11 99999-9999 | joao@empresa.com.br). Gostaria de saber mais sobre o módulo de Materiais de Construção.
```

Se o lead não informar empresa, o formato é:
```
Oi Ana, tudo bem? Sou o João (11 99999-9999 | joao@empresa.com.br). [MENSAGEM]
```

#### Response Esperada

```json
{
  "text": "O módulo de Materiais de Construção da DeckSoft oferece gestão completa para sua loja! Inclui controle de estoque com múltiplos depósitos, vendas no balcão e por orçamento, emissão de notas fiscais e muito mais. Posso explicar alguma funcionalidade específica?"
}
```

---

### 3. Mensagem de Áudio (`messageType: "audio"`)

Enviado quando o usuário grava e envia uma mensagem de voz.

#### Request

```http
POST /webhook/240b36f9-9d6d-4946-864b-8b681f3ec906
Content-Type: multipart/form-data
```

**FormData Fields:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `audio` | Blob | Arquivo de áudio (type: `audio/webm`) |
| `messageType` | string | Sempre `"audio"` |
| `format` | string | Sempre `"webm"` |
| `timestamp` | string | Data/hora no fuso de Brasília (UTC-3) |
| `history` | string | JSON stringificado do array de mensagens |
| `lead` | string | JSON stringificado dos dados do lead |

#### Processamento no n8n

No n8n, o áudio é acessível via `$binary.audio` para processamento direto:

```javascript
// Exemplo: enviar para transcrição
const audioBuffer = $binary.audio;
// Enviar para Whisper, EvolutionAPI, etc.
```

#### Response Esperada

Mesma estrutura das mensagens de texto:

```json
{
  "text": "Entendi! Você mencionou que precisa de ajuda com o controle de estoque. Posso te explicar como funciona o módulo de inventário da DeckSoft?"
}
```

---

## 🔄 Campos de Resposta

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
   (nome, e-mail, telefone, empresa, mensagem)
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
5. Chat inicia - mensagem inicial automática
   com apresentação do lead é enviada
          │
          ▼
6. Frontend envia POST → Webhook
   { messageType: "text", message: "Oi Ana, sou o João...", ... }
          │
          ▼
7. n8n processa:
   - Envia para modelo de IA
   - Recebe resposta
   - Retorna { text: "..." }
          │
          ▼
8. Frontend exibe resposta da Ana
          │
          ▼
   [Loop: passos 6-8 para cada mensagem]
          │
          ▼
9. [Opcional] Usuário grava áudio
          │
          ▼
10. Frontend envia POST → Webhook (multipart/form-data)
    { messageType: "audio", audio: Blob, ... }
          │
          ▼
11. n8n processa:
    - Transcreve áudio (Whisper/EvolutionAPI)
    - Envia transcrição para IA
    - Retorna { text: "..." }
          │
          ▼
12. Frontend exibe resposta da Ana
          │
          ▼
13. Usuário finaliza chat
    - Avalia de 1-5 estrelas
    - Comenta (opcional)
    - Redireciona para landing page
```

---

## 🛠 Exemplo de Fluxo n8n

### Nodes Recomendados

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Webhook    │────▶│    Switch    │────▶│ IF: message  │
│   Trigger    │     │  (by type)   │     │    Type      │
└──────────────┘     └──────────────┘     └──────────────┘
                                                   │
                     ┌─────────────────────────────┼─────────────────┐
                     │                             │                 │
                     ▼                             ▼                 ▼
              ┌──────────────┐             ┌──────────────┐   ┌──────────────┐
              │   Save to    │             │   OpenAI /   │   │   Whisper    │
              │   Airtable   │             │   Claude     │   │   (audio)    │
              └──────────────┘             └──────────────┘   └──────────────┘
              (lead_registration)                (text)              │
                     │                             │                 │
                     ▼                             │                 ▼
              ┌──────────────┐                     │          ┌──────────────┐
              │   Respond    │                     │          │   OpenAI /   │
              │  to Webhook  │                     │          │   Claude     │
              └──────────────┘                     │          └──────────────┘
                                                   │                 │
                                                   ▼                 ▼
                                            ┌──────────────────────────────┐
                                            │       Format Response        │
                                            └──────────────────────────────┘
                                                          │
                                                          ▼
                                            ┌──────────────────────────────┐
                                            │       Respond to Webhook     │
                                            └──────────────────────────────┘
```

### Configuração do Switch Node

```javascript
// Verificar tipo de evento
{{ $json.type === 'lead_registration' ? 'lead' : $json.messageType }}
// Outputs: 'lead', 'text', 'audio'
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

IMPORTANTE: A primeira mensagem do cliente já contém seus dados (nome, empresa, telefone, email).
Você NÃO precisa pedir essas informações novamente.

Informações do lead disponíveis no payload:
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
| Sem conexão | Erro logado no console (não exibido na UI) |
| Resposta inválida | Erro logado no console (não exibido na UI) |
| Timeout | Não há timeout - aguarda resposta indefinidamente |

**Nota:** Erros não são exibidos na UI para evitar confusão quando múltiplas mensagens são processadas em paralelo.

### Erros do Servidor (n8n)

| Status | Significado | Ação Recomendada |
|--------|-------------|------------------|
| 200 | Sucesso | Processar resposta |
| 4xx | Erro do cliente | Verificar payload |
| 5xx | Erro do servidor | Verificar logs n8n |

---

## 📊 Logs e Monitoramento

### Campos úteis para logging

```json
{
  "event_id": "uuid",
  "timestamp": "ISO 8601",
  "messageType": "text | audio",
  "type": "lead_registration",
  "lead_email": "email identificador",
  "message_length": 150,
  "response_time_ms": 1200,
  "has_audio": true
}
```

### Métricas recomendadas

- Tempo médio de resposta
- Taxa de erros
- Número de conversas iniciadas
- Mensagens por conversa
- Mensagens de áudio vs texto
- Taxa de conversão (lead → agendamento)

---

## 🔒 Segurança (Recomendações)

1. **Validação de origem**: Verificar header `Origin` ou `Referer`
2. **Rate limiting**: Limitar requisições por IP/lead
3. **Sanitização**: Limpar inputs antes de enviar para IA
4. **Tokens**: Implementar token de autenticação no header
5. **HTTPS**: Sempre usar conexão segura
6. **Validação de áudio**: Verificar tamanho e formato do arquivo

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
| 1.3.0 | 2024-01 | Adicionado campo `messageType` |
| 1.4.0 | 2024-01 | Suporte a mensagens de áudio (multipart/form-data) |
| 1.5.0 | 2024-01 | Mensagem inicial com apresentação do lead (nome, empresa, telefone, email) |

---

## 🆘 Suporte

Para dúvidas sobre a integração:
- **E-mail**: suporte@decksoft.com.br
- **Documentação n8n**: [docs.n8n.io](https://docs.n8n.io)
