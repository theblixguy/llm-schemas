import { z } from "zod";

/**
 * A single content part inside a message's content array. Has a `type` and an
 * optional `text`; other fields (such as `image_url`) are allowed.
 *
 * @example
 * ```ts
 * const part = ContentPartSchema.parse({
 *   type: "text",
 *   text: "Hello there",
 * });
 * ```
 */
export const ContentPartSchema = z.looseObject({
  type: z.string(),
  text: z.string().optional(),
});

const VALID_ROLES = [
  "system",
  "developer",
  "user",
  "assistant",
  "tool",
  // Deprecated, paired with the legacy `functions`/`function_call` flow, but
  // still accepted by the API.
  "function",
] as const;

/**
 * A function tool call on an assistant message. `arguments` is a
 * JSON-encoded string, not an object.
 */
const FunctionToolCallSchema = z.object({
  index: z.number().optional(),
  id: z.string().optional(),
  type: z.string().optional(),
  function: z.object({
    name: z.string(),
    arguments: z.string(),
  }),
});

/**
 * A custom tool call on an assistant message (GPT-5 family). `input` is raw
 * text rather than JSON-encoded arguments.
 */
const CustomToolCallSchema = z.object({
  index: z.number().optional(),
  id: z.string().optional(),
  type: z.literal("custom"),
  custom: z.object({
    name: z.string(),
    input: z.string(),
  }),
});

/**
 * A single message in the chat completions `messages` array.
 * All fields are optional because different roles use different subsets.
 * An assistant message might have `tool_calls` but no `content`, for instance.
 *
 * @example
 * ```ts
 * const msg = MessageSchema.parse({
 *   role: "user",
 *   content: "What's the weather like?",
 * });
 * ```
 */
export const MessageSchema = z.object({
  role: z.enum(VALID_ROLES).optional(),
  content: z
    .union([z.string(), z.array(ContentPartSchema), z.null()])
    .optional(),
  name: z.string().optional(),
  tool_calls: z
    .array(z.union([FunctionToolCallSchema, CustomToolCallSchema]))
    .optional(),
  tool_call_id: z.string().optional(),
});

/** Inferred type from {@link MessageSchema}. */
export type Message = z.infer<typeof MessageSchema>;
