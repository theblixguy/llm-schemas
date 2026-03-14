import { z } from "zod";

/**
 * A single content part inside a message's content array.
 * Uses looseObject so extra fields (like `image_url`) pass through.
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

const VALID_ROLES = ["system", "developer", "user", "assistant", "tool"] as const;

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
    .array(
      z.object({
        index: z.number().optional(),
        id: z.string().optional(),
        type: z.string().optional(),
        function: z.object({
          name: z.string(),
          arguments: z.string(),
        }),
      }),
    )
    .optional(),
  tool_call_id: z.string().optional(),
});

/** Inferred type from {@link MessageSchema}. */
export type Message = z.infer<typeof MessageSchema>;
