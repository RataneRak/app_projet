// services/tts/offline/g2p_malagasy.js
function normalize(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "")
    .replace(/[^a-z' -]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const DIGRAPHS = [
  [/ny/g, "ɲ"],
  [/ng/g, "ŋ"],
  [/ts/g, "ʦ"],
];

export function g2p(text) {
  let s = normalize(text);
  for (const [re, to] of DIGRAPHS) s = s.replace(re, to);
  const map = {
    a: "a",
    e: "e",
    i: "i",
    o: "o",
    u: "u",
    b: "b",
    d: "d",
    f: "f",
    g: "g",
    h: "h",
    j: "ʒ",
    k: "k",
    l: "l",
    m: "m",
    n: "n",
    p: "p",
    r: "r",
    s: "s",
    t: "t",
    v: "v",
    z: "z",
    ɲ: "ɲ",
    ŋ: "ŋ",
    ʦ: "ʦ",
    "-": "|",
    " ": "|",
    "'": "",
  };
  const out = [];
  for (const ch of s) out.push(map[ch] ?? ch);
  return out.join(" ").replace(/\s+/g, " ").trim();
}
