import { describe, it, expect } from "vitest";
import {
  ResponsesRequestSchema,
  FunctionToolSchema,
} from "../src/openai/responses/index.js";

describe("ResponsesRequestSchema", () => {
  const validRequest = {
    model: "o3-mini",
    input: "Hello",
  };

  it("accepts a valid request with string input", () => {
    const result = ResponsesRequestSchema.safeParse(validRequest);
    expect(result.success).toBe(true);
  });

  it("accepts array input with a user message", () => {
    const result = ResponsesRequestSchema.safeParse({
      model: "o3-mini",
      input: [{ role: "user", content: "Hello" }],
    });
    expect(result.success).toBe(true);
  });

  it("accepts array input with function_call and function_call_output", () => {
    const result = ResponsesRequestSchema.safeParse({
      model: "o3-mini",
      input: [
        {
          type: "function_call",
          call_id: "call_1",
          name: "search",
          arguments: "{}",
        },
        { type: "function_call_output", call_id: "call_1", output: "result" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional model", () => {
    const result = ResponsesRequestSchema.safeParse({ input: "Hello" });
    expect(result.success).toBe(true);
  });

  it("rejects empty model string", () => {
    expect(
      ResponsesRequestSchema.safeParse({ model: "", input: "Hello" }).success,
    ).toBe(false);
  });

  it("accepts optional input", () => {
    const result = ResponsesRequestSchema.safeParse({ model: "o3-mini" });
    expect(result.success).toBe(true);
  });

  it("accepts stream: true", () => {
    const result = ResponsesRequestSchema.safeParse({
      ...validRequest,
      stream: true,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.stream).toBe(true);
  });

  it("accepts stream: false", () => {
    const result = ResponsesRequestSchema.safeParse({
      ...validRequest,
      stream: false,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.stream).toBe(false);
  });

  it("accepts optional fields", () => {
    const result = ResponsesRequestSchema.safeParse({
      ...validRequest,
      instructions: "Be helpful",
      temperature: 0.5,
      previous_response_id: "resp_abc",
    });
    expect(result.success).toBe(true);
  });

  it("accepts tools array with function tools", () => {
    const result = ResponsesRequestSchema.safeParse({
      ...validRequest,
      tools: [
        {
          type: "function",
          name: "search",
          description: "Search the web",
          parameters: { type: "object", properties: {} },
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("accepts tools array with non-function tools", () => {
    const result = ResponsesRequestSchema.safeParse({
      ...validRequest,
      tools: [{ type: "web_search" }],
    });
    expect(result.success).toBe(true);
  });

  it("accepts message input with array content", () => {
    const result = ResponsesRequestSchema.safeParse({
      model: "o3-mini",
      input: [{ role: "user", content: [{ type: "text", text: "Hello" }] }],
    });
    expect(result.success).toBe(true);
  });

  it("passes through unknown top-level fields", () => {
    const result = ResponsesRequestSchema.safeParse({
      ...validRequest,
      custom_field: "hello",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect((result.data as Record<string, unknown>).custom_field).toBe(
        "hello",
      );
    }
  });
});

describe("FunctionToolSchema", () => {
  it("accepts a valid function tool", () => {
    const result = FunctionToolSchema.safeParse({
      type: "function",
      name: "search",
      description: "Search the web",
      parameters: { type: "object", properties: {} },
    });
    expect(result.success).toBe(true);
  });

  it("accepts function tool without optional fields", () => {
    const result = FunctionToolSchema.safeParse({
      type: "function",
      name: "search",
    });
    expect(result.success).toBe(true);
  });

  it("accepts function tool with strict field", () => {
    const result = FunctionToolSchema.safeParse({
      type: "function",
      name: "search",
      strict: true,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.strict).toBe(true);
  });

  it("rejects non-function tool type", () => {
    const result = FunctionToolSchema.safeParse({
      type: "web_search",
      name: "search",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing name", () => {
    const result = FunctionToolSchema.safeParse({
      type: "function",
    });
    expect(result.success).toBe(false);
  });
});
