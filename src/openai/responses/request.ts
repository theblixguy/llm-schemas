import { z } from "zod";
import { InputItemSchema } from "./input.js";
import { RawToolSchema } from "./tool.js";

/**
 * Request body for POST `/v1/responses`.
 * Covers every field from the OpenAI Responses API spec.
 *
 * Uses looseObject so unknown fields pass through without failing validation.
 * Fields we don't parse ourselves are typed as `z.unknown().optional()`.
 *
 * Both `model` and `input` are optional per the spec. If your app needs them
 * to be required, add your own `.refine()` or check after parsing.
 *
 * @see https://platform.openai.com/docs/api-reference/responses/create
 *
 * @example
 * ```ts
 * const body = ResponsesRequestSchema.parse({
 *   model: "o3-mini",
 *   input: "What is the capital of France?",
 *   stream: true,
 * });
 * ```
 */
export const ResponsesRequestSchema = z.looseObject({
  model: z.string().min(1).optional(),
  input: z.union([z.string(), z.array(InputItemSchema)]).optional(),
  instructions: z.string().optional(),
  tools: z.array(RawToolSchema).optional(),
  stream: z.boolean().optional(),
  temperature: z.number().optional(),
  previous_response_id: z.string().optional(),
  background: z.boolean().optional(),
  context_management: z.unknown().optional(),
  conversation: z.unknown().optional(),
  include: z.unknown().optional(),
  max_output_tokens: z.number().optional(),
  max_tool_calls: z.number().optional(),
  metadata: z.unknown().optional(),
  parallel_tool_calls: z.boolean().optional(),
  prompt: z.unknown().optional(),
  prompt_cache_key: z.string().optional(),
  prompt_cache_retention: z.unknown().optional(),
  reasoning: z.unknown().optional(),
  safety_identifier: z.string().optional(),
  service_tier: z.string().optional(),
  store: z.boolean().optional(),
  stream_options: z.unknown().optional(),
  text: z.unknown().optional(),
  tool_choice: z.unknown().optional(),
  top_logprobs: z.number().optional(),
  top_p: z.number().optional(),
  truncation: z.unknown().optional(),
  user: z.string().optional(),
});

/** Inferred type from {@link ResponsesRequestSchema}. */
export type ResponsesRequest = z.infer<typeof ResponsesRequestSchema>;
