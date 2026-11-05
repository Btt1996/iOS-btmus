import { a as __toESM } from "./rolldown-runtime-DQp2zzRu.js";
import { $ as History, A as Send, D as Share2, Dt as require_react, F as RefreshCw, J as ListMusic, K as LoaderCircle, R as Play, Z as Info, _ as Sparkles, bt as Check, dt as CloudUpload, gt as CircleAlert, it as FileMusic, j as Search, lt as Database, nt as FolderPlus, rt as FileText, st as Download, w as ShieldCheck } from "./vendor-icons-DVdP9XFB.js";
import { g as savePlaylist, m as importLibraryBackup, o as exportLibraryBackup, v as saveTrack } from "./db-Cr6tU0Tr.js";
import { _ as useMusic, h as parseAudioMetadata, m as formatFileSize } from "./x2Engine-BSzGwD2O.js";
import { l as require_jsx_runtime } from "./vendor-motion-CvHAzLEi.js";
import { a as SAMPLE_AUDIO_PRESETS, i as PlaylistImportModal, o as createToneAudioBlob } from "./index-DMa-3grU.js";
import { a as SpotifyPlaylistReviewModal, i as verifyTelegramBot, n as downloadTelegramAudio, o as MusicHistoryModal, r as fetchTelegramAudioTracks, t as TelegramDiscoveryModal } from "./TelegramDiscoveryModal-BdEIXZog.js";
// src/components/screens/SyncScreen.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var SyncScreen = ({ fileInputRef }) => {
	const { settings, updateSettings, refreshLibrary, showToast, playlists, tracks, playTrack, storageStats } = useMusic();
	const [activeTab, setActiveTab] = (0, import_react.useState)("import");
	const [isImportModalOpen, setIsImportModalOpen] = (0, import_react.useState)(false);
	const [isSpotifyReviewOpen, setIsSpotifyReviewOpen] = (0, import_react.useState)(false);
	const [isTelegramDiscoveryOpen, setIsTelegramDiscoveryOpen] = (0, import_react.useState)(false);
	const [isHistoryModalOpen, setIsHistoryModalOpen] = (0, import_react.useState)(false);
	const [spotifyUrlInput, setSpotifyUrlInput] = (0, import_react.useState)("");
	const [isExportingDb, setIsExportingDb] = (0, import_react.useState)(false);
	const [isImportingDb, setIsImportingDb] = (0, import_react.useState)(false);
	const dbFileRef = import_react.useRef(null);
	const [botToken, setBotToken] = (0, import_react.useState)(settings.telegramBotToken || "");
	const [botInfo, setBotInfo] = (0, import_react.useState)(null);
	const [isVerifyingBot, setIsVerifyingBot] = (0, import_react.useState)(false);
	const [isScanningUpdates, setIsScanningUpdates] = (0, import_react.useState)(false);
	const [discoveredTracks, setDiscoveredTracks] = (0, import_react.useState)([]);
	const [selectedItemIds, setSelectedItemIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [downloadTasks, setDownloadTasks] = (0, import_react.useState)({});
	const [isDownloading, setIsDownloading] = (0, import_react.useState)(false);
	const [manualSourceTag, setManualSourceTag] = (0, import_react.useState)("Telegram Audio");
	const [isProcessingFiles, setIsProcessingFiles] = (0, import_react.useState)(false);
	const [isGeneratingSamples, setIsGeneratingSamples] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (settings.telegramBotToken && !botInfo) {
			setBotToken(settings.telegramBotToken);
			verifyToken(settings.telegramBotToken, true);
		}
	}, [settings.telegramBotToken]);
	const verifyToken = async (tokenToVerify, silent = false) => {
		if (!tokenToVerify.trim()) return;
		setIsVerifyingBot(true);
		try {
			const info = await verifyTelegramBot(tokenToVerify.trim());
			setBotInfo(info);
			await updateSettings({ telegramBotToken: tokenToVerify.trim() });
			if (!silent) showToast(`Connected to Telegram Bot: @${info.username}`);
			scanForMusic(tokenToVerify.trim());
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Failed to connect bot";
			if (!silent) showToast(`Bot error: ${msg}`);
			setBotInfo(null);
		} finally {
			setIsVerifyingBot(false);
		}
	};
	const scanForMusic = async (token = botToken) => {
		if (!token.trim()) return;
		setIsScanningUpdates(true);
		try {
			const items = await fetchTelegramAudioTracks(token.trim());
			setDiscoveredTracks(items);
			const newIds = /* @__PURE__ */ new Set();
			items.forEach((item) => {
				if (!item.isAlreadyImported) newIds.add(item.fileId);
			});
			setSelectedItemIds(newIds);
			const newCount = Array.from(newIds).length;
			showToast(`Found ${items.length} track${items.length !== 1 ? "s" : ""} (${newCount} new to download)`);
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Scan error";
			showToast(msg);
		} finally {
			setIsScanningUpdates(false);
		}
	};
	const toggleSelectTrack = (fileId) => {
		setSelectedItemIds((prev) => {
			const next = new Set(prev);
			if (next.has(fileId)) next.delete(fileId);
			else next.add(fileId);
			return next;
		});
	};
	const selectAllTracks = () => {
		setSelectedItemIds(new Set(discoveredTracks.map((t) => t.fileId)));
	};
	const deselectAllTracks = () => {
		setSelectedItemIds(/* @__PURE__ */ new Set());
	};
	const handleDownloadSelected = async () => {
		const itemsToDownload = discoveredTracks.filter((t) => selectedItemIds.has(t.fileId));
		if (itemsToDownload.length === 0) {
			showToast("Select at least one track to download");
			return;
		}
		setIsDownloading(true);
		let successCount = 0;
		let failedCount = 0;
		const importedBySource = {};
		for (const item of itemsToDownload) {
			const taskId = item.fileId;
			setDownloadTasks((prev) => ({
				...prev,
				[taskId]: {
					id: taskId,
					fileId: item.fileId,
					title: item.title || item.fileName,
					artist: item.performer || "Unknown Artist",
					fileName: item.fileName,
					sourceName: item.topicName || item.chatTitle,
					totalBytes: item.fileSize,
					downloadedBytes: 0,
					status: "downloading"
				}
			}));
			try {
				const track = await downloadTelegramAudio(botToken, item, (bytes, total) => {
					setDownloadTasks((prev) => {
						if (!prev[taskId]) return prev;
						return {
							...prev,
							[taskId]: {
								...prev[taskId],
								downloadedBytes: bytes,
								totalBytes: total,
								status: bytes >= total ? "parsing" : "downloading"
							}
						};
					});
				});
				successCount++;
				const sourceName = item.topicName || item.chatTitle || "Telegram Audio";
				if (!importedBySource[sourceName]) importedBySource[sourceName] = [];
				importedBySource[sourceName].push(track.id);
				setDownloadTasks((prev) => ({
					...prev,
					[taskId]: {
						...prev[taskId],
						status: "completed"
					}
				}));
				setDiscoveredTracks((prev) => prev.map((t) => t.fileId === item.fileId ? {
					...t,
					isAlreadyImported: true
				} : t));
				await refreshLibrary();
			} catch (err) {
				failedCount++;
				let msg = err instanceof Error ? err.message : "Download failed";
				if (msg.includes("too big") || item.fileSize && item.fileSize > 20971520) msg = "File exceeds Telegram Bot 20MB limit. Use Manual Import.";
				setDownloadTasks((prev) => ({
					...prev,
					[taskId]: {
						...prev[taskId],
						status: "failed",
						error: msg
					}
				}));
			}
		}
		if (settings.autoCreatePlaylists && Object.keys(importedBySource).length > 0) for (const [sourceName, trackIds] of Object.entries(importedBySource)) {
			const existingPl = playlists.find((pl) => pl.sourceType === "telegram" && pl.name.toLowerCase() === sourceName.toLowerCase());
			if (existingPl) {
				const merged = Array.from(/* @__PURE__ */ new Set([...existingPl.trackIds, ...trackIds]));
				await savePlaylist({
					...existingPl,
					trackIds: merged,
					updatedAt: Date.now()
				});
			} else {
				const newPl = {
					id: `pl_tg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
					name: sourceName,
					description: `Auto-generated from Telegram: ${sourceName}`,
					sourceType: "telegram",
					telegramChatTitle: sourceName,
					telegramTopic: sourceName,
					trackIds,
					createdAt: Date.now(),
					updatedAt: Date.now()
				};
				await savePlaylist(newPl);
			}
		}
		await refreshLibrary();
		setIsDownloading(false);
		if (failedCount > 0 && successCount > 0) showToast(`Downloaded ${successCount} track(s). ${failedCount} failed.`);
		else if (failedCount > 0) showToast(`Download failed. Check file sizes or bot permissions.`);
		else showToast(`Successfully downloaded ${successCount} track${successCount !== 1 ? "s" : ""}!`);
	};
	const handleManualFiles = async (e) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;
		setIsProcessingFiles(true);
		let successCount = 0;
		const importedTrackIds = [];
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			try {
				const meta = await parseAudioMetadata(file, file.name);
				const trackId = `local_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`;
				const track = {
					id: trackId,
					title: meta.title || file.name.replace(/\.[^/.]+$/, ""),
					artist: meta.artist || "Unknown Artist",
					album: meta.album || manualSourceTag || "My Files",
					duration: meta.duration || 0,
					fileSize: file.size,
					mimeType: file.type || "audio/mpeg",
					fileName: file.name,
					downloadDate: Date.now(),
					isFavorite: false,
					playCount: 0,
					artworkUrl: meta.artworkUrl,
					telegramSource: manualSourceTag ? {
						chatTitle: manualSourceTag,
						topicName: manualSourceTag,
						sourceType: "manual"
					} : void 0
				};
				await saveTrack(track, file);
				importedTrackIds.push(trackId);
				successCount++;
			} catch (err) {
				console.warn("Error processing audio file:", file.name, err);
			}
		}
		if (manualSourceTag && importedTrackIds.length > 0 && settings.autoCreatePlaylists) {
			const existingPl = playlists.find((pl) => pl.name.toLowerCase() === manualSourceTag.toLowerCase());
			if (existingPl) {
				const merged = Array.from(/* @__PURE__ */ new Set([...existingPl.trackIds, ...importedTrackIds]));
				await savePlaylist({
					...existingPl,
					trackIds: merged,
					updatedAt: Date.now()
				});
			} else {
				const newPl = {
					id: `pl_manual_${Date.now()}`,
					name: manualSourceTag,
					description: `Imported audio from ${manualSourceTag}`,
					sourceType: "manual",
					trackIds: importedTrackIds,
					createdAt: Date.now(),
					updatedAt: Date.now()
				};
				await savePlaylist(newPl);
			}
		}
		await refreshLibrary();
		setIsProcessingFiles(false);
		showToast(`Successfully imported ${successCount} audio file${successCount !== 1 ? "s" : ""}!`);
		e.target.value = "";
	};
	const handleExportDatabase = async (withAudio = false) => {
		setIsExportingDb(true);
		try {
			const json = await exportLibraryBackup(withAudio);
			const filename = `btt-music-${withAudio ? "vault" : "db"}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
			const blob = new Blob([json], { type: "application/json" });
			if (navigator.canShare && navigator.canShare({ files: [new File([blob], filename, { type: "application/json" })] })) try {
				await navigator.share({
					files: [new File([blob], filename, { type: "application/json" })],
					title: "btmu Database",
					text: "Here is my btmu library backup."
				});
				showToast("Shared database successfully!");
				return;
			} catch {}
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
			showToast(`Exported ${withAudio ? "full database with audio" : "database metadata"}!`);
		} catch (err) {
			console.error("Export DB error:", err);
			showToast("Failed to export music database");
		} finally {
			setIsExportingDb(false);
		}
	};
	const handleImportDatabase = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setIsImportingDb(true);
		try {
			const text = await file.text();
			const res = await importLibraryBackup(text);
			await refreshLibrary();
			showToast(`Restored ${res.tracksRestored} songs and ${res.playlistsRestored} playlists!`);
		} catch (err) {
			console.error("Import DB error:", err);
			showToast("Invalid music database backup format");
		} finally {
			setIsImportingDb(false);
			e.target.value = "";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 overflow-y-auto px-4 pt-notch pb-8 space-y-5 max-w-lg mx-auto w-full select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileInputRef,
				type: "file",
				multiple: true,
				accept: "audio/*,.mp3,.m4a,.aac,.wav,.flac,.ogg",
				onChange: handleManualFiles,
				className: "hidden"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: dbFileRef,
				type: "file",
				accept: ".json,.btt,application/json",
				onChange: handleImportDatabase,
				className: "hidden"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] uppercase tracking-widest text-[var(--btt-accent)] font-black font-mono",
					children: "btmu by Ahmed"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-extrabold text-black dark:text-white tracking-tight font-display",
					children: "Sync & Import"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-zinc-500 dark:text-zinc-400 mt-0.5",
					children: "Import playlists from Spotify, sync music from Telegram, or manage your offline database."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-5 rounded-2xl bg-zinc-100 dark:bg-[#024E5B]/20 p-1 border border-zinc-200 dark:border-[#02ABB0]/20 text-[10.5px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("import"),
						className: `py-2 rounded-xl font-semibold transition flex flex-col items-center justify-center gap-0.5 ${activeTab === "import" ? "bg-[#02ABB0] text-black shadow-sm font-bold" : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: "Playlist"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("bot"),
						className: `py-2 rounded-xl font-semibold transition flex flex-col items-center justify-center gap-0.5 ${activeTab === "bot" ? "bg-[#02ABB0] text-black shadow-sm font-bold" : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: "Telegram"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("manual"),
						className: `py-2 rounded-xl font-semibold transition flex flex-col items-center justify-center gap-0.5 ${activeTab === "manual" ? "bg-[#02ABB0] text-black shadow-sm font-bold" : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: "Files"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("database"),
						className: `py-2 rounded-xl font-semibold transition flex flex-col items-center justify-center gap-0.5 ${activeTab === "database" ? "bg-[#02ABB0] text-black shadow-sm font-bold" : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: "Backup"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("guide"),
						className: `py-2 rounded-xl font-semibold transition flex flex-col items-center justify-center gap-0.5 ${activeTab === "guide" ? "bg-[#02ABB0] text-black shadow-sm font-bold" : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: "Guide"
						})]
					})
				]
			}),
			activeTab === "import" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 animate-in fade-in duration-150",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 sm:p-5 rounded-3xl bg-[#E8DDC9]/70 dark:bg-[#141815]/75 border border-[#176B67]/25 dark:border-[#C8F169]/30 space-y-4 shadow-sm backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold shrink-0 shadow-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListMusic, { className: "w-6 h-6" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-mono font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400",
											children: "Spotify Integration"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[9px]",
											children: "Keyless Embed"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-base font-bold text-[#292820] dark:text-[#E8E9DD] tracking-tight mt-0.5",
										children: "Spotify Playlist Inspector & Downloader"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#777267] dark:text-[#92998F] leading-relaxed",
								children: "Paste any public Spotify playlist URL to inspect every track before importing. Review metadata, skip duplicates, and download individual audio recordings directly."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: (e) => {
									e.preventDefault();
									if (spotifyUrlInput.trim()) setIsSpotifyReviewOpen(true);
								},
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: spotifyUrlInput,
									onChange: (e) => setSpotifyUrlInput(e.target.value),
									placeholder: "https://open.spotify.com/playlist/...",
									className: "flex-1 px-3.5 py-2.5 rounded-xl bg-white/70 dark:bg-black/40 border border-[#292820]/15 dark:border-white/15 text-xs font-mono text-[#292820] dark:text-[#E8E9DD] placeholder:text-[#777267] focus:outline-none focus:border-emerald-500"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									disabled: !spotifyUrlInput.trim(),
									className: "px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold active:scale-95 transition shrink-0 disabled:opacity-50 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Inspect" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setIsSpotifyReviewOpen(true),
								className: "w-full py-3 rounded-2xl bg-white/60 dark:bg-black/30 hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListMusic, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open Spotify Playlist Inspector" })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-3xl bg-[#E8DDC9]/50 dark:bg-[#141815]/60 border border-[#292820]/10 dark:border-white/10 space-y-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-9 h-9 rounded-xl bg-[#02ABB0]/20 text-[#02ABB0] flex items-center justify-center shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-4 h-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-xs font-bold text-[#292820] dark:text-[#E8E9DD]",
										children: "Telegram Music Hub"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-[#777267] dark:text-[#92998F]",
										children: botInfo ? `@${botInfo.username} connected` : "Optional bot & channel sync"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-[#777267] dark:text-[#92998F] leading-tight",
									children: "Preview discoverable tracks without a token or connect your bot to sync audio files."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setIsTelegramDiscoveryOpen(true),
									className: "w-full py-2 rounded-xl bg-[#02ABB0]/15 hover:bg-[#02ABB0]/25 text-[#02ABB0] text-xs font-bold transition active:scale-95 flex items-center justify-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open Telegram Hub" })]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-3xl bg-[#E8DDC9]/50 dark:bg-[#141815]/60 border border-[#292820]/10 dark:border-white/10 space-y-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-9 h-9 rounded-xl bg-[#176B67]/20 text-[#176B67] dark:bg-[#C8F169]/20 dark:text-[#C8F169] flex items-center justify-center shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-4 h-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-xs font-bold text-[#292820] dark:text-[#E8E9DD]",
										children: "Music & Import History"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-[#777267] dark:text-[#92998F]",
										children: "Persistent searches, downloads & retries"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-[#777267] dark:text-[#92998F] leading-tight",
									children: "Re-open past Spotify playlists, re-run searches, and retry failed imports with backoff."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setIsHistoryModalOpen(true),
									className: "w-full py-2 rounded-xl bg-[#176B67]/15 dark:bg-[#C8F169]/15 text-[#176B67] dark:text-[#C8F169] text-xs font-bold transition active:scale-95 flex items-center justify-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Complete History" })]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-2xl bg-white/40 dark:bg-black/20 border border-[#292820]/10 dark:border-white/10 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
							className: "text-xs font-bold text-[#292820] dark:text-[#E8E9DD]",
							children: "Advanced Batch Import Wizard"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-[#777267] dark:text-[#92998F]",
							children: "Multi-provider automated matching with threshold sliders"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setIsImportModalOpen(true),
							className: "px-3 py-1.5 rounded-xl bg-[#292820]/10 dark:bg-white/10 hover:bg-[#176B67] hover:text-white dark:hover:bg-[#C8F169] dark:hover:text-[#080A09] text-xs font-semibold active:scale-95 transition",
							children: "Launch Wizard"
						})]
					})
				]
			}),
			activeTab === "bot" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 animate-in fade-in duration-150",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-bold text-black dark:text-white flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-3.5 h-3.5" }), " Telegram Bot Connection"]
							}), botInfo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "px-2.5 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white border border-zinc-300 dark:border-zinc-700 text-[10px] font-bold flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3 h-3" }), " Connected"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									placeholder: "Enter Bot Token from @BotFather",
									value: botToken,
									onChange: (e) => setBotToken(e.target.value),
									className: "flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-xs text-black dark:text-white placeholder-zinc-400 focus:outline-none focus:border-black dark:focus:border-white font-mono"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => verifyToken(botToken),
									disabled: isVerifyingBot || !botToken.trim(),
									className: "px-4 py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black disabled:opacity-50 text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-sm",
									children: [isVerifyingBot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5" }), "Connect"]
								})]
							}), botInfo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between pt-1 text-[11px] text-zinc-600 dark:text-zinc-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"Bot: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-black dark:text-white",
										children: ["@", botInfo.username]
									}),
									" (",
									botInfo.first_name,
									")"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => scanForMusic(),
									disabled: isScanningUpdates,
									className: "text-black dark:text-white hover:underline font-semibold flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3 h-3 ${isScanningUpdates ? "animate-spin" : ""}` }), "Check Updates"]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "How it works:" }), " Create a bot with @BotFather on Telegram. Add your bot as an admin to your music channel/chat, or forward music to your bot. btmu reads the audio updates and downloads them straight into your iPhone local storage!"]
						})
					]
				}), discoveredTracks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-bold text-black dark:text-white",
							children: "Discovered Telegram Tracks"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [discoveredTracks.length, " found"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: selectAllTracks,
									className: "text-black dark:text-white hover:underline font-semibold",
									children: "Select All"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: deselectAllTracks,
									className: "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 font-medium",
									children: [
										"Clear (",
										selectedItemIds.size,
										")"
									]
								})
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleDownloadSelected,
							disabled: isDownloading || selectedItemIds.size === 0,
							className: "px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black disabled:opacity-40 text-xs font-bold flex items-center gap-1.5 shadow-md transition active:scale-95",
							children: [
								isDownloading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }),
								"Download (",
								selectedItemIds.size,
								")"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2 max-h-80 overflow-y-auto pr-1",
						children: discoveredTracks.map((item) => {
							const isSelected = selectedItemIds.has(item.fileId);
							const task = downloadTasks[item.fileId];
							const existingTrack = tracks.find((t) => t.telegramSource?.fileId === item.fileId || t.fileHash && t.fileHash === item.fileUniqueId || t.fileName === item.fileName);
							const isCurrentlyInLibrary = !!existingTrack;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => toggleSelectTrack(item.fileId),
								className: `p-3 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer ${isSelected ? "bg-zinc-200 dark:bg-zinc-800 border-black dark:border-white" : "bg-zinc-100/70 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200/60 dark:hover:bg-zinc-850"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-9 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileMusic, { className: "w-4 h-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "text-xs font-bold text-black dark:text-white truncate",
												children: item.title || item.fileName
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[10px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5 font-mono",
												children: [
													item.performer || item.chatTitle,
													" ",
													item.topicName ? `• #${item.topicName}` : "",
													" • ",
													formatFileSize(item.fileSize)
												]
											}),
											task && task.status === "failed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[10px] text-red-500 flex items-center gap-1 mt-1 font-medium font-sans",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-3 h-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "truncate",
													children: task.error
												})]
											})
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "shrink-0 flex items-center gap-2",
									children: task && task.status === "downloading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col items-end gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-black dark:text-white font-mono font-bold",
											children: task.totalBytes > 0 ? `${Math.round(task.downloadedBytes / task.totalBytes * 100)}%` : "Downloading..."
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-16 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-full bg-black dark:bg-white transition-all duration-150",
												style: { width: `${task.totalBytes > 0 ? task.downloadedBytes / task.totalBytes * 100 : 0}%` }
											})
										})]
									}) : isCurrentlyInLibrary ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: (e) => {
												e.stopPropagation();
												playTrack(existingTrack);
											},
											className: "px-2 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white text-[10px] font-bold flex items-center gap-1 transition active:scale-95",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-3 h-3 fill-current ml-0.5" }), "Play"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `w-5 h-5 rounded-md border flex items-center justify-center transition ${isSelected ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white" : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"}`,
											children: isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5" })
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `w-5 h-5 rounded-md border flex items-center justify-center transition ${isSelected ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white" : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"}`,
										children: isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5" })
									})
								})]
							}, item.fileId);
						})
					})]
				})]
			}),
			activeTab === "manual" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 animate-in fade-in duration-150",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-14 h-14 rounded-2xl bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white mx-auto flex items-center justify-center border border-zinc-300 dark:border-zinc-700",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, { className: "w-7 h-7" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-bold text-black dark:text-white",
							children: "Import Music Files"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto leading-relaxed",
							children: "Select MP3, M4A, AAC, WAV, or FLAC files directly from your iPhone Files app or iCloud Drive. ID3 tags and album artwork are extracted automatically."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-left space-y-1.5 max-w-sm mx-auto",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[11px] font-semibold text-zinc-600 dark:text-zinc-400",
									children: "Channel / Source Name (Optional):"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: manualSourceTag,
									onChange: (e) => setManualSourceTag(e.target.value),
									placeholder: "e.g. My Music Channel, Lo-Fi Vault",
									className: "w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-xs text-black dark:text-white placeholder-zinc-400 focus:outline-none focus:border-black dark:focus:border-white"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-zinc-400 dark:text-zinc-500",
									children: "A dedicated playlist with this source name will be created automatically."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => fileInputRef.current?.click(),
							disabled: isProcessingFiles,
							className: "w-full max-w-sm mx-auto py-3.5 px-4 rounded-2xl bg-black text-white dark:bg-white dark:text-black disabled:opacity-50 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-95",
							children: isProcessingFiles ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Processing Audio & ID3 Tags..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Choose Audio Files from iPhone" })] })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-bold text-black dark:text-white flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5" }), " Instant Offline Demo Pack"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-zinc-500 dark:text-zinc-400",
							children: "Generate 3 offline synthwave & lofi tracks instantly."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: async () => {
							setIsGeneratingSamples(true);
							try {
								const generatedIds = [];
								for (let i = 0; i < SAMPLE_AUDIO_PRESETS.length; i++) {
									const preset = SAMPLE_AUDIO_PRESETS[i];
									const blob = createToneAudioBlob({
										frequency: preset.frequency,
										durationSeconds: preset.duration,
										type: preset.type
									});
									const trackId = `sample_${Date.now()}_${i}`;
									generatedIds.push(trackId);
									const track = {
										id: trackId,
										title: preset.title,
										artist: preset.artist,
										album: preset.album,
										duration: preset.duration,
										fileSize: blob.size,
										mimeType: "audio/wav",
										fileName: `${preset.title}.wav`,
										downloadDate: Date.now() - i * 1e4,
										isFavorite: i === 0,
										playCount: 0,
										telegramSource: {
											chatTitle: "Demo Channel",
											topicName: preset.topic,
											sourceType: "sample"
										}
									};
									await saveTrack(track, blob);
								}
								await refreshLibrary();
								showToast("Generated 3 sample tracks for offline testing!");
							} finally {
								setIsGeneratingSamples(false);
							}
						},
						disabled: isGeneratingSamples,
						className: "px-3.5 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold shrink-0 transition",
						children: isGeneratingSamples ? "Generating..." : "Load Demo"
					})]
				})]
			}),
			activeTab === "database" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 animate-in fade-in duration-150",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-3xl bg-zinc-100 dark:bg-[#024E5B]/20 border border-zinc-200 dark:border-[#02ABB0]/30 space-y-3 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-10 h-10 rounded-2xl bg-[#02ABB0]/20 text-[#02ABB0] flex items-center justify-center shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "w-5 h-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-bold text-black dark:text-white font-serif",
								children: "Import Music Database"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-zinc-500 dark:text-zinc-400",
								children: "Restore tracks and playlists from Files App or AirDrop (.btt / .json)"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-2xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs space-y-1.5 text-zinc-600 dark:text-zinc-400",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "• Seamlessly merges or restores all songs, playlists, and SmartMix metadata." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "• Works with backups created on this or other devices." })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => dbFileRef.current?.click(),
							disabled: isImportingDb,
							className: "w-full py-3 rounded-2xl bg-[#02ABB0] hover:bg-[#01A4BD] text-black text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-[#02ABB0]/20 disabled:opacity-50",
							children: isImportingDb ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Restoring Music Database..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Choose Database Backup File" })] })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-3xl bg-zinc-100 dark:bg-[#024E5B]/20 border border-zinc-200 dark:border-[#02ABB0]/30 space-y-3 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-10 h-10 rounded-2xl bg-[#035A69]/20 text-[#01A4BD] flex items-center justify-center shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "w-5 h-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-bold text-black dark:text-white font-serif",
								children: "Export & Share Database"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-zinc-500 dark:text-zinc-400",
								children: "Share your library with others or save a backup to Files App"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-2xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold text-black dark:text-white",
								children: "Current Library"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-zinc-500",
								children: [
									tracks.length,
									" songs • ",
									playlists.length,
									" playlists"
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-2 py-0.5 rounded-full bg-[#02ABB0]/15 text-[#02ABB0] text-[10px] font-bold",
								children: formatFileSize(storageStats.trackBytes)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleExportDatabase(false),
								disabled: isExportingDb,
								className: "py-2.5 px-3 rounded-xl bg-white dark:bg-black border border-zinc-300 dark:border-zinc-700 text-black dark:text-white hover:border-[#02ABB0] text-xs font-semibold transition flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4 text-[#02ABB0]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Export Metadata (.json)" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleExportDatabase(true),
								disabled: isExportingDb,
								className: "py-2.5 px-3 rounded-xl bg-[#024E5B] text-white hover:bg-[#035A69] text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 shadow-sm disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "w-4 h-4 text-[#01A4BD]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Share Full Vault (with Audio)" })]
							})]
						})
					]
				})]
			}),
			activeTab === "guide" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 animate-in fade-in duration-150 text-xs text-zinc-700 dark:text-zinc-300",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-black dark:text-white font-bold text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-5 h-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Privacy & Telegram Architecture" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "leading-relaxed text-zinc-600 dark:text-zinc-400",
							children: "btmu was architected with privacy and iOS offline-first capabilities as top priorities:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "space-y-2 list-disc list-inside text-zinc-700 dark:text-zinc-300",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "No Third-Party Servers:" }), " Your songs and bot tokens stay 100% inside your iPhone's local IndexedDB. They are never sent to external servers or ad networks."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Bot API Security:" }), " Full Telegram Client APIs require phone number authentication and session hosting. The Telegram Bot API allows you to safely forward music without risking your personal Telegram credentials."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "100% Offline Playback:" }), " Once downloaded, Telegram is never contacted again. The app functions completely offline in Airplane mode and in the background."] })
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "font-bold text-black dark:text-white flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-4 h-4" }), " iOS PWA Best Practices"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "leading-relaxed text-zinc-600 dark:text-zinc-400",
							children: "IndexedDB on iOS supports hundreds of gigabytes depending on your iPhone's free storage. To keep music cached permanently:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
							className: "space-y-1.5 list-decimal list-inside text-zinc-700 dark:text-zinc-300",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Add btmu to your Home Screen from Safari." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Open the app periodically to keep Safari’s persistent storage flag active." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Check the Settings screen to monitor storage usage and export library metadata backups anytime." })
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaylistImportModal, {
				isOpen: isImportModalOpen,
				onClose: () => setIsImportModalOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotifyPlaylistReviewModal, {
				isOpen: isSpotifyReviewOpen,
				onClose: () => setIsSpotifyReviewOpen(false),
				initialUrl: spotifyUrlInput
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TelegramDiscoveryModal, {
				isOpen: isTelegramDiscoveryOpen,
				onClose: () => setIsTelegramDiscoveryOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MusicHistoryModal, {
				isOpen: isHistoryModalOpen,
				onClose: () => setIsHistoryModalOpen(false),
				onSelectPlaylistUrl: (url) => {
					setSpotifyUrlInput(url);
					setIsSpotifyReviewOpen(true);
				}
			})
		]
	});
};
export { SyncScreen };
