import { z } from "zod";

/**
 * A function tool definition. Only matches tools with `type: "function"`.
 * Use this when you need to narrow to function tools specifically.
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
 * Accepts any tool shape as a `Record<string, unknown>`.
 * The Responses API has several tool types (web_search, code_interpreter, etc.)
 * and this schema lets them all through. If you only care about function tools,
 * use {@link FunctionToolSchema} instead.
 */
export const RawToolSchema = z.record(z.string(), z.unknown());

/** Inferred type from {@link FunctionToolSchema}. */
export type FunctionTool = z.infer<typeof FunctionToolSchema>;
