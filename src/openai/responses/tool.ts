import { z } from "zod";

/**
 * A function tool definition in the Responses API `tools` array, with the tool
 * name and its parameters as JSON Schema at the top level.
 *
 * @example
 * ```ts
 * const tool = FunctionToolSchema.parse({
 *   type: "function",
 *   name: "search",
 *   parameters: { type: "object", properties: {} },
 *   strict: true,
 * });
 * ```
 */
export const FunctionToolSchema = z.object({
  type: z.literal("function"),
  name: z.string(),
  description: z.string().optional(),
  parameters: z.record(z.string(), z.unknown()).optional(),
  strict: z.boolean().optional(),
});

/**
 * Any tool in the Responses API `tools` array, as a `Record<string, unknown>`.
 * The Responses API has several tool types (web_search, code_interpreter,
 * etc.); for function tools specifically, use {@link FunctionToolSchema}.
 */
export const RawToolSchema = z.record(z.string(), z.unknown());

/** Inferred type from {@link FunctionToolSchema}. */
export type FunctionTool = z.infer<typeof FunctionToolSchema>;
