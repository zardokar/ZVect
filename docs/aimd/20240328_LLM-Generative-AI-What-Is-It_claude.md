# LLM (Generative AI): What Is It? — mikelopster - Claude Context
> Source: YouTube, mikelopster, "LLM (Generative AI) kue arai ?" (Thai title; English: What is an LLM?), 1:02:23, published 2024-03-28 · https://www.youtube.com/watch?v=-f_i_a13IKc · Generated: 2026-10-13
> Companion: 20240328_LLM-Generative-AI-What-Is-It.html (Thai, iw mode `iwd`, 13 sections, 7 frames + 3 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis (standard YouTube license).
- Frames used: 01_genai-whiteboard, 02_probability-whiteboard, 03_encoder-decoder-weight, 04_transformer-attention, 05_rl-agent-environment, 06_llm-training-stages, 07_multimodal-architecture.
- Own SVG diagrams: flow, bars, flow.
- Transcript SHA-256 (in-page = decoded): `06dcea599844726a094fb743a2335f5be64edb9eaef794947401e44fc97219a7 (th:manual track)`; kept in the session workspace only.

## TL;DR
A 62-minute Thai talk (mikelopster, published 2024-03-28; own-words deep analysis, standard YouTube license) that explains how ChatGPT / Claude / Gemini work, step by step and with little math. Chain of ideas: Generative AI = anything an AI creates -> a neural network is "if-else with probabilities" -> everything must become numbers, so an Encoder turns text into vectors and a Decoder turns results back; a trained "weight vector" acts like a smart dictionary (vector x weights -> scores such as 0.1 / 0.4 / 0.5 -> pick the highest -> "cat"); Attention computes relations and fixes the RNN problem of forgetting early tokens -> an LLM is a Transformer with a huge number of parameters that generates one token at a time in a loop -> Prompting / In-Context Learning teaches through the prompt without changing the model, but is hit-and-miss -> Pretrained (self-described "unsupervised", relationships only) -> Instruct model (humans label right/wrong, supervised fine-tune) -> Reinforcement Learning from Human Feedback (rewards from feedback) -> multimodality (images, audio, video converted to vectors) -> tools the speaker uses (GPT-4, Gemini, Claude, Perplexity, RAG idea). The analysis also extracts the clip's **explanation flow** as a reusable 15-step template (section 13 of the report).

## Key Concepts
- **Generative AI:** anything created by an AI model rather than originally by a person (speaker's example: a drawn Thai letter produced by an AI after a user command).
- **Neural network (as taught here):** inputs -> hidden layer(s) -> prediction; the speaker turns hard conditions into probabilities (illustrative numbers: blue shirt 0.6 stir-fried-basil vs orange 0.4 kale; province refinement 0.56 / 0.44). More variables make the network denser; this is the stated background of LLMs.
- **Text must be numbers:** activations and weight multiplications need numeric input; the speaker's made-up encoding is blue shirt = 0, orange = 1, Nonthaburi = 0.5, Bangkok = 0.4; text features (grammar, order, sentence type) live in vectors.
- **Encoder / Decoder:** Encoder converts original data to computable data (vectors); Decoder converts the computed result back to text.
- **Weight vector:** result of training, described as a dictionary of relationships; vector x weight vector gives scores per candidate; the max is the output word.
- **Attention + position:** Attention computes relations between the input and what was learned; position information is part of the input so early words ("cute", "animal") are not lost in long sentences.
- **RNN vs Transformer (as told):** an RNN passes state step by step and forgets early inputs in long text; a Transformer computes over the whole set.
- **Real Transformer diagram (not detailed on purpose):** tokenize -> embedding + position encoding -> attention module -> decoder -> compare with the dictionary -> emit text.
- **Generation loop:** after each new token the model re-analyses the whole sequence; this is why ChatGPT text streams in.
- **Training techniques named:** masking (hide a token, predict it) and next-sequence prediction; both end in a table of weights.
- **LLM:** a Transformer-based Neural Network with a very large parameter count; plain-language version: "a text-prediction model". Behaviour depends on the data it learned from (Wikipedia-only vs web + books + forums + Reddit).
- **Prompt techniques:** zero-shot, few-shot (the speaker only says "tell a story, the model summarises"; the usual definition, examples first, is the analyst's addition), chain of thought with the Roger tennis-ball problem (5 balls, buys 2 more) and a 23-apple cafeteria problem (from the Prompting Guide site); the speaker warns they work for some models and problems and not others, and long reasoning consumes tokens and may be wrong.
- **In-Context Learning:** teach through the prompt without adjusting the model ("adjusting" = re-training / fine-tuning).
- **Pretrained:** already trained model with weights ready to use; building one from scratch would take about a year (speaker's figure) and large compute.
- **Instruct model:** pretrained model + human supervision (label right/wrong, desired input/output) fine-tuned; examples named: GPT-3.5, Falcon Instruct, and another model the ASR renders as "DALL-E 2" (probably Dolly 2).
- **RL from human feedback:** reward model + RL replaces constant re-labelling; the speaker says GPT-4 uses it; users pressing "bad response" are described as giving reward (see author correction below).
- **Multimodal:** add encoders that turn image / audio / video into vectors, then relate them like text; the speaker says few models supported it then (mostly API models such as GPT-4, which already did), and he expects Gemini to get a multimodal version; Sora (text-to-video, announced 2024-02-15) is the example.

## Implementation
This is a conceptual talk, not a build recipe. The mechanics an engineer can take away (all simplified by the speaker):
1. Tokenize the text; map tokens to embeddings and add position encodings.
2. Run attention layers to relate tokens; the model produces a score per vocabulary item (the "dictionary" step, shown with toy scores 0.1 / 0.4 / 0.5).
3. Pick the highest-scoring token (the speaker's toy example; real systems usually sample, not covered), append it to the input, and repeat until an end token.
4. Training objectives named: masked-token prediction and next-token (sequence) prediction.
5. Post-training in three stages: pretrain (no human labels) -> supervised instruction tuning on labelled input/output examples -> reward-based tuning from human feedback.
6. Consume the model through prompts (zero-shot, few-shot, chain of thought) or run an open model from Hugging Face (Typhoon-7B is the Thai example).

Author corrections the implementer should apply (verified in the fact check): the single Encoder -> weight vector -> Decoder picture is illustrative; the original Transformer (Vaswani et al., section 3) is encoder-decoder, whereas GPT-3 is described as decoder-only. In the InstructGPT recipe the human step is ranking outputs to train a reward model, then RL; a single click on "bad response" is not shown to update the model immediately.

## Quick Reference
| Item | Value |
|---|---|
| Source | mikelopster, "LLM (Generative AI)", 1:02:23, 2024-03-28, Thai (manual captions) |
| GPT-2 / GPT-3 parameters | 1.5 billion / 175 billion (confirmed) |
| GPT-4 parameters | speaker: about 1.4 trillion, says undisclosed; OpenAI withheld the size in its technical report |
| "First Bard" parameters | speaker: 300+ million; not found in the sources read (Google: Bard launched on a lightweight LaMDA, size not stated; the smallest LaMDA in the paper is 2B) |
| Pretrain time from scratch | about a year (speaker) |
| Example data size on a model card | 300 GB (speaker); another model he opened: 200-300 GB |
| Toy probabilities | 0.6 / 0.4 and 0.56 / 0.44 (hypothetical, spoken as "suppose") |
| Toy dictionary scores | 0.1, 0.4, 0.5 -> highest -> "cat" |
| Thai open model | Typhoon (SCB 10X): Typhoon-7B, Mistral-7B base, pretrained weights under Apache 2.0; SCB 10X blog dated 2024-02-06, technical report arXiv 2312.13951 dated Dec 2023 |
| Products compared | GPT-4 (creative), Gemini / Gemini Advanced, Claude (Thai quality, maths), Perplexity (search + LLM) |
| Paid tiers named | Gemini Advanced, ChatGPT 4, Claude 3 Opus |
| Keywords to study next | Pretrained, Fine-tune, Prompting, Prompt Engineering, In-Context Learning, RAG, Multimodal |

## Comparisons
| Stage | Learns from | Human role | Result |
|---|---|---|---|
| Pretrained | huge corpora (Wikipedia, books, forums, Reddit) | none (speaker: "unsupervised"; the figure he shows says self-supervised) | knows a lot, does not know what is right; needs prompt framing |
| Instruct | pretrained model + labelled input/output | humans label right/wrong (supervised fine-tune) | answers more on-point (example GPT-3.5) |
| RL fine-tuned | instruct model + reward from feedback | humans give feedback that becomes reward | ChatGPT / Claude level; vendors differ because instruct and reward differ |

## Fact Check
12 claims: 5 confirmed, 6 partly confirmed, 1 not found.
| Claim | Verdict | Detail | Read from |
|---|---|---|---|
| Transformer comes from a "Google Brain" paper "Attention Is All You Need" (2017) | partly | title, 8 authors, NIPS 2017 confirmed; arXiv 2017-06-12; affiliations on page 1 are mixed (Google Brain, Google Research, University of Toronto, one unlisted) | arXiv 1706.03762 |
| GPT-2 about 1.5B, GPT-3 175B parameters | confirmed | matches Wikipedia | Wikipedia GPT-3 |
| GPT-4 about 1.4 trillion (speaker says undisclosed) | partly | "undisclosed" is right (technical report withholds model size); the figure is not official | arXiv 2303.08774 |
| First Bard had 300+ million parameters | not found | Google (2023-02-06) says Bard launched on a lightweight LaMDA without stating a size; the smallest LaMDA in the research paper is 2B (above 300M); no 300M figure found, so the claim cannot be judged | blog.google (Bard); arXiv 2201.08239 |
| Typhoon is a Thai model on Hugging Face, compared with GPT-3.5 | confirmed | 7B, Mistral-7B base, ~5,000 Thai words added, Apache 2.0, comparable to GPT-3.5 on Thai exams per the vendor | SCB 10X blog |
| One picture Encoder -> weight vector -> Decoder explains LLMs | partly | original Transformer is encoder-decoder (section 3); GPT-3 is decoder-only | arXiv 1706.03762; Wikipedia GPT-3 |
| Instruct = human supervision, then RL with rewards | confirmed | InstructGPT: SFT on demonstrations, reward model from rankings, RL; 1.3B model preferred over 175B GPT-3 | arXiv 2203.02155 |
| GPT-4 uses RLHF | confirmed | technical report says fine-tuned with RLHF | arXiv 2303.08774 |
| Bard renamed Gemini; paying gives each vendor's best model | partly | rename 2024-02-08; Gemini Advanced = Ultra, USD 20/month; Claude 3 released 2024-03-04 with Opus on top; ChatGPT 4 plan not checked | campustechnology.com; anthropic.com |
| Sora is new and makes video from text | confirmed | announced 2024-02-15, research-only then; OpenAI's Sora page read on 2026-10-13 says the product is no longer available as of 2026-04-26 | axios.com; openai.com/index/sora |
| Zero-shot, few-shot, chain of thought (Roger tennis-ball example) | partly | techniques and the "emergent in large models" note are on the Prompting Guide CoT page; the Roger example is not on that page | promptingguide.ai |
| Pretraining is "unsupervised" | partly | the figure the speaker shows labels the stage "self-supervised"; same meaning (no human labels) | frame at about 48:20 |

## Open Questions & Extension Ideas
- Chapter bridge: this talk gives an overview of pre-training (G1) and post-training (G2); inference (G3), evaluation (G5) and the Attention formula are not covered and need other sources.
- A follow-up piece could contrast the toy dictionary-score step with real logits + softmax + sampling.
- Reuse the 15-step explanation flow (section 13 of the report) as a checklist for lesson intros and manual sections; test it on one lesson before adopting it.

## Tags & Triggers
LLM, Generative AI, Transformer, Attention, Encoder, Decoder, Pretrained, Instruct model, RLHF, In-Context Learning, Prompt, Multimodal, explanation flow, storytelling template. Triggers: what is an LLM; Pretrained vs Instruct vs RLHF; why ChatGPT answers token by token; how to explain a hard technical topic simply.

## References
- mikelopster, "LLM (Generative AI)", YouTube, 2024-03-28: https://www.youtube.com/watch?v=-f_i_a13IKc
- Vaswani et al., Attention Is All You Need: https://arxiv.org/abs/1706.03762 ; https://research.google/pubs/pub46201/
- Wikipedia, GPT-3: https://en.wikipedia.org/wiki/GPT-3 ; Wikipedia, Bard: https://en.wikipedia.org/wiki/Bard_(chatbot)
- OpenAI, GPT-4 Technical Report: https://arxiv.org/pdf/2303.08774 ; Ouyang et al., InstructGPT: https://arxiv.org/abs/2203.02155 ; LaMDA: https://arxiv.org/abs/2201.08239
- SCB 10X Typhoon: https://www.scb10x.com/en/blog/typhoon-innovative-thai-language-model
- Campus Technology: https://campustechnology.com/articles/2024/02/09/google-renames-bard-introduces-tiered-models-and-pricing.aspx ; Anthropic Claude 3: https://www.anthropic.com/news/claude-3-family ; Axios Sora: https://www.axios.com/2024/02/15/openai-text-to-video-sora ; OpenAI Sora: https://openai.com/index/sora/
- Prompting Guide CoT: https://www.promptingguide.ai/techniques/cot
