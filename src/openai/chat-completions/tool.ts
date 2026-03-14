import { z } from "zod";

/**
 * A tool definition in the chat completions `tools` array.
 * The `type` is typically `"function"` but left as a plain string
 * so new tool types don't break validation.
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

/** Inferred type from {@link ToolSchema}. */
export type Tool = z.infer<typeof ToolSchema>;
