# llm-schemas [![npm version](https://img.shields.io/npm/v/llm-schemas)](https://www.npmjs.com/package/llm-schemas) ![npm downloads](https://img.shields.io/npm/d18m/llm-schemas)

Shared Zod schemas for validating LLM API request bodies. Covers OpenAI Chat Completions, OpenAI Responses, and Anthropic Messages. Used by both [llm-mock-server](https://github.com/theblixguy/llm-mock-server) and [copilot-sdk-proxy](https://github.com/theblixguy/copilot-sdk-proxy).

## Table of contents

- [Install](#install)
- [Usage](#usage)
  - [OpenAI Chat Completions](#openai-chat-completions)
  - [OpenAI Responses](#openai-responses)
  - [Anthropic Messages](#anthropic-messages)
  - [Top-level import](#top-level-import)
- [What's in each schema](#whats-in-each-schema)
  - [Request schemas](#request-schemas)
  - [Building blocks](#building-blocks)
- [Import paths](#import-paths)
- [Development](#development)
- [Licence](#licence)

## Install

```bash
npm install llm-schemas
```

Requires Node.js 22+ and Zod 4.

## Usage

Import from a sub-path to get schemas for a specific API, or import from the top level to get everything namespaced.

### OpenAI Chat Completions

```typescript
import {
  OpenAIRequestSchema,
  MessageSchema,
  ToolSchema,
} from "llm-schemas/openai/chat-completions";

const body = OpenAIRequestSchema.parse(req.body);
console.log(body.model, body.messages);
```

### OpenAI Responses

```typescript
import {
  ResponsesRequestSchema,
  FunctionToolSchema,
  InputMessageSchema,
} from "llm-schemas/openai/responses";

const body = ResponsesRequestSchema.parse(req.body);
console.log(body.model, body.input);
```

### Anthropic Messages

```typescript
import {
  AnthropicRequestSchema,
  MessageSchema,
  ToolDefinitionSchema,
} from "llm-schemas/anthropic";

const body = AnthropicRequestSchema.parse(req.body);
console.log(body.model, body.max_tokens, body.messages);
```

### Top-level import

If you need all three in one place, the root export namespaces them so there are no naming collisions.

```typescript
import { openai, anthropic } from "llm-schemas";

openai.chatCompletions.OpenAIRequestSchema.parse(body);
openai.responses.ResponsesRequestSchema.parse(body);
anthropic.AnthropicRequestSchema.parse(body);
```

## What's in each schema

### Request schemas

All three request schemas use `z.looseObject()` at the top level, so unknown fields pass through without failing validation. Every field from the official API specs is included. Fields that don't need parsing are typed as `z.unknown().optional()`.

Specs the schemas were built from:

- [OpenAI Chat Completions](https://platform.openai.com/docs/api-reference/chat/create)
- [OpenAI Responses](https://platform.openai.com/docs/api-reference/responses/create)
- [Anthropic Messages](https://docs.anthropic.com/en/api/messages)

| Schema | Required fields | Total fields |
| ------ | --------------- | ------------ |
| `OpenAIRequestSchema` | `model`, `messages` | 35 |
| `AnthropicRequestSchema` | `model`, `max_tokens`, `messages` | 18 |
| `ResponsesRequestSchema` | _(none)_ | 29 |

The Responses API spec makes both `model` and `input` optional. If your app needs them to be required, add a `.refine()` after parsing.

### Building blocks

#### OpenAI Chat Completions

- `ContentPartSchema` - a content part like `{ type: "text", text: "..." }` (looseObject)
- `MessageSchema` - a chat message with role, content, tool_calls, etc.
- `ToolSchema` - a tool definition with `function.name`, `function.parameters`, `function.strict`

#### Anthropic Messages

- `TextBlockSchema`, `ToolUseBlockSchema`, `ToolResultBlockSchema` - typed content blocks
- `LooseContentBlockSchema` - union of known blocks + a fallback for unknown types
- `MessageSchema` - a message with role and string or block array content
- `ToolDefinitionSchema` - a tool with `name`, `description`, `input_schema`

#### OpenAI Responses

- `InputMessageSchema` - a conversation message in the input array
- `FunctionCallInputSchema`, `FunctionCallOutputSchema` - function call round-trip items
- `FunctionToolSchema` - a function tool (with `strict` field)
- `RawToolSchema` - accepts any tool shape as `Record<string, unknown>`

Every schema also exports its inferred TypeScript type (e.g. `OpenAIRequest`, `AnthropicRequest`, `Message`, `FunctionTool`).

## Import paths

| Path | What you get |
| ---- | ------------ |
| `llm-schemas` | Everything, namespaced as `openai.chatCompletions`, `openai.responses`, `anthropic` |
| `llm-schemas/openai` | Both OpenAI APIs, namespaced as `chatCompletions` and `responses` |
| `llm-schemas/openai/chat-completions` | Chat completions schemas only |
| `llm-schemas/openai/responses` | Responses schemas only |
| `llm-schemas/anthropic` | Anthropic schemas only |

## Development

```bash
npm run build # Compile TypeScript
npm test # Run tests
npm run lint # Lint with oxlint
npm run check # All three: typecheck + lint + test
```

## Licence

[MIT](LICENCE)
