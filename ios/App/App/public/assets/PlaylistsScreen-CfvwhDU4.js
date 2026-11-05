import { a as __toESM } from "./rolldown-runtime-DQp2zzRu.js";
import { A as Send, Dt as require_react, H as Music, J as ListMusic, L as Plus, R as Play, S as Shuffle, Tt as ArrowLeft, _ as Sparkles, _t as ChevronUp, d as Trash2, r as X, st as Download, yt as ChevronDown, z as Pen } from "./vendor-icons-DVdP9XFB.js";
import { _ as useMusic, p as formatDuration } from "./x2Engine-BSzGwD2O.js";
import { l as require_jsx_runtime } from "./vendor-motion-CvHAzLEi.js";
import { c as SmartMixDrawer, i as PlaylistImportModal, n as ConfirmModal } from "./index-DMa-3grU.js";
// src/components/screens/PlaylistDetailView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var PlaylistDetailView = ({ playlist, onBack }) => {
	const { tracks, playTrack, updatePlaylist, deletePlaylist, removeTrackFromPlaylist, reorderPlaylistTracks, trackAnalyses } = useMusic();
	const [isEditingName, setIsEditingName] = (0, import_react.useState)(false);
	const [editedName, setEditedName] = (0, import_react.useState)(playlist.name);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = (0, import_react.useState)(false);
	const [isSmartMixOpen, setIsSmartMixOpen] = (0, import_react.useState)(false);
	const playlistTracks = playlist.trackIds.map((id) => tracks.find((t) => t.id === id)).filter((t) => t !== void 0);
	const totalDuration = playlistTracks.reduce((acc, t) => acc + (t.duration || 0), 0);
	const handleSaveName = async (e) => {
		e.preventDefault();
		if (!editedName.trim()) return;
		await updatePlaylist({
			...playlist,
			name: editedName.trim()
		});
		setIsEditingName(false);
	};
	const moveTrack = (index, direction) => {
		const targetIndex = direction === "up" ? index - 1 : index + 1;
		if (targetIndex < 0 || targetIndex >= playlist.trackIds.length) return;
		const copy = [...playlist.trackIds];
		const [moved] = copy.splice(index, 1);
		copy.splice(targetIndex, 0, moved);
		reorderPlaylistTracks(playlist.id, copy);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 overflow-y-auto px-4 pt-notch pb-8 space-y-5 max-w-lg mx-auto w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onBack,
					className: "p-2 -ml-2 text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition flex items-center gap-1.5 text-xs font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Playlists" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setIsEditingName(true),
						className: "p-2 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition",
						"aria-label": "Rename playlist",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-4 h-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setIsDeleteModalOpen(true),
						className: "p-2 text-zinc-500 hover:text-red-500 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition",
						"aria-label": "Delete playlist",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center text-center space-y-3 pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-36 h-36 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xl relative flex items-center justify-center",
						children: playlistTracks.length > 0 && playlistTracks[0].artworkUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: playlistTracks[0].artworkUrl,
							alt: playlist.name,
							className: "w-full h-full object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListMusic, { className: "w-16 h-16 stroke-[1.2]" })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						isEditingName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSaveName,
							className: "flex items-center gap-2 mt-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									autoFocus: true,
									value: editedName,
									onChange: (e) => setEditedName(e.target.value),
									className: "px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm font-bold text-black dark:text-white text-center"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "px-3 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-semibold",
									children: "Save"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setIsEditingName(false),
									className: "p-1.5 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-bold text-black dark:text-white",
							children: playlist.name
						}),
						playlist.sourceType === "telegram" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Telegram: ", playlist.telegramTopic || playlist.telegramChatTitle || "Chat"] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-zinc-500 dark:text-zinc-400 mt-1",
							children: [
								playlistTracks.length,
								" song",
								playlistTracks.length !== 1 ? "s" : "",
								" • ",
								formatDuration(totalDuration)
							]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 pt-2 w-full max-w-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								if (playlistTracks.length > 0) playTrack(playlistTracks[0], playlistTracks);
							},
							disabled: playlistTracks.length === 0,
							className: "flex-1 py-3 px-4 rounded-2xl bg-black text-white dark:bg-white dark:text-black disabled:opacity-50 text-xs font-bold flex items-center justify-center gap-2 shadow-md transition active:scale-95",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-4 h-4 fill-current ml-0.5" }), "Play All"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								if (playlistTracks.length > 0) {
									const shuffled = [...playlistTracks].sort(() => Math.random() - .5);
									playTrack(shuffled[0], shuffled);
								}
							},
							disabled: playlistTracks.length === 0,
							className: "flex-1 py-3 px-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-black dark:text-white disabled:opacity-50 text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, { className: "w-4 h-4" }), "Shuffle"]
						})]
					}),
					playlistTracks.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setIsSmartMixOpen(true),
						className: "w-full max-w-xs py-2.5 px-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-95",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Smart Mix: Optimize Flow" })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2 pt-2",
				children: playlistTracks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center py-12 text-zinc-400 dark:text-zinc-500 text-xs",
					children: "This playlist has no songs yet. Open any song in Library and tap \"+ Add to Playlist\"."
				}) : playlistTracks.map((track, idx) => {
					const analysis = trackAnalyses[track.id];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between p-2.5 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/60 hover:bg-zinc-200/70 dark:hover:bg-zinc-850/80 border border-zinc-200 dark:border-zinc-800 transition group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => playTrack(track, playlistTracks),
							className: "flex items-center gap-3 min-w-0 flex-1 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "w-9 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-800 shrink-0 overflow-hidden relative flex items-center justify-center border border-zinc-300/40 dark:border-zinc-700/40",
								children: [track.artworkUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: track.artworkUrl,
									alt: track.title,
									className: "w-full h-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: "w-4 h-4 text-zinc-400 dark:text-zinc-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-3.5 h-3.5 text-white fill-current ml-0.5" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1 pr-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-semibold text-black dark:text-white truncate",
									children: track.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-[10px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: track.artist
									}), analysis && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono font-medium shrink-0 text-zinc-600 dark:text-zinc-400",
										children: [
											analysis.bpm,
											" BPM • ",
											analysis.camelot
										]
									})] })]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 shrink-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mr-1",
									children: formatDuration(track.duration)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => moveTrack(idx, "up"),
									disabled: idx === 0,
									className: "p-1 text-zinc-400 hover:text-black dark:hover:text-white disabled:opacity-20 transition",
									"aria-label": "Move track up",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "w-4 h-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => moveTrack(idx, "down"),
									disabled: idx === playlistTracks.length - 1,
									className: "p-1 text-zinc-400 hover:text-black dark:hover:text-white disabled:opacity-20 transition",
									"aria-label": "Move track down",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-4 h-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => removeTrackFromPlaylist(playlist.id, track.id),
									className: "p-1.5 text-zinc-400 hover:text-red-500 transition",
									title: "Remove from playlist",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
								})
							]
						})]
					}, `${track.id}_${idx}`);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmModal, {
				isOpen: isDeleteModalOpen,
				title: `Delete playlist "${playlist.name}"?`,
				description: "This will delete this playlist. The underlying songs will remain safely saved in your library and local storage.",
				confirmLabel: "Delete Playlist",
				isDestructive: true,
				onConfirm: async () => {
					await deletePlaylist(playlist.id);
					setIsDeleteModalOpen(false);
					onBack();
				},
				onCancel: () => setIsDeleteModalOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartMixDrawer, {
				isOpen: isSmartMixOpen,
				onClose: () => setIsSmartMixOpen(false),
				playlistId: playlist.id
			})
		]
	});
};
// src/components/screens/PlaylistsScreen.tsx
var PlaylistsScreen = ({ selectedPlaylistId, onClearSelectedPlaylist }) => {
	const { playlists, tracks, createPlaylist } = useMusic();
	const [activePlaylistId, setActivePlaylistId] = (0, import_react.useState)(selectedPlaylistId || null);
	const [isCreatingModalOpen, setIsCreatingModalOpen] = (0, import_react.useState)(false);
	const [isImportModalOpen, setIsImportModalOpen] = (0, import_react.useState)(false);
	const [newPlaylistName, setNewPlaylistName] = (0, import_react.useState)("");
	const activePlaylist = playlists.find((pl) => pl.id === (activePlaylistId || selectedPlaylistId));
	if (activePlaylist) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaylistDetailView, {
		playlist: activePlaylist,
		onBack: () => {
			setActivePlaylistId(null);
			if (onClearSelectedPlaylist) onClearSelectedPlaylist();
		}
	});
	const handleCreate = async (e) => {
		e.preventDefault();
		if (!newPlaylistName.trim()) return;
		const created = await createPlaylist(newPlaylistName.trim());
		setNewPlaylistName("");
		setIsCreatingModalOpen(false);
		setActivePlaylistId(created.id);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 overflow-y-auto px-4 pt-notch pb-8 space-y-4 max-w-lg mx-auto w-full select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] uppercase tracking-widest text-[var(--btt-accent)] font-black font-mono",
						children: "btmu by Ahmed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-black text-[var(--btt-card-text)] tracking-tight font-display",
						children: "Playlists"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-[#777267] dark:text-[#92998F] mt-0.5",
						children: [
							playlists.length,
							" playlist",
							playlists.length !== 1 ? "s" : "",
							" stored offline"
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setIsImportModalOpen(true),
						className: "px-3 py-2 rounded-xl bg-[#176B67] text-[#E8DDC9] dark:bg-[#C8F169] dark:text-[#080A09] text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition",
						"aria-label": "Import Playlist",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Import" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setIsCreatingModalOpen(true),
						className: "px-3 py-2 rounded-xl bg-[#E8DDC9]/80 dark:bg-[#141815]/90 text-[#292820] dark:text-[#E8E9DD] border border-[#176B67]/20 dark:border-[#C8F169]/30 text-xs font-bold flex items-center gap-1.5 transition active:scale-95",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5 text-[#176B67] dark:text-[#C8F169]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "New" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onClick: () => setIsImportModalOpen(true),
				className: "p-4 rounded-3xl bg-[#E8DDC9]/75 dark:bg-[#141815]/80 backdrop-blur-2xl border border-[#176B67]/25 dark:border-[#C8F169]/30 shadow-md cursor-pointer hover:border-[#176B67] dark:hover:border-[#C8F169] transition-all group active:scale-[0.99] flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-2xl bg-[#C8F169] text-[#292820] flex items-center justify-center font-bold shrink-0 shadow-sm shadow-[#C8F169]/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-5 h-5 text-[#176B67]" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-black text-[#292820] dark:text-[#E8E9DD]",
							children: "Spotify & Web Playlist Import"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-1.5 py-0.2 rounded-full bg-[#1DB954]/20 text-[#1DB954] text-[9px] font-bold",
							children: "Spotify Ready"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-[#777267] dark:text-[#92998F] mt-0.5",
						children: "Paste public Spotify link to resolve tracklist with zero API keys"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-bold text-[#176B67] dark:text-[#C8F169] shrink-0 group-hover:translate-x-0.5 transition-transform",
					children: "Import →"
				})]
			}),
			playlists.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center py-16 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListMusic, { className: "w-12 h-12 text-[#777267] dark:text-[#92998F] mx-auto opacity-40" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-bold text-[#292820] dark:text-[#E8E9DD]",
						children: "No Playlists Yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[#777267] dark:text-[#92998F] max-w-xs mx-auto",
						children: "Import a Spotify playlist, sync audio from Telegram, or create custom playlists."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-center gap-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setIsImportModalOpen(true),
							className: "px-4 py-2.5 rounded-xl bg-[#176B67] text-[#E8DDC9] dark:bg-[#C8F169] dark:text-[#080A09] text-xs font-bold inline-flex items-center gap-2 shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }), "Import Playlist"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setIsCreatingModalOpen(true),
							className: "px-4 py-2.5 rounded-xl bg-[#E8DDC9] dark:bg-[#141815] text-[#292820] dark:text-[#E8E9DD] text-xs font-semibold inline-flex items-center gap-2 border border-[#176B67]/20 dark:border-[#C8F169]/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), "Create Empty"]
						})]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 pt-1",
				children: playlists.map((playlist) => {
					const firstTrackWithArt = playlist.trackIds.map((id) => tracks.find((t) => t.id === id)).find((t) => t && t.artworkUrl);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => setActivePlaylistId(playlist.id),
						className: "p-3 rounded-2xl bg-[#E8DDC9]/60 dark:bg-[#141815]/70 hover:bg-[#E8DDC9] dark:hover:bg-[#141815] border border-[#176B67]/20 dark:border-[#C8F169]/25 hover:border-[#176B67] dark:hover:border-[#C8F169] transition cursor-pointer flex flex-col justify-between space-y-2.5 group active:scale-[0.98] shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full aspect-square rounded-xl bg-[#E8DDC9] dark:bg-[#080A09] overflow-hidden relative shadow-sm flex items-center justify-center border border-[#176B67]/15 dark:border-[#C8F169]/20",
							children: [playlist.coverArtworkUrl || firstTrackWithArt?.artworkUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: playlist.coverArtworkUrl || firstTrackWithArt?.artworkUrl,
								alt: playlist.name,
								className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full h-full flex items-center justify-center text-[#777267] dark:text-[#92998F]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListMusic, { className: "w-10 h-10 stroke-[1.2]" })
							}), playlist.sourceType === "telegram" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 dark:bg-white/60 text-white dark:text-black backdrop-blur-md",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-3 h-3" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-xs font-bold text-[#292820] dark:text-[#E8E9DD] truncate",
							children: playlist.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] text-[#777267] dark:text-[#92998F] mt-0.5",
							children: [
								playlist.trackIds.length,
								" track",
								playlist.trackIds.length !== 1 ? "s" : ""
							]
						})] })]
					}, playlist.id);
				})
			}),
			isCreatingModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-3xl bg-[#E8DDC9] dark:bg-[#141815] border border-[#176B67]/30 dark:border-[#C8F169]/30 p-6 shadow-2xl space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-black text-[#292820] dark:text-[#E8E9DD]",
						children: "Create New Playlist"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreate,
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							autoFocus: true,
							placeholder: "Playlist name (e.g. Gym, Lo-Fi, Favorites)",
							value: newPlaylistName,
							onChange: (e) => setNewPlaylistName(e.target.value),
							className: "w-full px-4 py-3 rounded-xl bg-[#F3EBDD] dark:bg-[#080A09] border border-[#176B67]/25 dark:border-white/10 text-xs text-[#292820] dark:text-[#E8E9DD] focus:outline-none focus:border-[#176B67] dark:focus:border-[#C8F169] placeholder-[#777267]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIsCreatingModalOpen(false),
								className: "flex-1 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-[#777267] dark:text-[#92998F] text-xs font-semibold",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: !newPlaylistName.trim(),
								className: "flex-1 py-2.5 rounded-xl bg-[#176B67] text-[#E8DDC9] dark:bg-[#C8F169] dark:text-[#080A09] disabled:opacity-50 text-xs font-bold transition active:scale-95",
								children: "Create"
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaylistImportModal, {
				isOpen: isImportModalOpen,
				onClose: () => setIsImportModalOpen(false),
				onPlaylistCreated: (id) => setActivePlaylistId(id)
			})
		]
	});
};
export { PlaylistsScreen };
