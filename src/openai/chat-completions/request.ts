import { z } from "zod";
import { MessageSchema } from "./message.js";
import { ToolSchema } from "./tool.js";

/**
 * Request body for POST `/v1/chat/completions`.
 * Covers every field from the OpenAI API spec.
 *
 * Uses looseObject so unknown fields pass through without failing validation.
 * Fields we don't parse ourselves are typed as `z.unknown().optional()`.
 *
 * `model` and `messages` are the only required fields.
 *
 * @see https://platform.openai.com/docs/api-reference/chat/create
 *
 * @example
 * ```ts
 * const body = OpenAIRequestSchema.parse({
 *   model: "gpt-4o",
 *   messages: [{ role: "user", content: "Hi" }],
 *   stream: true,
 * });
 * ```
 */
export const OpenAIRequestSchema = z.looseObject({
  model: z.string().min(1, "Model is required"),
  messages: z.array(MessageSchema).min(1, "Messages are required"),
  audio: z.unknown().optional(),
  frequency_penalty: z.number().optional(),
  function_call: z.unknown().optional(),
  functions: z.unknown().optional(),
  logit_bias: z.unknown().optional(),
  logprobs: z.boolean().optional(),
  max_completion_tokens: z.number().optional(),
  max_tokens: z.number().optional(),
  metadata: z.unknown().optional(),
  modalities: z.unknown().optional(),
  n: z.number().optional(),
  parallel_tool_calls: z.boolean().optional(),
  prediction: z.unknown().optional(),
  presence_penalty: z.number().optional(),
  prompt_cache_key: z.string().optional(),
  prompt_cache_retention: z.unknown().optional(),
  reasoning_effort: z.string().optional(),
  response_format: z.unknown().optional(),
  safety_identifier: z.string().optional(),
  seed: z.number().optional(),
  service_tier: z.string().optional(),
  stop: z.union([z.string(), z.array(z.string())]).optional(),
  store: z.boolean().optional(),
  stream: z.boolean().optional(),
  stream_options: z.unknown().optional(),
  temperature: z.number().optional(),
  tool_choice: z.unknown().optional(),
  tools: z.array(ToolSchema).optional(),
  top_logprobs: z.number().optional(),
  top_p: z.number().optional(),
  user: z.string().optional(),
  verbosity: z.string().optional(),
  web_search_options: z.unknown().optional(),
});

/** Inferred type from {@link OpenAIRequestSchema}. */
export type OpenAIRequest = z.infer<typeof OpenAIRequestSchema>;
