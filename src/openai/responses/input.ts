import { z } from "zod";

/**
 * A conversation message in the Responses API `input` array.
 * The `type` field defaults to `"message"` and is optional.
 * Content can be a plain string or an array of content part objects.
 *
 * @example
 * ```ts
 * const msg = InputMessageSchema.parse({
 *   role: "user",
 *   content: "What's 2 + 2?",
 * });
 * ```
 */
export const InputMessageSchema = z.object({
  type: z.literal("message").optional(),
  role: z.enum(["user", "assistant", "system", "developer"]),
  content: z.union([z.string(), z.array(z.record(z.string(), z.unknown()))]),
});

/**
 * A function call input item. Appears in the `input` array when replaying
 * a previous assistant turn that called a function.
 *
 * @example
 * ```ts
 * const call = FunctionCallInputSchema.parse({
 *   type: "function_call",
 *   call_id: "call_abc",
 *   name: "get_weather",
 *   arguments: '{"location": "SF"}',
 * });
 * ```
 */
export const FunctionCallInputSchema = z.object({
  type: z.literal("function_call"),
  id: z.string().optional(),
  call_id: z.string(),
  name: z.string(),
  arguments: z.string(),
});

/**
 * The result of a function call, sent back to the model.
 * Pairs with a previous function call via `call_id`.
 *
 * @example
 * ```ts
 * const result = FunctionCallOutputSchema.parse({
 *   type: "function_call_output",
 *   call_id: "call_abc",
 *   output: "Sunny, 72F",
 * });
 * ```
 */
export const FunctionCallOutputSchema = z.object({
  type: z.literal("function_call_output"),
  call_id: z.string(),
  output: z.string(),
});

/**
 * Union of all valid input item types. The Responses API `input` field
 * accepts an array of these when it's not a plain string.
 */
export const InputItemSchema = z.union([
  InputMessageSchema,
  FunctionCallInputSchema,
  FunctionCallOutputSchema,
]);

/** Inferred type from {@link InputMessageSchema}. */
export type InputMessage = z.infer<typeof InputMessageSchema>;
/** Inferred type from {@link FunctionCallInputSchema}. */
export type FunctionCallInput = z.infer<typeof FunctionCallInputSchema>;
/** Inferred type from {@link FunctionCallOutputSchema}. */
export type FunctionCallOutput = z.infer<typeof FunctionCallOutputSchema>;
/** Inferred type from {@link InputItemSchema}. */
export type InputItem = z.infer<typeof InputItemSchema>;
