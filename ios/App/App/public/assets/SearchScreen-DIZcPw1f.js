import { a as __toESM } from "./rolldown-runtime-DQp2zzRu.js";
import { $ as History, A as Send, B as Pause, Dt as require_react, H as Music, J as ListMusic, K as LoaderCircle, L as Plus, R as Play, X as Layers, Y as Library, _ as Sparkles, at as ExternalLink, bt as Check, ct as Disc, gt as CircleAlert, j as Search, n as Youtube, ot as EllipsisVertical, r as X, st as Download, vt as ChevronRight } from "./vendor-icons-DVdP9XFB.js";
import { s as findVerifiedCachedTrack, u as getAllTracks } from "./db-BcvoMtQu.js";
import { _ as useMusic, d as recordSearchHistory, p as formatDuration, r as resolveAndDownloadSingleTrack } from "./x2Engine-Cmqm_qoc.js";
import { l as require_jsx_runtime } from "./vendor-motion-CvHAzLEi.js";
import { t as fetchSpotifyPlaylist } from "./x1Spotify-DNTjKEdX.js";
import { a as SpotifyPlaylistReviewModal, o as MusicHistoryModal, s as DEFAULT_IMPORT_SETTINGS, t as TelegramDiscoveryModal } from "./TelegramDiscoveryModal-CMX1QQ0P.js";
// src/services/musicSearch/youtubeSearchService.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* Normalizes title string for string similarity
*/
function normalizeTitleForYouTube(title) {
	if (!title) return "";
	return title.toLowerCase().replace(/\((?:feat|ft|official|audio|video|remaster|lyrics|visualizer)[^)]*\)/gi, "").replace(/\[(?:feat|ft|official|audio|video|remaster|lyrics|visualizer)[^\]]*\]/gi, "").replace(/[^a-z0-9\s]/gi, " ").replace(/\s+/g, " ").trim();
}
/**
* Calculate token-based Sorensen-Dice similarity
*/
function calculateSimilarity(str1, str2) {
	const norm1 = normalizeTitleForYouTube(str1);
	const norm2 = normalizeTitleForYouTube(str2);
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
* Computes candidate confidence score
*/
function scoreYouTubeCandidate(requestedTitle, requestedArtist, candidateTitle, candidateChannel) {
	const titleSim = calculateSimilarity(requestedTitle, candidateTitle);
	const artistSim = calculateSimilarity(requestedArtist, candidateTitle) || calculateSimilarity(requestedArtist, candidateChannel);
	const lowerCandidate = candidateTitle.toLowerCase();
	const lowerChannel = candidateChannel.toLowerCase();
	const isOfficial = lowerCandidate.includes("official audio") || lowerCandidate.includes("official music video") || lowerChannel.includes("topic") || lowerChannel.includes("vevo") || lowerChannel.includes(requestedArtist.toLowerCase());
	let composite = titleSim * .6 + artistSim * .3 + (isOfficial ? .1 : 0);
	let score = Math.min(100, Math.round(composite * 100));
	let reason = "Relevant search result";
	if (score >= 85) reason = isOfficial ? "High confidence: Official Recording" : "High confidence match";
	else if (score >= 60) reason = "Good match: title and artist aligned";
	else reason = "Possible match (verify recording)";
	return {
		score,
		reason,
		isOfficial
	};
}
/**
* Search YouTube for a song by title and optional artist name
*/
async function searchYouTubeSong(title, artist = "") {
	const cleanTitle = title.trim();
	const cleanArtist = artist.trim();
	const fullQuery = cleanArtist ? `${cleanTitle} ${cleanArtist}` : cleanTitle;
	if (!fullQuery) return {
		query: "",
		results: [],
		source: "fallback_search"
	};
	try {
		const url = `/api/youtube/search?q=${encodeURIComponent(fullQuery)}`;
		const res = await fetch(url, { signal: AbortSignal.timeout(7500) });
		if (res.ok) {
			const data = await res.json();
			if (Array.isArray(data.items)) {
				const results = data.items.map((item) => {
					const videoTitle = item.snippet?.title || item.title || "Unknown Video";
					const channel = item.snippet?.channelTitle || item.channelTitle || "";
					const videoId = item.id?.videoId || item.id || "";
					const thumb = item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
					const { score, reason, isOfficial } = scoreYouTubeCandidate(cleanTitle, cleanArtist, videoTitle, channel);
					return {
						id: videoId,
						title: videoTitle,
						channelTitle: channel,
						thumbnailUrl: thumb,
						publishedAt: item.snippet?.publishedAt,
						confidenceScore: score,
						matchReason: reason,
						videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
						isOfficialAudio: isOfficial
					};
				});
				results.sort((a, b) => b.confidenceScore - a.confidenceScore);
				return {
					query: fullQuery,
					results,
					source: data.hasOfficialApiKey ? "official_v3_api" : "youtube_oembed_proxy",
					requiresApiKeyNotice: !data.hasOfficialApiKey
				};
			}
		}
	} catch (err) {
		console.warn("YouTube search proxy warning:", err);
	}
	return {
		query: fullQuery,
		results: [],
		source: "fallback_search",
		requiresApiKeyNotice: true
	};
}
// src/services/musicSearch/itunesService.ts
async function searchITunesTracks(query, limit = 25) {
	const clean = query.trim();
	if (!clean) return [];
	try {
		const proxyUrl = `/api/itunes/search?term=${encodeURIComponent(clean)}&limit=${limit}`;
		const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(6e3) });
		if (res.ok) {
			const data = await res.json();
			if (Array.isArray(data.results)) return formatITunesResults(data.results);
		}
	} catch (err) {}
	try {
		const directUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(clean)}&media=music&entity=song&limit=${limit}`;
		const res = await fetch(directUrl, { signal: AbortSignal.timeout(7e3) });
		if (!res.ok) throw new Error(`iTunes Search API error: HTTP ${res.status}`);
		return formatITunesResults((await res.json()).results || []);
	} catch (err) {
		const msg = err instanceof Error ? err.message : "Failed to search iTunes";
		throw new Error(msg);
	}
}
function formatITunesResults(results) {
	return results.filter((item) => item.wrapperType === "track" && item.kind === "song").map((item) => {
		const rawArt = item.artworkUrl100 || "";
		const artworkUrl600 = rawArt ? rawArt.replace("100x100bb", "600x600bb") : "/pwa-512x512.png";
		return {
			trackId: item.trackId,
			trackName: item.trackName || "Unknown Title",
			artistName: item.artistName || "Unknown Artist",
			collectionName: item.collectionName || "Single",
			artworkUrl100: rawArt,
			artworkUrl600,
			previewUrl: item.previewUrl || null,
			trackTimeMillis: item.trackTimeMillis || 0,
			primaryGenreName: item.primaryGenreName,
			releaseDate: item.releaseDate,
			isrc: item.isrc || null
		};
	});
}
// src/services/musicSearch/soundcloudService.ts
async function searchSoundCloudTracks(query, clientId) {
	const clean = query.trim();
	const cId = clientId?.trim() || "";
	try {
		const url = `/api/soundcloud/search?q=${encodeURIComponent(clean)}&client_id=${encodeURIComponent(cId)}`;
		const res = await fetch(url);
		if (res.ok) {
			const data = await res.json();
			return {
				configured: data.configured,
				tracks: data.tracks || [],
				message: data.message || ""
			};
		}
	} catch (err) {
		console.warn("SoundCloud search request error:", err);
	}
	return {
		configured: false,
		tracks: [],
		message: "SoundCloud requires a registered developer Client ID for track search. Public oEmbed playback is supported."
	};
}
// src/services/musicSearch/unifiedSearchService.ts
/**
* Searches across all requested sources, normalizes records into a single structure,
* checks against verified local cache, and records history.
*/
async function performUnifiedSearch(query, options = {}) {
	const startTime = Date.now();
	const cleanQuery = query.trim();
	const sourceFilter = options.sourceFilter || "all";
	const limit = options.limitPerSource || 15;
	if (!cleanQuery) return {
		query: "",
		sourceFilter,
		results: [],
		sourceCounts: {},
		executionTimeMs: 0
	};
	const isSpotifyUrl = cleanQuery.includes("spotify.com") || cleanQuery.startsWith("spotify:") || /^[a-zA-Z0-9]{22}$/.test(cleanQuery);
	let detectedSpotifyPlaylist;
	if (isSpotifyUrl && (sourceFilter === "all" || sourceFilter === "spotify")) try {
		const pl = await fetchSpotifyPlaylist(cleanQuery);
		if (pl && pl.tracks && pl.tracks.length > 0) detectedSpotifyPlaylist = pl;
	} catch {}
	const results = [];
	const sourceCounts = {
		local: 0,
		spotify: 0,
		youtube: 0,
		soundcloud: 0,
		telegram: 0,
		open_cc: 0
	};
	const tasks = [];
	if (sourceFilter === "all" || sourceFilter === "local") tasks.push((async () => {
		try {
			const allLocal = await getAllTracks();
			const q = cleanQuery.toLowerCase();
			const matched = allLocal.filter((t) => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q) || t.album.toLowerCase().includes(q));
			for (const t of matched.slice(0, limit)) {
				sourceCounts.local++;
				results.push({
					id: `local_${t.id}`,
					title: t.title,
					artist: t.artist,
					album: t.album,
					durationSeconds: t.duration,
					durationFormatted: formatDuration(t.duration),
					artworkUrl: t.artworkUrl,
					source: "local",
					sourceId: t.id,
					downloadAvailability: "in_library",
					availabilityReason: "Stored locally in offline IndexedDB vault",
					localTrackId: t.id,
					isLocal: true,
					confidenceScore: 100,
					matchReason: "Direct local library audio hit",
					importState: "in_library"
				});
			}
		} catch (err) {
			console.warn("Local library search error:", err);
		}
	})());
	if (sourceFilter === "all" || sourceFilter === "spotify") tasks.push((async () => {
		try {
			if (detectedSpotifyPlaylist) for (const t of detectedSpotifyPlaylist.tracks.slice(0, limit)) {
				sourceCounts.spotify++;
				const cached = await findVerifiedCachedTrack(t.title, t.artists[0] || "", t.durationMs);
				const durationSec = Math.round(t.durationMs / 1e3);
				results.push({
					id: `sp_${t.position}_${t.title.substring(0, 10)}`,
					title: t.title,
					artist: t.artists.join(", ") || "Unknown Artist",
					album: t.album || detectedSpotifyPlaylist.playlistTitle,
					durationSeconds: durationSec,
					durationFormatted: formatDuration(durationSec),
					artworkUrl: t.artworkUrl || detectedSpotifyPlaylist.playlistCoverUrl,
					source: "spotify",
					sourceUrl: detectedSpotifyPlaylist.externalUrl,
					sourceId: `sp_${t.position}`,
					downloadAvailability: cached ? "in_library" : "downloadable",
					availabilityReason: cached ? "Already in local library" : "Ready for authorized recording match & download",
					localTrackId: cached ? cached.track.id : void 0,
					isLocal: !!cached,
					isrc: t.isrc,
					channelOrCurator: detectedSpotifyPlaylist.playlistTitle,
					importState: cached ? "in_library" : "idle"
				});
			}
			else {
				const itunesResults = await searchITunesTracks(cleanQuery, limit);
				for (const it of itunesResults) {
					sourceCounts.spotify++;
					const cached = await findVerifiedCachedTrack(it.trackName, it.artistName, it.trackTimeMillis);
					const durationSec = Math.round(it.trackTimeMillis / 1e3);
					results.push({
						id: `sp_meta_${it.trackId}`,
						title: it.trackName,
						artist: it.artistName,
						album: it.collectionName,
						durationSeconds: durationSec,
						durationFormatted: formatDuration(durationSec),
						artworkUrl: it.artworkUrl100?.replace("100x100bb", "600x600bb"),
						source: "spotify",
						sourceUrl: `https://music.apple.com/song/${it.trackId}`,
						sourceId: String(it.trackId),
						downloadAvailability: cached ? "in_library" : "downloadable",
						availabilityReason: cached ? "Already in local library" : "Official song metadata (30s preview available; download matches authorized CC/sync)",
						localTrackId: cached ? cached.track.id : void 0,
						isLocal: !!cached,
						audioStreamUrl: it.previewUrl || void 0,
						importState: cached ? "in_library" : "idle"
					});
				}
			}
		} catch (err) {
			console.warn("Spotify / iTunes search error:", err);
		}
	})());
	if (sourceFilter === "all" || sourceFilter === "youtube") tasks.push((async () => {
		try {
			const parts = cleanQuery.split(/\s*[-–—]\s*/);
			const ytResponse = await searchYouTubeSong(parts[0] || cleanQuery, parts[1] || "");
			for (const item of ytResponse.results.slice(0, limit)) {
				sourceCounts.youtube++;
				const cached = await findVerifiedCachedTrack(item.title, item.channelTitle);
				results.push({
					id: `yt_${item.id}`,
					title: item.title,
					artist: item.channelTitle,
					durationSeconds: item.durationSeconds,
					durationFormatted: item.durationFormatted,
					artworkUrl: item.thumbnailUrl,
					source: "youtube",
					sourceUrl: item.videoUrl,
					sourceId: item.id,
					downloadAvailability: cached ? "in_library" : "downloadable",
					availabilityReason: cached ? "Already downloaded in offline vault" : "YouTube video stream available (Download matches authorized audio provider)",
					localTrackId: cached ? cached.track.id : void 0,
					isLocal: !!cached,
					confidenceScore: item.confidenceScore,
					matchReason: item.matchReason,
					channelOrCurator: item.channelTitle,
					importState: cached ? "in_library" : "idle"
				});
			}
		} catch (err) {
			console.warn("YouTube search error:", err);
		}
	})());
	if (sourceFilter === "all" || sourceFilter === "soundcloud") tasks.push((async () => {
		try {
			const scResponse = await searchSoundCloudTracks(cleanQuery);
			for (const t of scResponse.tracks.slice(0, limit)) {
				sourceCounts.soundcloud++;
				const cached = await findVerifiedCachedTrack(t.title, t.user?.username || "");
				const durationSec = Math.round(t.duration / 1e3);
				results.push({
					id: `sc_${t.id}`,
					title: t.title,
					artist: t.user?.username || "SoundCloud Artist",
					durationSeconds: durationSec,
					durationFormatted: formatDuration(durationSec),
					artworkUrl: t.artwork_url || t.user?.avatar_url,
					source: "soundcloud",
					sourceUrl: t.permalink_url,
					sourceId: String(t.id),
					downloadAvailability: cached ? "in_library" : t.stream_url ? "downloadable" : "preview_only",
					availabilityReason: cached ? "Already in library" : t.stream_url ? "SoundCloud stream available for playback & authorized matching" : "SoundCloud web stream available",
					localTrackId: cached ? cached.track.id : void 0,
					isLocal: !!cached,
					audioStreamUrl: t.stream_url,
					downloadUrl: t.stream_url,
					channelOrCurator: t.user?.username,
					importState: cached ? "in_library" : "idle"
				});
			}
		} catch (err) {
			console.warn("SoundCloud search error:", err);
		}
	})());
	if (sourceFilter === "all" || sourceFilter === "telegram") tasks.push((async () => {
		try {
			const telegramTracks = (await getAllTracks()).filter((t) => t.telegramSource && t.telegramSource.fileId);
			const q = cleanQuery.toLowerCase();
			const matched = telegramTracks.filter((t) => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q));
			for (const t of matched.slice(0, limit)) {
				sourceCounts.telegram++;
				results.push({
					id: `tg_${t.id}`,
					title: t.title,
					artist: t.artist,
					album: t.album,
					durationSeconds: t.duration,
					durationFormatted: formatDuration(t.duration),
					artworkUrl: t.artworkUrl,
					source: "telegram",
					sourceId: t.id,
					downloadAvailability: "in_library",
					availabilityReason: "Synced from Telegram Hub into local library",
					localTrackId: t.id,
					isLocal: true,
					channelOrCurator: t.telegramSource?.chatTitle || "Telegram Audio Hub",
					importState: "in_library"
				});
			}
		} catch (err) {
			console.warn("Telegram search error:", err);
		}
	})());
	if (sourceFilter === "all" || sourceFilter === "open_cc") tasks.push((async () => {
		try {
			const clean = encodeURIComponent(cleanQuery.replace(/[^a-zA-Z0-9\s]/g, " ").trim());
			if (!clean) return;
			const jamUrl = `https://api.jamendo.com/v3.0/tracks/?client_id=96cf1c7c&format=json&limit=5&namesearch=${clean}&include=licenses`;
			const jamRes = await fetch(jamUrl, { signal: AbortSignal.timeout(4500) });
			if (jamRes.ok) {
				const data = await jamRes.json();
				for (const item of (data.results || []).slice(0, 5)) {
					sourceCounts.open_cc++;
					const durationSec = Number(item.duration) || 0;
					const cached = await findVerifiedCachedTrack(item.name, item.artist_name);
					results.push({
						id: `jam_${item.id}`,
						title: item.name,
						artist: item.artist_name,
						album: item.album_name || "Jamendo Music",
						durationSeconds: durationSec,
						durationFormatted: formatDuration(durationSec),
						artworkUrl: item.image || item.album_image,
						source: "open_cc",
						sourceUrl: item.shareurl,
						sourceId: item.id,
						downloadAvailability: cached ? "in_library" : "downloadable",
						availabilityReason: cached ? "Already in library" : "Creative Commons Open Music: Direct MP3 download permitted",
						localTrackId: cached ? cached.track.id : void 0,
						isLocal: !!cached,
						audioStreamUrl: item.audio,
						downloadUrl: item.audiodownload || item.audio,
						channelOrCurator: "Jamendo CC",
						confidenceScore: 95,
						matchReason: "Direct Open CC recording hit",
						importState: cached ? "in_library" : "idle"
					});
				}
			}
		} catch (err) {
			console.warn("Open CC search error:", err);
		}
	})());
	await Promise.all(tasks);
	await recordSearchHistory(cleanQuery, sourceFilter, results.length);
	if (detectedSpotifyPlaylist) await recordSearchHistory(detectedSpotifyPlaylist.playlistTitle, "spotify_playlist", detectedSpotifyPlaylist.totalTracks);
	const executionTimeMs = Date.now() - startTime;
	return {
		query: cleanQuery,
		sourceFilter,
		results,
		spotifyPlaylist: detectedSpotifyPlaylist,
		sourceCounts,
		executionTimeMs
	};
}
// src/components/screens/SearchScreen.tsx
var import_jsx_runtime = require_jsx_runtime();
var SearchScreen = () => {
	const { playTrack, showToast, refreshLibrary, tracks: localTracks, addToQueue } = useMusic();
	const [query, setQuery] = (0, import_react.useState)("");
	const [sourceFilter, setSourceFilter] = (0, import_react.useState)("all");
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [results, setResults] = (0, import_react.useState)([]);
	const [sourceCounts, setSourceCounts] = (0, import_react.useState)({});
	const [detectedPlaylist, setDetectedPlaylist] = (0, import_react.useState)(null);
	const [itemProgress, setItemProgress] = (0, import_react.useState)({});
	const [previewItemId, setPreviewItemId] = (0, import_react.useState)(null);
	const previewAudioRef = (0, import_react.useRef)(null);
	const [isHistoryOpen, setIsHistoryOpen] = (0, import_react.useState)(false);
	const [isSpotifyModalOpen, setIsSpotifyModalOpen] = (0, import_react.useState)(false);
	const [isTelegramModalOpen, setIsTelegramModalOpen] = (0, import_react.useState)(false);
	const [activeAddToPlaylistTrack, setActiveAddToPlaylistTrack] = (0, import_react.useState)(null);
	const [activeMenuTrackId, setActiveMenuTrackId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		return () => {
			if (previewAudioRef.current) {
				previewAudioRef.current.pause();
				previewAudioRef.current = null;
			}
		};
	}, []);
	const handleSearch = async (e, customQuery) => {
		if (e) e.preventDefault();
		const clean = (customQuery !== void 0 ? customQuery : query).trim();
		if (!clean) return;
		setIsLoading(true);
		setError(null);
		setDetectedPlaylist(null);
		if (previewAudioRef.current) {
			previewAudioRef.current.pause();
			previewAudioRef.current = null;
			setPreviewItemId(null);
		}
		try {
			const res = await performUnifiedSearch(clean, {
				sourceFilter,
				limitPerSource: 15
			});
			setResults(res.results);
			setSourceCounts(res.sourceCounts);
			if (res.spotifyPlaylist) {
				setDetectedPlaylist(res.spotifyPlaylist);
				showToast(`Spotify Playlist detected: "${res.spotifyPlaylist.playlistTitle}"`);
			}
			if (res.results.length === 0) setError(`No tracks found for "${clean}". Try another title or select "All Sources".`);
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Search request failed";
			setError(msg);
		} finally {
			setIsLoading(false);
		}
	};
	const handleSourceTabChange = (source) => {
		setSourceFilter(source);
		if (query.trim()) setTimeout(() => {
			handleSearch();
		}, 50);
	};
	const handleTogglePreview = (item) => {
		if (item.isLocal && item.localTrackId) {
			const track = localTracks.find((t) => t.id === item.localTrackId);
			if (track) {
				playTrack(track);
				return;
			}
		}
		if (!item.audioStreamUrl) {
			showToast("Audio preview stream not available for this record");
			return;
		}
		if (previewItemId === item.id) {
			if (previewAudioRef.current) {
				previewAudioRef.current.pause();
				setPreviewItemId(null);
			}
			return;
		}
		if (previewAudioRef.current) previewAudioRef.current.pause();
		const audio = new Audio(item.audioStreamUrl);
		previewAudioRef.current = audio;
		setPreviewItemId(item.id);
		audio.play().catch((err) => {
			console.warn("Preview play blocked:", err);
			showToast("Preview playback blocked by browser");
			setPreviewItemId(null);
		});
		audio.onended = () => {
			setPreviewItemId(null);
		};
	};
	const handleDownloadTrack = async (item) => {
		if (item.isLocal) {
			showToast("Track is already downloaded in your library");
			return;
		}
		setItemProgress((prev) => ({
			...prev,
			[item.id]: {
				percent: 15,
				status: "checking"
			}
		}));
		try {
			const result = await resolveAndDownloadSingleTrack({
				title: item.title,
				artist: item.artist,
				album: item.album,
				durationMs: item.durationSeconds ? item.durationSeconds * 1e3 : void 0,
				artworkUrl: item.artworkUrl,
				isrc: item.isrc,
				source: item.source
			}, DEFAULT_IMPORT_SETTINGS, (percent, statusMsg) => {
				setItemProgress((prev) => ({
					...prev,
					[item.id]: {
						percent,
						status: statusMsg
					}
				}));
			});
			if (result.success && result.track) {
				setItemProgress((prev) => ({
					...prev,
					[item.id]: {
						percent: 100,
						status: "completed"
					}
				}));
				setResults((prev) => prev.map((r) => r.id === item.id ? {
					...r,
					isLocal: true,
					localTrackId: result.track?.id,
					downloadAvailability: "in_library"
				} : r));
				showToast(`Downloaded "${item.title}" to offline library!`);
				await refreshLibrary();
			} else {
				const errorMsg = result.error || "No authorized audio provider could supply this recording";
				setItemProgress((prev) => ({
					...prev,
					[item.id]: {
						percent: 0,
						status: "unavailable",
						error: errorMsg
					}
				}));
				showToast(errorMsg);
			}
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Download failed";
			setItemProgress((prev) => ({
				...prev,
				[item.id]: {
					percent: 0,
					status: "failed",
					error: msg
				}
			}));
			showToast(`Download failed: ${msg}`);
		}
	};
	const handleAddToQueue = (item) => {
		setActiveMenuTrackId(null);
		if (item.isLocal && item.localTrackId) {
			const t = localTracks.find((lt) => lt.id === item.localTrackId);
			if (t) {
				addToQueue(t);
				showToast(`Added "${item.title}" to queue`);
				return;
			}
		}
		showToast("Download track first to add to offline queue");
	};
	const sourceTabs = [
		{
			id: "all",
			label: "All Sources",
			icon: Layers
		},
		{
			id: "youtube",
			label: "YouTube",
			icon: Youtube
		},
		{
			id: "spotify",
			label: "Spotify",
			icon: ListMusic
		},
		{
			id: "soundcloud",
			label: "SoundCloud",
			icon: Disc
		},
		{
			id: "telegram",
			label: "Telegram Hub",
			icon: Send
		},
		{
			id: "local",
			label: "Local Library",
			icon: Library
		},
		{
			id: "open_cc",
			label: "Open CC",
			icon: Sparkles
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 flex flex-col min-h-0 bg-[#F3EBDD] dark:bg-[#080A09] text-[#292820] dark:text-[#E8E9DD] select-none transition-colors duration-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-4 pt-4 pb-2 flex items-center justify-between border-b border-[#292820]/10 dark:border-white/10 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] font-mono uppercase tracking-widest text-[#176B67] dark:text-[#C8F169] font-bold",
					children: "Unified Discovery & Import"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-bold tracking-tight text-[#292820] dark:text-[#E8E9DD]",
					children: "Music Search"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setIsTelegramModalOpen(true),
						className: "p-2 rounded-xl bg-[#02ABB0]/15 text-[#02ABB0] hover:bg-[#02ABB0]/25 active:scale-95 transition",
						title: "Telegram Music Hub",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-4 h-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setIsHistoryOpen(true),
						className: "p-2 rounded-xl bg-[#176B67]/15 dark:bg-[#C8F169]/15 text-[#176B67] dark:text-[#C8F169] hover:opacity-80 active:scale-95 transition flex items-center gap-1.5",
						title: "Music & Search History",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold hidden sm:inline",
							children: "History"
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSearch,
					className: "relative flex items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "Search songs, artists, albums, or Spotify URLs...",
							className: "w-full pl-11 pr-24 py-3 rounded-2xl bg-white/80 dark:bg-[#141815]/80 backdrop-blur-xl border border-[#292820]/15 dark:border-white/15 text-sm font-medium text-[#292820] dark:text-[#E8E9DD] placeholder:text-[#777267] shadow-sm focus:outline-none focus:border-[#176B67] dark:focus:border-[#C8F169] transition"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-5 h-5 text-[#777267] absolute left-3.5 pointer-events-none" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute right-2 flex items-center gap-1",
							children: [query && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setQuery(""),
								className: "p-1.5 rounded-lg text-[#777267] hover:text-[#292820] dark:hover:text-white transition",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: isLoading || !query.trim(),
								className: "px-3.5 py-1.5 rounded-xl bg-[#176B67] text-white dark:bg-[#C8F169] dark:text-[#080A09] text-xs font-bold active:scale-95 transition disabled:opacity-50 flex items-center gap-1 shadow-xs",
								children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Search" })
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto scrollbar-none pt-3 pb-1 -mx-4 px-4",
					children: sourceTabs.map((tab) => {
						const Icon = tab.icon;
						const isActive = sourceFilter === tab.id;
						const count = sourceCounts[tab.id];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => handleSourceTabChange(tab.id),
							className: `px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 active:scale-95 ${isActive ? "bg-[#176B67] text-white dark:bg-[#C8F169] dark:text-[#080A09] shadow-sm" : "bg-[#292820]/5 dark:bg-white/5 text-[#777267] dark:text-[#92998F] hover:text-[#292820] dark:hover:text-white"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-3.5 h-3.5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab.label }),
								count !== void 0 && count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-mono opacity-80",
									children: [
										"(",
										count,
										")"
									]
								})
							]
						}, tab.id);
					})
				})]
			}),
			detectedPlaylist && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-4 mb-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-3 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 min-w-0",
					children: [detectedPlaylist.playlistCoverUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: detectedPlaylist.playlistCoverUrl,
						alt: "",
						className: "w-11 h-11 rounded-xl object-cover border border-emerald-500/20 shrink-0"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListMusic, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[9px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold",
								children: "Spotify Playlist Detected"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-xs font-bold text-[#292820] dark:text-[#E8E9DD] truncate",
								children: detectedPlaylist.playlistTitle
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-[#777267] dark:text-[#92998F] font-mono",
								children: [detectedPlaylist.totalTracks, " tracks ready for track-by-track download"]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setIsSpotifyModalOpen(true),
					className: "px-3.5 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-xs active:scale-95 transition flex items-center gap-1 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Inspect All" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5" })]
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-4 mb-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto px-4 pb-24 space-y-2.5",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-12 text-center text-[#777267] dark:text-[#92998F] text-xs font-mono flex flex-col items-center justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-7 h-7 animate-spin text-[#176B67] dark:text-[#C8F169] mb-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Searching across YouTube, Spotify, Local, and Open CC catalogs..." })]
				}) : results.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-12 text-center select-none text-[#777267] dark:text-[#92998F]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-10 h-10 mx-auto mb-3 opacity-30" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-bold text-[#292820] dark:text-[#E8E9DD]",
							children: "Discover Music Anywhere"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs mt-1 max-w-xs mx-auto leading-relaxed",
							children: "Search by song name, artist, album, or paste a Spotify link. Every result includes playback and download actions when permitted."
						})
					]
				}) : results.map((item) => {
					const progress = itemProgress[item.id];
					const isDownloading = progress && progress.status !== "completed" && progress.percent > 0;
					const isDownloaded = item.isLocal || progress?.status === "completed";
					const isPreviewing = previewItemId === item.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group p-3 rounded-2xl bg-white/70 dark:bg-[#141815]/70 border border-[#292820]/10 dark:border-white/10 hover:border-[#176B67]/40 dark:hover:border-[#C8F169]/40 transition-all duration-200 flex items-center justify-between gap-3 shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-12 h-12 rounded-xl overflow-hidden bg-[#292820]/10 dark:bg-white/10 shrink-0",
								children: [item.artworkUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: item.artworkUrl,
									alt: "",
									className: "w-full h-full object-cover",
									loading: "lazy"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full h-full flex items-center justify-center text-[#777267]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: "w-5 h-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleTogglePreview(item),
									className: `absolute inset-0 flex items-center justify-center transition-all duration-200 ${isPreviewing ? "bg-black/60 text-[#C8F169] opacity-100" : "bg-black/40 text-white opacity-0 group-hover:opacity-100 active:scale-95"}`,
									title: isPreviewing ? "Stop preview" : "Play preview stream",
									children: isPreviewing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "w-5 h-5 fill-current" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-5 h-5 fill-current ml-0.5" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs font-bold text-[#292820] dark:text-[#E8E9DD] truncate",
											children: item.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-[9px] font-mono uppercase px-1.5 py-0.2 rounded-full font-bold shrink-0 ${item.source === "youtube" ? "bg-red-500/15 text-red-500" : item.source === "spotify" ? "bg-emerald-500/15 text-emerald-500" : item.source === "soundcloud" ? "bg-amber-500/15 text-amber-500" : item.source === "telegram" ? "bg-[#02ABB0]/15 text-[#02ABB0]" : item.source === "local" ? "bg-[#176B67]/20 text-[#176B67] dark:text-[#C8F169]" : "bg-purple-500/15 text-purple-500"}`,
											children: item.source
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-[#777267] dark:text-[#92998F] truncate mt-0.5",
										children: [item.artist, item.album ? ` • ${item.album}` : ""]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 mt-0.5 text-[10px] text-[#777267] font-mono",
										children: [
											item.durationFormatted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.durationFormatted }),
											item.isLocal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3 h-3" }), " In Library"]
											}),
											progress?.status && progress.status !== "completed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[#176B67] dark:text-[#C8F169]",
												children: progress.status
											})
										]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 shrink-0",
							children: [isDownloaded ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "px-2.5 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Downloaded"
								})]
							}) : isDownloading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "px-2.5 py-1.5 rounded-xl bg-[#176B67]/20 text-[#176B67] dark:text-[#C8F169] text-xs font-mono font-bold flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [progress.percent, "%"] })]
							}) : item.downloadAvailability === "downloadable" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleDownloadTrack(item),
								className: "px-3 py-1.5 rounded-xl bg-[#176B67] text-white dark:bg-[#C8F169] dark:text-[#080A09] text-xs font-bold active:scale-95 transition flex items-center gap-1 shadow-xs",
								title: "Download audio recording to local vault",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download" })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-2 py-1 rounded-lg bg-[#292820]/5 dark:bg-white/5 text-[#777267] text-[10px] font-mono flex items-center gap-1",
								title: item.availabilityReason,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Stream Only" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setActiveMenuTrackId(activeMenuTrackId === item.id ? null : item.id),
									className: "p-1.5 rounded-lg text-[#777267] hover:text-[#292820] dark:hover:text-white transition",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "w-4 h-4" })
								}), activeMenuTrackId === item.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute right-0 top-full mt-1 w-44 rounded-2xl bg-white/95 dark:bg-[#141815]/95 backdrop-blur-2xl border border-[#292820]/15 dark:border-white/15 shadow-xl p-1.5 z-30 space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => handleAddToQueue(item),
											className: "w-full px-2.5 py-1.5 rounded-xl text-left text-xs text-[#292820] dark:text-[#E8E9DD] hover:bg-[#292820]/5 dark:hover:bg-white/5 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), " Add to Queue"]
										}),
										item.sourceUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: item.sourceUrl,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "w-full px-2.5 py-1.5 rounded-xl text-left text-xs text-[#292820] dark:text-[#E8E9DD] hover:bg-[#292820]/5 dark:hover:bg-white/5 flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3.5 h-3.5" }),
												" View on ",
												item.source
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "p-2 border-t border-[#292820]/10 dark:border-white/10 text-[10px] text-[#777267] font-mono leading-tight",
											children: item.availabilityReason
										})
									]
								})]
							})]
						})]
					}, item.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotifyPlaylistReviewModal, {
				isOpen: isSpotifyModalOpen,
				onClose: () => setIsSpotifyModalOpen(false),
				initialPlaylist: detectedPlaylist
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MusicHistoryModal, {
				isOpen: isHistoryOpen,
				onClose: () => setIsHistoryOpen(false),
				onSelectSearch: (q) => {
					setQuery(q);
					handleSearch(void 0, q);
				},
				onSelectPlaylistUrl: (url) => {
					setQuery(url);
					setIsSpotifyModalOpen(true);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TelegramDiscoveryModal, {
				isOpen: isTelegramModalOpen,
				onClose: () => setIsTelegramModalOpen(false)
			})
		]
	});
};
export { SearchScreen };
