import { z } from "zod";

/**
 * A text content block. The most common block type in Anthropic messages.
 *
 * @example
 * ```ts
 * const block = TextBlockSchema.parse({
 *   type: "text",
 *   text: "Here's what I found.",
 * });
 * ```
 */
export const TextBlockSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
});

/**
 * A tool use block, sent by the assistant when it wants to call a tool.
 * The `input` field holds the arguments as a JSON object.
 *
 * @example
 * ```ts
 * const block = ToolUseBlockSchema.parse({
 *   type: "tool_use",
 *   id: "toolu_01",
 *   name: "get_weather",
 *   input: { location: "SF" },
 * });
 * ```
 */
export const ToolUseBlockSchema = z.object({
  type: z.literal("tool_use"),
  id: z.string(),
  name: z.string(),
  input: z.record(z.string(), z.unknown()),
});

/**
 * A tool result block, sent by the user to return a tool's output.
 * `content` can be a plain string or an array of text blocks.
 *
 * @example
 * ```ts
 * const block = ToolResultBlockSchema.parse({
 *   type: "tool_result",
 *   tool_use_id: "toolu_01",
 *   content: "Sunny, 72F",
 * });
 * ```
 */
export const ToolResultBlockSchema = z.object({
  type: z.literal("tool_result"),
  tool_use_id: z.string(),
  content: z.union([z.string(), z.array(TextBlockSchema)]).optional(),
});

/**
 * Discriminated union of the three content block types we actually parse
 * (text, tool_use, tool_result). Discriminates on the `type` field.
 */
export const KnownContentBlockSchema = z.discriminatedUnion("type", [
  TextBlockSchema,
  ToolUseBlockSchema,
  ToolResultBlockSchema,
]);

/**
 * Accepts any known content block, but also lets unknown block types
 * (like `thinking` or `server_tool_use`) through without failing.
 * The fallback arm is a looseObject that just requires a `type` string.
 *
 * If you need to filter out the unknown blocks after parsing, check
 * each block's `type` against the known set yourself.
 */
export const LooseContentBlockSchema = z.union([
  KnownContentBlockSchema,
  z.looseObject({ type: z.string() }),
]);

/**
 * A single message in the Anthropic `messages` array.
 * Role is always `"user"` or `"assistant"`. Content can be a plain string
 * or an array of content blocks.
 *
 * @example
 * ```ts
 * const msg = MessageSchema.parse({
 *   role: "user",
 *   content: "Tell me a joke.",
 * });
 * ```
 */
export const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.union([
    z.string(),
    z.array(LooseContentBlockSchema),
  ]),
});

/** Inferred type from {@link TextBlockSchema}. */
export type TextBlock = z.infer<typeof TextBlockSchema>;
/** Inferred type from {@link ToolUseBlockSchema}. */
export type ToolUseBlock = z.infer<typeof ToolUseBlockSchema>;
/** Inferred type from {@link ToolResultBlockSchema}. */
export type ToolResultBlock = z.infer<typeof ToolResultBlockSchema>;
/** Inferred type from {@link MessageSchema}. */
export type Message = z.infer<typeof MessageSchema>;
