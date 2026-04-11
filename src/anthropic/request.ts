import { z } from "zod";
import { MessageSchema, TextBlockSchema } from "#anthropic/message.js";
import { ToolDefinitionSchema } from "#anthropic/tool.js";

/**
 * Request body for POST `/v1/messages`.
 * Covers every field from the Anthropic API spec.
 *
 * Uses looseObject so unknown fields pass through without failing validation.
 * Fields we don't parse ourselves are typed as `z.unknown().optional()`.
 *
 * `model`, `max_tokens`, and `messages` are required.
 *
 * @see https://docs.anthropic.com/en/api/messages
 *
 * @example
 * ```ts
 * const body = AnthropicRequestSchema.parse({
 *   model: "claude-sonnet-4-20250514",
 *   max_tokens: 1024,
 *   messages: [{ role: "user", content: "Hi" }],
 * });
 * ```
 */
export const AnthropicRequestSchema = z.looseObject({
  model: z.string().min(1, "Model is required"),
  max_tokens: z.number().int().positive("max_tokens must be positive"),
  messages: z.array(MessageSchema).min(1, "Messages are required"),
  cache_control: z.unknown().optional(),
  container: z.unknown().optional(),
  inference_geo: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  output_config: z.unknown().optional(),
  service_tier: z.string().optional(),
  stop_sequences: z.array(z.string()).optional(),
  stream: z.boolean().optional(),
  system: z.union([z.string(), z.array(TextBlockSchema)]).optional(),
  temperature: z.number().optional(),
  thinking: z.unknown().optional(),
  tool_choice: z.unknown().optional(),
  tools: z.array(ToolDefinitionSchema).optional(),
  top_k: z.number().optional(),
  top_p: z.number().optional(),
});

/** Inferred type from {@link AnthropicRequestSchema}. */
export type AnthropicRequest = z.infer<typeof AnthropicRequestSchema>;
