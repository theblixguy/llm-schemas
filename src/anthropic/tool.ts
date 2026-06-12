import { z } from "zod";

/**
 * A custom (client) tool definition in the Anthropic `tools` array.
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

/**
 * A server-side / Anthropic-defined tool (web search, bash, code execution,
 * text editor, memory, MCP toolset, etc.). Identified by a versioned `type`
 * string (e.g. `"web_search_20250305"`, `"bash_20250124"`) and has no
 * `input_schema`. Type-specific fields such as `max_uses` or `allowed_domains`
 * are allowed.
 *
 * @example
 * ```ts
 * const tool = ServerToolSchema.parse({
 *   type: "web_search_20250305",
 *   name: "web_search",
 *   max_uses: 5,
 * });
 * ```
 */
export const ServerToolSchema = z.looseObject({
  type: z.string(),
  name: z.string().optional(),
});

/**
 * A single entry in the Anthropic `tools` array: either a custom tool
 * definition (with `input_schema`) or a server-side tool (with a versioned
 * `type`).
 */
export const ToolSchema = z.union([ToolDefinitionSchema, ServerToolSchema]);

/** Inferred type from {@link ToolDefinitionSchema}. */
export type ToolDefinition = z.infer<typeof ToolDefinitionSchema>;
/** Inferred type from {@link ServerToolSchema}. */
export type ServerTool = z.infer<typeof ServerToolSchema>;
/** Inferred type from {@link ToolSchema}. */
export type Tool = z.infer<typeof ToolSchema>;
