# Demo Video "Dodrio: Exploring Transformer Models with Interactive Visualization" — Polo Club of Data Science @ Georgia Tech - Claude Context
> Source: YouTube, Polo Club of Data Science @ Georgia Tech, Demo Video "Dodrio: Exploring Transformer Models with Interactive Visualization", 1:59, published 2022-11-05 · https://www.youtube.com/watch?v=uboTKqPNU5Y · Generated: 2026-10-13
> Companion: 20221105_Dodrio-Demo.html (Thai, iw mode `iw`, 5 sections, 10 frames + 1 own SVG)

## Processing Notes
- Mode: `iw`. Body: own-words rewrite of on-screen captions and screen content (standard YouTube license; no caption track).
- Frames used: 01_intro, 02_overview-tooltip, 03_ring-detail, 04_hover-token, 05_layout-menu, 06_force-layout, 07_edge-threshold, 08_dependency-view, 09_comparison-arcs, 10_radial-panel.
- Own SVG diagrams: flow.
- Transcript SHA-256 (in-page = decoded): `none (no transcript available; NO_TRACKS)`; kept in the session workspace only.

## TL;DR
A 1:59 demo clip of Dodrio (Polo Club of Data Science, Georgia Tech, 2022): a web tool to explore BERT attention heads together with linguistic knowledge. No caption track and no narration text; the content is taken from caption bubbles and the screen. It is not a "forward pass" visualization like Transformer Explainer; it is an attention-analysis dashboard. Most reusable for ZVect: a layer x head dot/ring grid with hover tooltips, a radial attention graph (tokens on a circle, arrows between them) with an edge-threshold control, force/grid layouts, and arc diagrams over the token row.

