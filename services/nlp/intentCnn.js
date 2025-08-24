import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";

let ready = false;
let model = null;
let labels = ["default"];

export async function initTf() {
  if (ready) return;
  await tf.ready();
  // Backend RN
  // eslint-disable-next-line no-undef
  if (tf.getBackend() !== "rn-webgl") await tf.setBackend("rn-webgl");
  ready = true;
}

export async function loadIntentModel({ modelUrl, labelsArray }) {
  await initTf();
  if (!modelUrl) return null;
  model = await tf.loadLayersModel(modelUrl);
  if (labelsArray?.length) labels = labelsArray;
  return model;
}

function textToIds(text, { vocab = null, maxLen = 128 } = {}) {
  const s = text.toLowerCase();
  const ids = [];
  for (let i = 0; i < s.length && ids.length < maxLen; i++) {
    const ch = s.charCodeAt(i);
    // map ASCII range, else 0
    const id = ch >= 32 && ch < 127 ? ch - 31 : 0;
    ids.push(id);
  }
  while (ids.length < maxLen) ids.push(0);
  return tf.tensor2d([ids], [1, maxLen]);
}

export async function classifyIntent(text) {
  if (!model) return { label: "default", probs: [1] };
  const x = textToIds(text);
  const logits = model.predict(x);
  const probs = (await logits.softmax().data()).slice();
  const argmax = probs.reduce((best, v, i) => (v > best.v ? { v, i } : best), {
    v: -1,
    i: 0,
  }).i;
  x.dispose();
  logits.dispose?.();
  return { label: labels[argmax] || "default", probs };
}
