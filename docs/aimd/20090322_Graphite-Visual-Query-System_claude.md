# GRAPHITE: A Visual Query System for Large Graphs — Duen Horng "Polo" Chau - Claude Context
> Source: YouTube, Duen Horng "Polo" Chau, "GRAPHITE: A Visual Query System for Large Graphs", 3:10, published 2009-03-22 · https://www.youtube.com/watch?v=nZYHazugVNA · Generated: 2026-10-13
> Companion: 20090322_Graphite-Visual-Query-System.html (Thai, iw mode `iw`, 7 sections, 9 frames + 1 own SVG)

## Processing Notes
- Mode: `iw`. Body: own-words rewrite of an ASR transcript (standard YouTube license; ASR errors repaired against on-screen text).
- Frames used: 00_title-slide, 01_crowd-pattern, 02_challenges, 03_ui-overview, 04_empty-canvas, 05_attribute-dialog, 06_adding-nodes, 07_star-query, 08_matches-tabs.
- Own SVG diagrams: flow.
- Transcript SHA-256 (in-page = decoded): `0d3e64d4700ed1694094e4d097f7a2bcec4825cdad868dbd9245ac1c43053b21`; kept in the session workspace only.

## TL;DR
A 3:10 demo of Graphite (CMU / LLNL, 2009), a visual query system: the user draws a small query graph, assigns attributes to its nodes, and the system finds exact and close (approximate) matches in a large attributed graph (demo: DBLP, >350,000 authors, 1.9M co-authorship instances) and shows them in the same window. The demo draws a star query (a PODS author connected to one PODS, one ISBMS and one IAT author); no exact match exists, so close matches with indirect paths are shown as numbered tabs. Narration exists only at the start and end; the middle is silent screen work. The ASR transcript is poor and was repaired against on-screen text.

## Key Concepts
- 0:06 Title slide: six authors and two institutions (see Quick Reference).
- 0:03-0:49 Problem: find patterns in graphs (example: money-laundering rings of businessmen and bankers in a social network where occupation is a node attribute). Four challenges: (1) a convenient way to specify the pattern as a query; (2) find all matches, including close ones (allow another person between a businessman and a banker, because the real ring's shape is not known); (3) make graph matching fast; (4) visualize all matches so they can be understood and interpreted.
- 0:49-1:09 Graphite: visually construct a query pattern, find exact and approximate matches, visualize them, all in one integrated user interface.
- 1:07-1:25 Demo data: DBLP author-publication graph, more than 350,000 authors, 1.9 million co-authorship instances (description: 356K nodes, 1.9M edges).
- 1:23-1:56 Query: a star pattern = an author who published in PODS and co-authored with three other authors, one from PODS, one from ISBMS, one from IAT (spoken; ASR garbled the names, the screen confirms them). Drawn by placing nodes, giving each node an attribute through a "Specify Vertex Attribute" dialog (Search box, scrollable "Attributes" list, Okay / Cancel), and linking nodes with curved edges.
- 1:56-2:10 Speech garbled by ASR; reads roughly as: add the authors' conference-name attributes and co-authorship links.
- 2:10-2:31 Results: matches are shown in tabs, arranged so the top matches are (per the ASR) empirically more important to the user. Exact matches are searched whenever possible; if there are none (as in the example) close matches are shown, tolerating longer indirect paths between the query-graph nodes.
- 2:31-2:51 One top result: Philip Yu (prolific, PODS) in the centre, linked to Hector Garcia-Molina (also prolific) through an intermediate node; "Mark" (Zhongfei Zhang on screen) is a computer-vision person with recent interest in data mining, hence his link to Philip Yu.
- 2:51-3:04 Closing: easy to run graph queries; instead of DBLP the user can use their own attributed graph and draw query graphs of arbitrary structure.
- From the description only: the G-Ray algorithm and the fast node-proximity estimation. The speaker does say exact and approximate matching (~1:00) and tolerating longer indirect paths (~2:25).
- Screen details: window title "Graphite: Graph Investigation by Topological Example"; menus Data, Query, Matches; left tool strip of three icons (arrow, node-link icon that lights up while nodes are added, hand; the arrow and hand functions are inferred from the icon shapes; the arrow is the active one at 1:15); two side-by-side panes with faint watermark labels "Query" and "Match"; attribute legend (white blank row plus coloured rows) top right of the Query pane; vertical tab strip 0-14 at the right edge of the Match pane; bottom bar "Number of Matches" (20 in the opening scene, 10 in the demo), "Use Cache" checkbox (checked), "Find Matches" button. Dark grey panes, coloured filled circles with the attribute (and, in the Match pane, the author name) as a label, thin grey curved edges.

## Implementation
No code in the source. Playbook of the interaction flow shown:
1. Select the add node/edge tool; place a blank (white) node in the Query pane.
2. Open the attribute dialog, type a filter in Search, pick an attribute row, press Okay; the node takes the legend colour of that attribute.
3. Repeat for the other nodes; connect nodes with edges (drawn as curved lines).
4. Set Number of Matches, leave Use Cache on, press Find Matches.
5. Read the results in the Match pane; switch between result tabs (numbered 0-14). Nodes that satisfied an attribute show the attribute name plus the entity name; intermediate nodes that only bridge a path are white with just a name.
6. Compare the Query pane (left) with the Match pane (right).

## Quick Reference
| Item | Value | Time |
|---|---|---|
| Authors on title slide | Duen Horng Chau, Christos Faloutsos, Hanghang Tong, Jason I. Hong (Carnegie Mellon); Brian Gallagher, Tina Eliassi-Rad (Lawrence Livermore) | title |
| Demo graph | DBLP author-publication; >350,000 authors; 1.9M co-authorship instances (description 356K nodes / 1.9M edges) | 1:12 |
| Query | star: PODS author in the centre + one PODS, one ISBMS, one IAT neighbour | 1:23 |
| Result tabs | numbered 0-14 | 0:58, 3:02 |
| Number of Matches field | 20 (opening scene), 10 (demo scenes) | on screen |
| Example result | Philip S. Yu (PODS), Hector Garcia Molina (PODS), Zhongfei (Mark) Zhang (IAT), an ISBMS author whose name reads "Reinhard Mnner" on screen (one character missing, probably Männer), white bridge nodes Sudarshan S. Chawathe and Bing Liu | 2:31 |

## Comparisons
| | Exact match | Close (approximate) match |
|---|---|---|
| Meaning | subgraph that fits the drawn pattern | subgraph near the pattern, tolerating longer indirect paths between query nodes |
| When shown | searched first, whenever possible | shown when no exact match exists (the demo case) |
| Why | n/a | the user may not know what the real pattern looks like |

## Tags & Triggers
Graphite, visual query, query by sketch, graph pattern matching, approximate subgraph match, DBLP, linked views, Polo Chau. Triggers: how does a visual graph query system let users draw queries; why offer approximate matches; how are matches shown next to the query.

## References
- https://www.youtube.com/watch?v=nZYHazugVNA