## Key Concepts
- Header bar on every frame: tagline "Exploring transformer models in your browser!". 0:03: caption: Dodrio is an interactive visualization tool for researchers to explore a Transformer's attention weights with linguistic knowledge. Screen = three areas: top "Current Sentence" token boxes with blue dependency arcs and relation labels; bottom-left "Semantic Attention Graph"; bottom-right "Attention Head Overview". Menus: Dependency List, Show Comparison, Syntactic Relations; icons for paper, YouTube, GitHub.
- 0:12: "Overview allows users to choose different attention heads in BERT to visualize". Grid: rows layers 1..12 (bottom to top), columns Head 1..12. Hover tooltip, e.g. Layer 10 Head 9: Semantic 0.61, Syntactic 0, Importance 0.67. Legend bar: Semantic (red) - Both (purple) - Syntactic (blue).
- 0:20: "Show Detail" expands the grid; each head becomes a ring that contains a tiny radial preview. Side hints: click a ring to inspect the head, double-click to change the current attention head. Ring size legend "Less -> More Important"; 2-D color square: vertical More Semantic .. More Syntactic, horizontal Low .. High score.
- 0:28: "Click a ring to see attention weights in detail": radial graph opens beside it (Layer 8 Head 11 shown); tooltip for Layer 6 Head 10: Semantic 0.67, Syntactic 0.83, Importance 0.96.
- 0:34: "Hover over one token to see its in and out attentions" (Layer 6 Head 10 radial graph in purple).
- 0:44: Radial layout. Layout menu: Force Layout, Radial Layout (checked), Grid Layout. "Hover over nodes to highlight attentions".
- 0:54: Force layout: "Fine-tune graph force layout"; panel Edge Force (Attention auto, Text Order 1.6), ManyBody, Node Distance. 1:04: "Pin tokens to better inspect attentions".
- 1:14: "Users can control attention weight edge threshold": slider group Edge Threshold: Attention > 0.02 (Layer 11 Head 6, Radial Layout; ManyBody -920, Node Distance 1 in the same panel). At 0:54 (Force Layout, Layer 7 Head 4) the same panel reads ManyBody -840 and Attention > 0.04.
- 1:24: "Dependency view shows syntactic dependencies in the input sentence"; hovering the word "lisping" gives an orange box on the word, orange circles on its word pieces (li, ##sp, ##ing) in the graph and orange arrows for their attention.
- 1:34: "Arc diagram shows attentions in this attention head": view opened by the "Show Comparison" button (the name "Comparison View" comes from the Dodrio paper, not from the clip) titled "Dependencies predicted by attention heads with top syntactic correlations" (dropdown), rows layer 5 head 6, layer 4 head 7, layer 6 head 3, layer 5 head 1, layer 3 head 9; each row repeats the sentence with orange arcs.
- 1:44: "Open radial panel to inspect attention weights": floating draggable panel "Layer 4 Head 7 Attention Weights" with curved blue edges with arrowheads linking tokens around the circle, most of them converging on [CLS] and [SEP] at the top (none starts at the center).

## Implementation
Equation shown by the tool (MathML in the HTML report, eq. 1): edge i->j is drawn when a_ij > tau, tau = the Edge Threshold slider (0.04 at 0:54, 0.02 at 1:14); the reading of a_ij is the author's, the clip only prints "Attention >".
No code in the source. Visualization spec read from the frames (`frames/final/`):

**Head grid (frames 02, 03).** 12 x 12 grid, layer 1 at the bottom. Compact mode: filled circles; size = importance score (0..1), color = hue from red (semantic) through purple (both) to blue (syntactic), darker = stronger alignment (paper: HCL, hue from semantic minus syntactic, luminance from the max). Expanded mode: rings with a thumbnail radial arc-plot inside. Selected head: black rounded square around the dot. Tooltip: small dark box "Layer L Head H / Semantic x / Syntactic y / Importance z". Hint icons (hand click, hand double-click) in a side column; 2-D legend square bottom-right.

**Radial attention graph (frames 04, 05, 07).** Tokens (word pieces such as ##ing included) as circles on a ring, label inside each circle; node fill = red ramp for a saliency score (legend bar bottom-left, 0.00-0.20); edges = grey arrows with arrowheads from source to target token; hovering a node turns its edges orange (or purple/blue in the single-head panel) and fades the others; an "Edge Threshold: Attention > t" slider removes weak edges so a dense hairball becomes readable. Layout selector: Force (physics, draggable, pinnable nodes; sliders Attention, Text Order, ManyBody, Node Distance), Radial, Grid (tokens in reading order).

**Dependency / comparison (frames 08, 09).** Token boxes in a row; arcs under the row for dependency relations, blue relation labels on the arcs. Comparison: one row per head, arcs above the row with opacity = attention weight; orange highlight for the hovered token; a dropdown picks which heads to rank (e.g. top syntactic correlations). Two tiny icons sit under each row label (their function is not stated in the clip; the radial panel in frame 10 is opened from this view).

**Floating radial panel (frame 10).** White card with title "Layer 4 Head 7 Attention Weights", drag handle and close button; token labels on a circle, curved blue edges with arrowheads between tokens (many bundled toward [CLS]/[SEP] at the top); labels rotate around the circle.

**Interaction model.** Hover = highlight in all linked views; click on a ring = open detail; double-click = make it the current head (updates graph, comparison, dependency highlights); toggles for Show Detail, Show Comparison, layout, threshold sliders.

**Data shapes.** BERT: 12 layers x 12 heads = 144 heads; per head three scalars (semantic, syntactic, importance); per head an n x n attention matrix over word pieces (the sample sentence has dozens of tokens, [CLS] and [SEP] shown).

**ZVect reuse.** An attention matrix from `attention.js` (softmaxRows output, n x n) is exactly the input for a radial/arc view: edges = cells above a threshold. A layer x head grid needs several heads (lesson 10.4 uses 2 heads in `tblock.js`); with 2 heads a 1 x 2 or small grid still works. Causal masking (`causalMask`) maps to "arrows only point to earlier tokens" in the radial view.

## Quick Reference
| Item | Value | Time |
|---|---|---|
| Model | BERT, 12 x 12 heads | 0:12 |
| Head tooltip (compact) | Layer 10 Head 9: Semantic 0.61, Syntactic 0, Importance 0.67 | 0:12 |
| Head tooltip (ring) | Layer 6 Head 10: Semantic 0.67, Syntactic 0.83, Importance 0.96 | 0:28 |
| Layouts | Force, Radial, Grid | 0:44 |
| Graph settings panel | Attention auto, Text Order 1.6, Node Distance 1; ManyBody -840 + threshold Attention > 0.04 (0:54, Force); ManyBody -920 + threshold Attention > 0.02 (1:14, Radial) | 0:54, 1:14 |
| Comparison rows | L5H6, L4H7, L6H3, L5H1, L3H9 | 1:34 |
| Node color scale | Semantic Saliency Score 0.00-0.20 | whole clip |

## Tags & Triggers
tags: dodrio, BERT, attention visualization, radial graph, force layout, arc diagram, head overview, edge threshold
- How can attention heads be shown as a grid, graph and arcs?
- Which controls make a dense attention graph readable?

## References
- Video: https://www.youtube.com/watch?v=uboTKqPNU5Y (Polo Club of Data Science @ Georgia Tech, published 2022-11-05, 1:59)
- Live demo: https://poloclub.github.io/dodrio
- Paper (read for the design details above): https://arxiv.org/abs/2103.14625
