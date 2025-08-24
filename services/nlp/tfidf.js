function normalize(text) {}

function tokenize(text) {
  return normalize(text).split(" ").filter(Boolean);
}

export class TfIdf {
  constructor() {
    this.docs = []; // { id, tokens }
    this.df = new Map(); // term -> doc freq
    this.idf = new Map(); // term -> idf
    this.index = []; // vectors by doc
    this.termIndex = new Map(); // term -> column idx
  }

  addDoc(id, text) {
    const tokens = Array.from(new Set(tokenize(text)));
    this.docs.push({ id, tokens });
    for (const t of tokens) this.df.set(t, (this.df.get(t) || 0) + 1);
  }

  finalize() {
    const N = this.docs.length || 1;
    const terms = Array.from(this.df.keys());
    terms.forEach((t, i) => this.termIndex.set(t, i));
    terms.forEach((t) =>
      this.idf.set(t, Math.log((N + 1) / (1 + (this.df.get(t) || 0))) + 1)
    );

    for (const d of this.docs) {
      const vec = new Float32Array(terms.length);
      const counts = new Map();
      for (const t of d.tokens) counts.set(t, (counts.get(t) || 0) + 1);
      const maxf = Math.max(1, ...counts.values());
      for (const [t, f] of counts) {
        const j = this.termIndex.get(t);
        if (j != null) vec[j] = (f / maxf) * (this.idf.get(t) || 0);
      }
      this.index.push({ id: d.id, vec });
    }
  }

  _cosine(a, b) {
    let dot = 0,
      na = 0,
      nb = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      na += a[i] * a[i];
      nb += b[i] * b[i];
    }
    return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-9);
  }

  topKSimilar(query, k = 5) {
    const qTokens = tokenize(query);
    const qVec = new Float32Array(this.termIndex.size);
    const counts = new Map();
    for (const t of qTokens) counts.set(t, (counts.get(t) || 0) + 1);
    const maxf = Math.max(1, ...counts.values());
    for (const [t, f] of counts) {
      const j = this.termIndex.get(t);
      if (j != null) qVec[j] = (f / maxf) * (this.idf.get(t) || 0);
    }
    return this.index
      .map((r) => ({ id: r.id, score: this._cosine(qVec, r.vec) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }
}

export async function buildTfIdfFromCorpus(corpus) {
  // corpus : [{id, text}]
  const tfidf = new TfIdf();
  corpus.forEach(({ id, text }) => tfidf.addDoc(id, text));
  tfidf.finalize();
  return tfidf;
}
