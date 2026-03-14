import { z } from "zod";

/**
 * A tool definition in the Anthropic `tools` array.
 * The `input_schema` is a JSON Schema object describing the tool's parameters.
 *
 * @example
 * ```ts
 * const tool = ToolDefinitionSchema.parse({
 *   name: "get_weather",
 *   description: "Get current weather for a location",
 *   input_schema: {
 *     type: "object",
 *     properties: { location: { type: "string" } },
 *   },
 * });
 * ```
 */
export const ToolDefinitionSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  input_schema: z.record(z.string(), z.unknown()),
});

/** Inferred type from {@link ToolDefinitionSchema}. */
export type ToolDefinition = z.infer<typeof ToolDefinitionSchema>;
