# VIGOR: Interactive Visual Exploration of Graph Query Results — Polo Club of Data Science @ Georgia Tech - Claude Context
> Source: YouTube, Polo Club of Data Science @ Georgia Tech, "VIGOR: Interactive Visual Exploration of Graph Query Results", 3:50, published 2017-08-09 · https://www.youtube.com/watch?v=-jeck0yrT_Q · Generated: 2026-10-13
> Companion: 20170809_Vigor-Graph-Query-Results.html (Thai, iw mode `iw`, 9 sections, 14 frames + 1 own SVG)

## Processing Notes
- Mode: `iw`. Body: own-words rewrite of on-screen caption bubbles, screen content and the video description (standard YouTube license; no caption track, NO_TRACKS).
- Frames used: 01_enter-query, 02_both-views, 03_embedded-clusters, 04_fusion-hover, 05_exemplar-arrange, 06_exemplar-search, 07_exemplar-filter, 08_layout-distribute, 09_soft-intersection, 10_feature-explorer, 11_compare-clusters, 12_similar-results, 13_cluster-params, 14_cluster-width.
- Own SVG diagrams: flow.
- Transcript SHA-256 (in-page = decoded): `none (no transcript available; NO_TRACKS)`; kept in the session workspace only.

## TL;DR
A 3:50 demo of VIGOR (Polo Club, Georgia Tech, 2017), an interactive visual analytics system for exploring and making sense of graph query results. The clip has no captions and no narration; content comes from yellow-on-black caption bubbles, the tool's own screen and the video description. A Cypher query produces two linked views, a Fusion Graph (force-directed, draggable) and Embedded Results (one square per result, grouped into similarity clusters). An Exemplar View (the query's shape) filters the graph and highlights results; layout tools, soft-intersection, a Feature Explorer and adjustable clustering / dimensionality-reduction controls follow. Description claims: exemplar-based interaction and feature-aware subgraph summarization; a Symantec case study (cybersecurity data, over 11,000 incidents); a within-subjects study against a leading graph database management system showing ease of use, higher speed and fewer errors (no numbers given).

