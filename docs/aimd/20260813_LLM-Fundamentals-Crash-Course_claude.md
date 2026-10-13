# LLM Fundamentals Crash Course For Beginners 2026 (Tokens, Prompting, APIs & Tool Calls) — Harish Neel | AI - Claude Context
> Source: YouTube, Harish Neel | AI, "LLM Fundamentals Crash Course For Beginners 2026 (Tokens, Prompting, APIs & Tool Calls)", 1:13:43, published 2026-08-13 · https://www.youtube.com/watch?v=YHNi88FaGug · Generated: 2026-10-13
> Companion: 20260813_LLM-Fundamentals-Crash-Course.html (Thai, iw mode `iwd`, 12 sections, 7 frames + 4 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis (standard YouTube license, auto-generated English captions).
- Frames used: 01_token-table, 02_context-buffer, 03_context-table, 04_prediction-loop, 05_temperature-table, 06_fewshot-prompt, 07_tool-definition-code.
- Own SVG diagrams: flow, bars, compare, lanes.
- Transcript SHA-256 (in-page = decoded): `0a505288a25857aa6dd9cf3b58d9bf89f93218c8c595d3f28e84e8e232873e86`; kept in the session workspace only.

## TL;DR

A beginner course (about 74 min, eight stitched episodes) on what happens when you talk to an LLM and how to build on a raw API without frameworks. Core ideas: text -> tokens -> integer ids; the model predicts one next token at a time in a loop (hence streaming); the model has no memory, the whole history is resent each call and bounded by the context window; behaviour is steered by system prompt, user prompt, temperature and max tokens; prompting techniques are zero-shot, few-shot (examples steer the next-token distribution), chain of thought (reasoning tokens become context) and role prompting; OpenAI Responses API calls with streaming; structured output via Pydantic `text_format` (schema sent to the server) instead of "reply in JSON"; tool calls: the model only asks, the caller's code executes and returns the result with the same call id. The speaker deliberately skips model internals. Despite the chapter title, only OpenAI is demonstrated (no Anthropic or Gemini code).

## Key Concepts

- **Token / tokenizer:** a token is a chunk of text (word, word part, punctuation); the tokenizer splits and maps each token to an integer id; the model only sees ids. Rule of thumb from the speaker: 1 token ~ 0.75 English words (1,000 tokens ~ 750 words), i.e.

  $$N_{\text{words}} \approx 0.75 \times N_{\text{tokens}}, \qquad 0.75 \times 1000 = 750$$

  (author-written equation; symbols: $N_{\text{words}}$ English words, $N_{\text{tokens}}$ tokens, 0.75 the speaker's approximate ratio, English text only); code, JSON and non-English text cost more tokens. Everything is metered in tokens: cost (input and output), latency, context limit.
- **No memory / context window:** each API call starts fresh; chat apps concatenate system prompt + all prior user/assistant turns + the new message into one text buffer and resend it. The context window is the maximum number of tokens processed at once; the slide lists Claude Opus 4.7 = 1,000,000, GPT-5.5 = 1,050,000, Gemini 3.1 Pro = 1,000,000 (the speaker says "closer to 1 million" for the last two). 128,000 tokens ~ 300 pages (speaker's estimate; author arithmetic, assuming ~320 words per page: $$128{,}000 \times 0.75 = 96{,}000 \text{ words}, \qquad 96{,}000 / 320 = 300 \text{ pages}$$). When exceeded, older messages are ignored. Chunking and RAG are announced for later in the course, not covered here.
- **Next-token prediction loop:** the model reads everything so far, predicts one token, appends it, repeats. Speaker: it "never plans ahead"; this explains streaming (tokens are sent as soon as predicted). Author note: Anthropic interpretability research reports that Claude picks a rhyme word before writing the line, so "no planning" should be read as "generation is token by token", not "nothing is prepared internally".
- **Roles:** system (set by the developer, hidden from the end user: persona, rules, format), user, assistant. Payload = list of `{role, content}`.
- **Temperature:** the model computes a probability distribution over next tokens (speaker's toy example: "gravity" 40%, "force" 20%, a third token 15%). 0 = always the top token (deterministic); 1 = sample from the distribution; above 1 = flatter, increasingly unpredictable, eventually incoherent. Temperature is described by the speaker as a parameter most LLM APIs accept. The speaker gives no formula; the author adds the standard temperature-scaled softmax, with $z_i$ the raw score (logit) of token $i$, $T$ the temperature, $p_i$ the probability of choosing token $i$, and the sum over all candidate tokens $j$:

  $$p_i = \frac{\exp(z_i / T)}{\sum_j \exp(z_j / T)}$$

  $T = 1$ is ordinary softmax; $T > 1$ flattens the distribution; smaller $T$ concentrates probability on the top-scoring token; $T = 0$ cannot be divided by and is treated as the special case "always pick the top token". Slide guide: 0-0.2 extraction/classification/factual answers; 0.3-0.7 summarising, Q&A, coding assistants; 0.8-1.0 creative writing. Rule: correctness matters -> low; variety matters -> high.
- **Max tokens:** hard cap on generated tokens. Too low = cut mid-sentence; too high = pay for padding. Classification may need only 10-20 tokens; long technical explanations 500+ (upper number inaudible).
- **Zero-shot:** instruction only; must still be specific (e.g. "summarize in three bullets, each under 15 words, for a non-technical audience").
- **Few-shot:** one example = one-shot, two or more = few-shot (terms used interchangeably in industry, per speaker). Works because examples steer the next-token distribution. Speaker's guidance: 3-5 examples is the sweet spot (from his experience), cover edge cases and variations, skip when zero-shot is already clean; every example costs context tokens.
- **Chain of thought ("think step by step"):** reasoning tokens written before the answer become context for later tokens; without it the model must commit to the answer token immediately. Use for multi-step math/logic and complex classification with edge cases; skip for simple factual Q&A and creative writing. Arithmetic of the speaker's apple example (steps 1-3 spoken, final result computed by the author, in dollars):

  $$10 - 4 \times 1.5 - 2 \times 1.5 = 10 - 6 - 3 = 1$$

- **Structured output:** asking for JSON in the prompt is a suggestion (may return a string with a markdown fence, renamed keys or extra fields). Passing a Pydantic class as `text_format` makes the SDK send a JSON Schema; the speaker says the model is constrained server-side to that schema.
- **Response payload (Responses API):** top level has id, created_at, model, status, echoed parameters, `usage` (input/output/total tokens = the billing meter); `output` is a list of items (type `message` or `function_call`, possibly both); a message's `content` is itself a list (text now, other media possible); `output_text` is a convenience accessor.
- **Tool call:** a tool is a function in your code described to the model (name, description, parameters; the body is never sent). The model answers with a `function_call` (name, JSON arguments, call id); your code runs the function; you send back the original input + the model's call item + a `function_call_output` carrying the same call id; the model writes the final answer. "The model is the coordinator, your code is the executor." Every agent is this loop with more tools.

## Implementation

Setup shown in the clip: create a project folder, a Python virtual environment, `pip install openai python-dotenv`, a `.env` file holding the API key (created in the OpenAI platform under Settings -> API keys), and a `.gitignore` listing `.env` and the venv folder. Minimum prepaid credit mentioned: $5 (for an "insufficient balance" error). Model used: gpt-4o (speaker says 5, 5.5 or 4o mini also work).

Steps demonstrated (names as in the OpenAI Python SDK, Responses API):

1. `client = OpenAI()` after loading env vars. Simplest call: `client.responses.create(model=..., input="...")`; the SDK returns a Python object built from the JSON response; read `.output_text`.
2. Multi-turn: pass `input` as a list of `{"role": "user" | "assistant", "content": ...}` including earlier turns; the model answers "my name is Harish" correctly only because history is resent.
3. System prompt: `instructions="..."` (or a message with role system). Print `usage` to see input, output and total tokens.
4. `max_output_tokens`: 10 was rejected by the API (below the minimum; the error shown mentions 16), 20 truncated the answer at the 20th token, 100 restored. Author note: the speaker reads the on-screen error aloud as "greater than 16" plus "integer below minimum value"; the author reads the minimum as 16; this number was not found in the OpenAI doc pages that could be fetched.
5. Streaming: `stream=True` returns a generator of events; loop with `for event in stream` and print as events arrive.
6. Structured output: define `class Person(BaseModel): name: str; age: int; city: str`; call `client.responses.parse(model=..., instructions=..., input=..., text_format=Person)`; use `.name`, `.age`, `.city` on the parsed object. (Author note from the OpenAI docs: the parsed object is `response.output_parsed`; refusals are separate from schema adherence.)
7. Raw payload inspection: print the raw JSON instead of the SDK object to see `usage`, `output` items and `content`.
8. Tool call loop (get_weather example):
   - Python function `get_weather(city)` returns fake data `{"city", "temperature": 28, "unit": "celsius", "condition": "sunny"}`.
   - Tool definition: `[{"type": "function", "name": "get_weather", "description": "Get the current weather for a given city", "parameters": {"type": "object", "properties": {"city": {"type": "string", "description": "The city to get weather for"}}, "required": ["city"]}}]`.
   - First request: `input=[{"role": "user", "content": "What is the current weather in Bangalore?"}]` plus `tools=tools`. Without tools the model says it cannot provide real-time weather.
   - The first output item has type `function_call` with `name`, JSON `arguments` and a call id. Parse with `json.loads`, run the function yourself.
   - Second request: input = [original user message, the function_call item, `{"type": "function_call_output", "call_id": <same id>, "output": json.dumps(result)}`] (results must be a string); the model replies with the final text. Changing the city to Delhi changes the call and the answer.
   - Author notes from OpenAI docs: tool definitions can include `strict`; for reasoning models the returned reasoning items must also be passed back with the tool output; the doc's five-step flow matches the speaker's.

Pitfalls the speaker states: using "respond in JSON" as if it were a guarantee; setting max tokens too low or too high; sending a tool function's code instead of its description; forgetting to stringify the tool result; dropping the call id when many tool calls exist.

## Quick Reference

| Item | Value | Source |
|---|---|---|
| Token size | 1 token ~ 0.75 English words; 1,000 tokens ~ 750 words | speaker ~6:08 |
| Context windows (slide) | Opus 4.7 1,000,000; GPT-5.5 1,050,000; Gemini 3.1 Pro 1,000,000 tokens | slide ~10:20 |
| 128,000 tokens | ~300 pages (estimate) | speaker ~10:42 |
| Temperature guide | 0-0.2 / 0.3-0.7 / 0.8-1.0 by task (see Key Concepts) | slide ~21:20 |
| max tokens | classification 10-20; long technical 500+ | speaker ~22:34 |
| Four decisions per call | system prompt, user prompt, temperature, max tokens | speaker ~22:42 |
| Few-shot | 3-5 examples (speaker's experience) | speaker ~29:09 |
| Zero-shot constraint example | three bullets, each under 15 words, non-technical audience | speaker ~25:02 |
| CoT example | apples $1.5 each; 4 apples = $6; $10 - $6 = $4 change; 2 more apples = $3 (final answer not captured; $4 - $3 = $1 by arithmetic, see equation in Key Concepts) | speaker ~32:00 |
| Main API call | `client.responses.create(model="gpt-4o", input=...)` | code ~38:30 |
| Test of cap | max_output_tokens 10 rejected; 20 truncates at 20th token; reset to 100 | demo ~45:14 |
| Structured output | `responses.parse(..., text_format=Person)` | code ~51:56 |
| Tool definition keys | type "function", name, description, parameters (type object, properties, required) | code ~64:12 |
| Tool result item | type `function_call_output`, `call_id`, `output` string | ~69:49 |

## Comparisons

| Technique | Use when | Cost / trade-off | Avoid when |
|---|---|---|---|
| Zero-shot | simple, well-specified tasks (classify, translate, summarise, easy Q&A) | cheapest; weaker on complex or format-specific tasks | exact format needed and instruction alone is not enough |
| Few-shot | specific format/pattern, zero-shot inconsistent, high-stakes output | examples add context tokens | task already clean with zero-shot |
| Chain of thought | multi-step math/logic, classification with edge cases | extra reasoning tokens | simple factual Q&A, creative writing |
| Role prompting | persona or expertise needed | done via system prompt (only recapped) | n/a |

| Way to get JSON | Result in the clip |
|---|---|
| Ask plainly | one string, hard to parse |
| "Respond in JSON" in the prompt | still a string, markdown fence attached, not reliable |
| Pydantic `text_format` | typed Python object, schema enforced before it reaches the caller (speaker); OpenAI docs confirm schema adherence |

Verdict criterion: if code consumes the output, use schema-enforced structured output; if a human reads it, plain text is fine.

## Fact Check

17 claims checked (7 confirmed, 6 partly confirmed, 3 not matching sources or the clip itself, 1 not found in readable docs).

| # | Claim | Verdict | Detail |
|---|---|---|---|
| 1 | 1 token ~ 0.75 words | confirmed | OpenAI help: ~4 characters ~ 3/4 word; 100 tokens ~ 75 words (rough, English) |
| 2 | code/JSON/other languages cost more tokens | partly | OpenAI notes ratios vary by language; the slide's own string `{"key": "value"}` = 6 tokens in cl100k_base and in o200k_base (5 without the space; tiktoken run by author) vs 9 on the slide, so the slide count does not match these two encodings |
| 3 | "hello" might be id 9906 | partly | in cl100k_base 9906 is "Hello" (capital H); "hello" = 15339; o200k_base: 13225 / 24912 |
| 4 | "unhappiness" = 2 tokens (un + happiness) | does not match OpenAI tokenizers | speaker says it aloud (~5:14, ~7:13) and the slide shows it; cl100k_base and o200k_base give 3 tokens (un, h, appiness); the speaker names no tokenizer and defers the splitting math |
| 5 | Opus 4.7 has 1M context | confirmed (secondary source) | reported as released 2026-04-16; current Anthropic overview lists newer 1M models only |
| 6 | GPT-5.5 ~ 1M | confirmed | OpenAI model page: 1,050,000 context, 128,000 max output |
| 7 | Gemini 3.1 ~ 1M | confirmed | Google: input 1,048,576, output 65,536 |
| 8 | 128K tokens ~ 300 pages | partly | consistent with 0.75 words/token and ~320 words/page (author arithmetic); no official source |
| 9 | temperature 0 is deterministic | partly | true in principle; in serving, non-batch-invariant kernels can change results |
| 10 | temperature is a parameter most LLM APIs accept (speaker ~19:12) | partly | some GPT-5 models reject it; GPT-5.1+ accept it only with reasoning effort none |
| 11 | model never plans ahead | contradicted (partly) | Anthropic research shows rhyme planning before the line is written |
| 12 | few-shot sweet spot 3-5; cover edge cases | confirmed | Anthropic docs: "Include 3-5 examples for best results", diverse, cover edge cases |
| 13 | Pydantic `text_format` guarantees schema; prompt-only JSON does not | confirmed | OpenAI docs: Structured Outputs ensures schema adherence; JSON mode only valid JSON; internal mechanism not stated on the page read |
| 14 | tool definition keys, function_call + call_id, function_call_output | confirmed | OpenAI docs match; also `strict` and reasoning-item pass-back |
| 15 | too-low max_output_tokens is rejected (10) | not found in docs | minimum 16 seen only in the clip's on-screen error |
| 16 | `output_text` takes first item's first content (~57:26) | contradicted (within the clip) | doc shown at ~58:12 says it aggregates all text outputs into one string |
| 17 | chapter "OpenAI, Anthropic, Gemini" | partly | description and chapter title say so, and the speaker says before the chapter (~34:26) he will call OpenAI and Anthropic in code; the demo shows OpenAI only |

## Open Questions & Extension Ideas

- The clip says the next-token loop and temperature sampling are the whole story but skips how the distribution is produced (attention, embeddings), how tokenizers are trained (BPE), pre-training and post-training; those need other sources.
- Top-p / top-k are not mentioned; temperature is the only sampling control covered.
- Cost management is promised in the roadmap but only the `usage` fields are shown; no price arithmetic.
- No Anthropic or Gemini code despite the chapter title; a comparison of the three APIs' message and tool formats would be new content.
- Context-window overflow strategies (chunking, RAG, summarisation) are deferred to later episodes.
- Prompt injection, evaluation of prompts, and agent loops with multiple tool calls or error handling are not covered; the tool section shows one call only.
- Does "think step by step" still help with models that reason internally? Not tested here.
- Extension: build a runnable tool-call loop that handles several calls with distinct call ids and errors in the tool function.

## Tags & Triggers

tags: LLM, tokens, tokenizer, context window, next-token prediction, system prompt, temperature, max tokens, zero-shot, few-shot, chain of thought, OpenAI Responses API, streaming, structured output, Pydantic, tool call, function calling, agents
- What is a token and why is everything measured in tokens?
- Why does an LLM have no memory and what is a context window?
- How should temperature be set for different tasks?
- How many few-shot examples should I give?
- How do I make an LLM return reliable JSON?
- How does tool calling work and does the model run the function itself?

## References

- Source: YouTube, Harish Neel | AI, "LLM Fundamentals Crash Course For Beginners 2026 (Tokens, Prompting, APIs & Tool Calls)", published 2026-08-13, https://www.youtube.com/watch?v=YHNi88FaGug
- OpenAI Help Center, What are tokens and how to count them: https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them
- OpenAI API docs, GPT-5.5: https://developers.openai.com/api/docs/models/gpt-5.5.md
- Google AI for Developers, Gemini 3.1 Pro preview: https://ai.google.dev/gemini-api/docs/models/gemini-3.1-pro-preview
- Anthropic, Models overview: https://platform.claude.com/docs/en/about-claude/models/overview
- Let's Data Science, Claude Opus 4.7 with 1M context (secondary): https://letsdatascience.com/news/anthropic-releases-claude-opus-47-with-1m-context-06a580ef
- OpenAI, Structured Outputs: https://developers.openai.com/api/docs/guides/structured-outputs
- OpenAI, Function calling: https://developers.openai.com/api/docs/guides/function-calling
- Anthropic, Multishot prompting: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/multishot-prompting
- Anthropic Research, Tracing the thoughts of a large language model: https://www.anthropic.com/research/tracing-thoughts-language-model
- Spheron, vLLM batch invariance: https://www.spheron.network/blog/vllm-batch-invariance-why-temperature-0-isnt-deterministic/
- Braintrust KB, temperature parameter not supported in GPT: https://braintrust.dev/docs/kb/temperature-parameter-not-supported-in-gpt
- tiktoken runs by the author (cl100k_base, o200k_base) on 2026-10-13
