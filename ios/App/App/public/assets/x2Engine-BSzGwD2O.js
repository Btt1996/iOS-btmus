const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/web-Bvju295W.js","assets/definitions-dS0bAjGV.js","assets/db-Cr6tU0Tr.js","assets/rolldown-runtime-DQp2zzRu.js"])))=>i.map(i=>d[i]);
import { a as __toESM } from "./rolldown-runtime-DQp2zzRu.js";
import { Dt as require_react } from "./vendor-icons-DVdP9XFB.js";
import { _ as saveSetting, a as deleteTracks, b as updateTrackMetadata, c as getAllPlaylists, d as getAudioBlob, f as getSetting, g as savePlaylist, i as deleteTrack, l as getAllTrackAnalyses, p as getStorageEstimate, r as deletePlaylist, s as findVerifiedCachedTrack, u as getAllTracks, v as saveTrack, y as saveTrackAnalysis } from "./db-Cr6tU0Tr.js";
import { a as registerPlugin, r as Capacitor, t as ImpactStyle } from "./definitions-dS0bAjGV.js";
import { l as require_jsx_runtime } from "./vendor-motion-CvHAzLEi.js";
// src/services/audioAnalysis.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var PITCH_CLASSES = [
	"C",
	"C#",
	"D",
	"D#",
	"E",
	"F",
	"F#",
	"G",
	"G#",
	"A",
	"A#",
	"B"
];
var MAJOR_PROFILE = [
	6.35,
	2.23,
	3.48,
	2.33,
	4.38,
	4.09,
	2.52,
	5.19,
	2.39,
	3.66,
	2.29,
	2.88
];
var MINOR_PROFILE = [
	6.33,
	2.68,
	3.52,
	5.38,
	2.6,
	3.53,
	2.54,
	4.75,
	3.98,
	2.69,
	3.34,
	3.17
];
var CAMELOT_MAP = {
	"Ab minor": "1A",
	"B major": "1B",
	"Eb minor": "2A",
	"F# major": "2B",
	"Bb minor": "3A",
	"Db major": "3B",
	"F minor": "4A",
	"Ab major": "4B",
	"C minor": "5A",
	"Eb major": "5B",
	"G minor": "6A",
	"Bb major": "6B",
	"D minor": "7A",
	"F major": "7B",
	"A minor": "8A",
	"C major": "8B",
	"E minor": "9A",
	"G major": "9B",
	"B minor": "10A",
	"D major": "10B",
	"F# minor": "11A",
	"A major": "11B",
	"Db minor": "12A",
	"E major": "12B"
};
var KEY_ALIASES = {
	"G# minor": "Ab minor",
	"Gb major": "F# major",
	"D# minor": "Eb minor",
	"C# major": "Db major",
	"A# minor": "Bb minor",
	"G# major": "Ab major",
	"D# major": "Eb major",
	"A# major": "Bb major",
	"C# minor": "Db minor"
};
/**
* Perform genuine Web Audio local analysis on an audio Blob.
* Computes BPM, Musical Key, Camelot code, RMS Energy, Silence trims, and Loudness.
*/
async function analyzeTrackAudio(blob, trackId) {
	const AudioCtx = window.AudioContext || window.webkitAudioContext;
	if (!AudioCtx) throw new Error("Web Audio API is not supported in this browser.");
	const sliceSize = Math.min(blob.size, 3145728);
	const arrayBuffer = await blob.slice(0, sliceSize).arrayBuffer();
	const ctx = new AudioCtx();
	let audioBuffer;
	try {
		audioBuffer = await ctx.decodeAudioData(arrayBuffer);
	} finally {
		ctx.close().catch(() => {});
	}
	const channelData = audioBuffer.getChannelData(0);
	const sampleRate = audioBuffer.sampleRate;
	const { energy, loudnessDb, introSilence, outroSilence } = calculateEnergyAndSilence(channelData, sampleRate);
	const bpm = estimateBPM(channelData, sampleRate);
	const { key, camelot } = estimateMusicalKey(channelData, sampleRate);
	const suggestedFadeIn = Math.max(.5, introSilence);
	const suggestedFadeOut = Math.max(.5, outroSilence);
	return {
		trackId,
		bpm: Math.round(bpm),
		key,
		camelot,
		energy: parseFloat(energy.toFixed(2)),
		loudnessDb: parseFloat(loudnessDb.toFixed(1)),
		introSilenceDuration: parseFloat(introSilence.toFixed(2)),
		outroSilenceDuration: parseFloat(outroSilence.toFixed(2)),
		suggestedFadeInPoint: parseFloat(suggestedFadeIn.toFixed(2)),
		suggestedFadeOutPoint: parseFloat(suggestedFadeOut.toFixed(2)),
		analyzedAt: Date.now(),
		version: 1
	};
}
function calculateEnergyAndSilence(data, sampleRate) {
	const totalSamples = data.length;
	let sumSquares = 0;
	const silenceThreshold = .008;
	const step = 4;
	let count = 0;
	for (let i = 0; i < totalSamples; i += step) {
		sumSquares += data[i] * data[i];
		count++;
	}
	const rms = Math.sqrt(sumSquares / Math.max(1, count));
	const loudnessDb = 20 * Math.log10(rms + 1e-6);
	const energy = Math.min(1, Math.max(.1, (loudnessDb + 45) / 45));
	let introSamples = 0;
	const maxIntroSamples = Math.min(totalSamples, sampleRate * 10);
	for (let i = 0; i < maxIntroSamples; i += 256) {
		let windowPeak = 0;
		for (let j = 0; j < 256 && i + j < maxIntroSamples; j++) {
			const val = Math.abs(data[i + j]);
			if (val > windowPeak) windowPeak = val;
		}
		if (windowPeak > silenceThreshold) {
			introSamples = i;
			break;
		}
	}
	const introSilence = introSamples / sampleRate;
	let outroSamples = 0;
	const maxOutroSamples = Math.min(totalSamples, sampleRate * 10);
	for (let i = totalSamples - 1; i > totalSamples - maxOutroSamples; i -= 256) {
		let windowPeak = 0;
		for (let j = 0; j < 256 && i - j >= 0; j++) {
			const val = Math.abs(data[i - j]);
			if (val > windowPeak) windowPeak = val;
		}
		if (windowPeak > silenceThreshold) {
			outroSamples = totalSamples - 1 - i;
			break;
		}
	}
	return {
		energy,
		loudnessDb,
		introSilence,
		outroSilence: outroSamples / sampleRate
	};
}
function estimateBPM(data, sampleRate) {
	const downsampleRatio = Math.max(1, Math.floor(sampleRate / 11025));
	const targetLen = Math.floor(data.length / downsampleRatio);
	const downsampled = new Float32Array(targetLen);
	for (let i = 0; i < targetLen; i++) downsampled[i] = data[i * downsampleRatio];
	const effectiveSampleRate = sampleRate / downsampleRatio;
	const windowSize = 512;
	const numWindows = Math.floor(downsampled.length / windowSize);
	const energyEnvelope = new Float32Array(numWindows);
	for (let w = 0; w < numWindows; w++) {
		let sum = 0;
		const start = w * windowSize;
		for (let i = 0; i < windowSize; i++) {
			const val = downsampled[start + i];
			sum += val * val;
		}
		energyEnvelope[w] = Math.sqrt(sum / windowSize);
	}
	const flux = new Float32Array(numWindows);
	for (let i = 1; i < numWindows; i++) {
		const diff = energyEnvelope[i] - energyEnvelope[i - 1];
		flux[i] = diff > 0 ? diff : 0;
	}
	const minBpm = 70;
	const maxBpm = 175;
	const envelopeRate = effectiveSampleRate / windowSize;
	const minLag = Math.floor(60 / maxBpm * envelopeRate);
	const maxLag = Math.floor(60 / minBpm * envelopeRate);
	let bestLag = 0;
	let maxCorrelation = -1;
	for (let lag = minLag; lag <= maxLag; lag++) {
		let corr = 0;
		for (let i = 0; i < numWindows - lag; i++) corr += flux[i] * flux[i + lag];
		if (corr > maxCorrelation) {
			maxCorrelation = corr;
			bestLag = lag;
		}
	}
	if (bestLag === 0) return 120;
	let estimatedBpm = 60 * envelopeRate / bestLag;
	if (estimatedBpm < 70) estimatedBpm *= 2;
	if (estimatedBpm > 180) estimatedBpm /= 2;
	return Math.max(65, Math.min(180, estimatedBpm));
}
function estimateMusicalKey(data, sampleRate) {
	const chroma = /* @__PURE__ */ new Float64Array(12);
	const numSamples = Math.min(data.length, sampleRate * 30);
	const A4 = 440;
	for (let i = 0; i < 12; i++) {
		let classEnergy = 0;
		for (let octave = 3; octave <= 5; octave++) {
			const midi = (octave + 1) * 12 + i;
			const freq = A4 * Math.pow(2, (midi - 69) / 12);
			const k = Math.round(freq * 2048 / sampleRate);
			if (k > 0 && k < 1024) classEnergy += goertzelEnergy(data, freq, sampleRate, numSamples);
		}
		chroma[i] = classEnergy;
	}
	const chromaMax = Math.max(...Array.from(chroma), 1e-6);
	for (let i = 0; i < 12; i++) chroma[i] /= chromaMax;
	let bestScore = -999;
	let bestKey = "A minor";
	for (let root = 0; root < 12; root++) {
		const majorScore = correlation(chroma, MAJOR_PROFILE, root);
		if (majorScore > bestScore) {
			bestScore = majorScore;
			bestKey = `${PITCH_CLASSES[root]} major`;
		}
		const minorScore = correlation(chroma, MINOR_PROFILE, root);
		if (minorScore > bestScore) {
			bestScore = minorScore;
			bestKey = `${PITCH_CLASSES[root]} minor`;
		}
	}
	const camelot = CAMELOT_MAP[KEY_ALIASES[bestKey] || bestKey] || CAMELOT_MAP[bestKey] || "8A";
	return {
		key: bestKey,
		camelot
	};
}
function goertzelEnergy(data, targetFreq, sampleRate, maxSamples) {
	const k = Math.floor(.5 + 2048 * targetFreq / sampleRate);
	const w = 2 * Math.PI * k / 2048;
	const coeff = 2 * Math.cos(w);
	let s0 = 0, s1 = 0, s2 = 0;
	const limit = Math.min(data.length, maxSamples, 8192);
	for (let i = 0; i < limit; i++) {
		s0 = data[i] + coeff * s1 - s2;
		s2 = s1;
		s1 = s0;
	}
	return s1 * s1 + s2 * s2 - coeff * s1 * s2;
}
function correlation(chroma, profile, shift) {
	let sum = 0;
	for (let i = 0; i < 12; i++) {
		const profileIdx = (i - shift + 12) % 12;
		sum += chroma[i] * profile[profileIdx];
	}
	return sum;
}
function calculateTransitionCompatibility(analysisA, analysisB) {
	if (!analysisA || !analysisB) return {
		score: 75,
		label: "Natural Crossfade",
		harmonicMatch: false,
		tempoDifference: 0
	};
	const camelotA = analysisA.camelot || "8A";
	const camelotB = analysisB.camelot || "8A";
	const numA = parseInt(camelotA.slice(0, -1), 10);
	const letterA = camelotA.slice(-1);
	const numB = parseInt(camelotB.slice(0, -1), 10);
	const letterB = camelotB.slice(-1);
	let harmonicScore = 50;
	let harmonicMatch = false;
	if (camelotA === camelotB) {
		harmonicScore = 100;
		harmonicMatch = true;
	} else if (Math.abs(numA - numB) === 0 && letterA !== letterB) {
		harmonicScore = 90;
		harmonicMatch = true;
	} else if ((Math.abs(numA - numB) === 1 || Math.abs(numA - numB) === 11) && letterA === letterB) {
		harmonicScore = 88;
		harmonicMatch = true;
	} else if ((Math.abs(numA - numB) === 2 || Math.abs(numA - numB) === 10) && letterA === letterB) harmonicScore = 70;
	const bpmDiff = Math.abs(analysisA.bpm - analysisB.bpm);
	const bpmRatio = bpmDiff / Math.max(1, Math.min(analysisA.bpm, analysisB.bpm));
	const tempoScore = Math.max(20, Math.min(100, Math.round(100 - bpmRatio * 250)));
	const energyDiff = Math.abs(analysisA.energy - analysisB.energy);
	const energyScore = energyDiff < .25 ? 95 : energyDiff < .5 ? 80 : 65;
	const totalScore = Math.round(harmonicScore * .5 + tempoScore * .35 + energyScore * .15);
	let label = "Smooth Transition";
	if (totalScore >= 90) label = "Harmonic Match ⭐";
	else if (totalScore >= 78) label = "Compatible Transition";
	else if (totalScore < 60) label = "Contrasting Transition";
	return {
		score: totalScore,
		label,
		harmonicMatch,
		tempoDifference: Math.round(bpmDiff)
	};
}
function optimizePlaylistOrder(trackIds, analysisMap) {
	if (trackIds.length <= 2) return {
		optimizedTrackIds: trackIds,
		averageScore: 85
	};
	const remaining = [...trackIds];
	const ordered = [remaining.shift()];
	let totalScore = 0;
	while (remaining.length > 0) {
		const currentAnalysis = analysisMap[ordered[ordered.length - 1]];
		let bestIdx = 0;
		let bestScore = -1;
		for (let i = 0; i < remaining.length; i++) {
			const candidateAnalysis = analysisMap[remaining[i]];
			const { score } = calculateTransitionCompatibility(currentAnalysis, candidateAnalysis);
			if (score > bestScore) {
				bestScore = score;
				bestIdx = i;
			}
		}
		totalScore += bestScore > 0 ? bestScore : 70;
		ordered.push(remaining.splice(bestIdx, 1)[0]);
	}
	return {
		optimizedTrackIds: ordered,
		averageScore: Math.round(totalScore / (ordered.length - 1))
	};
}
// \0vite/preload-helper.js
var scriptRel = "modulepreload";
var assetsURL = function(dep) {
	return "/" + dep;
};
var seen = {};
var isCssPreloadUrl = function isCssPreloadUrl(url) {
	return url.pathname.endsWith(".css");
};
var preloadOnce = function preloadOnce(seen, href, preload) {
	if (href in seen) return seen[href];
	const promise = preload();
	if (!promise) {
		seen[href] = void 0;
		return;
	}
	const preloadPromise = promise.then(() => {
		seen[href] = void 0;
	}, (err) => {
		seen[href] = void 0;
		throw err;
	});
	seen[href] = preloadPromise;
	return preloadPromise;
};
var __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (deps && deps.length > 0) {
		let preloadedHrefs;
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
		function allSettled(promises) {
			return Promise.all(promises.map((p) => Promise.resolve(p).then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		function importMetaResolve(specifier) {
			if (import.meta.resolve) return new URL(import.meta.resolve(specifier));
			return new URL(
				specifier,
				/** #__KEEP__ */
				import.meta.url
			);
		}
		promise = allSettled(deps.map((depString) => {
			depString = assetsURL(depString, importerUrl);
			const dep = importMetaResolve(depString);
			const isCss = isCssPreloadUrl(dep);
			return preloadOnce(seen, dep.href, () => {
				if (preloadedHrefs === void 0) {
					preloadedHrefs = {
						all: /* @__PURE__ */ new Set(),
						styles: /* @__PURE__ */ new Set()
					};
					const links = document.getElementsByTagName("link");
					for (let i = links.length - 1; i >= 0; i--) {
						const link = links[i];
						preloadedHrefs.all.add(link.href);
						if (link.rel === "stylesheet") preloadedHrefs.styles.add(link.href);
					}
				}
				if ((isCss ? preloadedHrefs.styles : preloadedHrefs.all).has(dep.href)) return;
				const link = document.createElement("link");
				link.rel = isCss ? "stylesheet" : scriptRel;
				if (!isCss) link.as = "script";
				link.crossOrigin = "";
				link.href = dep.href;
				if (cspNonce) link.setAttribute("nonce", cspNonce);
				document.head.appendChild(link);
				if (isCss) return new Promise((res, rej) => {
					link.addEventListener("load", res);
					link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
				});
			});
		}).filter((p) => p !== void 0));
	}
	function handlePreloadError(err) {
		const e = new Event("vite:preloadError", { cancelable: true });
		e.payload = err;
		window.dispatchEvent(e);
		if (!e.defaultPrevented) throw err;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};
// node_modules/@capacitor/haptics/dist/esm/index.js
var Haptics = registerPlugin("Haptics", { web: () => __vitePreload(() => import("./web-Bvju295W.js").then((m) => new m.HapticsWeb()), __vite__mapDeps([0,1])) });
// src/services/nativeAudioBridge.ts
/**
* Register native AudioBridge plugin with safe Web/PWA fallback
*/
var AudioBridge = registerPlugin("AudioBridge", { web: {
	configureAudioSession: async () => ({ configured: false }),
	setNowPlayingInfo: async () => ({ success: false }),
	updatePlaybackState: async () => ({ success: false }),
	clearNowPlayingInfo: async () => ({ success: false }),
	beginBackgroundTask: async () => ({ taskId: 0 }),
	endBackgroundTask: async () => ({ ended: true }),
	addListener: async () => ({ remove: () => {} })
} });
var isNativePlatform = Capacitor.isNativePlatform();
isNativePlatform && Capacitor.getPlatform();
/**
* Haptic feedback helper for native iOS tactile response
*/
async function triggerHaptic(style = ImpactStyle.Light) {
	if (!isNativePlatform) return;
	try {
		await Haptics.impact({ style });
	} catch {}
}
// src/context/MusicContext.tsx
var import_jsx_runtime = require_jsx_runtime();
var MusicContext = (0, import_react.createContext)(null);
var DEFAULT_SMART_MIX = {
	enabled: true,
	preset: "balanced",
	duration: 6,
	style: "smooth",
	trimSilence: true,
	useHarmonicMixing: true
};
var DEFAULT_SETTINGS = {
	defaultShuffle: false,
	defaultRepeat: "off",
	rememberPosition: true,
	defaultPlaybackRate: 1,
	telegramBotToken: "",
	autoCreatePlaylists: true,
	skipDuplicates: true,
	smartMix: DEFAULT_SMART_MIX,
	volumeBooster: 1,
	isBoosterActive: false,
	paletteCombo: "signature"
};
var MusicProvider = ({ children }) => {
	const [tracks, setTracks] = (0, import_react.useState)([]);
	const [playlists, setPlaylists] = (0, import_react.useState)([]);
	const [trackAnalyses, setTrackAnalyses] = (0, import_react.useState)({});
	const [settings, setSettings] = (0, import_react.useState)(DEFAULT_SETTINGS);
	const [storageStats, setStorageStats] = (0, import_react.useState)({
		usedBytes: 0,
		quotaBytes: 0,
		trackCount: 0,
		trackBytes: 0
	});
	const [isFullScreenPlayerOpen, setIsFullScreenPlayerOpen] = (0, import_react.useState)(false);
	const [toastMessage, setToastMessage] = (0, import_react.useState)(null);
	const [playerState, setPlayerState] = (0, import_react.useState)({
		currentTrack: null,
		isPlaying: false,
		isLoading: false,
		currentTime: 0,
		duration: 0,
		volume: 1,
		isMuted: false,
		playbackRate: 1,
		repeatMode: "off",
		isShuffle: false,
		queue: [],
		queueIndex: -1,
		error: null,
		smartMixConfig: DEFAULT_SMART_MIX,
		isSmartMixBlending: false,
		activeAnalysis: null,
		isAnalyzing: false,
		analysisProgress: null,
		volumeBooster: 1,
		isBoosterActive: false
	});
	const deckARef = (0, import_react.useRef)(null);
	const deckBRef = (0, import_react.useRef)(null);
	const activeDeckRef = (0, import_react.useRef)("A");
	const activeUrlARef = (0, import_react.useRef)(null);
	const activeUrlBRef = (0, import_react.useRef)(null);
	const playerStateRef = (0, import_react.useRef)(playerState);
	playerStateRef.current = playerState;
	const nextTrackRef = (0, import_react.useRef)(() => {});
	const prevTrackRef = (0, import_react.useRef)(() => {});
	const togglePlayPauseRef = (0, import_react.useRef)(() => {});
	const seekToRef = (0, import_react.useRef)(() => {});
	const playTrackRef = (0, import_react.useRef)((() => Promise.resolve()));
	const crossfadeTimerRef = (0, import_react.useRef)(null);
	const isCrossfadingRef = (0, import_react.useRef)(false);
	const originalQueueRef = (0, import_react.useRef)([]);
	const SILENT_AUDIO_URI = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
	const silentKeepAliveRef = (0, import_react.useRef)(null);
	const audioCtxRef = (0, import_react.useRef)(null);
	(0, import_react.useRef)(null);
	const deckGainARef = (0, import_react.useRef)(null);
	const deckGainBRef = (0, import_react.useRef)(null);
	(0, import_react.useRef)(null);
	(0, import_react.useRef)(false);
	const preloadedUrlsRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const showToast = (0, import_react.useCallback)((msg) => {
		setToastMessage(msg);
		setTimeout(() => {
			setToastMessage((current) => current === msg ? null : current);
		}, 3200);
	}, []);
	const ensureWebAudio = (0, import_react.useCallback)(() => {
		if (silentKeepAliveRef.current && silentKeepAliveRef.current.paused && playerStateRef.current.isPlaying) silentKeepAliveRef.current.play().catch(() => {});
	}, []);
	const applyMasterGain = (0, import_react.useCallback)((vol, _booster, _isBooster, muted) => {
		const v = vol !== void 0 ? vol : playerStateRef.current.volume;
		const targetVol = (muted !== void 0 ? muted : playerStateRef.current.isMuted) ? 0 : Math.max(0, Math.min(1, v));
		const activeDeck = activeDeckRef.current === "A" ? deckARef.current : deckBRef.current;
		if (activeDeck) activeDeck.volume = targetVol;
	}, []);
	(0, import_react.useEffect)(() => {
		const deckA = deckARef.current || new Audio();
		const deckB = deckBRef.current || new Audio();
		deckA.preload = "auto";
		deckB.preload = "auto";
		deckA.setAttribute("playsinline", "true");
		deckB.setAttribute("playsinline", "true");
		deckA.setAttribute("webkit-playsinline", "true");
		deckB.setAttribute("webkit-playsinline", "true");
		deckA.setAttribute("x-webkit-airplay", "allow");
		deckB.setAttribute("x-webkit-airplay", "allow");
		deckARef.current = deckA;
		deckBRef.current = deckB;
		let silentAudio = silentKeepAliveRef.current;
		if (!silentAudio) {
			silentAudio = new Audio(SILENT_AUDIO_URI);
			silentKeepAliveRef.current = silentAudio;
		}
		silentAudio.loop = true;
		silentAudio.volume = .001;
		silentAudio.preload = "auto";
		silentAudio.setAttribute("playsinline", "true");
		silentAudio.setAttribute("webkit-playsinline", "true");
		const attachDeckListeners = (deck, deckId) => {
			const handleTimeUpdate = () => {
				if (activeDeckRef.current !== deckId) return;
				const dur = deck.duration && !isNaN(deck.duration) && isFinite(deck.duration) ? deck.duration : 0;
				setPlayerState((prev) => ({
					...prev,
					currentTime: deck.currentTime,
					duration: dur > 0 ? dur : prev.duration
				}));
				updateMediaSessionPosition(deck);
			};
			const handleLoadedMetadata = () => {
				if (activeDeckRef.current === deckId) {
					const dur = deck.duration && !isNaN(deck.duration) && isFinite(deck.duration) ? deck.duration : 0;
					setPlayerState((prev) => ({
						...prev,
						isLoading: false,
						duration: dur > 0 ? dur : prev.duration
					}));
				}
			};
			const handleWaiting = () => {
				if (activeDeckRef.current === deckId) setPlayerState((prev) => ({
					...prev,
					isLoading: true
				}));
			};
			const handleCanPlay = () => {
				if (activeDeckRef.current === deckId) setPlayerState((prev) => ({
					...prev,
					isLoading: false
				}));
			};
			const handlePlay = () => {
				if (activeDeckRef.current === deckId) {
					setPlayerState((prev) => ({
						...prev,
						isPlaying: true
					}));
					if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "playing";
					if (silentKeepAliveRef.current && silentKeepAliveRef.current.paused) silentKeepAliveRef.current.play().catch(() => {});
					if (isNativePlatform) AudioBridge.updatePlaybackState({
						currentTime: deck.currentTime,
						playbackRate: 1
					}).catch(() => {});
				}
			};
			const handlePause = () => {
				if (activeDeckRef.current === deckId && !isCrossfadingRef.current) {
					setPlayerState((prev) => ({
						...prev,
						isPlaying: false
					}));
					if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "paused";
					if (silentKeepAliveRef.current && !silentKeepAliveRef.current.paused) silentKeepAliveRef.current.pause();
					if (isNativePlatform) AudioBridge.updatePlaybackState({
						currentTime: deck.currentTime,
						playbackRate: 0
					}).catch(() => {});
				}
			};
			const handleError = () => {
				if (activeDeckRef.current === deckId) {
					console.warn("Audio playback error on deck", deckId, deck.error);
					setPlayerState((prev) => ({
						...prev,
						isPlaying: false,
						isLoading: false,
						error: "Playback error or unsupported format"
					}));
				}
			};
			const handleEnded = () => {
				if (isCrossfadingRef.current || activeDeckRef.current !== deckId) return;
				nextTrackRef.current();
			};
			deck.addEventListener("timeupdate", handleTimeUpdate);
			deck.addEventListener("loadedmetadata", handleLoadedMetadata);
			deck.addEventListener("waiting", handleWaiting);
			deck.addEventListener("canplay", handleCanPlay);
			deck.addEventListener("play", handlePlay);
			deck.addEventListener("pause", handlePause);
			deck.addEventListener("error", handleError);
			deck.addEventListener("ended", handleEnded);
			return () => {
				deck.removeEventListener("timeupdate", handleTimeUpdate);
				deck.removeEventListener("loadedmetadata", handleLoadedMetadata);
				deck.removeEventListener("waiting", handleWaiting);
				deck.removeEventListener("canplay", handleCanPlay);
				deck.removeEventListener("play", handlePlay);
				deck.removeEventListener("pause", handlePause);
				deck.removeEventListener("error", handleError);
				deck.removeEventListener("ended", handleEnded);
			};
		};
		const cleanupA = attachDeckListeners(deckA, "A");
		const cleanupB = attachDeckListeners(deckB, "B");
		const handleVisibilityChange = () => {
			const activeDeck = activeDeckRef.current === "A" ? deckA : deckB;
			if (document.visibilityState === "visible") {
				if (activeDeck && !activeDeck.paused) updateMediaSessionPosition(activeDeck);
			} else if (playerStateRef.current.isPlaying && silentKeepAliveRef.current && silentKeepAliveRef.current.paused) silentKeepAliveRef.current.play().catch(() => {});
		};
		document.addEventListener("visibilitychange", handleVisibilityChange);
		let removeNativeListeners = null;
		if (isNativePlatform) {
			AudioBridge.configureAudioSession().catch(console.warn);
			const setupNativeListeners = async () => {
				try {
					const remoteSub = await AudioBridge.addListener("remoteCommand", (event) => {
						switch (event.command) {
							case "play": {
								const activeDeck = activeDeckRef.current === "A" ? deckA : deckB;
								if (activeDeck && activeDeck.paused) activeDeck.play().catch(console.warn);
								break;
							}
							case "pause":
								(activeDeckRef.current === "A" ? deckA : deckB)?.pause();
								break;
							case "togglePlayPause":
								togglePlayPauseRef.current();
								break;
							case "nextTrack":
								nextTrackRef.current();
								break;
							case "previousTrack":
								prevTrackRef.current();
								break;
							case "seekTo": if (typeof event.position === "number") seekToRef.current(event.position);
						}
					});
					const interruptionSub = await AudioBridge.addListener("audioInterruption", (event) => {
						const activeDeck = activeDeckRef.current === "A" ? deckA : deckB;
						if (event.type === "began") activeDeck?.pause();
						else if (event.type === "ended" && event.shouldResume) activeDeck?.play().catch(console.warn);
					});
					const routeSub = await AudioBridge.addListener("routeChange", (event) => {
						if (event.reason === "oldDeviceUnavailable") (activeDeckRef.current === "A" ? deckA : deckB)?.pause();
					});
					removeNativeListeners = () => {
						remoteSub.remove?.();
						interruptionSub.remove?.();
						routeSub.remove?.();
					};
				} catch (err) {
					console.warn("Native AudioBridge listener setup error:", err);
				}
			};
			setupNativeListeners();
		}
		return () => {
			cleanupA();
			cleanupB();
			if (removeNativeListeners) removeNativeListeners();
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			deckA.pause();
			deckB.pause();
			if (silentKeepAliveRef.current) silentKeepAliveRef.current.pause();
			if (activeUrlARef.current) URL.revokeObjectURL(activeUrlARef.current);
			if (activeUrlBRef.current) URL.revokeObjectURL(activeUrlBRef.current);
			preloadedUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
			preloadedUrlsRef.current.clear();
			if (crossfadeTimerRef.current) clearInterval(crossfadeTimerRef.current);
		};
	}, []);
	const setupMediaSession = (0, import_react.useCallback)((track) => {
		if (!("mediaSession" in navigator)) return;
		const artwork = track.artworkUrl ? [{
			src: track.artworkUrl,
			sizes: "512x512",
			type: "image/png"
		}] : [{
			src: "/pwa-512x512.png",
			sizes: "512x512",
			type: "image/png"
		}];
		navigator.mediaSession.metadata = new MediaMetadata({
			title: track.title,
			artist: track.artist || "Unknown Artist",
			album: track.album || "btmu by Ahmed",
			artwork
		});
		navigator.mediaSession.playbackState = "playing";
		navigator.mediaSession.setActionHandler("play", () => {
			const activeDeck = activeDeckRef.current === "A" ? deckARef.current : deckBRef.current;
			if (activeDeck && activeDeck.paused) activeDeck.play().then(() => {
				if (silentKeepAliveRef.current && silentKeepAliveRef.current.paused) silentKeepAliveRef.current.play().catch(() => {});
			}).catch(console.warn);
		});
		navigator.mediaSession.setActionHandler("pause", () => {
			(activeDeckRef.current === "A" ? deckARef.current : deckBRef.current)?.pause();
			if (silentKeepAliveRef.current && !silentKeepAliveRef.current.paused) silentKeepAliveRef.current.pause();
		});
		try {
			navigator.mediaSession.setActionHandler("previoustrack", () => {
				prevTrackRef.current();
			});
		} catch {}
		try {
			navigator.mediaSession.setActionHandler("nexttrack", () => {
				nextTrackRef.current();
			});
		} catch {}
		try {
			navigator.mediaSession.setActionHandler("seekbackward", null);
		} catch {}
		try {
			navigator.mediaSession.setActionHandler("seekforward", null);
		} catch {}
		try {
			navigator.mediaSession.setActionHandler("seekto", (details) => {
				if (details.seekTime !== void 0) seekToRef.current(details.seekTime);
			});
		} catch {}
		if (isNativePlatform) {
			const activeDeck = activeDeckRef.current === "A" ? deckARef.current : deckBRef.current;
			AudioBridge.setNowPlayingInfo({
				title: track.title,
				artist: track.artist || "Unknown Artist",
				album: track.album || "btmu by Ahmed",
				duration: track.duration || 0,
				currentTime: activeDeck?.currentTime || 0,
				playbackRate: 1,
				artworkUrl: track.artworkUrl
			}).catch(console.warn);
		}
	}, []);
	const updateMediaSessionPosition = (audio) => {
		if ("mediaSession" in navigator && navigator.mediaSession.setPositionState) {
			if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0) try {
				navigator.mediaSession.setPositionState({
					duration: audio.duration,
					playbackRate: audio.playbackRate || 1,
					position: Math.min(audio.currentTime, audio.duration)
				});
			} catch {}
		}
		if (isNativePlatform) AudioBridge.updatePlaybackState({
			currentTime: audio.currentTime,
			playbackRate: audio.paused ? 0 : audio.playbackRate || 1
		}).catch(() => {});
	};
	const preloadQueueTracks = (0, import_react.useCallback)(async (currentIndex, queue) => {
		if (!queue || queue.length === 0) return;
		const indicesToPreload = [];
		for (let offset = 1; offset <= 3; offset++) {
			const nextIdx = currentIndex + offset;
			if (nextIdx < queue.length) indicesToPreload.push(nextIdx);
			else if (queue.length > 1) indicesToPreload.push((currentIndex + offset) % queue.length);
		}
		if (currentIndex - 1 >= 0) indicesToPreload.push(currentIndex - 1);
		else if (queue.length > 1) indicesToPreload.push(queue.length - 1);
		const neededIds = new Set(indicesToPreload.map((i) => queue[i]?.id).filter(Boolean));
		if (queue[currentIndex]?.id) neededIds.add(queue[currentIndex].id);
		for (const [id, url] of preloadedUrlsRef.current.entries()) if (!neededIds.has(id)) {
			URL.revokeObjectURL(url);
			preloadedUrlsRef.current.delete(id);
		}
		for (const idx of indicesToPreload) {
			const track = queue[idx];
			if (!track || preloadedUrlsRef.current.has(track.id)) continue;
			try {
				if (track.previewUrl) preloadedUrlsRef.current.set(track.id, track.previewUrl);
				else {
					const blob = await getAudioBlob(track.id);
					if (blob) {
						const url = URL.createObjectURL(blob);
						preloadedUrlsRef.current.set(track.id, url);
					}
				}
			} catch (err) {
				console.warn("Preload audio error for", track.id, err);
			}
		}
	}, []);
	const playTrack = (0, import_react.useCallback)(async (track, newQueue) => {
		if (crossfadeTimerRef.current) {
			clearInterval(crossfadeTimerRef.current);
			crossfadeTimerRef.current = null;
			isCrossfadingRef.current = false;
		}
		ensureWebAudio();
		applyMasterGain();
		if (deckBRef.current && !deckBRef.current.dataset.primed) {
			deckBRef.current.dataset.primed = "true";
			deckBRef.current.muted = true;
			deckBRef.current.play().then(() => {
				deckBRef.current?.pause();
				if (deckBRef.current) deckBRef.current.muted = false;
			}).catch(() => {});
		}
		activeDeckRef.current = "A";
		const activeDeck = deckARef.current;
		const inactiveDeck = deckBRef.current;
		if (!activeDeck) return;
		if (inactiveDeck) {
			inactiveDeck.pause();
			inactiveDeck.currentTime = 0;
		}
		if (deckGainARef.current && audioCtxRef.current) deckGainARef.current.gain.setValueAtTime(1, audioCtxRef.current.currentTime);
		if (deckGainBRef.current && audioCtxRef.current) deckGainBRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
		setPlayerState((prev) => ({
			...prev,
			isLoading: true,
			isSmartMixBlending: false,
			error: null
		}));
		if (isNativePlatform) {
			AudioBridge.beginBackgroundTask().catch(() => {});
			triggerHaptic();
		}
		try {
			let objectUrl = preloadedUrlsRef.current.get(track.id) || null;
			if (!objectUrl) {
				if (track.previewUrl) objectUrl = track.previewUrl;
				else {
					const blob = await getAudioBlob(track.id);
					if (!blob) throw new Error("Audio file is missing from offline storage.");
					objectUrl = URL.createObjectURL(blob);
					preloadedUrlsRef.current.set(track.id, objectUrl);
				}
			}
			if (activeUrlARef.current && activeUrlARef.current !== objectUrl) {}
			activeUrlARef.current = objectUrl;
			activeDeck.src = objectUrl;
			activeDeck.volume = playerStateRef.current.isMuted ? 0 : playerStateRef.current.volume;
			activeDeck.playbackRate = playerStateRef.current.playbackRate;
			activeDeck.currentTime = 0;
			await activeDeck.play();
			if (isNativePlatform) AudioBridge.endBackgroundTask().catch(() => {});
			const updatedTrack = {
				...track,
				playCount: (track.playCount || 0) + 1,
				lastPlayedAt: Date.now()
			};
			try {
				await updateTrackMetadata(updatedTrack);
			} catch {}
			setTracks((prev) => prev.map((t) => t.id === track.id ? updatedTrack : t));
			let finalQueue = playerStateRef.current.queue;
			let finalIndex = 0;
			if (newQueue && newQueue.length > 0) {
				originalQueueRef.current = newQueue;
				finalQueue = playerStateRef.current.isShuffle ? shuffleArray([...newQueue], updatedTrack) : newQueue;
				finalIndex = finalQueue.findIndex((t) => t.id === track.id);
			} else if (playerStateRef.current.queue.length > 0) {
				finalIndex = playerStateRef.current.queue.findIndex((t) => t.id === track.id);
				if (finalIndex === -1) {
					finalQueue = [...playerStateRef.current.queue, updatedTrack];
					finalIndex = finalQueue.length - 1;
				}
			} else {
				finalQueue = [updatedTrack];
				finalIndex = 0;
			}
			const analysis = trackAnalyses[track.id] || null;
			setPlayerState((prev) => ({
				...prev,
				currentTrack: updatedTrack,
				isPlaying: true,
				isLoading: false,
				currentTime: 0,
				duration: track.duration || 0,
				queue: finalQueue,
				queueIndex: finalIndex >= 0 ? finalIndex : 0,
				activeAnalysis: analysis,
				error: null
			}));
			setupMediaSession(updatedTrack);
			preloadQueueTracks(finalIndex >= 0 ? finalIndex : 0, finalQueue);
			if (!analysis) getAudioBlob(track.id).then((blob) => {
				if (blob) analyzeTrackAudio(blob, track.id).then(async (result) => {
					await saveTrackAnalysis(result);
					setTrackAnalyses((prev) => ({
						...prev,
						[track.id]: result
					}));
					setPlayerState((prev) => prev.currentTrack?.id === track.id ? {
						...prev,
						activeAnalysis: result
					} : prev);
				}).catch(() => {});
			});
		} catch (err) {
			if (isNativePlatform) AudioBridge.endBackgroundTask().catch(() => {});
			const msg = err instanceof Error ? err.message : "Failed to play audio";
			console.error("Play track failed:", err);
			setPlayerState((prev) => ({
				...prev,
				isLoading: false,
				isPlaying: false,
				error: msg
			}));
			showToast(msg);
		}
	}, [
		applyMasterGain,
		ensureWebAudio,
		preloadQueueTracks,
		setupMediaSession,
		showToast,
		trackAnalyses
	]);
	playTrackRef.current = playTrack;
	const nextTrack = (0, import_react.useCallback)(() => {
		if (crossfadeTimerRef.current) {
			clearInterval(crossfadeTimerRef.current);
			crossfadeTimerRef.current = null;
			isCrossfadingRef.current = false;
		}
		const { queue, queueIndex, repeatMode } = playerStateRef.current;
		if (queue.length === 0) return;
		ensureWebAudio();
		const activeDeck = activeDeckRef.current === "A" ? deckARef.current : deckBRef.current;
		if (!activeDeck) return;
		if (repeatMode === "one") {
			activeDeck.currentTime = 0;
			activeDeck.play().catch(console.warn);
			return;
		}
		const nextIndex = queueIndex + 1;
		let nextTrackToPlay = null;
		let finalIdx = nextIndex;
		if (nextIndex < queue.length) nextTrackToPlay = queue[nextIndex];
		else if (repeatMode === "all") {
			nextTrackToPlay = queue[0];
			finalIdx = 0;
		} else {
			activeDeck.pause();
			activeDeck.currentTime = 0;
			if (silentKeepAliveRef.current && !silentKeepAliveRef.current.paused) silentKeepAliveRef.current.pause();
			setPlayerState((prev) => ({
				...prev,
				isPlaying: false,
				currentTime: 0
			}));
			if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "paused";
			return;
		}
		if (!nextTrackToPlay) return;
		const cachedUrl = preloadedUrlsRef.current.get(nextTrackToPlay.id);
		if (cachedUrl) {
			activeDeck.src = cachedUrl;
			activeDeck.currentTime = 0;
			activeDeck.playbackRate = playerStateRef.current.playbackRate;
			activeDeck.play().then(() => {
				if (silentKeepAliveRef.current && silentKeepAliveRef.current.paused) silentKeepAliveRef.current.play().catch(() => {});
			}).catch(console.warn);
			const targetTrack = nextTrackToPlay;
			setPlayerState((prev) => ({
				...prev,
				currentTrack: targetTrack,
				queueIndex: finalIdx,
				isPlaying: true,
				isLoading: false,
				currentTime: 0,
				duration: targetTrack.duration || 0,
				activeAnalysis: trackAnalyses[targetTrack.id] || null,
				error: null
			}));
			setupMediaSession(targetTrack);
			applyMasterGain();
			updateTrackMetadata({
				...targetTrack,
				playCount: (targetTrack.playCount || 0) + 1,
				lastPlayedAt: Date.now()
			}).catch(() => {});
			preloadQueueTracks(finalIdx, queue);
			return;
		}
		playTrackRef.current(nextTrackToPlay);
	}, [
		applyMasterGain,
		ensureWebAudio,
		preloadQueueTracks,
		setupMediaSession,
		trackAnalyses
	]);
	nextTrackRef.current = nextTrack;
	const prevTrack = (0, import_react.useCallback)(() => {
		if (crossfadeTimerRef.current) {
			clearInterval(crossfadeTimerRef.current);
			crossfadeTimerRef.current = null;
			isCrossfadingRef.current = false;
		}
		ensureWebAudio();
		const activeDeck = activeDeckRef.current === "A" ? deckARef.current : deckBRef.current;
		if (!activeDeck) return;
		if (activeDeck.currentTime > 3) {
			activeDeck.currentTime = 0;
			activeDeck.play().catch(console.warn);
			return;
		}
		const { queue, queueIndex } = playerStateRef.current;
		if (queue.length === 0) return;
		const prevIndex = queueIndex - 1;
		if (prevIndex < 0) {
			activeDeck.currentTime = 0;
			activeDeck.play().catch(console.warn);
			return;
		}
		const prevTrackToPlay = queue[prevIndex];
		const cachedUrl = preloadedUrlsRef.current.get(prevTrackToPlay.id);
		if (cachedUrl) {
			activeDeck.src = cachedUrl;
			activeDeck.currentTime = 0;
			activeDeck.playbackRate = playerStateRef.current.playbackRate;
			activeDeck.play().then(() => {
				if (silentKeepAliveRef.current && silentKeepAliveRef.current.paused) silentKeepAliveRef.current.play().catch(() => {});
			}).catch(console.warn);
			setPlayerState((prev) => ({
				...prev,
				currentTrack: prevTrackToPlay,
				queueIndex: prevIndex,
				isPlaying: true,
				isLoading: false,
				currentTime: 0,
				duration: prevTrackToPlay.duration || 0,
				activeAnalysis: trackAnalyses[prevTrackToPlay.id] || null,
				error: null
			}));
			setupMediaSession(prevTrackToPlay);
			applyMasterGain();
			preloadQueueTracks(prevIndex, queue);
			return;
		}
		playTrackRef.current(prevTrackToPlay);
	}, [
		applyMasterGain,
		ensureWebAudio,
		preloadQueueTracks,
		setupMediaSession,
		trackAnalyses
	]);
	prevTrackRef.current = prevTrack;
	const togglePlayPause = (0, import_react.useCallback)(() => {
		ensureWebAudio();
		applyMasterGain();
		const activeDeck = activeDeckRef.current === "A" ? deckARef.current : deckBRef.current;
		if (!activeDeck) return;
		if (!playerStateRef.current.currentTrack) {
			if (tracks.length > 0) playTrack(tracks[0], tracks);
			return;
		}
		if (playerStateRef.current.isPlaying) {
			activeDeck.pause();
			if (silentKeepAliveRef.current && !silentKeepAliveRef.current.paused) silentKeepAliveRef.current.pause();
		} else activeDeck.play().then(() => {
			if (silentKeepAliveRef.current && silentKeepAliveRef.current.paused) silentKeepAliveRef.current.play().catch(() => {});
		}).catch((err) => {
			console.warn("Audio resume error:", err);
			showToast("Could not resume audio");
		});
	}, [
		applyMasterGain,
		ensureWebAudio,
		playTrack,
		showToast,
		tracks
	]);
	togglePlayPauseRef.current = togglePlayPause;
	const seekTo = (0, import_react.useCallback)((seconds) => {
		if (crossfadeTimerRef.current) {
			clearInterval(crossfadeTimerRef.current);
			crossfadeTimerRef.current = null;
			isCrossfadingRef.current = false;
		}
		const activeDeck = activeDeckRef.current === "A" ? deckARef.current : deckBRef.current;
		if (activeDeck && isFinite(seconds) && !isNaN(seconds)) {
			const clamped = Math.max(0, Math.min(seconds, activeDeck.duration || 9999));
			activeDeck.currentTime = clamped;
			setPlayerState((prev) => ({
				...prev,
				currentTime: clamped,
				isSmartMixBlending: false
			}));
			updateMediaSessionPosition(activeDeck);
		}
	}, []);
	seekToRef.current = seekTo;
	const setPlaybackRate = (0, import_react.useCallback)((rate) => {
		const activeDeck = activeDeckRef.current === "A" ? deckARef.current : deckBRef.current;
		const clamped = Math.max(.5, Math.min(2, rate));
		if (activeDeck) activeDeck.playbackRate = clamped;
		setPlayerState((prev) => ({
			...prev,
			playbackRate: clamped
		}));
		showToast(`Playback speed: ${clamped}x`);
	}, [showToast]);
	const refreshLibrary = (0, import_react.useCallback)(async () => {
		try {
			const [allTracks, allPlaylists, savedSettings, stats, analyses, savedBooster, savedBoosterActive] = await Promise.all([
				getAllTracks(),
				getAllPlaylists(),
				getSetting("app_settings", DEFAULT_SETTINGS),
				getStorageEstimate(),
				getAllTrackAnalyses(),
				getSetting("app_volume_booster", 1),
				getSetting("app_is_booster_active", false)
			]);
			setTracks(allTracks);
			setPlaylists(allPlaylists);
			setSettings(savedSettings);
			setStorageStats(stats);
			setTrackAnalyses(analyses);
			const effectiveBooster = savedBooster || savedSettings.volumeBooster || 1;
			const effectiveBoosterActive = savedBoosterActive ?? savedSettings.isBoosterActive ?? false;
			setPlayerState((prev) => ({
				...prev,
				repeatMode: savedSettings.defaultRepeat || "off",
				isShuffle: savedSettings.defaultShuffle || false,
				playbackRate: savedSettings.defaultPlaybackRate || 1,
				smartMixConfig: savedSettings.smartMix || DEFAULT_SMART_MIX,
				volumeBooster: effectiveBooster,
				isBoosterActive: effectiveBoosterActive
			}));
			applyMasterGain(void 0, effectiveBooster, effectiveBoosterActive);
		} catch (err) {
			console.error("Error loading library from IndexedDB:", err);
			showToast("Error loading local music library.");
		}
	}, [applyMasterGain, showToast]);
	(0, import_react.useEffect)(() => {
		refreshLibrary();
	}, [refreshLibrary]);
	(0, import_react.useEffect)(() => {
		const { isPlaying, currentTime, duration, smartMixConfig, queue, queueIndex, repeatMode } = playerState;
		if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
		if (!isPlaying || !smartMixConfig.enabled || isCrossfadingRef.current || duration <= 10) return;
		if (repeatMode === "one") return;
		const crossfadeDuration = smartMixConfig.duration;
		const currentTrackId = playerState.currentTrack?.id;
		const currentAnalysis = currentTrackId ? trackAnalyses[currentTrackId] : null;
		const outroSilence = smartMixConfig.trimSilence && currentAnalysis ? currentAnalysis.outroSilenceDuration : 0;
		if (currentTime >= Math.max(0, duration - crossfadeDuration - outroSilence) && currentTime < duration - .5) {
			let nextTrackToPlay = null;
			let nextIdx = queueIndex + 1;
			if (nextIdx < queue.length) nextTrackToPlay = queue[nextIdx];
			else if (repeatMode === "all" && queue.length > 0) {
				nextTrackToPlay = queue[0];
				nextIdx = 0;
			}
			if (!nextTrackToPlay) return;
			isCrossfadingRef.current = true;
			setPlayerState((prev) => ({
				...prev,
				isSmartMixBlending: true
			}));
			const currentDeck = activeDeckRef.current === "A" ? deckARef.current : deckBRef.current;
			const standbyDeck = activeDeckRef.current === "A" ? deckBRef.current : deckARef.current;
			const standbyDeckId = activeDeckRef.current === "A" ? "B" : "A";
			const currentDeckGain = activeDeckRef.current === "A" ? deckGainARef.current : deckGainBRef.current;
			const standbyDeckGain = activeDeckRef.current === "A" ? deckGainBRef.current : deckGainARef.current;
			if (!currentDeck || !standbyDeck) return;
			const resolveBlob = async () => {
				const cached = preloadedUrlsRef.current.get(nextTrackToPlay.id);
				if (cached) return cached;
				const b = await getAudioBlob(nextTrackToPlay.id);
				if (!b) return null;
				const u = URL.createObjectURL(b);
				preloadedUrlsRef.current.set(nextTrackToPlay.id, u);
				return u;
			};
			resolveBlob().then((nextUrl) => {
				if (!nextUrl || !isCrossfadingRef.current) return;
				if (standbyDeckId === "A") activeUrlARef.current = nextUrl;
				else activeUrlBRef.current = nextUrl;
				standbyDeck.src = nextUrl;
				const nextAnalysis = trackAnalyses[nextTrackToPlay.id];
				const introSilence = smartMixConfig.trimSilence && nextAnalysis ? nextAnalysis.introSilenceDuration : 0;
				standbyDeck.currentTime = introSilence;
				standbyDeck.playbackRate = playerState.playbackRate;
				standbyDeck.volume = 0;
				if (standbyDeckGain && audioCtxRef.current) standbyDeckGain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
				standbyDeck.play().then(() => {
					const steps = Math.floor(crossfadeDuration * 1e3 / 50);
					let currentStep = 0;
					crossfadeTimerRef.current = window.setInterval(() => {
						currentStep++;
						const progress = Math.min(1, currentStep / steps);
						const outGain = Math.cos(progress * .5 * Math.PI);
						const inGain = Math.sin(progress * .5 * Math.PI);
						if (currentDeck) currentDeck.volume = Math.max(0, outGain);
						if (standbyDeck) standbyDeck.volume = Math.min(1, inGain);
						if (audioCtxRef.current) {
							const now = audioCtxRef.current.currentTime;
							if (currentDeckGain) currentDeckGain.gain.setValueAtTime(outGain, now);
							if (standbyDeckGain) standbyDeckGain.gain.setValueAtTime(inGain, now);
						}
						if (progress >= 1) {
							if (crossfadeTimerRef.current) {
								clearInterval(crossfadeTimerRef.current);
								crossfadeTimerRef.current = null;
							}
							currentDeck.pause();
							currentDeck.currentTime = 0;
							currentDeck.volume = 0;
							activeDeckRef.current = standbyDeckId;
							if (standbyDeckGain && audioCtxRef.current) standbyDeckGain.gain.setValueAtTime(1, audioCtxRef.current.currentTime);
							const currentVol = playerStateRef.current.isMuted ? 0 : playerStateRef.current.volume;
							standbyDeck.volume = currentVol;
							isCrossfadingRef.current = false;
							const blendedTrack = nextTrackToPlay;
							const currentBlendedTime = standbyDeck.currentTime;
							const blendedDuration = standbyDeck.duration || blendedTrack.duration || 0;
							setPlayerState((prev) => ({
								...prev,
								currentTrack: blendedTrack,
								queueIndex: nextIdx,
								currentTime: currentBlendedTime,
								duration: blendedDuration,
								isSmartMixBlending: false,
								activeAnalysis: nextAnalysis || null
							}));
							setupMediaSession(blendedTrack);
							preloadQueueTracks(nextIdx, queue);
						}
					}, 50);
				}).catch((err) => {
					console.warn("Smart Mix next deck play error, falling back to seamless nextTrack:", err);
					isCrossfadingRef.current = false;
					setPlayerState((prev) => ({
						...prev,
						isSmartMixBlending: false
					}));
					nextTrackRef.current();
				});
			});
		}
	}, [
		playerState,
		trackAnalyses,
		setupMediaSession,
		preloadQueueTracks
	]);
	const toggleShuffle = () => {
		setPlayerState((prev) => {
			const willShuffle = !prev.isShuffle;
			let newQueue = [...prev.queue];
			if (willShuffle) {
				if (originalQueueRef.current.length === 0) originalQueueRef.current = [...prev.queue];
				newQueue = shuffleArray([...prev.queue], prev.currentTrack);
			} else newQueue = originalQueueRef.current.length > 0 ? [...originalQueueRef.current] : newQueue;
			const newIndex = prev.currentTrack ? newQueue.findIndex((t) => t.id === prev.currentTrack.id) : 0;
			return {
				...prev,
				isShuffle: willShuffle,
				queue: newQueue,
				queueIndex: newIndex >= 0 ? newIndex : 0
			};
		});
	};
	const cycleRepeatMode = () => {
		setPlayerState((prev) => {
			let nextMode = "off";
			if (prev.repeatMode === "off") nextMode = "all";
			else if (prev.repeatMode === "all") nextMode = "one";
			else nextMode = "off";
			return {
				...prev,
				repeatMode: nextMode
			};
		});
	};
	const setVolume = (0, import_react.useCallback)((val) => {
		const clamped = Math.max(0, Math.min(1, val));
		ensureWebAudio();
		applyMasterGain(clamped, void 0, void 0, clamped === 0);
		const activeDeck = activeDeckRef.current === "A" ? deckARef.current : deckBRef.current;
		if (activeDeck) activeDeck.volume = clamped;
		const inactiveDeck = activeDeckRef.current === "A" ? deckBRef.current : deckARef.current;
		if (inactiveDeck && !isCrossfadingRef.current) inactiveDeck.volume = clamped;
		setPlayerState((prev) => ({
			...prev,
			volume: clamped,
			isMuted: clamped === 0
		}));
	}, [applyMasterGain, ensureWebAudio]);
	const setVolumeBooster = (0, import_react.useCallback)((_multiplier) => {
		setPlayerState((prev) => ({
			...prev,
			volumeBooster: 1,
			isBoosterActive: false
		}));
		showToast("Volume booster disabled for background stability");
	}, [showToast]);
	const toggleVolumeBooster = (0, import_react.useCallback)((_enabled) => {
		setPlayerState((prev) => ({
			...prev,
			volumeBooster: 1,
			isBoosterActive: false
		}));
		showToast("Volume booster disabled for background stability");
	}, [showToast]);
	const toggleFavorite = async (trackId) => {
		const target = tracks.find((t) => t.id === trackId);
		if (!target) return;
		const updated = {
			...target,
			isFavorite: !target.isFavorite
		};
		await updateTrackMetadata(updated);
		setTracks((prev) => prev.map((t) => t.id === trackId ? updated : t));
		if (playerState.currentTrack?.id === trackId) setPlayerState((prev) => ({
			...prev,
			currentTrack: {
				...prev.currentTrack,
				isFavorite: updated.isFavorite
			}
		}));
		showToast(updated.isFavorite ? "Added to Favorites" : "Removed from Favorites");
	};
	const deleteTrack$1 = async (trackId) => {
		if (playerState.currentTrack?.id === trackId) {
			const activeDeck = activeDeckRef.current === "A" ? deckARef.current : deckBRef.current;
			if (activeDeck) {
				activeDeck.pause();
				activeDeck.currentTime = 0;
			}
			setPlayerState((prev) => ({
				...prev,
				currentTrack: null,
				isPlaying: false,
				currentTime: 0,
				duration: 0,
				queue: prev.queue.filter((t) => t.id !== trackId)
			}));
		}
		await deleteTrack(trackId);
		await refreshLibrary();
		showToast("Track deleted from offline storage.");
	};
	const deleteTracks$1 = async (trackIds) => {
		if (trackIds.includes(playerState.currentTrack?.id || "")) {
			const activeDeck = activeDeckRef.current === "A" ? deckARef.current : deckBRef.current;
			if (activeDeck) {
				activeDeck.pause();
				activeDeck.currentTime = 0;
			}
			setPlayerState((prev) => ({
				...prev,
				currentTrack: null,
				isPlaying: false,
				queue: prev.queue.filter((t) => !trackIds.includes(t.id))
			}));
		}
		await deleteTracks(trackIds);
		await refreshLibrary();
		showToast(`Deleted ${trackIds.length} track${trackIds.length > 1 ? "s" : ""}.`);
	};
	const createPlaylist = async (name, description, trackIds = []) => {
		const newPlaylist = {
			id: `pl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
			name: name.trim() || "New Playlist",
			description,
			sourceType: "manual",
			trackIds,
			createdAt: Date.now(),
			updatedAt: Date.now()
		};
		await savePlaylist(newPlaylist);
		setPlaylists((prev) => [newPlaylist, ...prev]);
		showToast(`Created playlist "${newPlaylist.name}"`);
		return newPlaylist;
	};
	const updatePlaylist = async (playlist) => {
		const updated = {
			...playlist,
			updatedAt: Date.now()
		};
		await savePlaylist(updated);
		setPlaylists((prev) => prev.map((pl) => pl.id === updated.id ? updated : pl));
	};
	const deletePlaylist$1 = async (playlistId) => {
		await deletePlaylist(playlistId);
		setPlaylists((prev) => prev.filter((pl) => pl.id !== playlistId));
		showToast("Playlist deleted (tracks preserved).");
	};
	const addTrackToPlaylist = async (playlistId, trackId) => {
		const target = playlists.find((pl) => pl.id === playlistId);
		if (!target) return;
		if (target.trackIds.includes(trackId)) {
			showToast("Track is already in this playlist");
			return;
		}
		const updated = {
			...target,
			trackIds: [...target.trackIds, trackId],
			updatedAt: Date.now()
		};
		await savePlaylist(updated);
		setPlaylists((prev) => prev.map((pl) => pl.id === playlistId ? updated : pl));
		showToast(`Added to "${target.name}"`);
	};
	const removeTrackFromPlaylist = async (playlistId, trackId) => {
		const target = playlists.find((pl) => pl.id === playlistId);
		if (!target) return;
		const updated = {
			...target,
			trackIds: target.trackIds.filter((id) => id !== trackId),
			updatedAt: Date.now()
		};
		await savePlaylist(updated);
		setPlaylists((prev) => prev.map((pl) => pl.id === playlistId ? updated : pl));
		showToast("Removed from playlist");
	};
	const reorderPlaylistTracks = async (playlistId, newTrackIds) => {
		const target = playlists.find((pl) => pl.id === playlistId);
		if (!target) return;
		const updated = {
			...target,
			trackIds: newTrackIds,
			updatedAt: Date.now()
		};
		await savePlaylist(updated);
		setPlaylists((prev) => prev.map((pl) => pl.id === playlistId ? updated : pl));
	};
	const addToQueue = (track) => {
		setPlayerState((prev) => ({
			...prev,
			queue: [...prev.queue, track]
		}));
		showToast(`Added "${track.title}" to queue`);
	};
	const playNextInQueue = (track) => {
		setPlayerState((prev) => {
			const idx = prev.queueIndex;
			const copy = [...prev.queue];
			copy.splice(idx + 1, 0, track);
			return {
				...prev,
				queue: copy
			};
		});
		showToast(`"${track.title}" will play next`);
	};
	const removeFromQueue = (index) => {
		setPlayerState((prev) => {
			const copy = [...prev.queue];
			copy.splice(index, 1);
			const newIndex = index < prev.queueIndex ? prev.queueIndex - 1 : prev.queueIndex;
			return {
				...prev,
				queue: copy,
				queueIndex: newIndex
			};
		});
	};
	const reorderQueue = (fromIndex, toIndex) => {
		setPlayerState((prev) => {
			if (fromIndex === toIndex) return prev;
			const copy = [...prev.queue];
			const [moved] = copy.splice(fromIndex, 1);
			copy.splice(toIndex, 0, moved);
			let newQueueIndex = prev.queueIndex;
			if (prev.queueIndex === fromIndex) newQueueIndex = toIndex;
			else if (fromIndex < prev.queueIndex && toIndex >= prev.queueIndex) newQueueIndex--;
			else if (fromIndex > prev.queueIndex && toIndex <= prev.queueIndex) newQueueIndex++;
			return {
				...prev,
				queue: copy,
				queueIndex: newQueueIndex
			};
		});
	};
	const clearQueue = () => {
		setPlayerState((prev) => ({
			...prev,
			queue: prev.currentTrack ? [prev.currentTrack] : [],
			queueIndex: 0
		}));
		showToast("Queue cleared");
	};
	const updateSettings = async (newSettings) => {
		const merged = {
			...settings,
			...newSettings
		};
		await saveSetting("app_settings", merged);
		setSettings(merged);
		showToast("Settings saved");
	};
	const updateSmartMixConfig = async (configUpdate) => {
		const updatedConfig = {
			...playerState.smartMixConfig,
			...configUpdate
		};
		if (configUpdate.preset) {
			if (configUpdate.preset === "off") updatedConfig.enabled = false;
			else {
				updatedConfig.enabled = true;
				if (configUpdate.preset === "short") updatedConfig.duration = 3;
				else if (configUpdate.preset === "balanced") updatedConfig.duration = 6;
				else if (configUpdate.preset === "long") updatedConfig.duration = 10;
			}
		}
		setPlayerState((prev) => ({
			...prev,
			smartMixConfig: updatedConfig
		}));
		await updateSettings({ smartMix: updatedConfig });
	};
	const analyzeTrackById = async (trackId) => {
		try {
			const blob = await getAudioBlob(trackId);
			if (!blob) return null;
			const analysis = await analyzeTrackAudio(blob, trackId);
			await saveTrackAnalysis(analysis);
			setTrackAnalyses((prev) => ({
				...prev,
				[trackId]: analysis
			}));
			if (playerState.currentTrack?.id === trackId) setPlayerState((prev) => ({
				...prev,
				activeAnalysis: analysis
			}));
			return analysis;
		} catch (err) {
			console.warn("Track analysis error:", err);
			return null;
		}
	};
	const batchAnalyzeTracks = async (trackIdsToAnalyze) => {
		const unanalyzed = (trackIdsToAnalyze || tracks.map((t) => t.id)).filter((id) => !trackAnalyses[id]);
		if (unanalyzed.length === 0) {
			showToast("All selected tracks are already analyzed!");
			return;
		}
		setPlayerState((prev) => ({
			...prev,
			isAnalyzing: true,
			analysisProgress: {
				current: 0,
				total: unanalyzed.length
			}
		}));
		let completed = 0;
		for (const trackId of unanalyzed) {
			try {
				const blob = await getAudioBlob(trackId);
				if (blob) {
					const analysis = await analyzeTrackAudio(blob, trackId);
					await saveTrackAnalysis(analysis);
					setTrackAnalyses((prev) => ({
						...prev,
						[trackId]: analysis
					}));
				}
			} catch (err) {
				console.warn("Failed analysis for track:", trackId, err);
			}
			completed++;
			setPlayerState((prev) => ({
				...prev,
				analysisProgress: {
					current: completed,
					total: unanalyzed.length
				}
			}));
		}
		setPlayerState((prev) => ({
			...prev,
			isAnalyzing: false,
			analysisProgress: null
		}));
		showToast(`Btt Smart Mix: Analyzed ${completed} track${completed > 1 ? "s" : ""}!`);
	};
	const optimizePlaylistHarmonically = async (playlistId) => {
		const targetPl = playlists.find((pl) => pl.id === playlistId);
		if (!targetPl || targetPl.trackIds.length <= 1) return null;
		const unanalyzed = targetPl.trackIds.filter((id) => !trackAnalyses[id]);
		if (unanalyzed.length > 0) {
			showToast(`Analyzing ${unanalyzed.length} tracks before optimizing...`);
			await batchAnalyzeTracks(targetPl.trackIds);
		}
		return optimizePlaylistOrder(targetPl.trackIds, trackAnalyses);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MusicContext.Provider, {
		value: {
			tracks,
			playlists,
			playerState,
			storageStats,
			isFullScreenPlayerOpen,
			settings,
			toastMessage,
			trackAnalyses,
			refreshLibrary,
			playTrack,
			togglePlayPause,
			seekTo,
			nextTrack,
			prevTrack,
			toggleShuffle,
			cycleRepeatMode,
			setVolume,
			setVolumeBooster,
			toggleVolumeBooster,
			setPlaybackRate,
			toggleFavorite,
			deleteTrack: deleteTrack$1,
			deleteTracks: deleteTracks$1,
			createPlaylist,
			updatePlaylist,
			deletePlaylist: deletePlaylist$1,
			addTrackToPlaylist,
			removeTrackFromPlaylist,
			reorderPlaylistTracks,
			addToQueue,
			playNextInQueue,
			removeFromQueue,
			reorderQueue,
			clearQueue,
			setIsFullScreenPlayerOpen,
			showToast,
			updateSettings,
			updateSmartMixConfig,
			analyzeTrackById,
			batchAnalyzeTracks,
			optimizePlaylistHarmonically
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: { display: "none" },
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
					ref: (el) => {
						if (el) deckARef.current = el;
					},
					preload: "auto"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
					ref: (el) => {
						if (el) deckBRef.current = el;
					},
					preload: "auto"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
					ref: (el) => {
						if (el) silentKeepAliveRef.current = el;
					},
					loop: true,
					preload: "auto",
					src: SILENT_AUDIO_URI
				})
			]
		}), children]
	});
};
function useMusic() {
	const context = (0, import_react.useContext)(MusicContext);
	if (!context) throw new Error("useMusic must be used within a MusicProvider");
	return context;
}
function shuffleArray(arr, currentItem) {
	const copy = [...arr];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	if (currentItem) {
		const idx = copy.findIndex((item) => item.id === currentItem.id);
		if (idx > -1) {
			copy.splice(idx, 1);
			copy.unshift(currentItem);
		}
	}
	return copy;
}
// src/utils/id3Parser.ts
async function parseAudioMetadata(file, fileNameHint) {
	const cleanName = cleanFileName(fileNameHint || (file instanceof File ? file.name : "Unknown Track"));
	let metadata = {
		title: cleanName.title,
		artist: cleanName.artist,
		album: "Unknown Album",
		duration: 0
	};
	try {
		const id3Data = parseID3v2(await file.slice(0, Math.min(file.size, 524288)).arrayBuffer());
		if (id3Data) {
			if (id3Data.title) metadata.title = id3Data.title.trim();
			if (id3Data.artist) metadata.artist = id3Data.artist.trim();
			if (id3Data.album) metadata.album = id3Data.album.trim();
			if (id3Data.year) metadata.year = id3Data.year.trim();
			if (id3Data.artworkUrl) metadata.artworkUrl = id3Data.artworkUrl;
			if (id3Data.duration && id3Data.duration > 0) metadata.duration = id3Data.duration;
		} else if (file.size > 128) {
			const id3v1 = parseID3v1(await file.slice(file.size - 128).arrayBuffer());
			if (id3v1) {
				if (id3v1.title) metadata.title = id3v1.title.trim();
				if (id3v1.artist) metadata.artist = id3v1.artist.trim();
				if (id3v1.album) metadata.album = id3v1.album.trim();
				if (id3v1.year) metadata.year = id3v1.year.trim();
			}
		}
	} catch (err) {
		console.warn("ID3 parsing skipped or failed:", err);
	}
	if (!metadata.duration || metadata.duration <= 0) try {
		metadata.duration = await measureAudioDuration(file);
	} catch {
		metadata.duration = 0;
	}
	return metadata;
}
function cleanFileName(fileName) {
	const base = fileName.replace(/\.[a-zA-Z0-9]+$/, "").trim();
	if (base.includes(" - ")) {
		const parts = base.split(" - ");
		const artist = parts[0].trim();
		const title = parts.slice(1).join(" - ").trim();
		return {
			artist: artist || "Unknown Artist",
			title: title || base
		};
	}
	return {
		artist: "Unknown Artist",
		title: base || "Untitled Track"
	};
}
function parseID3v2(buffer) {
	const bytes = new Uint8Array(buffer);
	if (bytes.length < 10) return null;
	if (bytes[0] !== 73 || bytes[1] !== 68 || bytes[2] !== 51) return null;
	const versionMajor = bytes[3];
	if (versionMajor < 2 || versionMajor > 4) return null;
	const tagSize = (bytes[6] & 127) << 21 | (bytes[7] & 127) << 14 | (bytes[8] & 127) << 7 | bytes[9] & 127;
	const maxRead = Math.min(bytes.length, 10 + tagSize);
	let offset = 10;
	const result = {};
	while (offset < maxRead - 10) {
		if (bytes[offset] === 0) break;
		let frameId = "";
		let frameSize = 0;
		if (versionMajor === 2) {
			frameId = String.fromCharCode(bytes[offset], bytes[offset + 1], bytes[offset + 2]);
			frameSize = bytes[offset + 3] << 16 | bytes[offset + 4] << 8 | bytes[offset + 5];
			offset += 6;
		} else {
			frameId = String.fromCharCode(bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3]);
			if (versionMajor === 4) frameSize = (bytes[offset + 4] & 127) << 21 | (bytes[offset + 5] & 127) << 14 | (bytes[offset + 6] & 127) << 7 | bytes[offset + 7] & 127;
			else frameSize = bytes[offset + 4] << 24 | bytes[offset + 5] << 16 | bytes[offset + 6] << 8 | bytes[offset + 7];
			offset += 10;
		}
		if (frameSize <= 0 || offset + frameSize > maxRead) break;
		const frameBytes = bytes.subarray(offset, offset + frameSize);
		if (frameId === "TIT2" || frameId === "TT2") result.title = decodeTextFrame(frameBytes);
		else if (frameId === "TPE1" || frameId === "TP1") result.artist = decodeTextFrame(frameBytes);
		else if (frameId === "TALB" || frameId === "TAL") result.album = decodeTextFrame(frameBytes);
		else if (frameId === "TYER" || frameId === "TDRC" || frameId === "TYE") result.year = decodeTextFrame(frameBytes);
		else if (frameId === "TLEN") {
			const ms = parseInt(decodeTextFrame(frameBytes), 10);
			if (!isNaN(ms) && ms > 0) result.duration = Math.round(ms / 1e3);
		} else if ((frameId === "APIC" || frameId === "PIC") && !result.artworkUrl) result.artworkUrl = decodeApicFrame(frameBytes, versionMajor);
		offset += frameSize;
	}
	return result;
}
function decodeTextFrame(bytes) {
	if (bytes.length <= 1) return "";
	const encoding = bytes[0];
	const payload = bytes.subarray(1);
	try {
		if (encoding === 0) {
			let str = "";
			for (let i = 0; i < payload.length; i++) {
				if (payload[i] === 0) break;
				str += String.fromCharCode(payload[i]);
			}
			return str;
		} else if (encoding === 1) return new TextDecoder("utf-16").decode(payload).replace(/\0.*$/g, "");
		else if (encoding === 2) return new TextDecoder("utf-16be").decode(payload).replace(/\0.*$/g, "");
		else if (encoding === 3) return new TextDecoder("utf-8").decode(payload).replace(/\0.*$/g, "");
	} catch {}
	return new TextDecoder("utf-8", { fatal: false }).decode(payload).replace(/\0.*$/g, "");
}
function decodeApicFrame(bytes, versionMajor) {
	if (bytes.length < 8) return void 0;
	let offset = 1;
	let mimeType = "image/jpeg";
	if (versionMajor === 2) {
		const fmt = String.fromCharCode(bytes[offset], bytes[offset + 1], bytes[offset + 2]).toUpperCase();
		offset += 3;
		mimeType = fmt === "PNG" ? "image/png" : "image/jpeg";
	} else {
		let mimeStr = "";
		while (offset < bytes.length && bytes[offset] !== 0) {
			mimeStr += String.fromCharCode(bytes[offset]);
			offset++;
		}
		offset++;
		if (mimeStr) mimeType = mimeStr.toLowerCase();
	}
	offset++;
	const encoding = bytes[0];
	if (encoding === 1 || encoding === 2) {
		while (offset < bytes.length - 1 && !(bytes[offset] === 0 && bytes[offset + 1] === 0)) offset += 2;
		offset += 2;
	} else {
		while (offset < bytes.length && bytes[offset] !== 0) offset++;
		offset++;
	}
	if (offset >= bytes.length) return void 0;
	const imageBytes = bytes.subarray(offset);
	if (imageBytes.length === 0) return void 0;
	let binary = "";
	const len = imageBytes.byteLength;
	const chunkLimit = 8192;
	for (let i = 0; i < len; i += chunkLimit) {
		const chunk = imageBytes.subarray(i, Math.min(i + chunkLimit, len));
		binary += String.fromCharCode.apply(null, chunk);
	}
	const base64 = btoa(binary);
	return `data:${mimeType};base64,${base64}`;
}
function parseID3v1(buffer) {
	const bytes = new Uint8Array(buffer);
	if (bytes.length < 128) return null;
	if (bytes[0] !== 84 || bytes[1] !== 65 || bytes[2] !== 71) return null;
	const decodeAscii = (start, len) => {
		let str = "";
		for (let i = start; i < start + len; i++) {
			if (bytes[i] === 0) break;
			str += String.fromCharCode(bytes[i]);
		}
		return str.trim();
	};
	return {
		title: decodeAscii(3, 30),
		artist: decodeAscii(33, 30),
		album: decodeAscii(63, 30),
		year: decodeAscii(93, 4)
	};
}
function measureAudioDuration(fileOrBlob) {
	return new Promise((resolve) => {
		const audio = document.createElement("audio");
		audio.preload = "metadata";
		const objectUrl = URL.createObjectURL(fileOrBlob);
		audio.src = objectUrl;
		const cleanup = () => {
			URL.revokeObjectURL(objectUrl);
			audio.removeAttribute("src");
			audio.load();
		};
		const timer = setTimeout(() => {
			cleanup();
			resolve(0);
		}, 4e3);
		audio.onloadedmetadata = () => {
			clearTimeout(timer);
			const dur = Math.round(audio.duration || 0);
			cleanup();
			resolve(dur > 0 && isFinite(dur) ? dur : 0);
		};
		audio.onerror = () => {
			clearTimeout(timer);
			cleanup();
			resolve(0);
		};
	});
}
function formatDuration(seconds) {
	if (isNaN(seconds) || seconds < 0) return "0:00";
	const total = Math.floor(seconds);
	const mins = Math.floor(total / 60);
	const secs = total % 60;
	return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}
function formatFileSize(bytes) {
	if (bytes === 0) return "0 B";
	const k = 1024;
	const sizes = [
		"B",
		"KB",
		"MB",
		"GB"
	];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
// src/services/playlistImport/spotdlBridge.ts
async function checkSpotDLBridgeStatus(bridgeUrl) {
	const url = bridgeUrl?.trim();
	if (!url) return {
		isConfigured: false,
		isOnline: false,
		errorMessage: "Bridge URL not configured. spotDL requires a hosted Python+FFmpeg service."
	};
	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 3500);
		const res = await fetch(`${url.replace(/\/$/, "")}/health`, { signal: controller.signal });
		clearTimeout(timeout);
		if (res.ok) return {
			isConfigured: true,
			isOnline: true,
			version: (await res.json().catch(() => ({}))).version || "spotDL v4.x Bridge"
		};
		return {
			isConfigured: true,
			isOnline: false,
			errorMessage: `Bridge responded with HTTP ${res.status}`
		};
	} catch (err) {
		return {
			isConfigured: true,
			isOnline: false,
			errorMessage: err instanceof Error ? err.message : "Connection timed out"
		};
	}
}
/**
* Searches the user-hosted spotDL bridge service for a matching audio stream or download
*/
async function searchSpotDLBridge(track, bridgeUrl) {
	const url = bridgeUrl?.trim();
	if (!url) return null;
	try {
		const res = await fetch(`${url.replace(/\/$/, "")}/api/match`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				title: track.title,
				artists: track.artists,
				album: track.album,
				durationMs: track.durationMs,
				isrc: track.isrc
			})
		});
		if (!res.ok) return null;
		const match = await res.json();
		if (!match.downloadUrl) return null;
		return {
			provider: "spotdl",
			providerTrackId: match.id || `spotdl_${Date.now()}`,
			title: match.title || track.title,
			artist: match.artist || track.artists[0] || "Unknown",
			durationSeconds: match.durationSeconds || Math.round(track.durationMs / 1e3),
			downloadUrl: match.downloadUrl,
			previewStreamUrl: match.streamUrl || match.downloadUrl,
			format: match.format || "mp3",
			fileSizeBytes: match.sizeBytes,
			confidenceScore: match.confidence || 90,
			matchReason: match.reason || "Matched via user-hosted spotDL Python engine"
		};
	} catch {
		return null;
	}
}
// src/services/historyService.ts
var HISTORY_STORAGE_KEY = "bttm_unified_music_history_v2";
var MAX_HISTORY_RECORDS = 200;
var inMemoryHistory = null;
function loadFromLocalStorage() {
	try {
		const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch (err) {
		console.warn("Failed reading history from localStorage:", err);
		return [];
	}
}
function saveToLocalStorage(records) {
	try {
		localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(records));
	} catch (err) {
		console.warn("Failed saving history to localStorage:", err);
	}
}
/**
* Initializes and retrieves all history records.
* Integrates bidirectional fallback between localStorage and IndexedDB settings store.
*/
async function getAllHistory() {
	if (inMemoryHistory) return inMemoryHistory;
	let records = loadFromLocalStorage();
	if (records.length === 0) try {
		const idbHistory = await getSetting(HISTORY_STORAGE_KEY, []);
		if (Array.isArray(idbHistory) && idbHistory.length > 0) {
			records = idbHistory;
			saveToLocalStorage(records);
		}
	} catch {}
	inMemoryHistory = records.sort((a, b) => b.timestamp - a.timestamp);
	return inMemoryHistory;
}
/**
* Saves updated records and syncs to both localStorage and IndexedDB
*/
async function persistHistory(records) {
	const trimmed = records.slice(0, MAX_HISTORY_RECORDS);
	inMemoryHistory = trimmed;
	saveToLocalStorage(trimmed);
	try {
		await saveSetting(HISTORY_STORAGE_KEY, trimmed);
	} catch {}
}
/**
* Record a search query
*/
async function recordSearchHistory(query, source, resultCount) {
	const clean = query.trim();
	if (!clean) return;
	const filtered = (await getAllHistory()).filter((r) => !(r.type === "search" && r.query?.toLowerCase() === clean.toLowerCase()));
	await persistHistory([{
		id: `search_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
		type: "search",
		timestamp: Date.now(),
		title: clean,
		subtitle: `${source.toUpperCase()} • ${resultCount} results found`,
		source,
		query: clean,
		status: "completed"
	}, ...filtered]);
}
/**
* Record a Spotify or external playlist inspection
*/
async function recordPlaylistHistory(playlist) {
	const filtered = (await getAllHistory()).filter((r) => !(r.type === "playlist" && (r.title === playlist.title || playlist.externalUrl && r.playlistUrl === playlist.externalUrl)));
	await persistHistory([{
		id: `pl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
		type: "playlist",
		timestamp: Date.now(),
		title: playlist.title,
		subtitle: `${playlist.curator || "Curated Playlist"} • ${playlist.totalTracks} tracks`,
		source: playlist.source,
		artworkUrl: playlist.coverUrl,
		playlistUrl: playlist.externalUrl,
		trackCount: playlist.totalTracks,
		status: "completed"
	}, ...filtered]);
}
/**
* Record a successful or attempted download
*/
async function recordDownloadHistory(item) {
	const records = await getAllHistory();
	await persistHistory([{
		id: `dl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
		type: "download",
		timestamp: Date.now(),
		title: item.title,
		subtitle: `${item.artist}${item.album ? ` • ${item.album}` : ""}`,
		source: item.source,
		status: item.status,
		localTrackId: item.localTrackId,
		artworkUrl: item.artworkUrl,
		durationSeconds: item.durationSeconds,
		fileSizeBytes: item.fileSizeBytes,
		errorReason: item.errorReason
	}, ...records]);
}
/**
* Record a failed import for subsequent retry
*/
async function recordFailedImport(item) {
	const records = await getAllHistory();
	await persistHistory([{
		id: `fail_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
		type: "failed_import",
		timestamp: Date.now(),
		title: item.title,
		subtitle: `${item.artist} — ${item.errorReason}`,
		source: item.source,
		status: "failed",
		errorReason: item.errorReason,
		retryPayload: {
			title: item.title,
			artist: item.artist,
			album: item.album,
			source: item.source,
			durationMs: item.durationMs,
			isrc: item.isrc
		}
	}, ...records]);
}
/**
* Record duplicate detection event
*/
async function recordDuplicateDetection(item) {
	const records = await getAllHistory();
	await persistHistory([{
		id: `dup_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
		type: "duplicate",
		timestamp: Date.now(),
		title: item.title,
		subtitle: `${item.artist} • Already in Library (Skipped re-download)`,
		source: "local_duplicate_check",
		localTrackId: item.matchedTrackId,
		status: "in_library"
	}, ...records]);
}
/**
* Delete a single history record by ID
*/
async function deleteHistoryRecord(id) {
	await persistHistory((await getAllHistory()).filter((r) => r.id !== id));
}
/**
* Clear records by type or all
*/
async function clearHistoryByType(type) {
	if (!type || type === "all") await persistHistory([]);
	else await persistHistory((await getAllHistory()).filter((r) => r.type !== type));
}
// src/services/playlistImport/x2Engine.ts
var DEFAULT_JAMENDO_CLIENT_ID = "96cf1c7c";
/**
* Normalizes title string by stripping punctuation, bracketed text, common tags:
* e.g. "Song Name (Official Video) [Remastered 2021]" -> "song name"
*/
function normalizeSongTitle(title) {
	if (!title) return "";
	let cleaned = title.toLowerCase();
	cleaned = cleaned.replace(/\((?:feat|ft|official|remaster|live|radio|deluxe|version|audio|video|explicit)[^)]*\)/gi, "");
	cleaned = cleaned.replace(/\[(?:feat|ft|official|remaster|live|radio|deluxe|version|audio|video|explicit)[^\]]*\]/gi, "");
	cleaned = cleaned.replace(/\s+(feat\.|ft\.|featuring)\s+.*$/i, "");
	cleaned = cleaned.replace(/[^a-z0-9\s]/g, " ");
	return cleaned.replace(/\s+/g, " ").trim();
}
function normalizeArtistName(artist) {
	if (!artist) return "";
	return artist.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
/**
* Calculate token-based Sorensen-Dice similarity (0 to 1)
*/
function calculateStringSimilarity(str1, str2) {
	const norm1 = normalizeSongTitle(str1);
	const norm2 = normalizeSongTitle(str2);
	if (!norm1 || !norm2) return 0;
	if (norm1 === norm2) return 1;
	if (norm1.includes(norm2) || norm2.includes(norm1)) return .85;
	const tokens1 = new Set(norm1.split(" ").filter(Boolean));
	const tokens2 = new Set(norm2.split(" ").filter(Boolean));
	let intersection = 0;
	for (const t of tokens1) if (tokens2.has(t)) intersection++;
	const union = tokens1.size + tokens2.size;
	return union === 0 ? 0 : 2 * intersection / union;
}
/**
* Calculates candidate match confidence score from 0 to 100
*/
function computeMatchConfidence(requested, candidate) {
	if (requested.isrc && candidate.isrc && requested.isrc.toUpperCase() === candidate.isrc.toUpperCase()) return {
		score: 99,
		reason: "Exact ISRC recording identifier match"
	};
	const titleSim = calculateStringSimilarity(requested.title, candidate.title);
	const artistSim = calculateStringSimilarity(requested.artists[0] || "", candidate.artist);
	const requestedSec = Math.round(requested.durationMs / 1e3);
	const durationDiff = Math.abs(requestedSec - candidate.durationSeconds);
	let durationScore = 1;
	if (requestedSec > 0 && candidate.durationSeconds > 0) {
		if (durationDiff <= 3) durationScore = 1;
		else if (durationDiff <= 8) durationScore = .9;
		else if (durationDiff <= 15) durationScore = .7;
		else if (durationDiff <= 30) durationScore = .4;
		else durationScore = .1;
	}
	const composite = titleSim * .5 + artistSim * .3 + durationScore * .2;
	const score = Math.round(composite * 100);
	let reason = "";
	if (score >= 85) reason = `High confidence match (Title ${(titleSim * 100).toFixed(0)}%, Artist ${(artistSim * 100).toFixed(0)}%)`;
	else if (score >= 60) reason = `Partial match: duration delta ${durationDiff}s, verify recording before playing`;
	else reason = "Weak match below confidence threshold";
	return {
		score,
		reason
	};
}
async function fetchWithBackoff(fn, retries = 2, delayMs = 400) {
	let attempt = 0;
	while (true) try {
		return await fn();
	} catch (err) {
		attempt++;
		if (attempt > retries) throw err;
		const jitter = Math.random() * 150;
		const backoff = delayMs * Math.pow(2, attempt - 1) + jitter;
		await new Promise((res) => setTimeout(res, backoff));
	}
}
async function searchLocalLibraryCache(track) {
	try {
		const cached = await findVerifiedCachedTrack(track.title, track.artists[0] || "", track.durationMs);
		if (cached) return {
			provider: "local",
			providerTrackId: `local_${cached.track.id}`,
			title: cached.track.title,
			artist: cached.track.artist,
			durationSeconds: cached.track.duration,
			downloadUrl: `blob:local/${cached.track.id}`,
			format: cached.track.mimeType?.includes("m4a") ? "m4a" : "mp3",
			fileSizeBytes: cached.blob.size,
			confidenceScore: 100,
			matchReason: "Instant hit: verified local IndexedDB audio cache",
			licenseInfo: "Personal Offline Library Storage"
		};
	} catch (err) {
		console.warn("Local cache check error:", err);
	}
	return null;
}
async function searchTelegramAudioHub(track) {
	try {
		const token = await getSetting("telegram_bot_token", "");
		if (!token) return [];
		const telegramTracks = (await getAllTracks()).filter((t) => t.telegramSource && t.telegramSource.fileId);
		const matches = [];
		const normReqTitle = normalizeSongTitle(track.title);
		normalizeArtistName(track.artists[0] || "");
		for (const t of telegramTracks) {
			const tTitle = normalizeSongTitle(t.title);
			normalizeArtistName(t.artist);
			if (tTitle === normReqTitle || normReqTitle.length > 4 && tTitle.includes(normReqTitle)) {
				const { score, reason } = computeMatchConfidence(track, {
					title: t.title,
					artist: t.artist,
					durationSeconds: t.duration
				});
				if (score >= 60) matches.push({
					provider: "telegram",
					providerTrackId: `tg_${t.id}`,
					title: t.title,
					artist: t.artist,
					durationSeconds: t.duration,
					downloadUrl: `/api/telegram/download?token=${encodeURIComponent(token)}&file_path=${encodeURIComponent(t.telegramSource?.fileId || "")}`,
					format: "mp3",
					fileSizeBytes: t.fileSize,
					confidenceScore: score,
					matchReason: `${reason} (Telegram Hub / Bot Sync)`,
					licenseInfo: "Telegram Music Sync Hub"
				});
			}
		}
		return matches.sort((a, b) => b.confidenceScore - a.confidenceScore);
	} catch (err) {
		console.warn("Telegram audio hub search error:", err);
		return [];
	}
}
async function searchJamendo(track, clientId = DEFAULT_JAMENDO_CLIENT_ID) {
	const cleanTitle = encodeURIComponent(normalizeSongTitle(track.title));
	if (!cleanTitle) return [];
	return fetchWithBackoff(async () => {
		const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=json&limit=6&namesearch=${cleanTitle}&include=licenses`;
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 6500);
		const res = await fetch(url, { signal: controller.signal });
		clearTimeout(timeout);
		if (!res.ok) throw new Error(`Jamendo API HTTP ${res.status}`);
		const data = await res.json();
		if (!data.results || !Array.isArray(data.results)) return [];
		const matches = [];
		for (const item of data.results) {
			if (!item.audio) continue;
			const durationSeconds = Number(item.duration) || 0;
			const { score, reason } = computeMatchConfidence(track, {
				title: item.name,
				artist: item.artist_name,
				durationSeconds
			});
			matches.push({
				provider: "jamendo",
				providerTrackId: `jamendo_${item.id}`,
				title: item.name,
				artist: item.artist_name,
				durationSeconds,
				downloadUrl: item.audiodownload || item.audio,
				previewStreamUrl: item.audio,
				format: "mp3",
				confidenceScore: score,
				matchReason: reason,
				licenseInfo: item.license_ccurl || "Creative Commons (Jamendo)"
			});
		}
		return matches.sort((a, b) => b.confidenceScore - a.confidenceScore);
	}, 2, 400);
}
async function searchInternetArchive(track) {
	const cleanTitle = normalizeSongTitle(track.title);
	if (!cleanTitle) return [];
	return fetchWithBackoff(async () => {
		const searchUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(`mediatype:audio AND (${cleanTitle})`)}&fl[]=identifier,title,creator,mediatype,publicdate&rows=5&output=json`;
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 7e3);
		const res = await fetch(searchUrl, { signal: controller.signal });
		clearTimeout(timeout);
		if (!res.ok) throw new Error(`Internet Archive HTTP ${res.status}`);
		const docs = (await res.json()).response?.docs;
		if (!docs || !Array.isArray(docs)) return [];
		const matches = [];
		for (const doc of docs.slice(0, 3)) try {
			const metaUrl = `https://archive.org/metadata/${doc.identifier}`;
			const metaRes = await fetch(metaUrl, { signal: AbortSignal.timeout(5e3) });
			if (!metaRes.ok) continue;
			const mp3File = ((await metaRes.json()).files || []).find((f) => f.name.endsWith(".mp3") && !f.name.includes("_thumb") && !f.name.includes("_preview") && (f.format?.toLowerCase().includes("mp3") || f.format?.toLowerCase().includes("vbr")));
			if (mp3File) {
				const durationSeconds = parseFloat(mp3File.length || "0") || 0;
				const { score, reason } = computeMatchConfidence(track, {
					title: doc.title || mp3File.name,
					artist: doc.creator || "Internet Archive Audio",
					durationSeconds
				});
				const downloadUrl = `https://archive.org/download/${doc.identifier}/${encodeURIComponent(mp3File.name)}`;
				matches.push({
					provider: "archive",
					providerTrackId: `archive_${doc.identifier}`,
					title: doc.title || track.title,
					artist: doc.creator || "Public Audio",
					durationSeconds,
					downloadUrl,
					previewStreamUrl: downloadUrl,
					format: "mp3",
					fileSizeBytes: mp3File.size ? parseInt(mp3File.size, 10) : void 0,
					confidenceScore: score,
					matchReason: `${reason} (Public Domain / Live Archive)`,
					licenseInfo: "Internet Archive Public Audio"
				});
			}
		} catch {
			continue;
		}
		return matches.sort((a, b) => b.confidenceScore - a.confidenceScore);
	}, 2, 500);
}
async function searchFreeMusicArchive(track) {
	const cleanTitle = encodeURIComponent(normalizeSongTitle(track.title));
	if (!cleanTitle) return [];
	try {
		const url = `https://freemusicarchive.org/api/get/tracks.json?api_key=60BLHNQCA2QA3OG&limit=5&q=${cleanTitle}`;
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 5e3);
		const res = await fetch(url, { signal: controller.signal });
		clearTimeout(timeout);
		if (!res.ok) return [];
		const data = await res.json().catch(() => ({}));
		if (!data.dataset || !Array.isArray(data.dataset)) return [];
		const matches = [];
		for (const item of data.dataset) {
			if (!item.track_file) continue;
			const durationSeconds = item.track_duration ? parseInt(item.track_duration, 10) : 0;
			const { score, reason } = computeMatchConfidence(track, {
				title: item.track_title,
				artist: item.artist_name,
				durationSeconds
			});
			matches.push({
				provider: "fma",
				providerTrackId: `fma_${item.track_id}`,
				title: item.track_title,
				artist: item.artist_name,
				durationSeconds,
				downloadUrl: item.track_file,
				format: "mp3",
				confidenceScore: score,
				matchReason: `${reason} (Free Music Archive CC)`,
				licenseInfo: item.license_title || "Creative Commons"
			});
		}
		return matches.sort((a, b) => b.confidenceScore - a.confidenceScore);
	} catch {
		return [];
	}
}
/**
* Downloads audio stream, handles progress, verifies minimum size and content-type.
* If direct browser fetch hits CORS errors on iOS Safari, automatically routes through server proxy.
*/
async function downloadAndValidateAudio(url, onProgress) {
	if (url.startsWith("blob:local/")) {
		const trackId = url.replace("blob:local/", "");
		const { getAudioBlob } = await __vitePreload(async () => {
			const { getAudioBlob } = await import("./db-Cr6tU0Tr.js").then((n) => n.n);
			return { getAudioBlob };
		}, __vite__mapDeps([2,3]));
		const blob = await getAudioBlob(trackId);
		if (!blob || blob.size < 1024) throw new Error("Local audio file missing or corrupted in storage.");
		if (onProgress) onProgress(100);
		return {
			blob,
			mimeType: blob.type || "audio/mpeg"
		};
	}
	let fetchUrl = url;
	let res;
	try {
		res = await fetch(fetchUrl);
		if (!res.ok && res.status >= 400) throw new Error(`HTTP ${res.status}`);
	} catch (directErr) {
		try {
			fetchUrl = `/api/audio-proxy?url=${encodeURIComponent(url)}`;
			res = await fetch(fetchUrl);
			if (!res.ok) throw new Error(`Proxy download failed: HTTP ${res.status}`);
		} catch {
			throw directErr;
		}
	}
	const contentLength = Number(res.headers.get("content-length")) || 0;
	let mimeType = res.headers.get("content-type") || "audio/mpeg";
	if (!mimeType.includes("audio")) mimeType = "audio/mpeg";
	if (!res.body) {
		const blob = await res.blob();
		if (blob.size < 1024) throw new Error("Downloaded audio stream is corrupted or empty (size < 1KB).");
		if (onProgress) onProgress(100);
		return {
			blob,
			mimeType
		};
	}
	const reader = res.body.getReader();
	let receivedBytes = 0;
	const chunks = [];
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		if (value) {
			chunks.push(value);
			receivedBytes += value.length;
			if (contentLength > 0 && onProgress) onProgress(Math.min(99, Math.round(receivedBytes / contentLength * 100)));
		}
	}
	if (onProgress) onProgress(100);
	const combined = new Uint8Array(receivedBytes);
	let offset = 0;
	for (const chunk of chunks) {
		combined.set(chunk, offset);
		offset += chunk.length;
	}
	const blob = new Blob([combined.buffer], { type: mimeType });
	if (blob.size < 1024) throw new Error("Retrieved file is too small to be a valid audio recording.");
	return {
		blob,
		mimeType
	};
}
/**
* Searches across all configured X2 providers in prioritized order,
* with error handling, latency logging, and failure recovery.
*/
async function searchAllX2Providers(track, settings) {
	const attempts = [];
	const matches = [];
	if (settings.preferLocalCache !== false) {
		const start = Date.now();
		try {
			const localMatch = await searchLocalLibraryCache(track);
			if (localMatch) {
				attempts.push({
					provider: "local",
					providerName: "Local Library Cache",
					status: "matched",
					candidateCount: 1,
					latencyMs: Date.now() - start
				});
				return {
					matches: [localMatch],
					attempts,
					failureCategory: "none"
				};
			} else attempts.push({
				provider: "local",
				providerName: "Local Library Cache",
				status: "no_match",
				candidateCount: 0,
				latencyMs: Date.now() - start
			});
		} catch (err) {
			attempts.push({
				provider: "local",
				providerName: "Local Library Cache",
				status: "error",
				errorDetails: err instanceof Error ? err.message : "Cache error",
				candidateCount: 0,
				latencyMs: Date.now() - start
			});
		}
	}
	if (settings.enableSpotDLBridge && settings.spotDLBridgeUrl) {
		const start = Date.now();
		try {
			const spotMatch = await searchSpotDLBridge(track, settings.spotDLBridgeUrl);
			if (spotMatch) {
				matches.push(spotMatch);
				attempts.push({
					provider: "spotdl",
					providerName: "spotDL Python Engine",
					status: "matched",
					candidateCount: 1,
					latencyMs: Date.now() - start
				});
			} else attempts.push({
				provider: "spotdl",
				providerName: "spotDL Python Engine",
				status: "no_match",
				candidateCount: 0,
				latencyMs: Date.now() - start
			});
		} catch (err) {
			attempts.push({
				provider: "spotdl",
				providerName: "spotDL Python Engine",
				status: "error",
				errorDetails: err instanceof Error ? err.message : "Bridge unreachable",
				candidateCount: 0,
				latencyMs: Date.now() - start
			});
		}
	} else if (settings.enableSpotDLBridge && !settings.spotDLBridgeUrl) attempts.push({
		provider: "spotdl",
		providerName: "spotDL Python Engine",
		status: "skipped",
		errorDetails: "Requires self-hosted Python microservice URL",
		candidateCount: 0
	});
	if (settings.enableTelegramMatch !== false) {
		const start = Date.now();
		try {
			const tgMatches = await searchTelegramAudioHub(track);
			if (tgMatches.length > 0) {
				matches.push(...tgMatches);
				attempts.push({
					provider: "telegram",
					providerName: "Telegram Audio Hub",
					status: "matched",
					candidateCount: tgMatches.length,
					latencyMs: Date.now() - start
				});
			} else attempts.push({
				provider: "telegram",
				providerName: "Telegram Audio Hub",
				status: "no_match",
				candidateCount: 0,
				latencyMs: Date.now() - start
			});
		} catch (err) {
			attempts.push({
				provider: "telegram",
				providerName: "Telegram Audio Hub",
				status: "error",
				errorDetails: err instanceof Error ? err.message : "Telegram search error",
				candidateCount: 0,
				latencyMs: Date.now() - start
			});
		}
	}
	if (settings.enableJamendo) {
		const start = Date.now();
		try {
			const jamendoMatches = await searchJamendo(track);
			if (jamendoMatches.length > 0) {
				matches.push(...jamendoMatches);
				attempts.push({
					provider: "jamendo",
					providerName: "Jamendo Open Music",
					status: "matched",
					candidateCount: jamendoMatches.length,
					latencyMs: Date.now() - start
				});
			} else attempts.push({
				provider: "jamendo",
				providerName: "Jamendo Open Music",
				status: "no_match",
				candidateCount: 0,
				latencyMs: Date.now() - start
			});
		} catch (err) {
			attempts.push({
				provider: "jamendo",
				providerName: "Jamendo Open Music",
				status: "error",
				errorDetails: err instanceof Error ? err.message : "API error",
				candidateCount: 0,
				latencyMs: Date.now() - start
			});
		}
	}
	if (settings.enableInternetArchive) {
		const start = Date.now();
		try {
			const archiveMatches = await searchInternetArchive(track);
			if (archiveMatches.length > 0) {
				matches.push(...archiveMatches);
				attempts.push({
					provider: "archive",
					providerName: "Internet Archive",
					status: "matched",
					candidateCount: archiveMatches.length,
					latencyMs: Date.now() - start
				});
			} else attempts.push({
				provider: "archive",
				providerName: "Internet Archive",
				status: "no_match",
				candidateCount: 0,
				latencyMs: Date.now() - start
			});
		} catch (err) {
			attempts.push({
				provider: "archive",
				providerName: "Internet Archive",
				status: "error",
				errorDetails: err instanceof Error ? err.message : "Search error",
				candidateCount: 0,
				latencyMs: Date.now() - start
			});
		}
	}
	if (settings.enableFMA) {
		const start = Date.now();
		try {
			const fmaMatches = await searchFreeMusicArchive(track);
			if (fmaMatches.length > 0) {
				matches.push(...fmaMatches);
				attempts.push({
					provider: "fma",
					providerName: "Free Music Archive",
					status: "matched",
					candidateCount: fmaMatches.length,
					latencyMs: Date.now() - start
				});
			} else attempts.push({
				provider: "fma",
				providerName: "Free Music Archive",
				status: "no_match",
				candidateCount: 0,
				latencyMs: Date.now() - start
			});
		} catch (err) {
			attempts.push({
				provider: "fma",
				providerName: "Free Music Archive",
				status: "error",
				errorDetails: err instanceof Error ? err.message : "FMA search error",
				candidateCount: 0,
				latencyMs: Date.now() - start
			});
		}
	}
	matches.sort((a, b) => b.confidenceScore - a.confidenceScore);
	let failureCategory = "none";
	if (matches.length === 0) {
		if (attempts.some((a) => a.status === "error" && (a.errorDetails?.includes("Failed to fetch") || a.errorDetails?.includes("Network")))) failureCategory = "network_failure";
		else failureCategory = "recording_unavailable";
	}
	return {
		matches,
		attempts,
		failureCategory
	};
}
async function executeX2Import(params) {
	const { tracks, playlistTitle, playlistDescription, playlistCoverUrl, settings, onItemUpdate, onSummaryUpdate, isCancelledRef } = params;
	const playlistTrackIds = [];
	const summary = {
		total: tracks.length,
		completed: 0,
		alreadyLocal: 0,
		reviewRequired: 0,
		unavailable: 0,
		failed: 0
	};
	for (let i = 0; i < tracks.length; i++) {
		if (isCancelledRef.current) break;
		const trackMeta = tracks[i];
		const itemProgress = {
			id: `item_${i}`,
			track: trackMeta,
			status: "pending",
			candidateMatches: [],
			downloadProgress: 0,
			retryCount: 0
		};
		onItemUpdate(itemProgress);
		itemProgress.status = "searching";
		onItemUpdate(itemProgress);
		const searchResult = await searchAllX2Providers(trackMeta, settings);
		itemProgress.candidateMatches = searchResult.matches;
		itemProgress.providerAttempts = searchResult.attempts;
		const bestMatch = searchResult.matches[0];
		if (bestMatch && bestMatch.provider === "local") {
			const localTrackId = bestMatch.providerTrackId.replace("local_", "");
			itemProgress.status = "already_local";
			itemProgress.savedTrackId = localTrackId;
			itemProgress.selectedMatch = bestMatch;
			playlistTrackIds.push(localTrackId);
			summary.alreadyLocal++;
			summary.completed++;
			onItemUpdate(itemProgress);
			onSummaryUpdate({ ...summary });
			continue;
		}
		if (!bestMatch || bestMatch.confidenceScore < 45) {
			itemProgress.status = "unavailable";
			itemProgress.failureCategory = searchResult.failureCategory;
			itemProgress.errorMessage = searchResult.failureCategory === "network_failure" ? "Network timeout or connection error during search." : "No authorized audio match found across open repositories or Telegram sync.";
			summary.unavailable++;
			onItemUpdate(itemProgress);
			onSummaryUpdate({ ...summary });
			continue;
		}
		if (settings.requireConfirmationForMedium && bestMatch.confidenceScore < settings.matchingThreshold) {
			itemProgress.status = "review_required";
			itemProgress.selectedMatch = bestMatch;
			summary.reviewRequired++;
			onItemUpdate(itemProgress);
			onSummaryUpdate({ ...summary });
			continue;
		}
		itemProgress.status = "downloading";
		itemProgress.selectedMatch = bestMatch;
		onItemUpdate(itemProgress);
		try {
			const { blob, mimeType } = await downloadAndValidateAudio(bestMatch.downloadUrl, (progress) => {
				itemProgress.downloadProgress = progress;
				onItemUpdate(itemProgress);
			});
			itemProgress.status = "saving";
			onItemUpdate(itemProgress);
			const trackId = `imported_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`;
			const newTrack = {
				id: trackId,
				title: trackMeta.title,
				artist: trackMeta.artists.join(", ") || bestMatch.artist || "Unknown Artist",
				album: trackMeta.album || playlistTitle,
				duration: bestMatch.durationSeconds || Math.round(trackMeta.durationMs / 1e3) || 0,
				fileSize: blob.size,
				mimeType,
				fileName: `${trackMeta.title}.${bestMatch.format || "mp3"}`,
				downloadDate: Date.now(),
				isFavorite: false,
				playCount: 0,
				artworkUrl: trackMeta.artworkUrl || playlistCoverUrl,
				telegramSource: {
					chatTitle: `Import: ${playlistTitle}`,
					topicName: bestMatch.provider.toUpperCase(),
					sourceType: "manual"
				}
			};
			await saveTrack(newTrack, blob);
			playlistTrackIds.push(trackId);
			itemProgress.status = "completed";
			itemProgress.savedTrackId = trackId;
			summary.completed++;
			onItemUpdate(itemProgress);
			onSummaryUpdate({ ...summary });
		} catch (err) {
			itemProgress.status = "failed";
			itemProgress.failureCategory = "stream_invalid";
			itemProgress.errorMessage = err instanceof Error ? err.message : "Download failed";
			summary.failed++;
			onItemUpdate(itemProgress);
			onSummaryUpdate({ ...summary });
		}
	}
	const newPlaylist = {
		id: `pl_import_${Date.now()}`,
		name: playlistTitle,
		description: playlistDescription || `Imported playlist with ${playlistTrackIds.length} audio tracks`,
		sourceType: "manual",
		trackIds: playlistTrackIds,
		createdAt: Date.now(),
		updatedAt: Date.now(),
		coverArtworkUrl: playlistCoverUrl
	};
	await savePlaylist(newPlaylist);
	return {
		createdPlaylist: newPlaylist,
		summary
	};
}
/**
* Retries an individual failed or unavailable track with updated settings or backoff
*/
async function retryIndividualTrack(item, settings, onItemUpdate, targetPlaylistId) {
	item.status = "searching";
	item.retryCount = (item.retryCount || 0) + 1;
	onItemUpdate({ ...item });
	const searchResult = await searchAllX2Providers(item.track, settings);
	item.candidateMatches = searchResult.matches;
	item.providerAttempts = searchResult.attempts;
	const bestMatch = searchResult.matches[0];
	if (!bestMatch || bestMatch.confidenceScore < 45) {
		item.status = "unavailable";
		item.failureCategory = searchResult.failureCategory;
		item.errorMessage = "Still unavailable across configured audio providers.";
		onItemUpdate({ ...item });
		return {
			success: false,
			error: item.errorMessage
		};
	}
	if (bestMatch.provider === "local") {
		const localId = bestMatch.providerTrackId.replace("local_", "");
		item.status = "already_local";
		item.savedTrackId = localId;
		item.selectedMatch = bestMatch;
		onItemUpdate({ ...item });
		return {
			success: true,
			trackId: localId
		};
	}
	item.status = "downloading";
	item.selectedMatch = bestMatch;
	onItemUpdate({ ...item });
	try {
		const { blob, mimeType } = await downloadAndValidateAudio(bestMatch.downloadUrl, (p) => {
			item.downloadProgress = p;
			onItemUpdate({ ...item });
		});
		item.status = "saving";
		onItemUpdate({ ...item });
		const trackId = `retry_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
		const newTrack = {
			id: trackId,
			title: item.track.title,
			artist: item.track.artists.join(", ") || bestMatch.artist,
			album: item.track.album || "Imported Audio",
			duration: bestMatch.durationSeconds || Math.round(item.track.durationMs / 1e3) || 0,
			fileSize: blob.size,
			mimeType,
			fileName: `${item.track.title}.${bestMatch.format || "mp3"}`,
			downloadDate: Date.now(),
			isFavorite: false,
			playCount: 0,
			artworkUrl: item.track.artworkUrl || void 0,
			telegramSource: {
				chatTitle: "Individual Retry",
				topicName: bestMatch.provider.toUpperCase(),
				sourceType: "manual"
			}
		};
		await saveTrack(newTrack, blob);
		if (targetPlaylistId) {
			const { getAllPlaylists, savePlaylist } = await __vitePreload(async () => {
				const { getAllPlaylists, savePlaylist } = await import("./db-Cr6tU0Tr.js").then((n) => n.n);
				return {
					getAllPlaylists,
					savePlaylist
				};
			}, __vite__mapDeps([2,3]));
			const targetPl = (await getAllPlaylists()).find((p) => p.id === targetPlaylistId);
			if (targetPl) {
				targetPl.trackIds = Array.from(/* @__PURE__ */ new Set([...targetPl.trackIds, trackId]));
				targetPl.updatedAt = Date.now();
				await savePlaylist(targetPl);
			}
		}
		item.status = "completed";
		item.savedTrackId = trackId;
		item.errorMessage = void 0;
		onItemUpdate({ ...item });
		return {
			success: true,
			trackId
		};
	} catch (err) {
		const msg = err instanceof Error ? err.message : "Download failed";
		item.status = "failed";
		item.errorMessage = msg;
		item.failureCategory = "stream_invalid";
		onItemUpdate({ ...item });
		return {
			success: false,
			error: msg
		};
	}
}
/**
* Resolves an individual track metadata against authorized X2 providers,
* downloads and verifies the audio blob, persists to IndexedDB, and updates history.
*/
async function resolveAndDownloadSingleTrack(meta, settings, onProgress) {
	const normMeta = {
		title: meta.title,
		artists: meta.artist ? [meta.artist] : ["Unknown Artist"],
		album: meta.album || "Single Import",
		durationMs: meta.durationMs || 0,
		isrc: meta.isrc || null,
		artworkUrl: meta.artworkUrl || null,
		position: 0
	};
	if (onProgress) onProgress(10, "Checking local library cache...");
	const cached = await searchLocalLibraryCache(normMeta);
	if (cached) {
		const localId = cached.providerTrackId.replace("local_", "");
		const { getTrack } = await __vitePreload(async () => {
			const { getTrack } = await import("./db-Cr6tU0Tr.js").then((n) => n.n);
			return { getTrack };
		}, __vite__mapDeps([2,3]));
		const existingTrack = await getTrack(localId);
		if (existingTrack) {
			await recordDuplicateDetection({
				title: meta.title,
				artist: meta.artist,
				matchedTrackId: localId
			});
			if (onProgress) onProgress(100, "Already in local library");
			return {
				success: true,
				status: "already_local",
				track: existingTrack
			};
		}
	}
	if (onProgress) onProgress(30, "Searching authorized audio providers...");
	const searchResult = await searchAllX2Providers(normMeta, settings);
	const bestMatch = searchResult.matches[0];
	if (!bestMatch || bestMatch.confidenceScore < 45) {
		const errorMsg = searchResult.failureCategory === "network_failure" ? "Network error reaching audio repositories" : "No authorized audio match found across open repositories or Telegram sync";
		await recordFailedImport({
			title: meta.title,
			artist: meta.artist,
			album: meta.album,
			source: meta.source || "x2_engine",
			errorReason: errorMsg,
			durationMs: meta.durationMs,
			isrc: meta.isrc
		});
		if (onProgress) onProgress(0, errorMsg);
		return {
			success: false,
			status: "unavailable",
			error: errorMsg
		};
	}
	if (onProgress) onProgress(50, `Downloading from ${bestMatch.provider.toUpperCase()}...`);
	try {
		const { blob, mimeType } = await downloadAndValidateAudio(bestMatch.downloadUrl, (p) => {
			if (onProgress) onProgress(50 + Math.round(p * .4), `Downloading audio... ${p}%`);
		});
		if (onProgress) onProgress(95, "Saving to local music vault...");
		const trackId = `track_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
		const newTrack = {
			id: trackId,
			title: meta.title,
			artist: meta.artist || bestMatch.artist || "Unknown Artist",
			album: meta.album || "Imported Audio",
			duration: bestMatch.durationSeconds || (meta.durationMs ? Math.round(meta.durationMs / 1e3) : 0),
			fileSize: blob.size,
			mimeType,
			fileName: `${meta.title}.${bestMatch.format || "mp3"}`,
			downloadDate: Date.now(),
			isFavorite: false,
			playCount: 0,
			artworkUrl: meta.artworkUrl || void 0,
			telegramSource: {
				chatTitle: "BttM Discovery Download",
				topicName: bestMatch.provider.toUpperCase(),
				sourceType: "manual"
			}
		};
		await saveTrack(newTrack, blob);
		await recordDownloadHistory({
			title: newTrack.title,
			artist: newTrack.artist,
			album: newTrack.album,
			source: bestMatch.provider,
			status: "completed",
			localTrackId: trackId,
			artworkUrl: newTrack.artworkUrl,
			durationSeconds: newTrack.duration,
			fileSizeBytes: blob.size
		});
		if (onProgress) onProgress(100, "Saved to library!");
		return {
			success: true,
			status: "completed",
			track: newTrack
		};
	} catch (err) {
		const msg = err instanceof Error ? err.message : "Audio download failed";
		await recordFailedImport({
			title: meta.title,
			artist: meta.artist,
			album: meta.album,
			source: meta.source || bestMatch.provider,
			errorReason: msg,
			durationMs: meta.durationMs,
			isrc: meta.isrc
		});
		if (onProgress) onProgress(0, msg);
		return {
			success: false,
			status: "failed",
			error: msg
		};
	}
}
export { useMusic as _, searchAllX2Providers as a, getAllHistory as c, recordSearchHistory as d, checkSpotDLBridgeStatus as f, MusicProvider as g, parseAudioMetadata as h, retryIndividualTrack as i, recordDownloadHistory as l, formatFileSize as m, executeX2Import as n, clearHistoryByType as o, formatDuration as p, resolveAndDownloadSingleTrack as r, deleteHistoryRecord as s, downloadAndValidateAudio as t, recordPlaylistHistory as u, isNativePlatform as v, __vitePreload as y };
