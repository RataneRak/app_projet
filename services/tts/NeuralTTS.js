import * as Speech from 'expo-speech';
this.currentSound = null;
}


async stop() {
try { Speech.stop(); } catch {}
if (this.currentSound) {
try { await this.currentSound.stopAsync(); await this.currentSound.unloadAsync(); } catch {}
this.currentSound = null;
}
}


/**
* Speak text with language hint (lid = 'fr'|'mg'|'en' ...)
*/
async speak(text, { lid = 'fr', pitch = 1.0, rate, voiceId } = {}) {
await this.stop();
if (!text || !text.trim()) return;


if (this.provider === 'native') {
const vCfg = DEFAULTS.voiceByLang[lid] || DEFAULTS.voiceByLang.fr;
Speech.speak(text, {
language: vCfg.native,
pitch,
rate: rate ?? vCfg.rate,
voice: voiceId, // facultatif: id natif si vous le connaissez
});
return;
}


if (this.provider === 'http') {
// POST {text, lid, voiceId} => retourne audio/mpeg (Buffer)
const res = await fetch(this.httpEndpoint, {
method: 'POST',
headers: { 'Content-Type': 'application/json', ...this.httpHeaders },
body: JSON.stringify({ text, lid, voiceId, pitch, rate }),
});
if (!res.ok) throw new Error('HTTP TTS failed');
const blob = await res.blob();
await this._playBlob(blob);
return;
}


if (this.provider === 'azure') {
// Ex : utilisez le SDK Speech de Microsoft côté RN (nécessite config native)
// Pour rester générique et simple ici, on recommande plutôt un proxy HTTP (provider='http').
throw new Error('Azure provider : implémentez selon votre config projet.');
}
}


async _playBlob(blob) {
const arrayBuffer = await blob.arrayBuffer();
const sound = new Audio.Sound();
await sound.loadAsync({ uri: `data:audio/mpeg;base64,${this._arrayBufferToBase64(arrayBuffer)}` });
this.currentSound = sound;
await sound.playAsync();
}


_arrayBufferToBase64(buffer) {
let binary = '';
const bytes = new Uint8Array(buffer);
const len = bytes.byteLength;
for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
return global.btoa(binary);
}
}


export default NeuralTTS;