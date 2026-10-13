// sources.js — every outside source the lessons draw on. One place, so the "Ref" tab of each lesson
// only names an id and says what that lesson took from it. Thai reports live in docs/outhtm/.
const R = "../docs/outhtm/";

export const SOURCES = {
  "3b1b": {
    title: "Vectors, Chapter 1, Essence of linear algebra", by: "3Blue1Brown", date: "2016-08-05",
    url: "https://www.youtube.com/watch?v=fNk_zzaMoSs", report: R + "20160805_Vectors-Chapter-1-Essence-Of-Linear-Algebra.html",
  },
  statquest: {
    title: "Cosine Similarity, Clearly Explained!!!", by: "StatQuest", date: "2023-01-29",
    url: "https://www.youtube.com/watch?v=e9U0QAFbfLI", report: R + "20230129_Cosine-Similarity-Clearly-Explained.html",
  },
  metrics: {
    title: "Cosine Similarity vs. Euclidean Distance vs. Dot Product", by: "SH AI Academy", date: "2025-09-23",
    url: "https://www.youtube.com/watch?v=xTaDx3tbYMs", report: R + "20250923_Cosine-Similarity-Vs-Euclidean-Distance-Vs-Dot-Product.html",
  },
  wordemb: {
    title: "What Are Word Embeddings?", by: "Under The Hood", date: "2025-02-21",
    url: "https://www.youtube.com/watch?v=hVM8qGRTaOA", report: R + "20250221_What-Are-Word-Embeddings.html",
  },
  beginner: {
    title: "A Beginner's Guide to Vector Embeddings", by: "Colin Talks Tech", date: "2023-06-08",
    url: "https://www.youtube.com/watch?v=NEreO2zlXDk", report: R + "20230608_A-Beginners-Guide-To-Vector-Embeddings.html",
  },
  sofar: {
    title: "Vector Embedding : Build LLM from scratch", by: "SOFAR", date: "2026-06-15",
    url: "https://www.youtube.com/watch?v=1Qex37vowTM", report: R + "20260615_Vector-Embedding-Build-LLM-From-Scratch.html",
  },
  blackboard: {
    title: "How AI Turns Words Into Vectors: Embeddings", by: "BlackBoard AI", date: "2025-08-18",
    url: "https://www.youtube.com/watch?v=lPTcTh5sRug", report: R + "20250818_How-AI-Turns-Words-Into-Vectors-Embeddings.html",
  },
  hnsw: {
    title: "Vector Search and HNSW Explained Visually", by: "Satyajit Das", date: "2026-05-30",
    url: "https://www.youtube.com/watch?v=Lc4dzmSFb14", report: R + "20260530_Vector-Search-And-HNSW-Explained-Visually.html",
  },
  ann: {
    title: "Approximate Nearest Neighbour From Scratch In Python", by: "Sefik Ilkin Serengil", date: "2024-06-23",
    url: "https://www.youtube.com/watch?v=c10w0Ptn_CU", report: R + "20240623_Approximate-Nearest-Neighbour-From-Scratch-In-Python.html",
  },
  vdbdead: {
    title: "Vector Databases Are Dead. Use This Instead", by: "Devsplainers", date: "2026-10-08",
    url: "https://www.youtube.com/watch?v=YLkSfz3EFGw", report: R + "20261008_Vector-Databases-Are-Dead-Use-This-Instead.html",
  },
  qdrant: {
    title: "Qdrant: Open Source Vector Search Engine (Andrey Vasnetsov)", by: "CMU Database Group", date: "2023-09-15",
    url: "https://www.youtube.com/watch?v=bU38Ovdh3NY", report: R + "20230915_Qdrant-Open-Source-Vector-Search-Engine-CMU.html",
  },
  bpe: {
    title: "Byte Pair Encoding - How does the BPE algorithm work? - Step by Step Guide", by: "Raj Pulapakura", date: "2024-01-24",
    url: "https://www.youtube.com/watch?v=BcxJk4WQVIw", report: R + "20240124_Byte-Pair-Encoding-How-Does-The-BPE-Algorithm-Work.html",
  },
  colbert: {
    title: "Supercharge Your RAG with Contextualized Late Interactions", by: "Prompt Engineering", date: "2024-03-22",
    url: "https://www.youtube.com/watch?v=xTzUn3G9YA0", report: R + "20240322_Supercharge-Your-RAG-With-Contextualized-Late-Interactions.html",
  },
  karpathy: {
    title: "Let's build the GPT Tokenizer", by: "Andrej Karpathy", date: "2024-02-20",
    url: "https://www.youtube.com/watch?v=zduSFxRajkE", report: R + "20240220_Lets-Build-The-GPT-Tokenizer.html",
  },
  choose: {
    title: "How to choose the embedding model based on the task at hand", by: "Byte Goose AI", date: "2026-02-28",
    url: "https://www.youtube.com/watch?v=H6q1UWCCnKw", report: R + "20260228_How-To-Choose-An-Embedding-Model-By-Task.html",
  },
  thuvu: {
    title: "Learn Text Embeddings in 20 Minutes (full guide for beginners)", by: "Thu Vu", date: "2026-05-23",
    url: "https://www.youtube.com/watch?v=Q6TBHDgWCDQ", report: R + "20260523_Learn-Text-Embeddings-In-20-Minutes.html",
  },
  nitmonk: {
    title: "How Tokens, Vectors & Embeddings Actually Work", by: "NitMonk", date: "2026-08-03",
    url: "https://www.youtube.com/watch?v=YIR-KxNpSbA", report: R + "20260803_How-Tokens-Vectors-And-Embeddings-Actually-Work.html",
  },
  annie: {
    title: "Tokens vs Embeddings – what are they + how are they different?", by: "Annie Sexton", date: "2025-05-29",
    url: "https://www.youtube.com/watch?v=izbifbq3-eI", report: R + "20250529_Tokens-Vs-Embeddings.html",
  },
  stanford: {
    title: "Stanford CME295 Transformers & LLMs, Autumn 2026, Lecture 1 - Transformers", by: "Stanford Online (Afshine & Shervine Amidi)", date: "2026-09-28",
    url: "https://www.youtube.com/watch?v=114i2Kz-LZA", report: R + "20260928_Stanford-CME295-Lecture-1-Transformers.html",
  },
  syntaxllm: {
    title: "LLMs Explained: Tokens, Embeddings, Transformers and More", by: "Syntax (CJ)", date: "2026-07-10",
    url: "https://www.youtube.com/watch?v=YmLp8qe87A0", report: R + "20260710_LLMs-Explained-Tokens-Embeddings-Transformers-And-More.html",
  },
};
