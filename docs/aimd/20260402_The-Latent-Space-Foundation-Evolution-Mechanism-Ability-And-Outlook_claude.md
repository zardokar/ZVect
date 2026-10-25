# "The Latent Space: Foundation, Evolution, Mechanism, Ability, and Outlook" - Claude Context
> Source: arXiv 2604.02029v2, Xinlei Yu et al. (39 authors), "The Latent Space: Foundation, Evolution, Mechanism, Ability, and Outlook", survey, v1 2026-04-02, v2 2026-06-05 · https://arxiv.org/abs/2604.02029v2 · Generated: 2026-10-24
> Companion: 20260402_The-Latent-Space-Foundation-Evolution-Mechanism-Ability-And-Outlook.html (Thai, iw mode `iwd`, 11 sections, 8 frames + 25 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words rewrite (no CC license stated on the arXiv page), every point and number kept; the method tables are reproduced row by row.
- Frames used: P18, P2, P3, P30, P42, P5, P6, P8.
- Own SVG diagrams: flow, flow, flow, flow, compare, multiples, bars, quadrant, flow, matrix, matrix, compare, bars, bars, compare, flow, layers, bars, bars, compare, compare, tree, compare, compare, compare.

## TL;DR

- Survey (arXiv 2604.02029v2, 39 authors from 19 institutions, v1 2026-04-02, v2 2026-06-05) arguing that latent space, the continuous hidden-state space inside language-based models (LLMs, VLMs, VLAs, agents), is becoming a machine-native substrate for computation rather than a hidden implementation detail.
- Motivation: four structural limits of explicit (verbal, token-level) computation: linguistic redundancy, the discretization bottleneck, sequential decoding cost, and potential loss of fine-grained information; most acute in complex, multimodal or long-horizon settings.
- Structure: five sequential questions: Foundation (what is it, §2), Evolution (how did it develop, §3), Mechanism (how does it work, §4), Ability (what does it enable, §5), Outlook (what is next, §6), plus a conclusion (§7).
- Core contribution: a two-axis taxonomy, 4 mechanisms (Architecture, Representation, Computation, Optimization) x 7 abilities (Reasoning, Planning, Modeling, Perception, Memory, Collaboration, Embodiment); five method tables (Tables 2-6) and 22 display equations, all in §4.
- Outlook: three challenges (evaluability, controllability, interpretability) and four directions (Theory, Multimodal, Downstream Task, Governable). Vision: explicit language stays the interface for instruction and verification; latent space becomes the internal workspace.
- Our fact check of 31 claims against the cited primary papers: confirmed 24 · partly 5 · not found 1 · contradicted 1. Key corrections: the "strictly more complex" looped-transformer separation attributed to [167] was not found (its theorems are simulation results); LatentGuard's backbone is Qwen3-8B, not Gemini 2.5 Pro.

## Key Concepts

- Explicit (verbal) space: the discrete space of linguistic symbols, defined by the vocabulary used for next-token prediction; human-readable and verifiable; training objectives are usually written here.
- Latent space: the family of hidden-state spaces in which contextual, semantic, syntactic and relational features are jointly represented. A token sequence maps to a trajectory of latent states, which is projected back to a next-token distribution. It can extend beyond language to a unified space for modality-specific inputs. Formal definition in §4 (generation conditioned on x and an extra latent z).
- Four representational contrasts (explicit vs latent): human-readable vs machine-native; discrete & symbolic vs continuous & flexible; inefficient vs efficient; semantically lossy vs high-fidelity.
- Functional capabilities of latent space: operability (differentiable manifold: concatenation, linear combination, steering [250, 84], intervention [295, 98, 49], interleaving [111, 20], visual latent thinking [276, 211, 183]); expressiveness; scalability (longer trajectories, more agent turns, test-time compute); generalization. Explicit space keeps the edge on evaluability, controllability and interpretability (revisited as challenges in §6.2).
- Not the same as visual generative latents (VAE [85] -> VQ-VAE [201] -> latent diffusion [162] -> VideoLDM [12]): those are shaped by a reconstruction objective (smooth, locally Euclidean, meaningful distances), have an explicit spatial (and temporal) grid, and are controlled via dedicated pathways (pose, depth, segmentation, reference images); LM latents are shaped by next-token prediction with no explicit geometric constraint and carry no spatial topology or physical dynamics.
- Taxonomy, axis 1 (Mechanism, 14 sub-types by our count):
  - Architecture: Backbone, Component, Auxiliary Model.
  - Representation: Internal, External, Learnable, Hybrid.
  - Computation: Compressed, Expanded, Adaptive, Interleaved.
  - Optimization: Pre-training, Post-training, Inference.
- Taxonomy, axis 2 (Ability, 27 sub-abilities by our count from Figure 8):
  - Reasoning (5): Implicit Inference, Compact Trace, Continuous Refinement, Branching Path, Modal Generalization.
  - Planning (4): Controllable Exploration, Efficient Search, Adaptive Budget, Sequential Decision.
  - Modeling (4): Rich Expression, Self Inspection, Robust Control, Scalable Computation.
  - Perception (3): Multimodal Inference, Heuristic Imagination, Faithful Grounding.
  - Memory (3): Working Retention, Persistent Mind, Multimodal Recall.
  - Collaboration (3): Semantic Fidelity, Shared Cognition, Heterogeneous Interoperability.
  - Embodiment (5): Unsupervised Grounding, Implicit Thinking, Predictive Foresight, Spatial Cognition, Generalized Transfer.
- Figure 1 places each method in its single best cell; one method may belong to several mechanisms and abilities.

### History (Evolution, §3)

Each stage ends with a bottleneck that motivates the next one (Figure 4: the count of latent-level works stays below about 100 through the first two stages and rises steeply from Expansion on; the curve never falls, so it is probably cumulative, which the caption does not say).

| stage | dates | threads | representative works | bottleneck that ends it |
|---|---|---|---|---|
| Prototype | before - Mar 2025 | theory validation; early exploration | HCoT [122], Zhang & Viteri steering vectors [277], Hopfieldian view [66], Chain-of-Embedding [217]; COCONUT [58] (last hidden state fed back, emergent BFS), CCoT [31], cache augmentation [117], Huginn [50] (recurrent depth), SoftCoT [243] (plug-in soft thoughts) | no account of why latent reasoning works, when it beats explicit CoT, how to evaluate it |
| Formation | Apr - Jul 2025 | theory systematization; technical formation; first multimodal steps | Reasoning by Superposition [294], CoT2 [52], looped transformers [167]; Assorted [181], CODI [174], BoLT [164]; HRPO [266], System-1.5 [214], CoLaR [188]; Mirage [251], UniVLA [14] | narrow, text-centric settings, weak integration with memory, planning, communication, action |
| Expansion | Aug - Nov 2025 | technical maturation; paradigm/scenario expansion | MemGen [273], LTPO [258], Ouro [296], latent TTS [262], SofT-GRPO [291], SpiralThinker [155], CLaRa [59]; LVR [95], Monet [211], 3DThinker [28], VisMem [264], CoMEM [230], Latent Sketchpad [276], LaCoT [183]; C2C [48], ThoughtComm [290], LatentMAS [300]; LAPA [256], LAWM [196], OccVLA [118], SRPO [45], ATE [281] | fragmentation: different assumptions, objectives, evaluation criteria and latent interfaces |
| Outbreak | Dec 2025 - present | all-round outbreak | Dreamer [86], LoopFormer [72], MLRA [121], DLCM [158]; ReLaX [280], Active Latent Planning [292], RL analysis [149], LED [189], Latent Thinking Optimization [41]; ILVR [39], CrystaL [283], LIVR [100], Mull-Tokens [160], VL-JEPA [21], DMLR [111]; KV-cache alignment [38], L2-VMAS [265], Wormhole [124], LatentMem [47]; Motus [10], VLA-JEPA [184], Villa-X [26], JALA [131], CoWVLA [249], WholeBodyVLA [77], SwiftVLA [142], LoLA [213] | consolidation: standard latent interfaces, cross-modal evaluation, efficiency vs interpretability, integration into agentic systems |

Primary-paper numbers for works named in §3 (from our fact check, not stated in the survey): HCoT decodes at least 1.5x faster; Huginn has 3.5B parameters, (2, 4, 2) prelude/recurrent/coda layers, 800B training tokens; CODI 3.1x compression and +28.2% over the prior best implicit method on GSM8k; SofT-GRPO +0.13% Pass@1 and +2.19% Pass@32 over discrete-token GRPO (1.5B-7B); C2C +6.4-14.2% over single models, +3.1-5.4% over text communication, 2.5x lower latency; LatentMAS up to +14.6% accuracy, 70.8-83.7% fewer output tokens, 4-4.3x faster; SRPO success 48.9% -> 99.2% after 200 RL steps (48.9% is the supervised baseline).

## Implementation

### Mechanism overview (paper §4 intro)

The survey organizes latent-space mechanisms on four complementary axes (not mutually exclusive boxes; one method can sit on several axes):

- **Architecture (§4.1):** where latent space lives structurally: inside the backbone, in a dedicated plug-in component, or in an auxiliary model.
- **Representation (§4.2):** what form z takes: internal, external, learnable, hybrid.
- **Computation (§4.3):** how z participates in processing: compressed, expanded, adaptive, interleaved.
- **Optimization (§4.4):** when z is induced, aligned or refined: pre-training, post-training, inference.

Notation (Table 1): 𝒱 token space (discrete vocabulary / token IDs); ℋ latent space (continuous ℝ^d); ℳ model space (models / modules / components); 𝒲 parameter space; 𝒟 data space. x, y, r (generation trajectory), E (embedding matrix), W (projection matrix), q/k/v are listed under 𝒱; h (one token's hidden state), H (sequence hidden states), z (latent representation) under ℋ; Φ (whole framework), Φ^back (backbone), Φ^comp (functional component), Φ^aux (auxiliary model) under ℳ; θ under 𝒲; R reward, ℒ loss. Note: Table 1 calls the model space ℳ, while §4.1 writes the same set as Φ = {Φ^back, Φ^comp, Φ^aux}; Table 1 also files E, W, q/k/v under 𝒱 although §4.2.1 defines E ∈ ℝ^{|𝒱|×d}.

Eq. (1), standard autoregressive generation (purely in token space; hidden states h ∈ ℋ exist internally but the interface stays token-to-token):

$$ \mathbf{y}\sim\Phi_{\theta}(\cdot\mid\mathbf{x}) $$

Eq. (2), latent-conditioned generation (z ∈ ℋ is an extra continuous channel for global semantics, multimodal features, intermediate reasoning states, structural constraints or other task factors that are hard to express in tokens):

$$ \mathbf{y}\sim\Phi_{\theta}(\cdot\mid\mathbf{x},\mathbf{z}) $$

The survey's framing: the question is not whether a method uses latent variables but how latent space is instantiated and integrated into generation.

### Architecture (paper §4.1; Tables 2 and 3)

Guiding question: "what architectures are utilized to learn the latent space?" Methods are split by where ℋ is integrated into Φ = {Φ^back, Φ^comp, Φ^aux}.

#### Backbone (§4.1.1, Table 2: 11 models, 01/25 to 03/26)

Latent computation is native to the generative backbone; no extra module. Eq. (3):

$$ \mathbf{h}_{t+1}=\Phi^{back}(\mathbf{h}_{1:t},\mathbf{x},\mathbf{y}_{1:t}) $$

Each next output token is produced from the updated hidden state; reasoning / intermediate transformation happens inside Φ^back.

- **Parameter-shared** (a smaller set of reusable modules applied repeatedly; recurrence depth typically fixed):
  - Huginn [50]: decoder-only, shared recurrent block reused across depth steps; fewer unique parameters; test-time scaling by adding recurrent steps (compute for performance). Table 2: dim 5280, 8 layers, 3.5B. Fact check: confirmed; (prelude, recurrent, coda) = (2, 4, 2) unique layers, 800B training tokens, no specialized reasoning data.
  - Looped Trans. [167]: explicit layer looping plus looping-based regularization that stabilizes hidden-state dynamics and encourages convergence of iterated representations. Table 2: dim 5120, 24 layers, 1.5B. Fact check: partly; the baseline has 24 layers, 32 heads, model dim 2048; 5120 is the feed-forward dim; size is "1B" in the main text and "1.5B" in Appendix A.2.
  - PHD-Trans. [223]: recurrence under long-context decoding via cache management plus sliding-window attention (lower memory). Table 2: 2048, 16 layers, 1.2B.
- **Iterative** (variable or learnable depth, dynamic updating):
  - Ouro [296]: recursive inference; iteration count as an alternative scaling axis analogous to depth; parameter-shared repetition gives consistent gains. Table 2: 2048, 24/48 layers, 1.4B/2.6B. Fact check: confirmed (config.json hidden_size 2048, total_ut_steps 4; 7.7T training tokens; entropy-regularized depth objective).
  - LoopFormer [72]: elastic-depth looped transformer; loop count varies by input or compute budget. Table 2: 2048, layers and size not given.
  - PonderLM2 [267]: decoder-only; iterative refinement with Jacobi-style parallel updates; multi-step hidden-state evolution in parallel while keeping decoding efficient. Table 2: 2048, 24 layers, 0.5B/1.4B.
- **Augmented**:
  - Heima (Table 2 [173]; the §4.1.1 text mistakenly cites [223]) and DLCM [158]: hierarchical encoder-decoder; DLCM moves computation from tokens to a compressed concept space. Heima Table 2: 4096, 72 layers, 19B (fact check: 19B = LLaVA-CoT on Llama-3.2-11B-Vision encoder + Llama-3.1-8B decoder; the paper states no total). DLCM: 1536, 32 layers, 2.3B. The text says "unlike most encoder-only designs"; 6 of the 11 Table 2 models are decoder-only, so "decoder-only" was likely meant (author reading, unconfirmed).
  - Dreamer [86] (sequence-depth sparse attention mixture; 1024, 16/32 layers, 1B/2B) and MLRA [121] (multi-head low-rank attention, four-way tensor-parallel decoding; 3072, 24 layers, 2.9B; fact check: 2.8x decoding speedup over MLA, size figures not visible on the abstract page).
  - MoLAE [127]: mixture of latent experts reformulated in a lower dimension; 512, 12 layers, 0.1B.

Survey summary: backbone methods are the most intrinsic form; parameter sharing buys efficiency, iterative refinement buys adaptive flexibility, augmentation broadens the architectural shift.

#### Component (§4.1.2, Table 3: 46 methods)

Keeps the backbone architecture (largely frozen) and adds a plug-in operator over latent space. Eq. (4); z is then used in Eq. (2):

$$ \mathbf{z}=\Phi^{\mathrm{comp}}\left(\mathbf{h},\mathbf{x}\right) $$

Five families:
- **Generation** (synthesize intermediate latent states / subgoals not available as symbols): ETD [87] encode-think-decode; Palette [129], iCLP [25], ATP-Latent [292], ReGuLaR [205] VAE-style components for diverse exploration; JEPA-Reasoner [110] reasoning as a chain of JEPA latent predictions. Non-trajectory signals: CoLaR [188] embedding prediction for "silent" reasoning; AR [64], RB-CoT [63] SAE feature directions; PILOT [289] MLP-synthesized steering vectors; MemGen [273], VisMem [264], LatentMem [47] LoRA-woven latent memory. Multimodal: AURORA [11] VAE perception tokens; CoMEM [229], CoMEM-Agent [230] Q-Former visual memory tokens; SteerVAD [18] frame-level embeddings from mixed layers (not in Table 3); Latent Sketchpad [276] (Table 3: "LS") VAE decoder for visual imagination.
- **Projection** (map existing hidden states to a target space): SoftCoT++ [244], PLaT [207] linear layers; SpiralThinker [155], LiteReason [55] MLPs; LF-Steering [250] SAE semantic subspace; Wormhole [124] encoder-decoder bridge between heterogeneous visual agents; OccVLA [118] transformer adapter for 3D features; action projection: LCLA [182] (not in Table 3), LaST0 [128] MLP projectors; ThinkAct [69], Fast-ThinkAct [70] Q-Former + MLP heads to robot action space; VITA [136] encoder-decoder visual-action latent; ColaVLA [152] forward layer to action-planning space.
- **Alignment** (anchor latents to grounding signals): AlignVLM [137] mixed alignment layers; PREGEN [169] video embeddings to retrieval text semantics; LaDiR [83], LoLA [213] diffusion-compatible / transformer-based semantic spaces; Interpreter [82] (Table 3 spells "Interpeter") LoRA cross-domain transfer.
- **Control** (when to enter / exit / delegate latent modes): FR-Ponder [62] MLP gating head; TaH [49] per-layer MLP decider (fact check: TaH = Think-at-Hard; latent iterations skipped on 93% of tokens); MemGen [273] LoRA or entropy trigger for memory invocation; Kelp [101] MLP module for risky inputs.
- **Storage** (persistent latent state across steps / turns / episodes): IMM [148], L2-VMAS [265] differentiable vector library; G-MemLLM [242] gated write-read; PolarMem [30] graph topology over visual memory.

#### Auxiliary Model (§4.1.3, Table 3: 26 methods)

Latent guidance outsourced to an external model; host keeps final prediction. Eq. (5); z is injected into Eq. (2):

$$ \mathbf{z}=\Phi^{\mathrm{aux}}(\mathbf{x}) $$

- **Supervision-oriented** (training signals): HCoT [122], LaViT [227] teacher chains distilled into host hidden states; SoftCoT [243] auxiliary chain projected into continuous soft embeddings (gradient-compatible); SIM-CoT [220], SemCoT [61] external hidden states as semantic anchors, contrastive objective; CTRLS [226] small LLM synthesizes reasoning waypoints; LatentEvolve [274] evolutionary refinement of memory representations; CoLT [293] tiny auxiliary decomposes latent tool-calling states.
- **Feature-oriented** (intermediate representations injected into the computation graph; prevalent in multimodal / embodied work): CoVT [156] chain of visual thought; 3DThinker [28] 3D foundation-model priors; LaRe [135], MM-CoT [171], VaLR [73] diffusion-based visual imagination; OneLatent [133], RoT [216] vision encoder renders textual reasoning into visual latents; SkiLa [197] (generative), VL-JEPA [21] (self-supervised) vision projection; UniVLA [14], SSM-VLA [19], SwiftVLA [142], LaST-VLA [132] embodied; LCDrive [187] world model and DW-VLA [75] extra encoder for driving; Future-VLA [44] predicted future visual features; WholeBodyVLA [77], LatentVLA [235] latent action model (text: whole-body humanoid control; Table 3 lists LatentVLA as planning/autonomous driving).

Author count from Table 3 (Modality column): Component 46 = text 28 / vision 11 / action 7; Auxiliary Model 26 = text 6 / vision 11 / action 9.

### Representation (paper §4.2; Table 4: 69 methods)

Two orthogonal axes: subject (z computed natively in the backbone vs by a structurally independent module) × parameterization (fixed model states vs dedicated trainable modules). Internal = native + fixed; External = independent + frozen; Learnable = native + trainable; Hybrid = independent + trainable. Discrete x ∈ 𝒱 is limited to the vocabulary; z ∈ ℋ lies on a continuous high-dimensional manifold with richer expressivity [8], [58], [243].

#### Internal (§4.2.1; 18 methods)

No added parameters; z read from forward-pass activations. Eq. (6), backbone with L transformer blocks (φ_emb: 𝒱 → ℝ^d via E ∈ ℝ^{|𝒱|×d}; φ_l: ℝ^{d×T} → ℝ^{d×T}; φ_head projects back to the vocabulary):

$$ \Phi^{\mathrm{back}}=\phi_{\mathrm{head}}\circ\phi_{L}\circ\cdots\circ\phi_{l}\circ\cdots\circ\phi_{1}\circ\phi_{\mathrm{emb}} $$

With h_l^t ∈ ℝ^d (token t, layer l) and H_l = [h_l^1, …, h_l^T] ∈ ℝ^{T×d}, Eq. (7), a deterministic readout where g is parameter-free (index selection, token mean pooling, fixed linear combination over layers):

$$ \mathbf{z}=g\!\left(\{\mathbf{H}_{l}\}_{l\in S}\right) $$

- **Hidden state**, Eq. (8) (last state at position T, or mean at layer l; the superscript T is a position, not a transpose):

$$ \mathbf{z}=\mathbf{h}_{L}^{T}\quad\text{or}\quad\frac{1}{T}\sum_{t=1}^{T}\mathbf{h}_{l}^{t} $$

  COCONUT [58] feeds the last hidden state back as the next input embedding (continuous-thought loop; fact check: GPT-2 base confirmed); SIM-CoT [220], LatentMAS [300] reuse the loop; CoE [217] pooled-state embedding chains for label-free self-evaluation; VTI [119], CGC-VTD [212] probe states to mitigate visual hallucination; IVT-LR [20] fuse with image embeddings; CausalEmbed [71] dense retrieval embeddings; CLReg [191] states as anti-forgetting regularizer; LFJ [237], LatentBreak [140] latent jailbreak attacks; JLT [81] defensive monitoring.
- **Weighted embedding**, Eq. (9) (α from softmax over pre-softmax logits o ∈ ℝ^{|𝒱|}; z lies in the convex hull of vocabulary embeddings; differentiable superposition of candidate tokens [287], [52] lets gradients pass the discrete step and enables parallel exploration):

$$ \mathbf{z}=\mathbf{E}^{\top}\bm{\alpha},\qquad\bm{\alpha}=\mathrm{softmax}(\mathbf{o}) $$

  LT-Tuning [123] context-prediction fusion; ThinkRouter [241] confidence-aware switching between latent and token generation. Fact check on Soft Thinking [287] (Table 4 backbone "LLaMA3.1-8B/other 3"): partly; evaluated models are QwQ-32B, DeepSeek-R1-Distill-Qwen-32B, DeepSeek-R1-Distill-Llama-70B; training-free, up to +2.48 pass@1, up to 22.4% fewer tokens.
  Worked toy example (author): logits [2, 3, 1] → α ≈ [0.24, 0.67, 0.09]; E rows [4, 1], [5, 1], [6, 1] → z = [4.85, 1.00].
- **Cache**, Eq. (10) (W_l^k, W_l^v ∈ ℝ^{d×d_k}; KV pairs as structured latent memory reused without recomputation):

$$ \mathbf{k}_{l}=\mathbf{H}_{l}\mathbf{W}_{l}^{k},\qquad\mathbf{v}_{l}=\mathbf{H}_{l}\mathbf{W}_{l}^{v} $$

  SALS [139] sparse attention over the KV cache; LatentMAS [300] KV cache as shared working memory across agents (fact check: training-free, up to +14.6% accuracy, 70.8–83.7% fewer output tokens, 4–4.3x faster on Qwen3-4B/8B/14B); LRP [253] attention weights + hidden states for visual abstraction.

#### External (§4.2.2; 14 methods)

z from a structurally independent auxiliary encoder, frozen during backbone training; x_aux may equal x or be another modality. Eq. (11):

$$ \mathbf{z}=\Phi^{\mathrm{aux}}(\mathbf{x}_{\mathrm{aux}}) $$

Because d_aux ≠ d_back is possible, z needs explicit alignment. Mode 1, conditioning input via learned projection ψ: ℝ^{d_aux} → ℝ^{d_back} (linear or MLP) and integration [ẑ; x] (prefix concatenation or cross-attention injection), Eq. (12):

$$ \hat{\mathbf{z}}=\psi(\mathbf{z}),\qquad\mathbf{y}\sim\Phi^{\mathrm{back}}\!\left(\cdot\mid[\hat{\mathbf{z}};\,\mathbf{x}]\right) $$

Mode 2, supervision target: the backbone state h is trained to match the projected external signal (dense, non-verbal distillation without the token bottleneck).

- **Reasoning priors:** CODI [174] self-distillation, frozen teacher hidden states as continuous targets (fact check: same model as teacher and student; 3.1x compression; +28.2% over prior best implicit method on GSM8k); SoftCoT [243] assistant's speculative chains projected into prepended soft tokens (fact check: assistant LLaMA-3.2-1B-Instruct, frozen backbone LLaMA-3.1-8B-Instruct); KaVa [91] distills the teacher's compressed KV cache.
- **Perceptual priors:** 3DThinker [28] 3D tokens; SkiLa [197] sketch tokens interleaved with text reasoning; VL-JEPA [21] predictive-coding embeddings (fact check: predictor from last 8 layers of Llama-3.2-1B, 490M trainable, V-JEPA 2 ViT-L + EmbeddingGemma-300M, 1.6B total); COVT [156] iterative visual tokens; OneLatent [133] perceptual + OCR context in a single latent token; Mull-Tokens [160] modality-agnostic latent tokens.
- **Embodied priors:** OccVLA [118] pre-trained 3D occupancy tokens as supervision (no 3D input at inference); LCDrive [187] world-model action/scene tokens; LaRA-VLA [5] pre-trained visual and action tokens.

#### Learnable (§4.2.3; 15 methods)

z built by a parameterized module embedded in the backbone (continuous virtual tokens, lightweight adapters); c is optional context (x, h, or ∅); θ trained end-to-end alone (frozen backbone) or jointly with θ_back. Eq. (13):

$$ \mathbf{z}=\Phi^{\mathrm{comp}}(\mathbf{c};\,\theta) $$

- **Compression learning** (information bottleneck): CoLaR [188] variance-preserving scaled aggregation of consecutive reasoning tokens; CoLT [293] seed tokens for parametric tool calls; LIVR [100] visual bottleneck; DeltaKV [57] residual differences between successive cache states.
- **Distribution learning:** CTRLS [226] MDP with Dirichlet transitions (epistemic uncertainty); MARCOS [115] conditional HMM with step-level latents, variational training; UniCog [116] latent variable model optimized via ELBO into a high-dimensional sparse space; LatentGuard [179] VAE semantic distributions for robust refusal (fact check: contradicted on Table 4's "Gemini2.5 Pro" backbone; the steered model is Qwen3-8B with LoRA + structured VAE on MLP activations, 52 semantic + 2000 residual dims, transfer to Mistral-7B; Gemini 2.5 Pro only generated training responses).
- **Alignment learning:** KVCA [38] shared latent manifold Σ via cross-attention to translate KV caches across heterogeneous models; C2C [48] MLP projection of KV caches by aligning terminal-layer representations (fact check: +6.4–14.2% over individual models, +3.1–5.4% over text communication, 2.5x latency speedup); Interlat [42] weighted Jensen-Shannon divergence for communication adapters; MCOUT [154] cross-modal attention fusion with an entropy-collapse penalty; MAS4TS [163] numeric trajectories from time-series plots; TCLA [144] noisy observations aligned to VLM-prompted latent action targets.

**Pitfall stated by the authors:** unconstrained optimization in continuous space risks manifold overfitting (memorizing supervision noise, losing zero-shot generalization); they call rigorous regularization essential: enforced structural sparsity, variance-preserving normalizations, controlled belief-shift tuning.

#### Hybrid (§4.2.4; 22 methods)

Same form as Eq. (13) (the TeX is identical), but Φ^comp is architecturally disjoint from Φ^back; c comes from x or auxiliary features; z is then used like External (conditioning for a typically frozen backbone, or a distillation target). Eq. (14):

$$ \mathbf{z}=\Phi^{\mathrm{comp}}(\mathbf{c};\,\theta) $$

- **Traces:** HCoT [122] thought token into a frozen decoder (fact check: at least 1.5x faster decoding); Assorted [181] VQ-VAE codebook mixing latent and text tokens; Latent-SFT [37] latent space restricted to the column space of the vocabulary matrix via induction-supervision masking; EBM-CoT [29] Langevin-dynamics calibration toward lower energy; GainRouter [288] codebook of discrete strategy priors; ThoughtComm [290] sparsity-regularized autoencoder between agents; LatentChem [259] molecular-language alignment; iCLP [25], RB-CoT [63] prompt-sensitive latent plans.
- **Grounding:** AURORA [11] VQ-VAE discrete visual codes; Monet [211] multi-stage distilled visual thoughts; UniVLA [14] task-centric latent actions from heterogeneous videos (fact check: confirmed, Prismatic-7B); LatBot [105] motion + scene tokens; Motus [10] optical-flow delta actions; UniLACT [51] depth-aware latent actions from RGB-D; VITA [136] unified codebooks.
- **Augmentation:** DCA [117] offline coprocessor appends latent embeddings to the KV cache (fact check: frozen decoder, both Gemma-2 2B); CLaRa [59] salient compressor trained on synthetic data, end-to-end retrieval space; DEP [157] SAE user patterns as soft prompts; VisMem [264], CoMEM [229] visual memory tokens; MemGen [273] episodic representations for self-evolving behavior.

Survey claim: Hybrid suits complex, multimodal or domain-specialized settings, giving semantic fidelity (grounded in the raw modality) and computational efficiency (backbone spared raw high-dimensional inputs at inference).

Author counts from Table 4 (Modality column): Internal 18 = text 13 / vision 5 / action 0; External 14 = 5 / 6 / 3; Learnable 15 = 12 / 2 / 1; Hybrid 22 = 13 / 4 / 5. Non-text share: External 64.3%, Hybrid 40.9%, Internal 27.8%, Learnable 20.0%.

Author crosswalk, 21 methods appear in both Table 3 and Table 4: Component → Hybrid 7 (AURORA, iCLP, RB-CoT, VITA, CoMEM, VisMem, MemGen), → Learnable 2 (CoLaR, CoLT), → External 1 (OccVLA); Auxiliary Model → External 7 (VL-JEPA, 3DThinker, OneLatent, CoVT, LCDrive, SkiLa, SoftCoT), → Hybrid 2 (UniVLA, HCoT), → Internal 1 (SIM-CoT), → Learnable 1 (CTRLS). The axes are orthogonal in practice; the survey does not spell out why most plug-in components count as Hybrid rather than Learnable.

Scope of this part: the survey's mechanism dimensions Computation (paper §4.3, Table 5, eqs. 15-19) and Optimization (paper §4.4, Table 6, eqs. 20-22). Notation follows the paper's Table 1: token space V (discrete vocabulary), latent space H (continuous R^d), parameter space W, data space D; x input, y output, r generation trajectory (in V), h hidden state of one token, H hidden states of a sequence, z latent representation (in H); Phi whole framework, Phi^back backbone, Phi^comp functional component, Phi^aux auxiliary model; theta parameters; R reward; L loss. Reference numbers [n] are the paper's bibliography (https://arxiv.org/html/2604.02029v2#bib.bib{n}).

### Computation (§4.3): what operation is performed in latent space

Motivation: move part of reasoning out of fixed-depth, token-by-token generation [297, 46] into latent computation that is more flexible, efficient and scalable. Four operation types; Table 5 lists 65 methods (author count: Compressed 12, Expanded 15, Adaptive 14, Interleaved 24; by modality text 45, vision 16, action 4; Adaptive is 14/14 text; Interleaved is 13 vision / 11 text).

**1. Compressed (§4.3.1), eq. (15).** Project an explicit trajectory r in V onto a dense latent z; the compression operator acts on intermediate hidden states h; Phi may be a functional component Phi^comp or the backbone Phi^back itself. Goal: cut autoregressive overhead while keeping enough semantics for faithful downstream decoding.

$$ \mathbf{z}=\Phi(\mathbf{h}),\quad\lvert\mathbf{z}\rvert\ll\lvert\mathbf{h}\rvert $$

- Traces compression (shorten the written chain): HCoT [122] hierarchical compression that skips redundant intermediate tokens; SoftCoT [243] projects reasoning into a continuous soft-token space, decoupling reasoning depth from trace length, zero-shot transfer without task-specific retraining; CCoT [31] variable-length latent allocation (short for easy inferences, richer for complex ones); CODI [174] self-distillation; CoLaR [188] dynamic token-level compaction.
- States compression (shrink the KV cache, which grows linearly with sequence length): KaVa [91] KV-cache compression as knowledge distillation (student matches the output distribution of a teacher using the full cache); SALS [139] training-free projection of the cache onto a low-rank principal subspace (dominant directions keep attention patterns with bounded error); DeltaKV [57] stores semantically compressed residuals between highly correlated caches of successive steps, strongest on multi-step reasoning.
- Features compression (visual/action features in perception-action loops: driving, manipulation, navigation): RoT [216] renders intermediate reasoning as low-resolution image patches; OneLatent [133] one latent visual token, competitive with a drastically reduced visual token budget; LatentVLA [235] compact action latents for real-time closed-loop planning; Future-VLA [44] future-conditioned latents without increasing dimensionality.
- Verified extras (fact-check): HCoT decodes at least 1.5x faster (P03); CODI uses one model as teacher and student, 3.1x compression, +28.2% over the prior best implicit method on GSM8k (P13); SoftCoT assistant LLaMA-3.2-1B-Instruct with frozen LLaMA-3.1-8B-Instruct backbone (P07).

**2. Expanded (§4.3.2), eq. (16).** Iterate over T steps (depth) and K parallel trajectories (width); h_t^(k) is the k-th latent trajectory at step t; all K paths share initialization h^(0). Trades extra latent compute for ability, faithfulness and adaptability without proportional parameter growth.

$$ \mathbf{h}_{t+1}^{(k)}=\Phi\!\left(\bigl\{\mathbf{h}_{t}^{(k)}\bigr\}_{k=1}^{K}\right),\quad t=1,\ldots,T,\;\;k=1,\ldots,K $$

- Depth expansion: Huginn [50] recurrent-depth model trained from scratch, a fixed block applied a variable number of thinking steps (decouples parameter count from inference compute; test-time scaling without new parameters); RD-VLA [198] recurrent latent refinement for long-horizon manipulation; Loop [167] looping the full decoder stack yields multi-step reasoning; LoopFormer [72] input-adaptive looping; Ouro [296] favorable scaling along the looping dimension (faithfulness, efficiency); ETD [87] encode-think-decode, iterative latent refinement, zero-shot arithmetic/commonsense gains without CoT supervision.
- Width expansion: SoftCoT++ [244] parallel paths in continuous embedding space aggregated before decoding, zero-shot gains growing monotonically with path count, no path-specific supervision; LatentTTS [262] concurrent latent tree search pruned by a learned value function; PCCoT [224] parallel latent chains that exchange information at synchronization points; CoT2 [52] parallel sampling in continuous thought space helps even GPT2-scale models on compositional tasks; Bubbles [113] parallel "bubbles" with pooled representations (zero-shot, unsupervised); PLR [193] parallel latent reasoning for sequential recommendation (captures preference uncertainty).
- Structural expansion: Latent-SFT [37] supervision on superposed latent chains instead of token realizations; Laser [218] fuses multi-scale visual features into one latent; ColaVLA [152] parallel interacting semantic-reasoning and motor-planning streams linked by cross-attention across temporal scales.
- Caveat (fact-check P10): the looped-transformer paper [167] proves simulation results (a looped model matches an L-layer non-looped model; simulates m CoT steps with L + O(1) layers); no strict separation was found. Huginn verified: hidden 5280, 8 unique layers (2+4+2), 3.5B, 800B tokens (P06).

**3. Adaptive (§4.3.3), eqs. (17)-(18).** Same update as Expanded, but T and K are conditioned on the input x instead of fixed hyperparameters; a learned halting function chooses them (at token-boundary granularity or from the current hidden state); the halting function may be an explicit component or internalized.

$$ \mathbf{h}_{t+1}^{(k)}=\Phi\!\left(\bigl\{\mathbf{h}_{t}^{(k)}\bigr\}_{k=1}^{K}\right) $$

$$ (T,\,K)=\mathcal{T}(\mathbf{h}_{t};\,\mathbf{x}) $$

- Depth/width adaptation: TaH [49] exits early on easy tokens, extra refinement on hard ones; LWS [146] halting as a learned policy, auxiliary stopping variable optimized jointly with the LM objective; PLaT [207] learns when to stop generating latent tokens; Dreamer [86], SpiralFormer [263] weight-tied recurrent transformers; I2B-LPO [36] expands branching under high uncertainty and collapses it when confident (most impactful on long-horizon tasks).
- Semantic adaptation: AL-CoT more refinement steps for difficult tokens; PonderLM-3 [97], AdaPonderLM [180] per-token learned depth/halting; DLCM [158] adapts at the level of multi-token concepts.
- Control adaptation: System-1.5 [214] shortcuts that bypass intermediate blocks by estimated difficulty; FR-Ponder [62] instance-adaptive activation steering through subspaces chosen from early-layer features; RISER [257] composes latent reasoning skills as steering directions, zero-shot, no gradient updates; PRE [125] selective extraction of intermediate-layer representations beats final-layer outputs.
- Corrections: TaH is "Think-at-Hard", not "think-and-halt"; it skips iteration on 93% of tokens and beats always-iterate baselines by 3.8-4.4% (P31). AL-CoT is cited as [267] in §4.3.3 and Table 5, but [267] is PonderLM-2; AL-CoT is [268] (as Table 6 has it).

**4. Interleaved (§4.3.4), eq. (19).** A heterogeneous trajectory alternating discrete tokens r_i in V with continuous latents z_j in H (M text pieces, N latents).

$$ \mathbf{r}=\bigl[r_{1},\,z_{1},\,r_{2},\,z_{2},\,\ldots,\,r_{M},\,z_{N}\bigr],\quad r_{i}\in\mathcal{V},\;\;z_{j}\in\mathcal{H} $$

- Explicit-latent interleaving: Assorted [181] replaces selected verbal CoT steps with latent activations, same accuracy, far fewer tokens (VQ-VAE latent tokens randomly mixed with text, P12); fixed/curriculum schemes SpiralThinker [155], LiteReason [55]; adaptive boundary SwiReasoning [175] (RL step-level switching), LT-Tuning [123] (latent-thought positions in instruction tuning), ThinkRouter [241] (system-level routing to reasoning depths).
- Modality interleaving (latents are a representational requirement for non-text content): AURORA [11]; Mirage [251], LVR [95], VisMem [264], Monet [211] interleave vision latents without textual scene descriptions; IVT-LR [20] text-vision cross-attention; SkiLa [197], LS [276], MM-CoT [171] visual latent sketchpad; 3DThinker [28] spatial latents; DMLR [111], ILVR [39] sparse interleaving keeps grounding at lower cost.
- Task interleaving (stream carries task-specific structured signals): LCR-SER [177] compressed history buffer; MemGen [273], VisMem [264], FlashMem [65] persistent working memory via generated memory tokens; CLaRa [59] jointly trained latent retrieval and generation; LatentMem [47] shared latent memory across agents; L2-VMAS [265] alternating perception and planning streams across agents.

### Optimization (§4.4): what is optimized, with which supervision, for which objective

Three stages differ in the optimized variable: pre- and post-training optimize parameters theta in W (or a subset); inference mostly freezes parameters (sometimes still trains them) and optimizes an inference-time state (z in H or r in V). Methods are classified by supervision (what supplies the learning signal) and objective (the purpose of each loss term). Table 6 lists 68 methods (author count: pre-training 13, post-training 38, inference 17). Abbreviations: Recon. reconstruction, CE cross-entropy, InfoNCE information noise-contrastive estimation, KL Kullback-Leibler divergence, MSE mean squared error, CL contrastive learning.

Supervision usage in Table 6 (author count; one method can list several; "self reward" merged with "self-reward"):

| Signal | Pre-training | Post-training | Inference | Total |
|---|---|---|---|---|
| CE | 8 | 21 | 0 | 29 |
| task loss | 6 | 15 | 4 | 25 |
| reward | 2 | 17 | 3 | 22 |
| KL | 2 | 12 | 4 | 18 |
| self-reward | 0 | 3 | 8 | 11 |
| Recon. | 3 | 3 | 1 | 7 |
| regularization | 1 | 6 | 0 | 7 |
| MSE | 2 | 4 | 0 | 6 |
| CL | 0 | 1 | 4 | 5 |
| InfoNCE | 1 | 1 | 0 | 2 |
| joint CE | 1 | 0 | 0 | 1 |

**Pre-training (§4.4.1), eq. (20).** z is trained jointly with the base model from scratch on large-scale data D; theta in Phi, a subset of W (the paper overloads Phi here as the trainable set; Table 1 defines Phi as the whole framework); L trains the system end-to-end. Supervision is mostly simple and scalable (no human annotation); optional auxiliary losses regularize the latent space.

$$ \theta^{\star}=\arg\min_{\theta\in\Phi}\mathbb{E}_{(\mathbf{x},\mathbf{y})\sim\mathcal{D}}\left[\mathcal{L}(\mathbf{x},\mathbf{y},\mathbf{z};\Phi_{\theta})\right] $$

- Autoregressive supervision (reasoning as a by-product of next-token prediction or looping, no matching of intermediate states): PonderLM-2 [267] Jacobi-iteration parallel training of recursive latent thoughts without strict causal blocking (joint CE); Looped Trans. [167] looped layers, CE + regularization; Ouro [296] looped LMs up to 2.6B with an entropy-regularized objective (CE/KL/task loss); PHD-Trans. [223] dynamic exploration of continuous states (CE); AL-CoT [268] continuous state prediction for stability (CE/task loss).
- Auxiliary supervision (shape latent geometry): CoCoMix [186] CE + reconstruction over continuous concepts; LARES [112] InfoNCE + CE (+reward) for sequential recommendation; LAPA [255] VQ-VAE latent actions from unannotated video; CLAP [272] contrastive alignment of video latents with proprioceptive actions; JALA [131] predictive action embeddings aligned with inverse dynamics and sparse actions, no full visual reconstruction; CARE [176] MSE + task loss multi-task prediction; ConceptLM [126] CE + MSE.
- Reinforcement pre-training: LoopRPT [190] next-token prediction reframed as reasoning via noisy latent rollouts (reward/KL/task loss), compressing effective reasoning into fewer iterations.
- Verified extras (P19): Ouro hidden size 2048, 24 layers (1.4B) / 48 layers (2.6B), total_ut_steps 4, 7.7T training tokens.

**Post-training (§4.4.2), eq. (21).** Fine-tune a pre-trained model; smaller data allows richer augmentation and specialized losses; extra signals often supervise the latent variable directly. The form subsumes SFT, preference optimization and RL-based alignment; beta weights the expected reward of self-generated trajectories (beta = 0 reduces to supervised fine-tuning).

$$ \theta^{\star}=\arg\min_{\theta\in\mathcal{W}}\mathbb{E}_{(\mathbf{x},\mathbf{y})\sim\mathcal{D}}\left[\mathcal{L}(\mathbf{x},\mathbf{y},\mathbf{z};\Phi_{\theta})\right]-\beta\,\mathbb{E}_{\mathbf{r}\sim\Phi_{\theta}(\cdot\mid\mathbf{x})}\left[R(\mathbf{x},\mathbf{r},\mathbf{z})\right] $$

- Explicit supervision fine-tuning (loss only on the final human-readable output, no step targets for latents): LATPC [260] task loss for jailbreak robustness; GainRouter [288] feature routing; GeoSteer [84] steering on a learned latent manifold; PILOT [289] CE + regularization; TS [2] CE.
- Implicit supervision fine-tuning (gold targets for latents): distillation SPOT [32] (anchor latent tokens to teacher spans), SemCoT [61], Latent-SFT [37] (vocabulary-space superpositions, KL + CE); contrastive LTA-Thinker [206], EPR-Latent [215], ReaRec [192], EBM-CoT [29]; reconstruction LaViT [227] (next tokens + visual features), RoT [216] (CoT rendered as images, MSE + CE), BNPO [102], plus Mirage [251], 3DThinker [28], VisMem [264], Monet [211], CogSense [96].
- Reinforcement learning (also said to mitigate geometric drift): self-reward LaTRO [22] (variational sampling with the model's own probabilities), I2B-LPO [36] (iterative information bottleneck), MemGen [273]; regularizers SofT-GRPO [291] (Gumbel reparameterization for GRPO), GANPO [76] (adversarial regularizer), DLR [170] (contrastive stability + reward); HRPO [266] learnable gate mixing hidden states into tokens; reward-driven CoLaR [188], LWS [146], LatentR3 [282], Reason-IAD [24]; KL penalties to a reference policy LARES [112], RL-Latent [149], SCM [208], ATP-Latent [292]; ReLaX [280] strict reward regularization against premature convergence; RLTT [222] rewards distributed over the whole trajectory.
- Naming pitfall: the subsection names say "explicit" = output-level loss and "implicit" = gold latent targets, but the paper's own summary uses the words the other way round. Go by the descriptions.
- Verified extras: SofT-GRPO +0.13% Pass@1 and +2.19% Pass@32 over discrete-token GRPO on 1.5B-7B models (P20); HRPO gate confirmed (P15).

**Inference (§4.4.3), eq. (22).** Weights usually frozen (may be trained); the latent state is optimized at test time and the output is generated from the optimized state; Omega is the feasible region, J the inference-time objective. The paper names the optimized variable omega but writes the result as z*; read omega as the quantity moved to obtain z (or r).

$$ \mathbf{z}^{\star}=\arg\min_{\omega\in\Omega}\mathcal{J}\!\left(\mathbf{z};\mathbf{x},\Phi_{\theta}\right) $$

- Scaling (sample candidates, select by reward): LTO [41] continuous-space classifier as latent reward model; TGR [298] manifold-informed latent foresight search; GTS [209] Gaussian Thought Sampler for context-dependent perturbations; LatentSeek [98] self-reward sampling, alleviates catastrophic forgetting; SR [295]; LatentPrompt [17] prompt optimization via intrinsic self-rewards; ITR [88] KL + task loss; DMLR [111].
- Tuning (gradient steps on latents or policy during the forward pass): LTPO [258] online policy gradient with a confidence-based intrinsic reward; nabla-Reasoner [210] gradient descent over token logits in the decoding loop; LatentEvolve [274] self-reward + reconstruction on experiential memory states.
- Guidance (constraints, contrast, sparse interventions; mostly hallucination): REVIS [225] sparse activation steering with pure visual information vectors; STIR [178] value-modulated trajectory intervention with anchor-based gating; SoftCoT++ [244] contrastive diversity of soft thoughts; VTI [120]; L2V-CoT [270]; Control++ [228].

Pitfalls stated or checked:
- Table 6 Looped Trans. "decoder-only-1.5B": the source says 1B in the main text and 1.5B in Appendix A.2 (24 layers, 32 heads, d_model 2048; 5120 is the FFN width) (P11).
- LAPA is dated 10/24 in Table 6 (correct), but §3.3 places it in the Aug-Nov 2025 stage and cites it as [256] (P23).
- MemGen: Qwen3-8B and the LoRA trigger confirmed; SmolLM3-3B not seen in the text read (P18).

## Quick Reference

| item | value | note |
|---|---|---|
| arXiv id | 2604.02029v2 | v1 2026-04-02, v2 2026-06-05 |
| authors | 39 from 19 institutions | 9 core contributors (Xinlei Yu organizer), 6 core supervisors |
| repository | github.com/YU-deep/Awesome-Latent-Space | resource list for the community |
| structure | 5 perspectives (§2-§6) + conclusion (§7) | Foundation, Evolution, Mechanism, Ability, Outlook |
| taxonomy | 4 mechanisms x 7 abilities | Figure 1 grid |
| mechanism sub-types | Architecture 3, Representation 4, Computation 4, Optimization 3 | 14 in total (our count) |
| ability sub-abilities | 5, 4, 4, 3, 3, 3, 5 | 27 in total (our count from Figure 8) |
| explicit-space limits | 4 | redundancy, discretization bottleneck, sequential decoding cost, semantic loss |
| evolution stages | 4 | Prototype (before - Mar 2025), Formation (Apr - Jul 2025), Expansion (Aug - Nov 2025), Outbreak (Dec 2025 - present) |
| tables | 6 | Table 1 notation; Tables 2-6 method comparisons |
| method rows in Tables 2-6 | 11, 72, 69, 65, 68 (285 in total) | our count, header and group rows excluded; methods repeat across tables |
| display equations | 22 | all in §4 |
| figures | 8 | 1 taxonomy grid, 2 outline, 3 explicit vs latent, 4 timeline, 5-7 mechanisms, 8 abilities |
| bibliography | 302 entries | in-page links use https://arxiv.org/html/2604.02029v2#bib.bib{n} |
| challenges | 3 | evaluability, controllability, interpretability |
| future directions | 4 | Theory, Multimodal, Downstream Task, Governable |

## Comparisons

| Axis | Option A | Option B | Choose by |
|---|---|---|---|
| Compute shape | Expanded: fixed T, K for every input | Adaptive: halting function picks (T, K) per input from h_t and x | Fixed budget and simple training vs. saving compute on easy tokens/inputs |
| Trace form | Compressed: shorter latent replaces the trace | Interleaved: keep some text steps, run others in latent | Pure efficiency vs. keeping human-checkable checkpoints or non-text modalities |
| Optimized variable | Pre/post-training: parameters theta | Inference: latent z (weights frozen) | Whether retraining is possible; inference methods add per-query cost but no training run |
| Post-training signal | Output-level loss only (paper's "explicit") | Gold latent targets via distillation, contrast, reconstruction (paper's "implicit") | Availability of a teacher/targets for latents; multimodal alignment favors reconstruction |
| Post-training RL | Self-reward (no annotation) | External reward + KL to a reference policy | Annotation budget vs. stability against drift |

Scenario verdicts (author, criteria-based): low-latency serving of long reasoning → Compressed (states compression for KV memory, traces compression for decode length); heterogeneous difficulty → Adaptive; visual/embodied reasoning → Interleaved modality latents (13 of 24 interleaved methods are vision); no training budget → inference-time scaling/tuning/guidance.

## Fact Check

31 claims checked against the cited primary papers (arXiv abstract/HTML, Hugging Face model cards). Result: confirmed 24 · partly 5 · not found 1 · contradicted 1.

| id | § | claim | verdict | detail | source |
|---|---|---|---|---|---|
| P01 | 3.1 | COCONUT is the first complete continuous-latent reasoning framework; last hidden state fed back; emergent BFS | confirmed | Mechanism and BFS match (9 Dec 2024); COCONUT calls itself a new paradigm, not "first" | https://arxiv.org/abs/2412.06769 |
| P02 | Table 4 | COCONUT 12/24, GPT2-0.1B, last hidden state | confirmed | Pre-trained GPT-2 base for all experiments | https://arxiv.org/html/2412.06769 |
| P03 | 3.1 | HCoT compresses a full CoT into special tokens via contrastive alignment | confirmed | Auxiliary CoT model with contrastive loss; at least 1.5x faster decoding (13 Sep 2024) | https://arxiv.org/abs/2409.08561 |
| P04 | 3.1 / Table 4 | Chain-of-Embedding: self-evaluation via latent embeddings; 10/24; LLaMA2-7B + 6 | confirmed | Output-free, training-free, label-free; 4 domains, 7 LLMs (17 Oct 2024); ICLR 2025 | https://arxiv.org/abs/2410.13640 |
| P05 | 3.1 / Table 4 | Liu et al. augment the KV cache via an offline coprocessor, decoder frozen; 12/24; Gemma2-2B | confirmed | Frozen decoder; coprocessor from same weights trained on LM loss; both Gemma-2 2B | https://arxiv.org/abs/2412.17747 |
| P06 | 3.1 / Table 2 | Huginn 02/25: recurrent depth, no specialized data; dim 5280, 8 layers, 3.5B | confirmed | h = 5280, (2, 4, 2) layers, 3.5B, 800B tokens (7 Feb 2025) | https://arxiv.org/html/2502.05171 ; https://huggingface.co/tomg-group-umd/huginn-0125 |
| P07 | 3.1 / Table 4 | SoftCoT is the first plug-in approach; frozen backbone LLaMA3.1-8B; 02/25 | confirmed | Assistant LLaMA-3.2-1B-Instruct, backbone LLaMA-3.1-8B-Instruct (also Qwen2.5-7B), ACL 2025; its own "first" is "first lightweight ... preserving prior knowledge", not "plug-in" | https://arxiv.org/abs/2502.12134 |
| P08 | 3.2 | Zhu et al. give the first formal complexity analysis of superposition | partly | Result correct: 2-layer transformer solves graph reachability in D continuous steps vs O(n^2) for discrete CoT; the paper does not claim "first" | https://arxiv.org/abs/2505.12514 |
| P09 | 3.2 | CoT2 links parallelism to embedding dimension; continuous supervision + RL | confirmed | Optimal parallelism governed by embedding dimension (29 May 2025; ICLR 2026) | https://arxiv.org/abs/2505.23648 |
| P10 | 3.2, 5.3 | Saunshi et al. prove looped transformers are strictly more expressive than standard transformers | not found | Theorems are simulation results (Thm 5.2: matches an L-layer model; Thm 5.4: m CoT steps with L + O(1) layers, extra width and heads); no strict separation | https://arxiv.org/pdf/2502.17416 |
| P11 | Table 2 | Looped Trans. 02/25: dim 5120, 24 layers, 1.5B | partly | Model dim 2048 (5120 is the FFN hidden dim); size 1B in main text, 1.5B in Appendix A.2 | https://arxiv.org/pdf/2502.17416 |
| P12 | 3.2 / 4.2.4 | Token Assorted mixes latent discrete (VQ-VAE) and text tokens for shorter, better traces | confirmed | Random mixing; abstract gives no single reduction figure (5 Feb 2025) | https://arxiv.org/abs/2502.03275 |
| P13 | 3.2 / Table 4 | CODI self-distillation, same model teacher and student; GPT2-0.1B / LLaMA3.2-1B | confirmed | 3.1x compression, +28.2% on GSM8k over prior best implicit method; EMNLP 2025 | https://arxiv.org/html/2502.21074 |
| P14 | 3.2 | BoLT treats web text as compressed thought, bootstraps data-efficient pretraining | confirmed | EM bootstrapping for data-constrained continued pretraining; name not in abstract (24 Mar 2025) | https://arxiv.org/abs/2503.18866 |
| P15 | 3.2 / 4.4.2 | HRPO: latent RL with a learnable gate mixing hidden states and tokens | confirmed | Submitted 24 May 2025 | https://arxiv.org/abs/2505.18454 |
| P16 | 3.2 | Mirage recasts hidden states as latent visual tokens interleaved with text | confirmed | No image generation; distillation, then text-only supervision, then RL (20 Jun 2025) | https://arxiv.org/abs/2506.17218 |
| P17 | 3.2 / Table 4 | UniVLA task-centric latent actions from internet video; Prismatic-7B; 05/25 | confirmed | Latent action model in DINO feature space (9 May 2025) | https://arxiv.org/html/2505.06111 |
| P18 | 3.3 / 4.1.2 | MemGen: planning, procedural, working memory emerge; LoRA trigger; SmolLM3-3B / Qwen3-8B | confirmed | LoRA adapter trigger, Qwen3-8B used; SmolLM3-3B not seen in the text read (29 Sep 2025) | https://arxiv.org/abs/2509.24704 |
| P19 | Table 2 / 4.4.1 | Ouro 10/25: dim 2048, 24/48 layers, 1.4B/2.6B; entropy-regularized objective | confirmed | hidden_size 2048, total_ut_steps 4, 7.7T tokens (29 Oct 2025) | https://arxiv.org/abs/2510.25741 |
| P20 | 3.3 | SofT-GRPO: Gumbel-reparameterized RL for continuous latent reasoning | confirmed | +0.13% Pass@1, +2.19% Pass@32 over discrete GRPO, 1.5B-7B (9 Nov 2025) | https://arxiv.org/abs/2511.06411 |
| P21 | 3.3 | C2C: direct LLM-to-LLM communication via KV-cache projection and fusion | confirmed | +6.4-14.2% vs single models, +3.1-5.4% vs text communication, 2.5x speedup (3 Oct 2025) | https://arxiv.org/abs/2510.03215 |
| P22 | 3.3 / Table 4 | LatentMAS: shared latent working memory, fewer tokens, higher accuracy; Qwen3-4B/8B/14B | confirmed | Training-free; up to +14.6% accuracy, 70.8-83.7% fewer tokens, 4-4.3x faster; also two Llama-3 models (25 Nov 2025) | https://arxiv.org/abs/2511.20639 |
| P23 | 3.3 | LAPA [256] and LAWM [196] pioneer latent action pretraining in the Expansion stage (Aug-Nov 2025) | partly | Method correct, but LAPA was submitted 15 Oct 2024 (ICLR 2025); the survey's Table 6 dates it 10/24 as [255] | https://arxiv.org/abs/2410.11758 |
| P24 | 3.3 / 5.7 | SRPO: near-complete mastery within 200 RL steps from a sparse-reward baseline | confirmed | 48.9% -> 99.2% after 200 steps (+103% relative); 48.9% is the supervised baseline (19 Nov 2025) | https://arxiv.org/abs/2511.15605 |
| P25 | 3.4 / Table 4 | VL-JEPA 12/25: LLaMA3.2-1B, pretrained text embedding, classification/retrieval | confirmed | Predictor from last 8 layers of Llama-3.2-1B (490M trainable), V-JEPA 2 ViT-L, EmbeddingGemma-300M, 1.6B total (11 Dec 2025) | https://arxiv.org/html/2512.10942 |
| P26 | 5.7 | VLA-JEPA: leakage-free prediction of future-frame target latents, robust to camera motion | confirmed | Future frames used only as targets, never as input; robustness is the paper's own claim (10 Feb 2026) | https://arxiv.org/abs/2602.10098 |
| P27 | Table 2 / 4.1.1 | Heima 01/25: dim 4096, 72 layers, 19B | confirmed | Encoder LLaVA-CoT (Llama-3.2-11B-Vision) + decoder Llama-3.1-8B = 19B; §4.1.1 cites Heima as [223] (another paper), the table as [173] | https://arxiv.org/html/2501.19201v1 |
| P28 | Table 2 | MLRA 03/26: multi-head low-rank attention, 4-way TP decoding | confirmed | 2.8x decoding speedup over MLA; dim 3072, 24 layers, 2.9B not visible on the abstract page | https://arxiv.org/abs/2603.02188 |
| P29 | Table 4 | Soft Thinking 05/25: LLaMA3.1-8B + 3, weighted embedding | partly | Method and date correct (up to +2.48 pass@1, up to 22.4% fewer tokens); evaluated on QwQ-32B and two DeepSeek-R1 distills, not LLaMA-3.1-8B | https://arxiv.org/html/2505.15778 |
| P30 | Table 4 | LatentGuard 09/25: backbone Gemini2.5 Pro | contradicted | Steered model is Qwen3-8B (LoRA + structured VAE, 52 semantic + 2000 residual dims), transfer to Mistral-7B; Gemini only generated training responses | https://arxiv.org/abs/2509.19839 |
| P31 | 4.3.3 | TaH is a "think-and-halt" mechanism | partly | TaH is "Think-at-Hard": iterates only on hard tokens, skips 93% of tokens, +3.8-4.4% over always-iterate baselines | https://arxiv.org/abs/2511.08577 |

### Ability notes (s8-s9)

- §5 frames the seven abilities as facets of intelligence that latent representations empower, from internal logical deduction to physical interaction.
- Reasoning: deduction through continuous states instead of token-by-token verbalization [58, 294]. Implicit Inference (reasoning already encoded in activations [122, 277, 22, 99, 217]; COCONUT superposition and BFS [58]); Compact Trace (long traces absorbed into compact states with modest overhead [31, 174, 220, 61, 215, 173, 288]); Continuous Refinement (soft tokens [287, 243, 208], diffusion [83], Markov dynamics [115], energy-based consistency [29], vocabulary-space superposition [37, 52]); Branching Path (parallel latent reasoning [244, 113, 262, 224], hybrid latent-explicit [155, 181, 175, 241], dual-system [33]); Modal Generalization (modality-agnostic thought [154, 160], cross-modal transfer [270, 171, 216, 133], domains such as chemistry [3]). Inconsistency: the text says "six abilities" but lists five (Figure 8 also shows five).
- Planning: prospective organization of computation: where to allocate, how to explore, when to stop [207, 240]. Controllable Exploration (RL on continuous thoughts [41, 266, 291, 258]; stability via [36, 149, 170]); Efficient Search ([280, 189, 295]; geometry-guided [98, 298, 178]); Adaptive Budget ([62, 146, 207, 292]); Sequential Decision (recommendation, retrieval, tool use [188, 112, 282, 193, 54, 271, 177, 204]; [226, 25, 293, 289, 102, 269]). The intro calls the second item "Search Efficiency", the heading "Efficient Search".
- Modeling: what latents let us understand and control. Rich Expression ([294, 239]; monitorability trade-off [89]; limits [301, 166]); Self Inspection (validity probing [285, 107], visualization [23, 145, 116], information flow [125, 195]); Robust Control (attacks [237, 140], defenses [179, 260, 250, 101], training-phase safety [76, 191, 6]); Scalable Computation (looped/recurrent [167, 50, 296, 87, 1], adaptive depth [49, 214, 97, 180]). The "strictly more complex" claim for [167] is not supported by that paper (P10).
- Perception: converting images into text tokens discards spatial structure, fine detail and relational geometry [11, 95]. Multimodal Inference ([95, 211]; [183, 39, 100, 218, 21]); Heuristic Imagination ([251, 28]; sketchpads [276, 197, 156]); Faithful Grounding (hallucination mitigation [120, 137], grounding tokens [11], diagnostics [9, 90, 253, 246], anomaly detection [24, 18]).
- Memory: token memory inflates prompts, degrades retrieval and blocks gradient-based consolidation. Working Retention (cache injection and compression [117, 223, 139, 57], intrinsic consolidation [65]); Persistent Mind (gated and generative stores [242, 273, 286], self-evolving and retrieval-unified [274, 59], multi-agent [47]); Multimodal Recall (fixed-length visual memory with frozen backbones [229, 230], scaling monotonically with memory depth; perceptual vs semantic modules [264]).
- Collaboration: language between agents discards nuance, adds latency and breaks gradients [300, 48]. Semantic Fidelity (KV-cache / hidden-state transfer [48, 42, 300]; shared latent space without changing pre-trained parameters [38]); Shared Cognition (identifiable shared vs private thought [290, 265, 47]; strategy evolution [194]); Heterogeneous Interoperability (Agent Primitives [79]; visual latent frameworks [265, 124], training-free cross-family collaboration).
- Embodiment: data bottleneck across hardware, viewpoints and environments [114, 142, 14]. Unsupervised Grounding (latent actions from unlabeled video [255, 14, 196]; latent-space quality over labeled-data quantity); Implicit Thinking ([69, 70], curriculum [5], recurrent refinement [198]); Predictive Foresight (VLA-JEPA [184], world-model progress rewards [45], joint foresight and action [69, 44]); Spatial Cognition (geometry distillation [53, 51, 142], 3D occupancy [118], [19, 74]); Generalized Transfer (body-agnostic latent action spaces [281, 176, 77], [106], [213], navigation [182]).
- Our reading notes: two sentences (§5.5 "latent space imposes a structural memory barrier", §5.7 "action in latent space ... severing") contradict their own paragraphs and most likely mean token-based memory and symbolic action. §5.7 uses strong wording ("strictly more expressive", "necessary foundation") without numbers or proofs in that section.

## Open Questions & Extension Ideas

From the survey's Outlook (§6):
- Evaluability: latent trajectories cannot be inspected directly; evaluation relies on final-answer accuracy or post hoc verbalization [285, 99]; benchmarking strategies exist [56] but no standard for faithfulness, robustness or internal consistency [301, 166].
- Controllability: interventions can be precise but are unreliable; the open problem is specifying high-level intent so it is machine-actionable, precise and human-intelligible [147, 299, 165], and mapping goals, safety requirements and resource budgets onto internal computation.
- Interpretability: latents are high-dimensional, distributed and entangled [299, 201, 252]; hard to trace transformations or locate where errors first arise [301, 9, 166, 103]; the paper frames this as an institutional problem (auditability, accountability).
- Theory [58]: when and why latent beats explicit computation (operable, expressive, scalable, generalizable); formal accounts started [56, 294, 252], systematic theory missing [239, 285, 301, 107, 166]; explicit and latent as complementary regimes [297, 143, 239, 301]; a theory of trustworthy latent space.
- Multimodal: from text-mediated multimodality [261, 7, 114] to modality-native latent computation; from isolated multimodal models to integrated systems [135, 95, 100, 264] coordinated through a shared latent substrate.
- Downstream tasks most likely to benefit: search-intensive reasoning [297, 58, 99], sequential planning [56, 252], visual perception [261], long-horizon memory [68], multi-agent coordination [60], embodied control [114]; systems are expected to externalize only final outputs or selected checkpoints.
- Governable latent space: benchmark suites for faithfulness/robustness, process-level supervision, controllable latent interfaces (goals, budgets, safety), explanation frameworks (semantic structure, causal pathways, failure sources).

Extension ideas (author):
- Report compute per token alongside accuracy for Adaptive methods, since their claim is budget allocation; Table 5 Adaptive methods are all text-only, so a vision/action adaptive halting study is an open slot.
- Pair any inference-time latent optimizer (eq. 22) with a process-level faithfulness probe, so gains are not only final-answer gains.
- Interleaved trajectories (eq. 19) give natural checkpoints r_i; evaluate whether the visible r_i are faithful to the latent z_j between them.
- Fix the bibliography inconsistencies before citing the survey's tables (AL-CoT [267] vs [268], TaH name, LAPA date in §3.3).

## Tags & Triggers

tags: latent space, latent reasoning, continuous thought, looped transformer, recurrent depth, adaptive computation, interleaved reasoning, KV cache compression, latent optimization, test-time optimization, reinforcement learning, survey
- How many kinds of latent-space computation are there, and how do Compressed and Expanded differ?
- How does adaptive computation choose the number of latent iterations per input?
- How do interleaved text/latent trajectories help vision and memory tasks?
- What is optimized in pre-training vs post-training vs inference for latent reasoning?
- How can a latent be optimized at test time without retraining the model?
- Why is latent reasoning hard to evaluate, control and interpret?
- What research directions does the latent-space survey propose?

## References

- Xinlei Yu et al. (39 authors), "The Latent Space: Foundation, Evolution, Mechanism, Ability, and Outlook", arXiv 2604.02029v2 (v1 2026-04-02, v2 2026-06-05): https://arxiv.org/abs/2604.02029v2
- Paper bibliography (302 entries; [n] links): https://arxiv.org/html/2604.02029v2#bib
- Training Large Language Models to Reason in a Continuous Latent Space (fact-check P01): https://arxiv.org/abs/2412.06769
- Training LLMs to Reason in a Continuous Latent Space (HTML) (fact-check P02): https://arxiv.org/html/2412.06769
- Expediting and Elevating LLM Reasoning via Hidden Chain-of-Thought Decoding (fact-check P03): https://arxiv.org/abs/2409.08561
- Latent Space Chain-of-Embedding Enables Output-free LLM Self-Evaluation (fact-check P04): https://arxiv.org/abs/2410.13640
- Deliberation in Latent Space via Differentiable Cache Augmentation (fact-check P05): https://arxiv.org/abs/2412.17747
- Scaling up Test-Time Compute with Latent Reasoning: A Recurrent Depth Approach (fact-check P06): https://arxiv.org/html/2502.05171
- Scaling up Test-Time Compute with Latent Reasoning: A Recurrent Depth Approach (model card / config) (fact-check P06): https://huggingface.co/tomg-group-umd/huginn-0125
- SoftCoT: Soft Chain-of-Thought for Efficient Reasoning with LLMs (fact-check P07): https://arxiv.org/abs/2502.12134
- Reasoning by Superposition: A Theoretical Perspective on Chain of Continuous Thought (fact-check P08): https://arxiv.org/abs/2505.12514
- Continuous Chain of Thought Enables Parallel Exploration and Reasoning (fact-check P09): https://arxiv.org/abs/2505.23648
- Reasoning with Latent Thoughts: On the Power of Looped Transformers (fact-check P10): https://arxiv.org/pdf/2502.17416
- Token Assorted: Mixing Latent and Text Tokens for Improved Language Model Reasoning (fact-check P12): https://arxiv.org/abs/2502.03275
- CODI: Compressing Chain-of-Thought into Continuous Space via Self-Distillation (fact-check P13): https://arxiv.org/html/2502.21074
- CODI: Compressing Chain-of-Thought into Continuous Space via Self-Distillation (ACL Anthology) (fact-check P13): https://preview.aclanthology.org/credits/2025.emnlp-main.36
- Reasoning to Learn from Latent Thoughts (fact-check P14): https://arxiv.org/abs/2503.18866
- Hybrid Latent Reasoning via Reinforcement Learning (fact-check P15): https://arxiv.org/abs/2505.18454
- Machine Mental Imagery: Empower Multimodal Reasoning with Latent Visual Tokens (fact-check P16): https://arxiv.org/abs/2506.17218
- UniVLA: Learning to Act Anywhere with Task-centric Latent Actions (fact-check P17): https://arxiv.org/html/2505.06111
- MemGen: Weaving Generative Latent Memory for Self-Evolving Agents (fact-check P18): https://arxiv.org/abs/2509.24704
- Scaling Latent Reasoning via Looped Language Models (fact-check P19): https://arxiv.org/abs/2510.25741
- Scaling Latent Reasoning via Looped Language Models (model card / config) (fact-check P19): https://huggingface.co/ByteDance/Ouro-2.6B/blob/main/config.json
- Scaling Latent Reasoning via Looped Language Models (model card / config) (fact-check P19): https://huggingface.co/ByteDance/Ouro-1.4B/blob/main/config.json
- SofT-GRPO: Surpassing Discrete-Token LLM RL via Gumbel-Reparameterized Soft-Thinking Policy Optimization (fact-check P20): https://arxiv.org/abs/2511.06411
- Cache-to-Cache: Direct Semantic Communication Between Large Language Models (fact-check P21): https://arxiv.org/abs/2510.03215
- Latent Collaboration in Multi-Agent Systems (fact-check P22): https://arxiv.org/abs/2511.20639
- Latent Action Pretraining from Videos (fact-check P23): https://arxiv.org/abs/2410.11758
- SRPO: Self-Referential Policy Optimization for Vision-Language-Action Models (fact-check P24): https://arxiv.org/abs/2511.15605
- VL-JEPA: Joint Embedding Predictive Architecture for Vision-language (fact-check P25): https://arxiv.org/html/2512.10942
- VLA-JEPA: Enhancing Vision-Language-Action Model with Latent World Model (fact-check P26): https://arxiv.org/abs/2602.10098
- Efficient Reasoning with Hidden Thinking (fact-check P27): https://arxiv.org/html/2501.19201v1
- Multi-Head Low-Rank Attention (fact-check P28): https://arxiv.org/abs/2603.02188
- Soft Thinking: Unlocking the Reasoning Potential of LLMs in Continuous Concept Space (fact-check P29): https://arxiv.org/html/2505.15778
- LatentGuard: Controllable Latent Steering for Robust Refusal of Attacks and Reliable Response Generation (fact-check P30): https://arxiv.org/abs/2509.19839
- Think-at-Hard: Dynamic Looped Transformers for Improved Reasoning (fact-check P31): https://arxiv.org/abs/2511.08577

## Equations (LaTeX)
13. $$ \mathbf{z}=\Phi^{\mathrm{comp}}(\mathbf{c},\theta) $$
14. $$ \mathbf{z}=\Phi^{\mathrm{comp}}(\mathbf{c},\theta) $$
18. $$ (T,\,K)=\mathcal{T}(\mathbf{h}_{t},\,\mathbf{x}) $$
20. $$ \theta^{\star}=\arg\min_{\theta\in\Phi}\mathbb{E}_{(\mathbf{x},\mathbf{y})\sim\mathcal{D}}\left[\mathcal{L}(\mathbf{x},\mathbf{y},\mathbf{z},\Phi_{\theta})\right] $$
22. $$ \mathbf{z}^{\star}=\arg\min_{\omega\in\Omega}\mathcal{J}\!\left(\mathbf{z},\mathbf{x},\Phi_{\theta}\right) $$
