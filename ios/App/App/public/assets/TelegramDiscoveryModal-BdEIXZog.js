import { a as __toESM } from "./rolldown-runtime-DQp2zzRu.js";
import { $ as History, A as Send, Dt as require_react, G as Lock, H as Music, I as Radio, J as ListMusic, K as LoaderCircle, M as RotateCcw, R as Play, X as Layers, _ as Sparkles, bt as Check, d as Trash2, ft as Clock, gt as CircleAlert, it as FileMusic, j as Search, mt as CircleCheck, r as X, st as Download, u as TriangleAlert, ut as Copy, w as ShieldCheck, wt as ArrowRight } from "./vendor-icons-DVdP9XFB.js";
import { g as savePlaylist, h as isTrackInLibrary, s as findVerifiedCachedTrack, v as saveTrack } from "./db-Cr6tU0Tr.js";
import { _ as useMusic, a as searchAllX2Providers, c as getAllHistory, h as parseAudioMetadata, l as recordDownloadHistory, m as formatFileSize, o as clearHistoryByType, p as formatDuration, r as resolveAndDownloadSingleTrack, s as deleteHistoryRecord, u as recordPlaylistHistory } from "./x2Engine-BSzGwD2O.js";
import { l as require_jsx_runtime } from "./vendor-motion-CvHAzLEi.js";
import { t as fetchSpotifyPlaylist } from "./x1Spotify-BF31KyoX.js";
// src/types/playlistImport.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var DEFAULT_IMPORT_SETTINGS = {
	matchingThreshold: 70,
	enableJamendo: true,
	enableInternetArchive: true,
	enableFMA: true,
	enableTelegramMatch: true,
	enableSpotDLBridge: false,
	spotDLBridgeUrl: "",
	spotifyClientId: "",
	spotifyClientSecret: "",
	requireConfirmationForMedium: false,
	preferLocalCache: true,
	maxRetries: 2
};
// src/components/common/MusicHistoryModal.tsx
var import_jsx_runtime = require_jsx_runtime();
var MusicHistoryModal = ({ isOpen, onClose, onSelectSearch, onSelectPlaylistUrl }) => {
	const { playTrack, tracks, showToast, refreshLibrary } = useMusic();
	const [activeFilter, setActiveFilter] = (0, import_react.useState)("all");
	const [records, setRecords] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [retryingId, setRetryingId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (isOpen) loadHistory();
	}, [isOpen]);
	const loadHistory = async () => {
		setIsLoading(true);
		try {
			const data = await getAllHistory();
			setRecords(data);
		} finally {
			setIsLoading(false);
		}
	};
	const handleClearHistory = async () => {
		if (window.confirm(`Clear ${activeFilter === "all" ? "all history" : `${activeFilter} history`}?`)) {
			await clearHistoryByType(activeFilter);
			await loadHistory();
			showToast("History cleared");
		}
	};
	const handleDeleteItem = async (id, e) => {
		e.stopPropagation();
		await deleteHistoryRecord(id);
		setRecords((prev) => prev.filter((r) => r.id !== id));
	};
	const handleRetryFailed = async (record, e) => {
		e.stopPropagation();
		if (!record.retryPayload) return;
		setRetryingId(record.id);
		showToast(`Retrying import: "${record.title}"...`);
		try {
			const result = await resolveAndDownloadSingleTrack({
				title: record.retryPayload.title,
				artist: record.retryPayload.artist,
				album: record.retryPayload.album,
				durationMs: record.retryPayload.durationMs,
				isrc: record.retryPayload.isrc,
				source: record.retryPayload.source
			}, DEFAULT_IMPORT_SETTINGS);
			if (result.success) {
				showToast(`Successfully imported "${record.title}"!`);
				await deleteHistoryRecord(record.id);
				await refreshLibrary();
				await loadHistory();
			} else showToast(`Retry failed: ${result.error || "No audio match found"}`);
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Retry failed";
			showToast(`Error: ${msg}`);
		} finally {
			setRetryingId(null);
		}
	};
	const handlePlayDownloaded = (record, e) => {
		e.stopPropagation();
		if (record.localTrackId) {
			const local = tracks.find((t) => t.id === record.localTrackId);
			if (local) {
				playTrack(local);
				showToast(`Playing "${local.title}"`);
				onClose();
				return;
			}
		}
		showToast("Local track not found in library");
	};
	if (!isOpen) return null;
	const filteredRecords = records.filter((r) => {
		if (activeFilter === "all") return true;
		return r.type === activeFilter;
	});
	const filterTabs = [
		{
			id: "all",
			label: "All History",
			icon: History
		},
		{
			id: "search",
			label: "Searches",
			icon: Search
		},
		{
			id: "playlist",
			label: "Playlists",
			icon: ListMusic
		},
		{
			id: "download",
			label: "Downloads",
			icon: Download
		},
		{
			id: "failed_import",
			label: "Failed Retries",
			icon: TriangleAlert
		},
		{
			id: "duplicate",
			label: "Duplicates",
			icon: Copy
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-xl rounded-3xl bg-[#F3EBDD]/95 dark:bg-[#080A09]/95 border border-[#176B67]/20 dark:border-[#C8F169]/20 shadow-[0_20px_60px_0_rgba(0,0,0,0.6)] flex flex-col max-h-[90vh] overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-b border-[#292820]/10 dark:border-white/10 flex items-center justify-between shrink-0 bg-[#E8DDC9]/50 dark:bg-[#141815]/50 backdrop-blur-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-9 h-9 rounded-2xl bg-[#176B67]/20 text-[#176B67] dark:bg-[#C8F169]/20 dark:text-[#C8F169] flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-bold text-[#292820] dark:text-[#E8E9DD] tracking-tight",
							children: "Music & Import History"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-[#777267] dark:text-[#92998F] font-mono",
							children: "Persistent log across searches, playlists & downloads"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [filteredRecords.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleClearHistory,
							className: "p-2 rounded-xl text-[#777267] dark:text-[#92998F] hover:text-red-500 active:scale-95 transition",
							title: "Clear filtered history",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onClose,
							className: "p-2 rounded-xl bg-[#292820]/5 dark:bg-white/5 text-[#292820] dark:text-[#E8E9DD] active:scale-95 transition",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-3 border-b border-[#292820]/10 dark:border-white/10 overflow-x-auto scrollbar-none flex gap-2",
					children: filterTabs.map((tab) => {
						const Icon = tab.icon;
						const count = records.filter((r) => tab.id === "all" ? true : r.type === tab.id).length;
						const isActive = activeFilter === tab.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveFilter(tab.id),
							className: `px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 active:scale-95 ${isActive ? "bg-[#176B67] text-white dark:bg-[#C8F169] dark:text-[#080A09] shadow-sm" : "bg-[#292820]/5 dark:bg-white/5 text-[#777267] dark:text-[#92998F] hover:text-[#292820] dark:hover:text-white"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-3.5 h-3.5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab.label }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? "bg-black/20 text-white dark:bg-black/20 dark:text-[#080A09]" : "bg-black/5 dark:bg-white/10 text-inherit"}`,
									children: count
								})
							]
						}, tab.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto p-4 space-y-2.5",
					children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-12 text-center text-[#777267] dark:text-[#92998F] text-xs font-mono",
						children: "Loading persistent history..."
					}) : filteredRecords.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-12 text-center select-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-8 h-8 text-[#777267]/50 dark:text-[#92998F]/50 mx-auto mb-2" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-[#292820] dark:text-[#E8E9DD]",
								children: "No history in this category"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#777267] dark:text-[#92998F] mt-1",
								children: "Your searches, playlists, downloads, and retries will appear here."
							})
						]
					}) : filteredRecords.map((item) => {
						const isSearch = item.type === "search";
						const isPlaylist = item.type === "playlist";
						const isFailed = item.type === "failed_import";
						const isDownload = item.type === "download";
						const isDup = item.type === "duplicate";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => {
								if (isSearch && item.query && onSelectSearch) {
									onSelectSearch(item.query);
									onClose();
								} else if (isPlaylist && item.playlistUrl && onSelectPlaylistUrl) {
									onSelectPlaylistUrl(item.playlistUrl);
									onClose();
								}
							},
							className: `group relative p-3 rounded-2xl bg-white/60 dark:bg-[#141815]/60 border border-[#292820]/10 dark:border-white/10 transition-all duration-200 flex items-center justify-between gap-3 ${isSearch || isPlaylist ? "cursor-pointer hover:border-[#176B67] dark:hover:border-[#C8F169]" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 min-w-0",
								children: [item.artworkUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: item.artworkUrl,
									alt: "",
									className: "w-11 h-11 rounded-xl object-cover border border-[#292820]/10 shrink-0"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${isFailed ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : isDownload ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : isPlaylist ? "bg-[#176B67]/10 text-[#176B67] dark:text-[#C8F169] border-[#176B67]/20" : "bg-[#292820]/5 dark:bg-white/5 text-[#777267] dark:text-[#92998F] border-transparent"}`,
									children: isFailed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-5 h-5" }) : isDownload ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-5 h-5" }) : isPlaylist ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListMusic, { className: "w-5 h-5" }) : isDup ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-5 h-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "text-xs font-bold text-[#292820] dark:text-[#E8E9DD] truncate",
												children: item.title
											}), item.source && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#176B67]/10 dark:bg-[#C8F169]/20 text-[#176B67] dark:text-[#C8F169] uppercase font-bold shrink-0",
												children: item.source
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-[#777267] dark:text-[#92998F] truncate mt-0.5",
											children: item.subtitle || new Date(item.timestamp).toLocaleDateString()
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 mt-1 text-[10px] text-[#777267]/80 dark:text-[#92998F]/80 font-mono",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: new Date(item.timestamp).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit"
												}) }),
												item.durationSeconds && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["• ", formatDuration(item.durationSeconds)] })
											]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 shrink-0",
								children: [
									isFailed && item.retryPayload && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: (e) => handleRetryFailed(item, e),
										disabled: retryingId === item.id,
										className: "px-2.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-center gap-1 active:scale-95 transition",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: `w-3.5 h-3.5 ${retryingId === item.id ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Retry" })]
									}),
									isDownload && item.localTrackId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: (e) => handlePlayDownloaded(item, e),
										className: "p-2 rounded-xl bg-[#176B67]/15 dark:bg-[#C8F169]/20 text-[#176B67] dark:text-[#C8F169] active:scale-95 transition",
										title: "Play downloaded audio",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-4 h-4 fill-current" })
									}),
									isSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "p-2 text-[#777267] dark:text-[#92998F] group-hover:text-[#176B67] dark:group-hover:text-[#C8F169] transition",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: (e) => handleDeleteItem(item.id, e),
										className: "p-1.5 rounded-lg text-[#777267] dark:text-[#92998F] hover:text-red-500 opacity-60 hover:opacity-100 transition active:scale-90",
										title: "Remove record",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
									})
								]
							})]
						}, item.id);
					})
				})
			]
		})
	});
};
// src/components/import/SpotifyPlaylistReviewModal.tsx
var SpotifyPlaylistReviewModal = ({ isOpen, onClose, initialUrl = "", initialPlaylist = null, onPlaylistSaved }) => {
	const { showToast, refreshLibrary, playTrack, tracks: localTracks } = useMusic();
	const [urlInput, setUrlInput] = (0, import_react.useState)(initialUrl);
	const [isLoadingMetadata, setIsLoadingMetadata] = (0, import_react.useState)(false);
	const [metadataError, setMetadataError] = (0, import_react.useState)(null);
	const [playlist, setPlaylist] = (0, import_react.useState)(initialPlaylist);
	const [reviewItems, setReviewItems] = (0, import_react.useState)([]);
	const [filterTab, setFilterTab] = (0, import_react.useState)("all");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [skipDuplicates, setSkipDuplicates] = (0, import_react.useState)(true);
	const [isBatchDownloading, setIsBatchDownloading] = (0, import_react.useState)(false);
	const isCancelledRef = (0, import_react.useRef)(false);
	const [settings, setSettings] = (0, import_react.useState)(DEFAULT_IMPORT_SETTINGS);
	const [activeCandidatePickerId, setActiveCandidatePickerId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (initialPlaylist) {
			setPlaylist(initialPlaylist);
			initializeReviewItems(initialPlaylist);
		} else if (initialUrl && isOpen) {
			setUrlInput(initialUrl);
			handleFetchPlaylist(initialUrl);
		}
	}, [
		initialPlaylist,
		initialUrl,
		isOpen
	]);
	const handleFetchPlaylist = async (urlToFetch = urlInput) => {
		const clean = urlToFetch.trim();
		if (!clean) return;
		setIsLoadingMetadata(true);
		setMetadataError(null);
		try {
			const data = await fetchSpotifyPlaylist(clean);
			setPlaylist(data);
			await initializeReviewItems(data);
			await recordPlaylistHistory({
				title: data.playlistTitle,
				curator: data.playlistDescription,
				source: "spotify",
				coverUrl: data.playlistCoverUrl,
				totalTracks: data.totalTracks,
				externalUrl: data.externalUrl
			});
			showToast(`Loaded ${data.totalTracks} tracks from Spotify`);
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Failed to fetch Spotify playlist";
			setMetadataError(msg);
		} finally {
			setIsLoadingMetadata(false);
		}
	};
	const initializeReviewItems = async (pl) => {
		const items = [];
		for (let i = 0; i < pl.tracks.length; i++) {
			const t = pl.tracks[i];
			const cached = await findVerifiedCachedTrack(t.title, t.artists[0] || "", t.durationMs);
			items.push({
				id: `track_${i}`,
				meta: t,
				isSelected: true,
				isExcluded: false,
				isLocal: !!cached,
				localTrackId: cached ? cached.track.id : void 0,
				status: cached ? "completed" : "idle",
				downloadProgress: cached ? 100 : 0,
				candidateMatches: []
			});
		}
		setReviewItems(items);
	};
	const handleToggleSelect = (id) => {
		setReviewItems((prev) => prev.map((item) => item.id === id ? {
			...item,
			isSelected: !item.isSelected
		} : item));
	};
	const handleExcludeTrack = (id) => {
		setReviewItems((prev) => prev.map((item) => item.id === id ? {
			...item,
			isExcluded: true,
			isSelected: false
		} : item));
		showToast("Track removed from import queue");
	};
	const handleDownloadSingle = async (item) => {
		if (item.status === "downloading" || item.isLocal) return;
		setReviewItems((prev) => prev.map((it) => it.id === item.id ? {
			...it,
			status: "checking",
			downloadProgress: 10
		} : it));
		try {
			const result = await resolveAndDownloadSingleTrack({
				title: item.meta.title,
				artist: item.meta.artists.join(", "),
				album: item.meta.album || playlist?.playlistTitle,
				durationMs: item.meta.durationMs,
				artworkUrl: item.meta.artworkUrl || playlist?.playlistCoverUrl,
				isrc: item.meta.isrc,
				source: "spotify_playlist"
			}, settings, (percent, statusMsg) => {
				setReviewItems((prev) => prev.map((it) => it.id === item.id ? {
					...it,
					status: percent > 40 ? "downloading" : "checking",
					downloadProgress: percent
				} : it));
			});
			if (result.success) {
				setReviewItems((prev) => prev.map((it) => it.id === item.id ? {
					...it,
					status: "completed",
					isLocal: true,
					localTrackId: result.track?.id,
					downloadProgress: 100,
					errorMessage: void 0
				} : it));
				showToast(`Downloaded "${item.meta.title}"!`);
				await refreshLibrary();
			} else {
				setReviewItems((prev) => prev.map((it) => it.id === item.id ? {
					...it,
					status: result.status === "unavailable" ? "unavailable" : "failed",
					errorMessage: result.error,
					downloadProgress: 0
				} : it));
				showToast(`Could not download: ${result.error}`);
			}
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Download failed";
			setReviewItems((prev) => prev.map((it) => it.id === item.id ? {
				...it,
				status: "failed",
				errorMessage: msg,
				downloadProgress: 0
			} : it));
			showToast(`Error: ${msg}`);
		}
	};
	const handleInspectCandidates = async (item) => {
		setActiveCandidatePickerId(item.id);
		if (item.candidateMatches.length === 0) {
			const res = await searchAllX2Providers(item.meta, settings);
			setReviewItems((prev) => prev.map((it) => it.id === item.id ? {
				...it,
				candidateMatches: res.matches
			} : it));
		}
	};
	const handleBatchDownload = async () => {
		if (!playlist) return;
		setIsBatchDownloading(true);
		isCancelledRef.current = false;
		const queue = reviewItems.filter((it) => it.isSelected && !it.isExcluded && (!skipDuplicates || !it.isLocal));
		let completedCount = 0;
		const importedTrackIds = [];
		for (const it of reviewItems) if (it.isLocal && it.localTrackId && !it.isExcluded) importedTrackIds.push(it.localTrackId);
		for (const item of queue) {
			if (isCancelledRef.current) break;
			await handleDownloadSingle(item);
			completedCount++;
		}
		try {
			const newPlaylistId = `pl_spotify_${Date.now()}`;
			await savePlaylist({
				id: newPlaylistId,
				name: playlist.playlistTitle,
				description: playlist.playlistDescription || `Imported Spotify playlist (${playlist.totalTracks} tracks)`,
				sourceType: "manual",
				trackIds: Array.from(new Set(importedTrackIds)),
				createdAt: Date.now(),
				updatedAt: Date.now(),
				coverArtworkUrl: playlist.playlistCoverUrl
			});
			showToast(`Playlist saved with ${importedTrackIds.length} tracks!`);
			if (onPlaylistSaved) onPlaylistSaved(newPlaylistId);
		} catch (e) {
			console.warn("Failed saving playlist:", e);
		}
		setIsBatchDownloading(false);
	};
	const summary = (0, import_react.useMemo)(() => {
		return {
			total: reviewItems.filter((i) => !i.isExcluded).length,
			inLibrary: reviewItems.filter((i) => !i.isExcluded && i.isLocal).length,
			unavailable: reviewItems.filter((i) => !i.isExcluded && i.status === "unavailable").length,
			eligible: reviewItems.filter((i) => !i.isExcluded && i.isSelected && (!skipDuplicates || !i.isLocal)).length
		};
	}, [reviewItems, skipDuplicates]);
	const displayedItems = reviewItems.filter((item) => {
		if (item.isExcluded) return false;
		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			const matchTitle = item.meta.title.toLowerCase().includes(q);
			const matchArtist = item.meta.artists.some((a) => a.toLowerCase().includes(q));
			if (!matchTitle && !matchArtist) return false;
		}
		if (filterTab === "in_library") return item.isLocal;
		if (filterTab === "unavailable") return item.status === "unavailable";
		if (filterTab === "review") return item.status === "review_required";
		if (filterTab === "ready") return !item.isLocal && item.status !== "unavailable";
		return true;
	});
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-2xl rounded-3xl bg-[#F3EBDD]/95 dark:bg-[#080A09]/95 border border-[#176B67]/20 dark:border-[#C8F169]/20 shadow-[0_20px_60px_0_rgba(0,0,0,0.6)] flex flex-col max-h-[92vh] overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-b border-[#292820]/10 dark:border-white/10 flex items-center justify-between shrink-0 bg-[#E8DDC9]/50 dark:bg-[#141815]/50 backdrop-blur-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListMusic, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-bold text-[#292820] dark:text-[#E8E9DD] tracking-tight",
							children: "Spotify Playlist Inspector"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-[#777267] dark:text-[#92998F] font-mono",
							children: "Inspect metadata & download individual recordings"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							if (isBatchDownloading) isCancelledRef.current = true;
							onClose();
						},
						className: "p-2 rounded-xl bg-[#292820]/5 dark:bg-white/5 text-[#292820] dark:text-[#E8E9DD] active:scale-95 transition",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 border-b border-[#292820]/10 dark:border-white/10 bg-white/40 dark:bg-[#141815]/40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: (e) => {
							e.preventDefault();
							handleFetchPlaylist();
						},
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: urlInput,
								onChange: (e) => setUrlInput(e.target.value),
								placeholder: "Paste Spotify playlist URL (e.g. https://open.spotify.com/playlist/...)",
								className: "w-full pl-3.5 pr-8 py-2 rounded-xl bg-[#292820]/5 dark:bg-white/5 border border-[#292820]/10 dark:border-white/10 text-xs font-mono text-[#292820] dark:text-[#E8E9DD] placeholder:text-[#777267] focus:outline-none focus:border-[#176B67] dark:focus:border-[#C8F169]"
							}), urlInput && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setUrlInput(""),
								className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-[#777267] hover:text-[#292820]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: isLoadingMetadata || !urlInput.trim(),
							className: "px-4 py-2 rounded-xl bg-[#176B67] text-white dark:bg-[#C8F169] dark:text-[#080A09] text-xs font-bold flex items-center gap-1.5 active:scale-95 transition shrink-0 disabled:opacity-50",
							children: isLoadingMetadata ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loading..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Inspect" })] })
						})]
					}), metadataError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: metadataError })]
					})]
				}),
				playlist && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-b border-[#292820]/10 dark:border-white/10 bg-white/60 dark:bg-[#141815]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 min-w-0",
						children: [playlist.playlistCoverUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: playlist.playlistCoverUrl,
							alt: "",
							className: "w-14 h-14 rounded-2xl object-cover shadow-sm shrink-0 border border-[#292820]/10"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-14 h-14 rounded-2xl bg-[#176B67]/20 text-[#176B67] dark:bg-[#C8F169]/20 dark:text-[#C8F169] flex items-center justify-center shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: "w-7 h-7" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold",
										children: "Spotify Playlist"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-mono text-[#777267] dark:text-[#92998F]",
										children: [playlist.totalTracks, " tracks"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-bold text-[#292820] dark:text-[#E8E9DD] truncate tracking-tight mt-0.5",
									children: playlist.playlistTitle
								}),
								playlist.playlistDescription && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#777267] dark:text-[#92998F] truncate max-w-sm",
									children: playlist.playlistDescription
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-1.5 text-xs text-[#777267] dark:text-[#92998F] cursor-pointer select-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: skipDuplicates,
								onChange: (e) => setSkipDuplicates(e.target.checked),
								className: "rounded text-[#176B67] dark:text-[#C8F169] focus:ring-0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Skip duplicates (",
								summary.inLibrary,
								")"
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleBatchDownload,
							disabled: isBatchDownloading || summary.eligible === 0,
							className: "px-4 py-2.5 rounded-2xl bg-[#C8F169] text-[#292820] text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition flex items-center gap-2 disabled:opacity-50",
							children: isBatchDownloading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Importing..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Download All Eligible (",
								summary.eligible,
								")"
							] })] })
						})]
					})]
				}),
				playlist && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 border-b border-[#292820]/10 dark:border-white/10 flex flex-col sm:flex-row gap-2 justify-between items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1.5 overflow-x-auto scrollbar-none w-full sm:w-auto",
						children: [
							{
								id: "all",
								label: "All",
								count: summary.total
							},
							{
								id: "ready",
								label: "Eligible",
								count: summary.eligible
							},
							{
								id: "in_library",
								label: "In Library",
								count: summary.inLibrary
							},
							{
								id: "unavailable",
								label: "Unavailable",
								count: summary.unavailable
							}
						].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setFilterTab(tab.id),
							className: `px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 whitespace-nowrap ${filterTab === tab.id ? "bg-[#176B67] text-white dark:bg-[#C8F169] dark:text-[#080A09]" : "bg-[#292820]/5 dark:bg-white/5 text-[#777267] dark:text-[#92998F]"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] font-mono opacity-80",
								children: [
									"(",
									tab.count,
									")"
								]
							})]
						}, tab.id))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-full sm:w-48",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							placeholder: "Search tracks...",
							className: "w-full pl-7 pr-3 py-1 rounded-xl bg-[#292820]/5 dark:bg-white/5 text-xs text-[#292820] dark:text-[#E8E9DD] placeholder:text-[#777267] focus:outline-none"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-3.5 h-3.5 text-[#777267] absolute left-2 top-1/2 -translate-y-1/2" })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto p-3 space-y-2",
					children: !playlist ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-12 text-center text-[#777267] dark:text-[#92998F] select-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: "w-10 h-10 mx-auto mb-2 opacity-40" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold text-[#292820] dark:text-[#E8E9DD]",
								children: "Enter a Spotify playlist or album URL above"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs mt-1",
								children: "Public playlists are inspected keylessly. Each track has an individual download button."
							})
						]
					}) : displayedItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-12 text-center text-[#777267] dark:text-[#92998F] text-xs",
						children: "No tracks matching current filter."
					}) : displayedItems.map((item, idx) => {
						const isDownloading = item.status === "downloading" || item.status === "checking";
						const isDownloaded = item.isLocal || item.status === "completed";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `p-3 rounded-2xl bg-white/70 dark:bg-[#141815]/70 border transition-all duration-200 flex items-center justify-between gap-3 ${isDownloaded ? "border-emerald-500/20" : item.status === "unavailable" ? "border-amber-500/20 opacity-75" : "border-[#292820]/10 dark:border-white/10"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: item.isSelected,
										onChange: () => handleToggleSelect(item.id),
										className: "rounded text-[#176B67] dark:text-[#C8F169] focus:ring-0 shrink-0"
									}),
									item.meta.artworkUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: item.meta.artworkUrl,
										alt: "",
										className: "w-10 h-10 rounded-xl object-cover shrink-0 border border-[#292820]/10"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-10 h-10 rounded-xl bg-[#292820]/5 dark:bg-white/5 flex items-center justify-center font-mono text-xs text-[#777267] shrink-0",
										children: idx + 1
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "text-xs font-bold text-[#292820] dark:text-[#E8E9DD] truncate",
												children: item.meta.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-[#777267] dark:text-[#92998F] truncate",
												children: item.meta.artists.join(", ")
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 mt-0.5 text-[10px] text-[#777267] font-mono",
												children: [
													item.meta.durationMs > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDuration(Math.round(item.meta.durationMs / 1e3)) }),
													item.isLocal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3 h-3" }), " In Library"]
													}),
													item.errorMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-amber-500 truncate max-w-xs",
														children: item.errorMessage
													})
												]
											})
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 shrink-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleInspectCandidates(item),
										className: "p-1.5 rounded-lg text-[#777267] dark:text-[#92998F] hover:text-[#176B67] dark:hover:text-[#C8F169] active:scale-95 transition",
										title: "Inspect match candidates",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-3.5 h-3.5" })
									}),
									isDownloaded ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "px-2.5 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Downloaded" })]
									}) : isDownloading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "px-2.5 py-1.5 rounded-xl bg-[#176B67]/20 text-[#176B67] dark:text-[#C8F169] text-xs font-mono font-bold flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [item.downloadProgress, "%"] })]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleDownloadSingle(item),
										className: "px-3 py-1.5 rounded-xl bg-[#176B67] text-white dark:bg-[#C8F169] dark:text-[#080A09] text-xs font-bold shadow-xs active:scale-95 transition flex items-center gap-1",
										title: "Download matching audio recording",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleExcludeTrack(item.id),
										className: "p-1.5 rounded-lg text-[#777267] hover:text-red-500 active:scale-90 transition",
										title: "Remove from queue",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
									})
								]
							})]
						}, item.id);
					})
				})
			]
		})
	});
};
// src/services/telegramService.ts
async function verifyTelegramBot(botToken) {
	const cleanToken = botToken.trim();
	if (!cleanToken) throw new Error("Please enter a valid Telegram Bot Token.");
	try {
		const proxyUrl = `/api/telegram/verify?token=${encodeURIComponent(cleanToken)}`;
		const res = await fetch(proxyUrl);
		if (res.ok) {
			const data = await res.json();
			if (data.ok) return data.result;
			throw new Error(data.description || "Invalid Telegram Bot Token");
		}
	} catch (proxyErr) {
		const msg = proxyErr instanceof Error ? proxyErr.message : "";
		if (msg.includes("Invalid") || msg.includes("Unauthorized") || msg.includes("Not Found")) throw proxyErr;
	}
	const directUrl = `https://api.telegram.org/bot${cleanToken}/getMe`;
	try {
		const data = await (await fetch(directUrl)).json();
		if (!data.ok) throw new Error(data.description || "Invalid Telegram Bot Token");
		return data.result;
	} catch (err) {
		const msg = err instanceof Error ? err.message : "Network error verifying bot token";
		throw new Error(msg);
	}
}
async function fetchTelegramAudioTracks(botToken) {
	const cleanToken = botToken.trim();
	let updates = [];
	try {
		const proxyUrl = `/api/telegram/updates?token=${encodeURIComponent(cleanToken)}&limit=100`;
		const res = await fetch(proxyUrl);
		if (res.ok) {
			const data = await res.json();
			if (data.ok) updates = data.result || [];
			else throw new Error(data.description || "Failed to fetch updates from Telegram");
		} else throw new Error(`Proxy responded with status ${res.status}`);
	} catch {
		const directUrl = `https://api.telegram.org/bot${cleanToken}/getUpdates?limit=100&allowed_updates=["message","channel_post"]`;
		const data = await (await fetch(directUrl)).json();
		if (!data.ok) throw new Error(data.description || "Failed to fetch updates from Telegram");
		updates = data.result || [];
	}
	const discovered = [];
	for (const update of updates) {
		const msg = update.message || update.channel_post;
		if (!msg) continue;
		let audioInfo = null;
		if (msg.audio) audioInfo = {
			fileId: msg.audio.file_id,
			fileUniqueId: msg.audio.file_unique_id || msg.audio.file_id,
			fileName: msg.audio.file_name || `${msg.audio.title || "Audio"}.mp3`,
			title: msg.audio.title,
			performer: msg.audio.performer,
			duration: msg.audio.duration,
			fileSize: msg.audio.file_size || 0,
			mimeType: msg.audio.mime_type || "audio/mpeg"
		};
		else if (msg.document) {
			const mime = (msg.document.mime_type || "").toLowerCase();
			const name = (msg.document.file_name || "").toLowerCase();
			if (mime.startsWith("audio/") || [
				".mp3",
				".m4a",
				".aac",
				".wav",
				".flac",
				".ogg"
			].some((ext) => name.endsWith(ext))) audioInfo = {
				fileId: msg.document.file_id,
				fileUniqueId: msg.document.file_unique_id || msg.document.file_id,
				fileName: msg.document.file_name || "Document Audio.mp3",
				fileSize: msg.document.file_size || 0,
				mimeType: msg.document.mime_type || "audio/mpeg"
			};
		}
		if (audioInfo) {
			const chatTitle = msg.chat?.title || (msg.chat?.first_name ? `${msg.chat.first_name} ${msg.chat.last_name || ""}`.trim() : "Telegram Chat");
			const isImported = await isTrackInLibrary(audioInfo.fileId, audioInfo.fileUniqueId, audioInfo.fileName);
			discovered.push({
				...audioInfo,
				chatId: msg.chat?.id || 0,
				chatTitle,
				topicId: msg.message_thread_id,
				topicName: msg.reply_to_message?.forum_topic_created?.name,
				messageId: msg.message_id,
				date: msg.date ? msg.date * 1e3 : Date.now(),
				isAlreadyImported: isImported
			});
		}
	}
	return discovered;
}
async function downloadTelegramAudio(botToken, item, onProgress) {
	const cleanToken = botToken.trim();
	let filePath = "";
	try {
		const proxyInfoUrl = `/api/telegram/file-info?token=${encodeURIComponent(cleanToken)}&file_id=${encodeURIComponent(item.fileId)}`;
		const infoRes = await fetch(proxyInfoUrl);
		if (infoRes.ok) {
			const infoData = await infoRes.json();
			if (infoData.ok && infoData.result?.file_path) filePath = infoData.result.file_path;
			else if (infoData.description) throw new Error(infoData.description);
		}
	} catch (proxyErr) {
		if (proxyErr instanceof Error && proxyErr.message.includes("too big")) throw proxyErr;
	}
	if (!filePath) {
		const directInfoUrl = `https://api.telegram.org/bot${cleanToken}/getFile?file_id=${encodeURIComponent(item.fileId)}`;
		const infoData = await (await fetch(directInfoUrl)).json();
		if (!infoData.ok || !infoData.result?.file_path) throw new Error(infoData.description || "Could not retrieve Telegram file path from Telegram.");
		filePath = infoData.result.file_path;
	}
	let res;
	const proxyDownloadUrl = `/api/telegram/download?token=${encodeURIComponent(cleanToken)}&file_path=${encodeURIComponent(filePath)}`;
	try {
		res = await fetch(proxyDownloadUrl);
		if (!res.ok) throw new Error(`Proxy error ${res.status}`);
	} catch {
		const directDownloadUrl = `https://api.telegram.org/file/bot${cleanToken}/${filePath}`;
		res = await fetch(directDownloadUrl);
	}
	if (!res.ok) throw new Error(`Failed to download audio file: HTTP ${res.status}`);
	const contentLength = res.headers.get("content-length");
	const total = contentLength ? parseInt(contentLength, 10) : item.fileSize || 0;
	let blob;
	if (res.body && window.ReadableStream) {
		const reader = res.body.getReader();
		const chunks = [];
		let received = 0;
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			if (value) {
				chunks.push(value);
				received += value.length;
				if (onProgress) onProgress(received, total || received);
			}
		}
		const merged = new Uint8Array(received);
		let offset = 0;
		for (const chunk of chunks) {
			merged.set(chunk, offset);
			offset += chunk.length;
		}
		blob = new Blob([merged], { type: item.mimeType || "audio/mpeg" });
	} else {
		blob = await res.blob();
		if (onProgress) onProgress(blob.size, blob.size);
	}
	if (blob.size === 0) throw new Error("Downloaded audio file was empty (0 bytes).");
	const parsed = await parseAudioMetadata(blob, item.fileName);
	const title = item.title?.trim() || parsed.title || item.fileName.replace(/\.[^/.]+$/, "");
	const artist = item.performer?.trim() || parsed.artist || "Unknown Artist";
	const duration = item.duration && item.duration > 0 ? item.duration : parsed.duration;
	const track = {
		id: `tg_${item.fileUniqueId || Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
		title,
		artist,
		album: parsed.album || item.chatTitle || "Telegram Audio",
		duration,
		fileSize: blob.size,
		mimeType: blob.type || item.mimeType,
		fileName: item.fileName,
		fileHash: item.fileUniqueId,
		downloadDate: Date.now(),
		isFavorite: false,
		playCount: 0,
		artworkUrl: parsed.artworkUrl,
		telegramSource: {
			chatId: item.chatId,
			chatTitle: item.chatTitle,
			topicId: item.topicId,
			topicName: item.topicName,
			messageId: item.messageId,
			fileId: item.fileId,
			sourceType: "bot"
		}
	};
	await saveTrack(track, blob);
	return track;
}
// src/components/import/TelegramDiscoveryModal.tsx
var PREVIEW_PUBLIC_CHANNELS = [
	{
		channel: "@ElectronicMusicHub",
		title: "Neon Nights (Original Mix)",
		artist: "CyberSound",
		duration: 214,
		size: 512e4,
		genre: "Synthwave / Electronic"
	},
	{
		channel: "@ClassicalMasterpieces",
		title: "Clair de Lune (Solo Piano)",
		artist: "Claude Debussy",
		duration: 302,
		size: 724e4,
		genre: "Classical / Ambient"
	},
	{
		channel: "@IndieVaultRadio",
		title: "Autumn Breezes (Acoustic)",
		artist: "The Wanderers",
		duration: 188,
		size: 45e5,
		genre: "Indie Folk"
	},
	{
		channel: "@LoFiStudyStation",
		title: "Coffee in Kyoto (Beat Tape)",
		artist: "Quiet Hours",
		duration: 154,
		size: 38e5,
		genre: "Lo-Fi Chillhop"
	}
];
var TelegramDiscoveryModal = ({ isOpen, onClose }) => {
	const { settings, updateSettings, showToast, refreshLibrary } = useMusic();
	const [activeTab, setActiveTab] = (0, import_react.useState)("preview");
	const [tokenInput, setTokenInput] = (0, import_react.useState)(settings.telegramBotToken || "");
	const [isVerifying, setIsVerifying] = (0, import_react.useState)(false);
	const [isScanning, setIsScanning] = (0, import_react.useState)(false);
	const [botInfo, setBotInfo] = (0, import_react.useState)(null);
	const [discoveredTracks, setDiscoveredTracks] = (0, import_react.useState)([]);
	const [downloadingIds, setDownloadingIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [downloadedIds, setDownloadedIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [errorMsg, setErrorMsg] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (settings.telegramBotToken) {
			setTokenInput(settings.telegramBotToken);
			verifyToken(settings.telegramBotToken, true);
		}
	}, [settings.telegramBotToken]);
	const verifyToken = async (token, silent = false) => {
		if (!token.trim()) return;
		setIsVerifying(true);
		setErrorMsg(null);
		try {
			const info = await verifyTelegramBot(token.trim());
			setBotInfo(info);
			setActiveTab("active_hub");
			await updateSettings({ telegramBotToken: token.trim() });
			if (!silent) showToast(`Connected to @${info.username}!`);
			scanBotUpdates(token.trim());
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Bot verification failed";
			setErrorMsg(msg);
			if (!silent) showToast(`Error: ${msg}`);
		} finally {
			setIsVerifying(false);
		}
	};
	const scanBotUpdates = async (token = tokenInput) => {
		if (!token.trim()) return;
		setIsScanning(true);
		try {
			const items = await fetchTelegramAudioTracks(token.trim());
			setDiscoveredTracks(items);
			showToast(`Found ${items.length} audio files in Telegram bot updates`);
		} catch (err) {
			console.warn("Telegram scan warning:", err);
		} finally {
			setIsScanning(false);
		}
	};
	const handleDownloadItem = async (item) => {
		if (downloadingIds.has(item.fileId) || downloadedIds.has(item.fileId)) return;
		setDownloadingIds((prev) => new Set(prev).add(item.fileId));
		showToast(`Downloading "${item.title || item.fileName}" from Telegram...`);
		try {
			const savedTrack = await downloadTelegramAudio(tokenInput, item);
			await recordDownloadHistory({
				title: savedTrack.title,
				artist: savedTrack.artist,
				source: "telegram",
				status: "completed",
				localTrackId: savedTrack.id,
				durationSeconds: savedTrack.duration,
				fileSizeBytes: savedTrack.fileSize
			});
			setDownloadedIds((prev) => new Set(prev).add(item.fileId));
			showToast(`Saved "${savedTrack.title}" to local library!`);
			await refreshLibrary();
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Download failed";
			showToast(`Telegram download error: ${msg}`);
		} finally {
			setDownloadingIds((prev) => {
				const next = new Set(prev);
				next.delete(item.fileId);
				return next;
			});
		}
	};
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-xl rounded-3xl bg-[#F3EBDD]/95 dark:bg-[#080A09]/95 border border-[#176B67]/20 dark:border-[#C8F169]/20 shadow-[0_20px_60px_0_rgba(0,0,0,0.6)] flex flex-col max-h-[90vh] overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-b border-[#292820]/10 dark:border-white/10 flex items-center justify-between shrink-0 bg-[#E8DDC9]/50 dark:bg-[#141815]/50 backdrop-blur-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-9 h-9 rounded-2xl bg-[#02ABB0]/20 text-[#02ABB0] flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-bold text-[#292820] dark:text-[#E8E9DD] tracking-tight",
							children: "Telegram Music Sync Hub"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-[#777267] dark:text-[#92998F] font-mono",
							children: "Optional audio sync inspired by @MusicsHuntersbot"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "p-2 rounded-xl bg-[#292820]/5 dark:bg-white/5 text-[#292820] dark:text-[#E8E9DD] active:scale-95 transition",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 border-b border-[#292820]/10 dark:border-white/10 flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveTab("preview"),
							className: `px-3 py-1.5 rounded-full text-xs font-semibold transition active:scale-95 ${activeTab === "preview" ? "bg-[#176B67] text-white dark:bg-[#C8F169] dark:text-[#080A09]" : "bg-[#292820]/5 dark:bg-white/5 text-[#777267] dark:text-[#92998F]"}`,
							children: "Pre-Connection Preview"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveTab("connect"),
							className: `px-3 py-1.5 rounded-full text-xs font-semibold transition active:scale-95 ${activeTab === "connect" ? "bg-[#176B67] text-white dark:bg-[#C8F169] dark:text-[#080A09]" : "bg-[#292820]/5 dark:bg-white/5 text-[#777267] dark:text-[#92998F]"}`,
							children: botInfo ? `@${botInfo.username}` : "Connect Bot"
						}),
						botInfo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveTab("active_hub"),
							className: `px-3 py-1.5 rounded-full text-xs font-semibold transition active:scale-95 ${activeTab === "active_hub" ? "bg-[#176B67] text-white dark:bg-[#C8F169] dark:text-[#080A09]" : "bg-[#292820]/5 dark:bg-white/5 text-[#777267] dark:text-[#92998F]"}`,
							children: [
								"Bot Audio Files (",
								discoveredTracks.length,
								")"
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto p-4 space-y-4",
					children: [
						activeTab === "preview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-2xl bg-[#02ABB0]/10 border border-[#02ABB0]/20 text-[#292820] dark:text-[#E8E9DD]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-[#02ABB0] font-bold text-xs uppercase tracking-wider mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4" }), "Pre-Connection Scanning Experience"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#777267] dark:text-[#92998F]",
									children: "You can browse, inspect metadata, and preview audio before configuring a Telegram bot token. Connecting a bot is 100% optional and only needed if you want to stream or download audio files directly from your personal Telegram chats."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-xs font-mono uppercase tracking-wider text-[#777267] dark:text-[#92998F] mb-2 font-bold",
								children: "Discoverable Public Audio Samples"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: PREVIEW_PUBLIC_CHANNELS.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-2xl bg-white/70 dark:bg-[#141815]/70 border border-[#292820]/10 dark:border-white/10 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-10 h-10 rounded-xl bg-[#02ABB0]/15 text-[#02ABB0] flex items-center justify-center font-bold text-xs shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileMusic, { className: "w-5 h-5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
												className: "text-xs font-bold text-[#292820] dark:text-[#E8E9DD]",
												children: item.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[11px] text-[#777267] dark:text-[#92998F]",
												children: [
													item.artist,
													" • ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-[#02ABB0]",
														children: item.channel
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 mt-0.5 text-[10px] text-[#777267] font-mono",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDuration(item.duration) }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["• ", formatFileSize(item.size)] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["• ", item.genre] })
												]
											})
										] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setActiveTab("connect"),
										className: "px-3 py-1.5 rounded-xl bg-[#292820]/5 dark:bg-white/5 hover:bg-[#02ABB0]/20 text-[#02ABB0] text-xs font-semibold transition active:scale-95 shrink-0",
										children: "Connect Bot to Sync"
									})]
								}, idx))
							})] })]
						}),
						activeTab === "connect" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-2xl bg-[#E8DDC9]/70 dark:bg-[#141815]/70 border border-[#292820]/10 dark:border-white/10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-xs font-bold text-[#292820] dark:text-[#E8E9DD] mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 text-emerald-500" }), "Secure Architecture Notice"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-[#777267] dark:text-[#92998F] leading-relaxed",
										children: "Your Telegram Bot token is proxied solely through the local Express server on port 3000 to overcome iOS Safari CORS restrictions. Tokens are never transmitted to external analytics or third parties."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-bold text-[#292820] dark:text-[#E8E9DD] block",
											children: "Telegram Bot Token"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "password",
												value: tokenInput,
												onChange: (e) => setTokenInput(e.target.value),
												placeholder: "123456789:ABCdefGHIjklMNOpqrSTUvwxYZ",
												className: "flex-1 px-3.5 py-2.5 rounded-xl bg-white/70 dark:bg-[#141815]/70 border border-[#292820]/15 dark:border-white/15 text-xs font-mono text-[#292820] dark:text-[#E8E9DD] placeholder:text-[#777267] focus:outline-none focus:border-[#02ABB0]"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => verifyToken(tokenInput),
												disabled: isVerifying || !tokenInput.trim(),
												className: "px-4 py-2.5 rounded-xl bg-[#02ABB0] text-white text-xs font-bold active:scale-95 transition shrink-0 disabled:opacity-50 flex items-center gap-1.5",
												children: isVerifying ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verifying..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Connect" })] })
											})]
										}),
										errorMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-red-500 font-mono flex items-center gap-1 mt-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-3.5 h-3.5" }),
												" ",
												errorMsg
											]
										})
									]
								}),
								botInfo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
										className: "text-xs font-bold",
										children: ["Connected: @", botInfo.username]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] opacity-80",
										children: ["Bot ID: ", botInfo.id]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => scanBotUpdates(tokenInput),
										disabled: isScanning,
										className: "px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-bold active:scale-95 transition flex items-center gap-1",
										children: [isScanning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Scan Music" })]
									})]
								})
							]
						}),
						activeTab === "active_hub" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-[#777267] dark:text-[#92998F] font-mono",
									children: [discoveredTracks.length, " audio files found"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => scanBotUpdates(tokenInput),
									disabled: isScanning,
									className: "px-3 py-1 rounded-xl bg-[#292820]/5 dark:bg-white/5 text-xs font-semibold text-[#02ABB0] flex items-center gap-1 active:scale-95 transition",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: `w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Refresh" })]
								})]
							}), discoveredTracks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-8 text-center text-[#777267] dark:text-[#92998F] text-xs",
								children: "No audio tracks found in recent bot updates. Send MP3 files to your bot on Telegram and tap Refresh."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: discoveredTracks.map((item) => {
									const isDownloading = downloadingIds.has(item.fileId);
									const isDownloaded = downloadedIds.has(item.fileId);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-2xl bg-white/70 dark:bg-[#141815]/70 border border-[#292820]/10 dark:border-white/10 flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-10 h-10 rounded-xl bg-[#02ABB0]/15 text-[#02ABB0] flex items-center justify-center font-bold text-xs shrink-0",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileMusic, { className: "w-5 h-5" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
														className: "text-xs font-bold text-[#292820] dark:text-[#E8E9DD] truncate",
														children: item.title || item.fileName
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-[11px] text-[#777267] dark:text-[#92998F] truncate",
														children: [
															item.performer || "Telegram Audio",
															" • ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-mono text-[#02ABB0]",
																children: item.chatTitle
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 text-[10px] text-[#777267] font-mono",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDuration(item.duration || 0) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["• ", formatFileSize(item.fileSize)] })]
													})
												]
											})]
										}), isDownloaded ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5" }), " In Library"]
										}) : isDownloading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "px-3 py-1.5 rounded-xl bg-[#02ABB0]/20 text-[#02ABB0] text-xs font-mono font-bold flex items-center gap-1 shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }), " Saving..."]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => handleDownloadItem(item),
											className: "px-3 py-1.5 rounded-xl bg-[#02ABB0] text-white text-xs font-bold active:scale-95 transition flex items-center gap-1 shrink-0 shadow-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download" })]
										})]
									}, item.fileId);
								})
							})]
						})
					]
				})
			]
		})
	});
};
export { SpotifyPlaylistReviewModal as a, verifyTelegramBot as i, downloadTelegramAudio as n, MusicHistoryModal as o, fetchTelegramAudioTracks as r, DEFAULT_IMPORT_SETTINGS as s, TelegramDiscoveryModal as t };
