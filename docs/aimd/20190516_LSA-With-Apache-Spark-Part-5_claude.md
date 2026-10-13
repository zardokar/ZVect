# Latent Semantic Analysis with Apache Spark (5/5) — Databricks Academy (Joshua Cook) - Claude Context
> Source: YouTube, Databricks Academy (Joshua Cook), "Latent Semantic Analysis with Apache Spark (5/5)", 6:51, published 2019-05-16 · https://www.youtube.com/watch?v=OXJdfpEFmF8 · Generated: 2026-10-13
> Companion: 20190516_LSA-With-Apache-Spark-Part-5.html (Thai, iw mode `iwd`, 16 sections, 15 frames + 2 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis (standard YouTube license); Scala code, table values and printouts transcribed exactly from the frames.
- Frames used: 01_lsa-pipeline, 02_parquet-files, 02b_lemma-markdown, 03_corenlp-slide, 04_maven-coordinate, 05_wget-models, 06_lemma-output, 07_stopwords-download, 08_stopwords-filter, 09_tfidf-spark-code, 09b_dtm-output, 10_vecrdd-code, 11_computesvd, 12_top-terms-function, 13_top-terms-output.
- Own SVG diagrams: flow, bars.
- Transcript SHA-256 (in-page = decoded): `090f966e789aa0b0cc2f315bcdfefc3d1171a0702e4df1b7c6a3771fdd14cd35 (transcript of the first job, SHA matched; reused, not re-grabbed)`; kept in the session workspace only.

## TL;DR
- Part 5 of 5 of Databricks Academy's LSA series (Joshua Cook, 6:51, 2019-05-16): the same four LSA steps (raw text → document-term matrix → SVD → topic-encoded data) on the larger 20 Newsgroups data, moving from scikit-learn to Apache Spark with a Scala notebook ("Latent Semantic Analysis, Part 2").
- New vs parts 2–4: lemmatisation with Stanford CoreNLP (`databricks:spark-corenlp:0.4.0-spark2.4-scala2.11`, models jar `stanford-corenlp-3.6.0-models.jar` 378,116,526 bytes via `wget`); stop words as a separate `StopWordsRemover` with CoreNLP's English list + 13 own entries; TF-IDF in two steps (`CountVectorizer` → `IDF`); SVD only in RDD-based `spark.mllib`: `RowMatrix(vecRdd).computeSVD(50, computeU=true)`.
- Printout of the top 10 terms of the top 10 topics (frame 6:28, re-read at 1920 px): topic 1 "looks a bit noisy" (weights 5.2e-21 … −1.1e-7, e.g. Moooo −1.0979866037813425e-7), topic 2 = images (JPEG 0.3520, jpeg 0.2564, gif 0.1833, …, quality 0.09191), topic 3 = the Bible (Jesus 0.3048, Matthew 0.2441, prophecy 0.1604, psalm 0.1375, Isaiah 0.1223).
- Author analysis: topic 1's "noise" is likely a sign artefact (inferred from the printed values, not re-run) (non-negative A ⇒ single-signed v₁; if the solver returns −v₁, `sortBy(-w)` lists the least related terms). Other artefacts: no lower-casing (JPEG/jpeg, ARGUMENTUM/argumentum), repeated themes (Bible in 3 and 6, launches in 5 and 8). The printout is dated 3/26/2019 while the preceding cells are 4/16/2019.
- Fact check: 14 claims — 11 confirmed, 2 partly, 1 contradicted ("we must provide our own list": `StopWordsRemover.stopWords` defaults to the English list).

## Key Concepts
- Lemma (speech ~1:10–1:50): $\operatorname{lemma}(\text{run}) = \operatorname{lemma}(\text{ran}) = \operatorname{lemma}(\text{running}) = \text{run}$, $\operatorname{lemma}(\text{bananas}) = \operatorname{lemma}(\text{banana}) = \text{banana}$. Frame: "was" → "be"; lemmatized = [#beginpost, #, Background, :, the, Orion, spacedrive, be, …].
- Stop list (author, from code): $S = S_{\text{add}} \cup S_{\text{CoreNLP}}$, $|S_{\text{add}}| = 13$ (#BEGINPOST, _, |, \, \\, /, //, ||, ???, 0/0, n, 2/2, --). Filter: $\operatorname{filtered}(d) = [\, w \in \operatorname{lemmatized}(d) : \operatorname{lower}(w) \notin \operatorname{lower}(S) \,]$ (`caseSensitive=false`). Result: [Background, Orion, spacedrive, theoretical, concept, drive, use, thermonuclear, …].
- TF (Spark CountVectorizer): $\operatorname{TF}(t,d) = f_{t,d}$; vocabulary $\mathcal{W}$ = top `vocabSize` terms by corpus frequency with DF ≥ `minDF` (defaults $2^{18}$, 1.0).
- IDF (Spark docs): $\operatorname{IDF}(t,D) = \log\frac{|D|+1}{\operatorname{DF}(t,D)+1}$, $\operatorname{TFIDF}(t,d,D) = \operatorname{TF}(t,d)\cdot\operatorname{IDF}(t,D)$; `minDocFreq` default 0; no row normalisation. vs sklearn: $\operatorname{idf}_{\text{sklearn}} - \operatorname{IDF}_{\text{Spark}} = 1$ for equal n, and Spark rows are not unit length.
- SVD (Spark mllib docs): $A = U\Sigma V^\top$, $A\in\mathbb{R}^{m\times n}$ (posts × terms), $k=50$; $A^\top A v_j = \sigma_j^2 v_j$; $U = A(V\Sigma^{-1})$ when `computeU`. Local Gramian path if $n<100$ or $k>n/2$, otherwise distributed $(A^\top A)v$ + ARPACK; assumes $n<m$. In the clip n = 29,801 (DTM output ~5:18), so the ARPACK path applies; with ~18,846–20,000 posts in the standard dataset n would exceed m (author note; the clip gives no post count). This is the uncentred (non-PCA) decomposition discussed in part 4.
- Reading V (author): `toArray` is column-major, so $\text{arr}[i\cdot n + t] = V_{t,i}$, $\text{offs}_i = i\cdot n$; $T_i = \operatorname{take}_{10}(\operatorname{sort}_\downarrow V_{:,i})$ — signed sort, not absolute.
- Sign argument (author): $A\ge 0 \Rightarrow A^\top A \ge 0 \Rightarrow \exists\, v_1 \ge 0$ (Perron–Frobenius); if the solver returns $\tilde v_1 = -v_1$, $\operatorname{take}_{10}(\operatorname{sort}_\downarrow \tilde v_1)$ = the 10 terms with the smallest $|v_{1,t}|$.
- Topic-encoded post (author): $z_d = (U\Sigma)_{d,:} = V^\top a_d \in \mathbb{R}^{50}$.
- Whole pipeline (author): $Z = \operatorname{SVD}_{50}(\operatorname{IDF}\circ\operatorname{TF}\circ\operatorname{filter}_S\circ\operatorname{lemma}(\text{text}))$; part 4 for contrast: $Z = \operatorname{SVD}_{2}(\operatorname{L2}\circ\operatorname{IDF}_{+1}\circ\operatorname{TF}\circ\operatorname{filter}_{\text{english}}(\text{text}))$.

## Implementation
All cells transcribed from the frames (Scala, Databricks):
```scala
%fs ls /mnt/joshua/text-data/newsgroups
// _SUCCESS 0, _committed_3221925014621618954 840, _started_… 0,
// part-00000-…-62884-1-c000.snappy.parquet 202246, part-00001-… 147137, part-00002-… 175600, part-00003-… 214210

val newsgroupsDF = spark.read
  .parquet("/mnt/joshua/text-data/newsgroups")
display(newsgroupsDF)   // "Command took 3.88 seconds … 4/16/2019, 4:07:44 PM" for %fs ls; display output never shown (still "Running command…" at ~1:02)
// path column of the listing = dbfs:/mnt/joshua/text-data/newsgroups/<name>
// Cmd 7 markdown "Generating Word Lemmas with Stanford CoreNLP": lemma = canonical/dictionary form; without lemmas "run", "ran",
// "running" (and "banana"/"bananas") are distinct words; quote of the CoreNLP project description; "The Stanford CoreNLP provides
// functionality to generate tokenized word lemmas using Apache Spark."
// Slide ~1:58 "Core NLP": Stanford NLP logo + parse tree of "The first fifteen minutes were dry but by the end I really enjoyed the lecture" (Image Credit: Stanford NLP)

// Maven coordinate (slide ~2:04): databricks:spark-corenlp:0.4.0-spark2.4-scala2.11

// Cmd 9 (~2:16)
val version = "3.6.0"
val model = s"stanford-corenlp-$version-models" // append "-english" to use the full English model
val jars = sc.asInstanceOf[{def addedJars: scala.collection.mutable.Map[String, Long]}].addedJars.keys // use sc.listJars in Spark 2.0
if (!jars.exists(jar => jar.contains(model))) {
  import scala.sys.process._
  s"wget http://repo1.maven.org/maven2/edu/stanford/nlp/stanford-corenlp/$version/$model.jar -O /tmp/$model.jar".!!
  sc.addJar(s"/tmp/$model.jar")
}
// output: Length: 378116526 (361M) [application/java-archive]

// Cmd 11 (~2:30) — "Command took 40.97 seconds" (speaker: about 30 s)
import org.apache.spark.sql.functions.col
import com.databricks.spark.corenlp.functions.lemma
val lemmatizedDF = newsgroupsDF.withColumn("lemmatized",
                                           lemma(col("text")))
display(lemmatizedDF)

// Cmd 13 (~3:12)
import scala.io.Source
val coreNLPStopWordsGitHub =
  "https://raw.githubusercontent.com/stanfordnlp/CoreNLP/master/data/edu/stanford/nlp/patterns/surface/stopwords.txt"
val words = Source.fromURL(coreNLPStopWordsGitHub)
val additionalStopWords = "#BEGINPOST\n_\n|\n\\\n\\\\\n/\n//\n||\n???\n0/0\nn\n2/2\n--\n"
val stopWordsList = (additionalStopWords+words.mkString).split("\n")

// Cmd 15 (~4:05)
import org.apache.spark.ml.feature.StopWordsRemover
val remover = new StopWordsRemover()
  .setInputCol("lemmatized")
  .setOutputCol("filtered")
  .setStopWords(stopWordsList)
val filteredDF = remover.transform(lemmatizedDF)
display(filteredDF.select("text", "filtered"))

// Cmd 17 (~4:50)
import org.apache.spark.ml.feature.{CountVectorizer, CountVectorizerModel, IDF}
val cvModel: CountVectorizerModel = new CountVectorizer()
  .setInputCol("filtered")
  .setOutputCol("rawFeatures")
  .fit(filteredDF)
val featurizedDataDF = cvModel.transform(filteredDF)
val idf = new IDF()
  .setInputCol("rawFeatures")
  .setOutputCol("TFIDFfeatures")
val idfModel = idf.fit(featurizedDataDF)
val documentTermMatrixDF = idfModel.transform(featurizedDataDF)
display(documentTermMatrixDF.select("text", "TFIDFfeatures"))
// output (~5:18): featurizedDataDF: DataFrame = [text: string, label: long ... 4 more fields]
//                 documentTermMatrixDF: DataFrame = [text: string, label: long ... 5 more fields]
// first row TFIDFfeatures = [0,29801,[1,2,5,11,17,22,30,36,40,41,53,57,61,68,128,135,139,144,221,307,408,441,453,489,528,…
//   (sparse vector: type 0, size n = 29,801 terms, then indices; values cut off) ; "Showing the first 216 rows."
//   "Command took 31.43 seconds -- … 4/16/2019, 4:36:32 PM"

// Cmd 19 (~5:40)
import org.apache.spark.mllib.linalg.{Vectors, Vector => MLLibVector}
import org.apache.spark.ml.linalg.{Vector => MLVector}
val vecRdd = documentTermMatrixDF.select("TFIDFfeatures").rdd.map {
    row => Vectors.fromML(row.getAs[MLVector]("TFIDFfeatures"))
  }
// output: vecRdd: org.apache.spark.rdd.RDD[org.apache.spark.mllib.linalg.Vector] = MapPartitionsRDD[31] at map at command-11152034:4 (0.50 s, 4/16/2019 4:40:23 PM)

// Cmd 20 (~5:52)
import org.apache.spark.mllib.linalg.distributed.RowMatrix
vecRdd.cache
val mat = new RowMatrix(vecRdd)
val k = 50
val svd = mat.computeSVD(k, computeU=true)

// Cmd 22 (~6:12)
import scala.collection.mutable.ArrayBuffer
import org.apache.spark.mllib.linalg.{Matrix,
  SingularValueDecomposition}
import org.apache.spark.mllib.linalg.distributed.RowMatrix
def topTermsInTopTopics(
    svd: SingularValueDecomposition[RowMatrix, Matrix],
    numConcepts: Int,
    numTerms: Int, termIds: Array[String])
  : Seq[Seq[(String, Double)]] = {
  val v = svd.V
  val topTerms = new ArrayBuffer[Seq[(String, Double)]]()
  val arr = v.toArray
  for (i <- 0 until numConcepts) {
    val offs = i * v.numRows
    val termWeights = arr.slice(offs, offs + v.numRows).zipWithIndex
    val sorted = termWeights.sortBy(-_._1)
    topTerms += sorted.take(numTerms).map {
      case (score, id) => (termIds(id), score)
    }
  }
  topTerms
}

// Cmd 23 (~6:16)
print(topTermsInTopTopics(svd, 10, 10, cvModel.vocabulary).mkString("\n\n"))
```
Suggested fixes (author, not in the clip): lower-case tokens before `CountVectorizer`; add `Normalizer(p=2)` after `IDF` for sklearn-like rows; sort by `math.abs(_._1)` or flip each column of V so its largest-magnitude entry is positive before reading topics; use `svd.U`·`svd.s` for document coordinates.
Author toy check (recompute.py, numpy re-implementation, 10 lines, 28 terms): IDF goodnight ln(11/6) = 0.6061, terrible ln(11/4) = 1.0116, brush ln(11/2) = 1.7047; row norms 2.4625–3.8598 (not 1); k = 3 → s = (4.1094, 3.9058, 3.1893), UᵀU = I; v₁ single-signed; non-negative v₁ top-4 = terrible 0.3863, wild 0.3604, showed 0.3578, teeth 0.3578; negated v₁ top-4 = bowl, jumped, cow, moon at −0.0.

## Quick Reference
| Item | Value |
|---|---|
| Data | 20 Newsgroups posts, parquet in /mnt/joshua/text-data/newsgroups |
| Example doc | label 2 = sci.space, "Background: The Orion spacedrive was a theoretical concept…" |
| Package | databricks:spark-corenlp:0.4.0-spark2.4-scala2.11 (spark-packages 2018-11-16, GPL-3.0) |
| Models | stanford-corenlp-3.6.0-models.jar, 378,116,526 bytes (361M) |
| Extra stop words | 13: #BEGINPOST, _, \|, \, \\, /, //, \|\|, ???, 0/0, n, 2/2, -- |
| k | 50 (`computeSVD(k, computeU=true)`) |
| Vocabulary | n = 29,801 terms (sparse vector size in the DTM output, ~5:18); DTM display 31.43 s, 216 rows shown |
| Printout | `topTermsInTopTopics(svd, 10, 10, cvModel.vocabulary)`, 0.32 s, 3/26/2019 2:24:16 PM |
| Topic 1 | Ditto 5.200e-21, ......@compuserve.com 4.631e-21, critus 4.197e-21, dash line −2.762e-20, Cockroaches −4.694e-20, <most of message deleted> −1.818e-8, propagandist −4.860e-8, surreal −6.100e-8, Moooo −1.098e-7, salvadoran −1.115e-7 |
| Topic 2 | JPEG 0.3520, jpeg 0.2564, gif 0.1833, jfif 0.1061, file 0.09216, quality 0.09191, viewer 0.08580, setting 0.07363, color 0.07316, QuickTime 0.06523 |
| Topic 3 | Jesus 0.3048, Matthew 0.2441, prophecy 0.1604, psalm 0.1375, g 0.1224, Isaiah 0.1223, will 0.1105, JPEG 0.1095, messiah 0.09688, say 0.09670 |
| Topic 4 | = 0.6517, den 0.3874, t 0.2077, -rcb- 0.1560, -lcb- 0.1509, radius 0.1455, p3 0.1416, p2 0.1333, p1 0.1167, 0.0 0.1043 |
| Topic 5 | launch 0.3993, satellite 0.2942, market 0.1736, space 0.1622, commercial 0.1397, venture 0.1257, m 0.1130, service 0.1123, contract 0.1114, probe 0.08821 |
| Topic 6 | Jesus 0.1693, Matthew 0.1597, prophecy 0.1225, psalm 0.1070, launch 0.09646, Isaiah 0.09515, g 0.09497, messiah 0.07525, satellite 0.07022, prophet 0.06658 |
| Topic 7 | ray 0.1827, tracer 0.1681, send 0.1450, mail 0.1364, file 0.1067, server 0.1034, rt 0.1029, 3d 0.09976, object 0.09661, Amiga 0.08815 |
| Topic 8 | launch 0.1024, fallacy 0.09742, atheist 0.09481, market 0.08456, argument 0.08285, God 0.08164, satellite 0.07962, commercial 0.06758, venture 0.06380, conclusion 0.06126 |
| Topic 9 | Larson 0.5146, Theory 0.3057, universe 0.1973, physical 0.1711, UNIFIED 0.1500, Dewey 0.1500, motion 0.1486, star 0.1484, physicist 0.1332, GENERAL 0.1255 |
| Topic 10 | fallacy 0.3918, argument 0.2608, premise 0.2340, conclusion 0.2177, ad 0.1496, proposition 0.1358, inference 0.1341, occur 0.1231, argumentum 0.1175, ARGUMENTUM 0.1175 |
| Corrected exact values | quality 0.09190958331644203, venture 0.12570558929369197, m 0.11304280746128555, p3 0.1415587579217417, Moooo −1.0979866037813425E-7 |

## Comparisons
| Step | scikit-learn (parts 2–4) | Spark (part 5) |
|---|---|---|
| Lemma | none | spark-corenlp `lemma` |
| Stop words | `stop_words='english'` argument | `StopWordsRemover` with CoreNLP list + 13 |
| DTM | `TfidfVectorizer` (one step) | `CountVectorizer` → `IDF` (two fits) |
| idf | ln((1+n)/(1+df)) + 1 | ln((m+1)/(df+1)) |
| Row norm | L2 | none |
| SVD | `TruncatedSVD(n_components=2)` | `RowMatrix.computeSVD(50, computeU=true)` (mllib, RDD) |
| Topic reading | pandas, sorted by absolute value | Scala, sorted by signed value |

## Fact Check
14 claims: 11 confirmed, 2 partly, 1 contradicted.
- SVD not in spark.ml, must use RDD-based spark.mllib — confirmed (ml-features has PCA, no SVD; mllib in maintenance mode since 2.0, not deprecated).
- Stop words are a separate transformation in Spark — confirmed (`StopWordsRemover`; `CountVectorizer` has no stop-word parameter).
- "We must provide our own list" — contradicted (API: `stopWords` default = English stop words; `loadDefaultStopWords(language)` exists).
- CoreNLP publishes an English stop list on GitHub — confirmed (patterns/surface/stopwords.txt, 257 lines, via a summarising fetch).
- spark-corenlp provides `lemma` — confirmed (README function list).
- Maven coordinate on the slide — confirmed (spark-packages 0.4.0-spark2.4-scala2.11, 2018-11-16, GPL-3.0).
- Pre-trained models must be downloaded — partly (true; README example uses 3.9.1 models, the clip loads 3.6.0; compatibility not checked).
- Lemma = dictionary form — confirmed (Wikipedia, Lemmatisation).
- TF-IDF in Spark is two steps — confirmed (Spark docs).
- 20 Newsgroups = newsgroup posts — confirmed (sklearn: 18,846 posts, 20 groups; size of the clip's copy unknown).
- Lemmatisation took about 30 s — partly (frame: 40.97 s).
- "was" → "be" — confirmed (frame).
- 50 columns via `computeSVD` — confirmed (code; Spark docs).
- (author) -lcb-/-rcb- are curly-bracket tokens — confirmed via secondary source (DrQA tokenizer maps -LCB- → "{", -RCB- → "}").

## Open Questions & Extension Ideas
- Re-run with absolute-value sorting (or sign-normalised columns) to see what topic 1 really is; expected: the most frequent terms of the corpus (uncentred first direction).
- Add `lower` before `CountVectorizer` and `Normalizer(p=2)` after `IDF`; compare topics with the clip's.
- Check whether the shown printout (3/26/2019) belongs to the SVD computed on 4/16/2019.
- The notebook continues with Latent Dirichlet Allocation (Cmd 24), not covered.
- ZVect: the Q&A page plan (TF-IDF → SVD latent space) should fix the sign of every latent axis and use absolute or sign-normalised loadings when showing "topic words"; Thai needs word segmentation (and no lemma step exists for Thai in this pipeline).

## Tags & Triggers
LSA, latent semantic analysis, Apache Spark, Scala, spark.mllib, RowMatrix, computeSVD, CountVectorizer, IDF, StopWordsRemover, Stanford CoreNLP, spark-corenlp, lemmatization, 20 Newsgroups, Databricks, SVD sign ambiguity, Perron–Frobenius.
Triggers: "LSA in Spark", "Spark IDF formula vs sklearn", "why is the first LSA topic noisy", "install CoreNLP on Databricks", "does computeSVD use A^T A / ARPACK".

## References
- Joshua Cook (Databricks Academy), "Latent Semantic Analysis with Apache Spark (5/5)", YouTube, 2019-05-16 — https://www.youtube.com/watch?v=OXJdfpEFmF8
- Spark ml-features — https://spark.apache.org/docs/latest/ml-features.html
- Spark API StopWordsRemover — https://spark.apache.org/docs/latest/api/scala/org/apache/spark/ml/feature/StopWordsRemover.html
- Spark API CountVectorizer — https://spark.apache.org/docs/latest/api/scala/org/apache/spark/ml/feature/CountVectorizer.html
- Spark API IDF — https://spark.apache.org/docs/latest/api/scala/org/apache/spark/ml/feature/IDF.html
- Spark mllib dimensionality reduction — https://spark.apache.org/docs/latest/mllib-dimensionality-reduction.html
- Spark ML guide (spark.mllib status) — https://spark.apache.org/docs/latest/ml-guide.html
- spark-packages databricks/spark-corenlp — https://spark-packages.org/package/databricks/spark-corenlp
- GitHub databricks/spark-corenlp — https://github.com/databricks/spark-corenlp
- CoreNLP stopwords.txt — https://github.com/stanfordnlp/CoreNLP/blob/master/data/edu/stanford/nlp/patterns/surface/stopwords.txt
- scikit-learn fetch_20newsgroups — https://scikit-learn.org/stable/modules/generated/sklearn.datasets.fetch_20newsgroups.html
- Wikipedia, Lemmatisation — https://en.wikipedia.org/wiki/Lemmatisation
- DrQA corenlp_tokenizer.py — https://huggingface.co/spaces/zhenyundeng/AVeriTeC-API/blob/8c5fc492046f78f3f2312ba61faa1e9be74f13b5/drqa/tokenizers/corenlp_tokenizer.py
- Author recomputation: recompute.py / recompute.out (numpy 2.5.3).
- Related reports (same folder): 20190422_Introduction-To-Latent-Semantic-Analysis (part 1), 20190516_Trivial-LSA-With-Scikit-Learn (part 2), 20190422_LSA-Two-Childrens-Books-Part-3 (part 3), 20190422_Improving-LSA-With-TF-IDF-Part-4 (part 4), this report (part 5), 20200331_Latent-Semantic-Indexing-Explained (LSI), 20191117_Latent-Semantic-Analysis-Lsa (LSA, Iacobelli).
