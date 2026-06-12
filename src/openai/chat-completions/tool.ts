import { z } from "zod";

/**
 * A function tool definition in the chat completions `tools` array. The
 * `function` object names the tool and describes its parameters as JSON Schema.
 *
 * @example
 * ```ts
 * const tool = ToolSchema.parse({
 *   type: "function",
 *   function: {
 *     name: "get_weather",
 *     parameters: { type: "object", properties: {} },
 *   },
 * });
 * ```
 */
export const ToolSchema = z.object({
  type: z.string(),
  function: z.object({
    name: z.string(),
    description: z.string().optional(),
    parameters: z.record(z.string(), z.unknown()).optional(),
    strict: z.boolean().optional(),
  }),
});

/**
 * A custom tool definition (GPT-5 family). Custom tools take raw text input,
 * optionally constrained by a Lark or regex grammar, instead of a JSON Schema.
 *
 * @example
 * ```ts
 * const tool = CustomToolSchema.parse({
 *   type: "custom",
 *   custom: {
 *     name: "code_exec",
 *     description: "Execute a shell command",
 *   },
 * });
 * ```
 */
export const CustomToolSchema = z.object({
  type: z.literal("custom"),
  custom: z.object({
    name: z.string(),
    description: z.string().optional(),
    format: z.unknown().optional(),
  }),
});

/**
 * A single entry in the chat completions `tools` array: either a function
 * tool or a custom tool.
 */
export const ChatCompletionToolSchema = z.union([ToolSchema, CustomToolSchema]);

/** Inferred type from {@link ToolSchema}. */
export type Tool = z.infer<typeof ToolSchema>;
/** Inferred type from {@link CustomToolSchema}. */
export type CustomTool = z.infer<typeof CustomToolSchema>;
/** Inferred type from {@link ChatCompletionToolSchema}. */
export type ChatCompletionTool = z.infer<typeof ChatCompletionToolSchema>;