## Key Concepts
- Description (not spoken): finding patterns in graphs matters in biology, network security and finance (e.g. money-laundering rings); less work helps analysts make sense of patterns inside a group of subgraph results; visualizing them is hard (many subgraphs, shared node values, rich node features, flexible structure across queries). VIGOR = multiple coordinated views; contributions (1) exemplar-based interaction: start from a specific result and relax constraints to find similar ones, or start with the bare structure (no node-value constraints) and add constraints to narrow down; (2) feature-aware subgraph result summarization.
- 0:11 caption "Enter Query: Cypher Querying Language". Screen: query bar at top with the Cypher text already in it (the end looks like it is still being typed) and a "Go!" button; three panes: Exemplar View (empty, no counter), Fusion Graph (0), Embedded Results (0). Query read from the screen (small text): MATCH (a1:Author)-(p1:Paper)-(c1:Conference), (a2:Author)-(p2:Paper)-(c2:Conference), (p2)-(a1), (a2)-(p1) WHERE c1.name in ['ieeevast','infovis'] AND c2.name = 'kdd' RETURN a1,p1,c1,a2,p2,c2 limit 2000.
- ~0:20 after the query: "Fusion Graph (211 Nodes, 414 Results)" on the left, "Embedded Results (414 Results)" on the right. Node colours: Conference orange, Paper red, Author blue.
- 0:35 caption "Embedded Results: Clustered by result-similarity". Grey squares (one per result), pastel cluster regions labelled "Cluster 2..9"; the right pane gets a yellow outline while it is being explained.
- 0:43 caption "Fusion Graph: Draggable force-directed results". Selected nodes get a yellow ring and yellow edges; yellow squares appear in several clusters of Embedded Results (cross-view highlight; no caption states the hover).
- ~0:50 hovering an Author node in Fusion Graph shows a node readout at the bottom-left (Thomas Seidl, Author, Coauthors: 80, paper(s) in dataset); its edges turn yellow and the related results turn yellow squares in cluster 7.
- 0:57 caption "Exemplar View: Freely arrange query" - the Conference (kdd) node of the Exemplar View has been dragged from the top right to beside the right Paper node; - the Exemplar View (top-left, collapsible) draws the query shape: Conference-Paper-Author and Conference(kdd)-Paper-Author with crossing Paper/Author links.
- 1:05 caption "Exemplar View: Search by node value from results" - clicking an Author node opens a dropdown with a search box (typed "sh") and a filtered name list.
- 1:12 caption "Exemplar View: Filters Fusion Graph & Highlights Embedded Results" - the Author node shows "Shixia Liu" with an x chip to remove the constraint; the Fusion Graph shrinks to a small graph but its header still reads 211 Nodes; Embedded Results header shows "17 Results" and 17 matching squares turn yellow (the other squares stay).
- 1:26 "Layout Tools: Left-Align selections"; 1:32 "Distribute vertically"; 1:39-1:45 "Quickly Layout Nodes: Drag by selection to reposition". Bottom toolbar of the graph pane: Legend, Zoom (Zoom to selected, Reset Zoom), Soft-Intersect (None / Common) with S-I Opacity slider, Filtering (Filter), Label Length slider, Node Alignment (2 rows of icon buttons), Node Pinning (pin / clear).
- 1:52-1:58 "Soft-intersection: Scale node opacity by the number of results it appears in" - header "Fusion Graph (23 Nodes, 414 Results)", "Embedded Results (17 Results)"; most nodes faded. 23 Nodes appears only here (Soft-Intersect = Common); the header stays 211 Nodes at 1:12-1:32 and in the later cluster scenes; the clip does not say why it changed.
- 2:11 "Embedded Results: Use the Feature Explorer to investigate cluster features"; 2:24 "Feature & node value distributions by type" (a yellow arrow points at the right-hand panel "Author Features": density curves for Papers 0-114, Conferences 1-14, Coauthors 0-141, then horizontal bars of node values, axis 0-8; "Paper Features" below with a year axis 2003-2018); 2:37 "Select multiple clusters to compare their features": Cluster 7 (dark outline) and Cluster 4 (pink outline) are both selected; each density curve is drawn twice, overlaid in dark and pink (Coauthors axis to 143); the bar list shows paired dark/pink bars per author on a new axis 0-11-22 (was 0-4-8) with a different ranking (Haesun Park, Jaegul Choo, Naren Ramakrishnan, Hannah Kim, Shixia Liu ...).
- 2:50 "Quickly investigate similar results" (full graph restored, no yellow highlight). 3:03 "4 VAST 2014 Mini Challenges" (a small graph with a yellow circle around four red Paper nodes labelled "Safeg...", matching the 4 in the caption; cluster 9 outlined); meaning not explained in the clip.
- 3:16 "Adjustable clustering parameters" - Embedded Results panel controls: Legend ("Nodes colored by cluster"), Zoom (Zoom to selection, Reset Zoom), Dim. Reduction dropdown (t-SNE), Points (Jitter, Hide Result Points), Groups (Hide Group Labels, Selection Stats), Cluster Width slider. More, smaller clusters (labels up to Cluster 32) at one slider position, one big cluster at another. 3:29 "Multiple dimensionality reductions techniques" (fading). 3:47 black screen with "And much more!" and "Thank You!" together.
- Style notes: white background, thin grey edges, small truncated node labels; panes separated by a thin vertical rule; counters in grey beside each pane title; caption bubbles are black rectangles bottom-left or bottom-right with a bold yellow title and lighter yellow subtitle; one large yellow arrow used once as a pointer.

## Implementation
No code in the source. Interaction playbook (as shown): (1) type Cypher, press Go!; (2) read both counters; (3) hover/select in either view and watch the other highlight in yellow; (4) pick values in the Exemplar View to filter (search box, x chip to remove); (5) tidy the graph with alignment/distribute/pin, fade nodes with soft-intersection; (6) select a cluster in Embedded Results and open Feature Explorer panels per node type; (7) tune Cluster Width and Dim. Reduction.

## Quick Reference
| Item | Value | Time |
|---|---|---|
| Counters | Fusion Graph 211 nodes / 414 results; Embedded Results 414 results; Exemplar filter: Embedded Results 17 results (Fusion header stays 211 nodes); Fusion Graph 23 nodes only at the soft-intersection step | 0:20, 1:12, 1:58 |
| Panes | Exemplar View, Fusion Graph, Embedded Results (+ Feature Explorer panel) | 0:20 |
| Description numbers | Symantec dataset over 11,000 incidents | description |

## Tags & Triggers
VIGOR, graph query results, visual analytics, coordinated views, exemplar view, soft-intersection, feature explorer, t-SNE, Polo Club. Triggers: how do two linked views highlight each other; how does an exemplar/query-shape panel filter results; how to expose clustering parameters.

## References
- https://www.youtube.com/watch?v=-jeck0yrT_Q
