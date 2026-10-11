// dict/adapters.js — where the dictionary comes from and where it is kept. The facade (index.js) only talks to these two
// small interfaces, so the storage or the source can be swapped (tests, another backend) without touching the rest.
//   source: { load() → Promise<{ texts: { [file]: string } }> }
//   store:  { read() → object | null, write(object) → void }

// default words: the JSON files in web/data/dict/, fetched next to this module
export function jsonFileSource(files, base = new URL("../../data/dict/", import.meta.url)) {
  return {
    async load() {
      const texts = await Promise.all(files.map((f) =>
        fetch(new URL(`${f}.json`, base)).then((r) => { if (!r.ok) throw new Error(f + ".json " + r.status); return r.text(); })));
      return { texts: Object.fromEntries(files.map((f, i) => [f, texts[i]])) };
    },
  };
}

// this browser's localStorage; private mode or blocked storage: read gives null and write does nothing (defaults only)
export function localStorageStore(key) {
  return {
    read() { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
    write(value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage blocked */ } },
  };
}

// keeps everything in memory (tests, or a page that must not touch storage)
export function memoryStore(initial = null) {
  let value = initial ? JSON.parse(JSON.stringify(initial)) : null;
  return { read: () => (value ? JSON.parse(JSON.stringify(value)) : null), write: (v) => { value = JSON.parse(JSON.stringify(v)); } };
}
