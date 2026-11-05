import { a as __toESM } from "./rolldown-runtime-DQp2zzRu.js";
import { C as Shield, D as Share2, Dt as require_react, E as Share, Et as Activity, F as RefreshCw, K as LoaderCircle, V as Palette, _ as Sparkles, bt as Check, c as Volume1, ft as Clock, h as SquarePlus, ht as CircleArrowUp, k as Server, l as Upload, mt as CircleCheck, o as VolumeX, r as X, s as Volume2, st as Download, t as Zap, tt as HardDrive, u as TriangleAlert, ut as Copy, v as Smartphone, xt as ChartColumn } from "./vendor-icons-DVdP9XFB.js";
import { d as getAudioBlob, m as importLibraryBackup, o as exportLibraryBackup, t as clearAllData } from "./db-Cr6tU0Tr.js";
import { _ as useMusic, m as formatFileSize } from "./x2Engine-BSzGwD2O.js";
import { l as require_jsx_runtime } from "./vendor-motion-CvHAzLEi.js";
import { n as SpotDLInfoModal, t as X2BenchmarkModal } from "./X2BenchmarkModal-bDWlfQ7R.js";
import { n as ConfirmModal, r as findDuplicateTracks, s as useOnlineStatus, t as DuplicatesModal } from "./index-DMa-3grU.js";
// src/hooks/usePWAInstall.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function usePWAInstall() {
	const [deferredPrompt, setDeferredPrompt] = (0, import_react.useState)(null);
	const [isInstalled, setIsInstalled] = (0, import_react.useState)(false);
	const [isIOS, setIsIOS] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
		setIsInstalled(isStandalone);
		const userAgent = window.navigator.userAgent.toLowerCase();
		const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
		setIsIOS(isIOSDevice);
		const handleBeforeInstallPrompt = (e) => {
			e.preventDefault();
			setDeferredPrompt(e);
		};
		const handleAppInstalled = () => {
			setIsInstalled(true);
			setDeferredPrompt(null);
		};
		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		window.addEventListener("appinstalled", handleAppInstalled);
		return () => {
			window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
			window.removeEventListener("appinstalled", handleAppInstalled);
		};
	}, []);
	const install = async () => {
		if (!deferredPrompt) return false;
		await deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === "accepted") {
			setIsInstalled(true);
			setDeferredPrompt(null);
			return true;
		}
		return false;
	};
	return {
		isInstallable: !!deferredPrompt,
		isInstalled,
		isIOS,
		install
	};
}
// src/components/common/PWAInstallModal.tsx
var import_jsx_runtime = require_jsx_runtime();
var PWAInstallModal = ({ isOpen, onClose }) => {
	const { isInstallable, isInstalled, install } = usePWAInstall();
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl relative",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "absolute top-4 right-4 p-2 text-zinc-400 hover:text-black dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800",
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3.5 mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-14 h-14 rounded-2xl overflow-hidden shadow-md border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-950 shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/app-logo.png",
							alt: "btmu Logo",
							className: "w-full h-full object-cover"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-extrabold text-black dark:text-white",
							children: "btmu"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-1.5 py-0.2 rounded-md bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white text-[10px] font-bold",
							children: "iOS"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-zinc-500 dark:text-zinc-400",
						children: "Add to iPhone Home Screen"
					})] })]
				}),
				isInstalled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-center space-y-2 my-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-full bg-black text-white dark:bg-white dark:text-black mx-auto flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-5 h-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-black dark:text-white",
							children: "Installed on Home Screen!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-zinc-500 dark:text-zinc-400",
							children: "btmu is running in standalone mode with notch & Dynamic Island safe area support."
						})
					]
				}) : isInstallable ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 my-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed",
						children: "Install btmu onto your device for standalone offline playback, full notch clearance, and lock-screen media controls."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: async () => {
							await install();
							onClose();
						},
						className: "w-full py-3 px-4 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold text-sm transition shadow-md flex items-center justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4" }), "Install Application"]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 my-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed",
							children: [
								"To install ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "btmu" }),
								" on your ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "iPhone" }),
								" with full notch and Dynamic Island support:"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
							className: "space-y-3 text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-950 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-6 h-6 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-black dark:text-white font-bold",
										children: "1"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Tap the ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
											className: "text-black dark:text-white inline-flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share, { className: "w-3.5 h-3.5 inline" }), " Share"]
										}),
										" button in Safari toolbar."
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-6 h-6 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-black dark:text-white font-bold",
										children: "2"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Scroll down and tap ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
											className: "text-black dark:text-white inline-flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePlus, { className: "w-3.5 h-3.5 inline" }), " Add to Home Screen"]
										}),
										"."
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-6 h-6 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-black dark:text-white font-bold",
										children: "3"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Tap ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-black dark:text-white",
											children: "Add"
										}),
										" in the top-right corner."
									] })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 text-black dark:text-white font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "iPhone Notch & Dynamic Island Ready" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "leading-tight",
								children: "When opened from the Home Screen, btmu automatically expands into a standalone app without browser bars, keeping all controls clearly below the notch and above the home swipe indicator."
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "mt-4 w-full py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-semibold text-black dark:text-white transition",
					children: "Got It"
				})
			]
		})
	});
};
// src/constants/version.ts
var APP_VERSION = "1.8.0";
var APP_NAME = "btmu by Ahmed";
var BUILD_DATE = "2026-10-30";
// src/hooks/useAppUpdate.ts
function useAppUpdate() {
	const [updateState, setUpdateState] = (0, import_react.useState)(() => {
		const savedTime = localStorage.getItem("btt_last_update_check");
		return {
			currentVersion: APP_VERSION,
			remoteVersion: null,
			releaseNotes: null,
			status: "idle",
			lastCheckedAt: savedTime ? parseInt(savedTime, 10) : null,
			isUpdateAvailable: false,
			errorMessage: null
		};
	});
	const [swRegistration, setSwRegistration] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if ("serviceWorker" in navigator) navigator.serviceWorker.getRegistration().then((reg) => {
			if (reg) {
				setSwRegistration(reg);
				reg.onupdatefound = () => {
					const installingWorker = reg.installing;
					if (installingWorker) installingWorker.onstatechange = () => {
						if (installingWorker.state === "installed" && navigator.serviceWorker.controller) setUpdateState((prev) => ({
							...prev,
							isUpdateAvailable: true,
							status: "available"
						}));
					};
				};
			}
		});
	}, []);
	const checkForUpdates = (0, import_react.useCallback)(async () => {
		if (!navigator.onLine) {
			setUpdateState((prev) => ({
				...prev,
				status: "offline",
				errorMessage: "Device is offline. Connect to internet to verify version."
			}));
			return;
		}
		setUpdateState((prev) => ({
			...prev,
			status: "checking",
			errorMessage: null
		}));
		try {
			if (swRegistration) swRegistration.update().catch(console.warn);
			const res = await fetch(`/api/version?t=${Date.now()}`, {
				cache: "no-store",
				headers: { Accept: "application/json" }
			}).catch(async () => {
				return await fetch(`/version.json?t=${Date.now()}`, { cache: "no-store" });
			});
			if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
			const manifest = await res.json();
			const remoteVer = manifest.version || "1.8.0";
			const isNewer = compareVersions(remoteVer, APP_VERSION) > 0;
			const now = Date.now();
			localStorage.setItem("btt_last_update_check", now.toString());
			setUpdateState((prev) => ({
				...prev,
				remoteVersion: remoteVer,
				releaseNotes: manifest.releaseNotes || null,
				status: isNewer ? "available" : "latest",
				isUpdateAvailable: isNewer,
				lastCheckedAt: now,
				errorMessage: null
			}));
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Could not check for updates";
			setUpdateState((prev) => ({
				...prev,
				status: "error",
				errorMessage: msg
			}));
		}
	}, [swRegistration]);
	const applyUpdate = (0, import_react.useCallback)(async () => {
		setUpdateState((prev) => ({
			...prev,
			status: "installing"
		}));
		try {
			if (swRegistration && swRegistration.waiting) swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
			setTimeout(() => {
				window.location.reload();
			}, 600);
		} catch {
			window.location.reload();
		}
	}, [swRegistration]);
	return {
		...updateState,
		checkForUpdates,
		applyUpdate
	};
}
function compareVersions(v1, v2) {
	const parts1 = v1.replace(/^v/, "").split(".").map(Number);
	const parts2 = v2.replace(/^v/, "").split(".").map(Number);
	for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
		const num1 = parts1[i] || 0;
		const num2 = parts2[i] || 0;
		if (num1 > num2) return 1;
		if (num1 < num2) return -1;
	}
	return 0;
}
// src/components/player/VolumeControl.tsx
var VolumeControl = ({ className = "", showPresets = true }) => {
	const { playerState, setVolume, setVolumeBooster, toggleVolumeBooster } = useMusic();
	const { volume, volumeBooster, isBoosterActive, isMuted } = playerState;
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const [dragPercent, setDragPercent] = (0, import_react.useState)(null);
	const trackRef = (0, import_react.useRef)(null);
	const currentPercent = isMuted ? 0 : isBoosterActive ? volume <= .99 ? volume * 100 : 100 + (volumeBooster - 1) / 2 * 200 : volume * 100;
	const displayPercent = isDragging && dragPercent !== null ? dragPercent : currentPercent;
	const maxPercent = isBoosterActive ? 300 : 100;
	const progressRatio = Math.max(0, Math.min(1, displayPercent / maxPercent));
	const renderVolumeIcon = () => {
		if (isMuted || displayPercent === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "w-4 h-4 text-zinc-400 dark:text-zinc-500" });
		if (displayPercent > 100) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-4 h-4 text-black dark:text-white fill-current" });
		if (displayPercent < 40) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume1, { className: "w-4 h-4 text-zinc-500 dark:text-zinc-400" });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-4 h-4 text-black dark:text-white" });
	};
	const calculatePercentFromX = (0, import_react.useCallback)((clientX) => {
		if (!trackRef.current) return 0;
		const rect = trackRef.current.getBoundingClientRect();
		const clickX = clientX - rect.left;
		const fraction = Math.max(0, Math.min(1, clickX / rect.width));
		return Math.round(fraction * maxPercent);
	}, [maxPercent]);
	const applyPercent = (0, import_react.useCallback)((pct) => {
		if (pct <= 0) {
			setVolume(0);
			return;
		}
		if (pct <= 100) {
			setVolume(pct / 100);
			if (isBoosterActive && volumeBooster > 1) setVolumeBooster(1);
		} else {
			setVolume(1);
			const boosterVal = 1 + (pct - 100) / 200 * 2;
			setVolumeBooster(Math.round(boosterVal * 10) / 10);
		}
	}, [
		isBoosterActive,
		volumeBooster,
		setVolume,
		setVolumeBooster
	]);
	const handlePointerDown = (e) => {
		e.preventDefault();
		e.target.setPointerCapture?.(e.pointerId);
		setIsDragging(true);
		const newPct = calculatePercentFromX(e.clientX);
		setDragPercent(newPct);
		applyPercent(newPct);
		const handlePointerMove = (moveEv) => {
			const movedPct = calculatePercentFromX(moveEv.clientX);
			setDragPercent(movedPct);
			applyPercent(movedPct);
		};
		const handlePointerUp = (upEv) => {
			const finalPct = calculatePercentFromX(upEv.clientX);
			setIsDragging(false);
			setDragPercent(null);
			applyPercent(finalPct);
			window.removeEventListener("pointermove", handlePointerMove);
			window.removeEventListener("pointerup", handlePointerUp);
			window.removeEventListener("pointercancel", handlePointerUp);
		};
		window.addEventListener("pointermove", handlePointerMove);
		window.addEventListener("pointerup", handlePointerUp);
		window.addEventListener("pointercancel", handlePointerUp);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `space-y-2 select-none ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						if (isMuted || volume === 0) setVolume(.8);
						else setVolume(0);
					},
					className: "p-2 -ml-1 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition active:scale-95",
					"aria-label": isMuted ? "Unmute" : "Mute",
					children: renderVolumeIcon()
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: trackRef,
					onPointerDown: handlePointerDown,
					className: "relative flex-1 h-9 flex items-center cursor-pointer group touch-none",
					title: "Drag to adjust volume cursor",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden relative border border-zinc-300 dark:border-zinc-700/60",
							children: [isBoosterActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-0 bottom-0 w-[1.5px] bg-zinc-400 dark:bg-zinc-500 z-10",
								style: { left: "33.33%" }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-black dark:bg-white transition-all duration-75",
								style: { width: `${progressRatio * 100}%` }
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `absolute top-1/2 -translate-y-1/2 -ml-2.5 rounded-full shadow-md transition-transform ${isDragging ? "scale-125 w-5 h-5 bg-black dark:bg-white ring-4 ring-black/20 dark:ring-white/20" : "w-4 h-4 bg-black dark:bg-white group-hover:scale-110"}`,
							style: { left: `${progressRatio * 100}%` }
						}),
						isDragging && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute -top-7 -translate-x-1/2 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black text-white dark:bg-white dark:text-black shadow-lg pointer-events-none whitespace-nowrap z-30",
							style: { left: `${progressRatio * 100}%` },
							children: displayPercent > 100 ? `${displayPercent}% (${(1 + (displayPercent - 100) / 200 * 2).toFixed(1)}x)` : `${displayPercent}%`
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "shrink-0 text-right min-w-[50px]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-mono font-bold text-black dark:text-white",
						children: [Math.round(displayPercent), "%"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => toggleVolumeBooster(),
					className: "px-2.5 py-1 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1 opacity-60 cursor-not-allowed bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700",
					title: "Disabled for background stability",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Booster Off" })]
				})
			]
		}), showPresets && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-1.5 pt-0.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] uppercase font-bold tracking-wider text-zinc-500 dark:text-zinc-400",
				children: "Presets:"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setVolume(.25),
						className: `px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold transition ${Math.abs(volume - .25) < .05 ? "bg-black text-white dark:bg-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"}`,
						children: "25%"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setVolume(.5),
						className: `px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold transition ${Math.abs(volume - .5) < .05 ? "bg-black text-white dark:bg-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"}`,
						children: "50%"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setVolume(.75),
						className: `px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold transition ${Math.abs(volume - .75) < .05 ? "bg-black text-white dark:bg-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"}`,
						children: "75%"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setVolume(1),
						className: `px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold transition ${volume >= .98 ? "bg-black text-white dark:bg-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"}`,
						children: "100%"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[9px] font-mono text-zinc-400 dark:text-zinc-500 pl-1",
						title: "3x Booster disabled for background playback stability",
						children: "(Direct output)"
					})
				]
			})]
		})]
	});
};
// src/components/screens/SettingsScreen.tsx
var SettingsScreen = () => {
	const { settings, updateSettings, updateSmartMixConfig, batchAnalyzeTracks, trackAnalyses, storageStats, tracks, refreshLibrary, showToast, playerState, toggleVolumeBooster } = useMusic();
	const { isInstalled } = usePWAInstall();
	useOnlineStatus();
	const { currentVersion, remoteVersion, releaseNotes, status: updateStatus, lastCheckedAt, isUpdateAvailable, errorMessage: updateError, checkForUpdates, applyUpdate } = useAppUpdate();
	const [isInstallModalOpen, setIsInstallModalOpen] = (0, import_react.useState)(false);
	const [isClearDataModalOpen, setIsClearDataModalOpen] = (0, import_react.useState)(false);
	const [backupFileInputRef] = (0, import_react.useState)(() => import_react.createRef());
	const [isTestingOffline, setIsTestingOffline] = (0, import_react.useState)(false);
	const [diagnosticResult, setDiagnosticResult] = (0, import_react.useState)(null);
	const [isSpotDLModalOpen, setIsSpotDLModalOpen] = (0, import_react.useState)(false);
	const [isBenchmarkModalOpen, setIsBenchmarkModalOpen] = (0, import_react.useState)(false);
	const [spotDLBridgeUrl, setSpotDLBridgeUrl] = (0, import_react.useState)(localStorage.getItem("btt_spotdl_bridge_url") || "");
	const [isDuplicatesModalOpen, setIsDuplicatesModalOpen] = (0, import_react.useState)(false);
	const [duplicateGroups, setDuplicateGroups] = (0, import_react.useState)([]);
	const handleScanDuplicates = () => {
		const groups = findDuplicateTracks(tracks);
		setDuplicateGroups(groups);
		if (groups.length === 0) showToast("No duplicate tracks found! Your library is clean.");
		else setIsDuplicatesModalOpen(true);
	};
	const { smartMixConfig, isAnalyzing, analysisProgress } = playerState;
	const handleExportBackup = async (withAudio = false) => {
		try {
			const json = await exportLibraryBackup(withAudio);
			const blob = new Blob([json], { type: "application/json" });
			const filename = `btmu-${withAudio ? "vault" : "db"}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
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
			console.error("Export failed:", err);
			showToast("Failed to export backup");
		}
	};
	const handleImportBackup = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			const text = await file.text();
			const res = await importLibraryBackup(text);
			await refreshLibrary();
			showToast(`Restored ${res.tracksRestored} songs and ${res.playlistsRestored} playlists!`);
		} catch (err) {
			console.error("Import error:", err);
			showToast("Invalid music database backup file");
		}
		e.target.value = "";
	};
	const runOfflineDiagnostic = async () => {
		setIsTestingOffline(true);
		setDiagnosticResult(null);
		try {
			if (tracks.length === 0) {
				setDiagnosticResult("Library is currently empty. Import a song to test offline playback.");
				setIsTestingOffline(false);
				return;
			}
			const firstTrack = tracks[0];
			const blob = await getAudioBlob(firstTrack.id);
			if (!blob || blob.size === 0) {
				setDiagnosticResult(`Error: Audio file for "${firstTrack.title}" is missing or empty.`);
				setIsTestingOffline(false);
				return;
			}
			const testUrl = URL.createObjectURL(blob);
			const audioTest = new Audio(testUrl);
			await new Promise((resolve, reject) => {
				const timeout = setTimeout(() => {
					URL.revokeObjectURL(testUrl);
					resolve();
				}, 3e3);
				audioTest.onloadedmetadata = () => {
					clearTimeout(timeout);
					URL.revokeObjectURL(testUrl);
					resolve();
				};
				audioTest.onerror = () => {
					clearTimeout(timeout);
					URL.revokeObjectURL(testUrl);
					reject(/* @__PURE__ */ new Error("Audio decoding failed"));
				};
			});
			setDiagnosticResult(`Verified! IndexedDB has ${tracks.length} track(s) cached. Track "${firstTrack.title}" (${formatFileSize(blob.size)}) decoded successfully offline without network.`);
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Diagnostic failed";
			setDiagnosticResult(`Diagnostic issue: ${msg}`);
		} finally {
			setIsTestingOffline(false);
		}
	};
	const handleClearAll = async () => {
		await clearAllData();
		await refreshLibrary();
		setIsClearDataModalOpen(false);
		showToast("All local music and data cleared.");
	};
	const presets = [
		{
			id: "off",
			label: "Off"
		},
		{
			id: "short",
			label: "3s"
		},
		{
			id: "balanced",
			label: "6s"
		},
		{
			id: "long",
			label: "10s"
		},
		{
			id: "custom",
			label: "Custom"
		}
	];
	const analyzedCount = Object.keys(trackAnalyses).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 overflow-y-auto px-4 pt-notch pb-8 space-y-6 max-w-lg mx-auto w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: backupFileInputRef,
				type: "file",
				accept: ".json,application/json",
				onChange: handleImportBackup,
				className: "hidden"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] uppercase tracking-widest text-[var(--btt-accent)] font-black font-mono",
					children: "btmu by Ahmed"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-extrabold text-[var(--btt-card-text)] tracking-tight font-display",
					children: "Settings"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-[var(--btt-card-subtext)] mt-1 font-sans",
					children: "btmu preferences, updates, audio transitions, palette themes, and offline storage."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "text-xs font-mono font-black uppercase tracking-wider text-[var(--btt-accent)] flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleArrowUp, { className: "w-4 h-4 text-[var(--btt-accent)]" }), " Application Updates"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 rounded-3xl bg-[var(--btt-surface)] backdrop-blur-2xl border border-[var(--btt-border)] space-y-4 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-13 h-13 rounded-2xl overflow-hidden shadow-sm border border-[var(--btt-accent)]/30 bg-[var(--btt-surface)] shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: "/app-logo.png",
										alt: "btmu Logo",
										className: "w-full h-full object-cover"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-sm font-bold text-[var(--btt-card-text)] font-display",
									children: "btmu by Ahmed"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-[var(--btt-card-subtext)] font-mono mt-0.5",
									children: [
										"Version ",
										currentVersion,
										" • iOS Edition"
									]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: checkForUpdates,
								disabled: updateStatus === "checking",
								className: "px-3.5 py-2 rounded-xl bg-[var(--btt-accent)]/15 hover:bg-[var(--btt-accent)]/25 border border-[var(--btt-accent)]/25 disabled:opacity-50 text-xs font-bold text-[var(--btt-accent)] flex items-center gap-1.5 transition active:scale-95 shrink-0",
								children: updateStatus === "checking" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Checking..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Check Updates" })] })
							})]
						}),
						updateStatus === "latest" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-2xl bg-[var(--btt-accent)]/15 border border-[var(--btt-accent)]/30 flex items-center gap-2.5 text-xs text-[var(--btt-card-text)] font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 shrink-0 text-[var(--btt-accent)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"You are using the latest version of btmu (v",
								currentVersion,
								")."
							] })]
						}),
						updateStatus === "available" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-2xl bg-[var(--btt-accent)]/20 border border-[var(--btt-accent)]/40 space-y-2.5 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-[var(--btt-card-text)] flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleArrowUp, { className: "w-4 h-4 text-[var(--btt-accent)]" }),
											"Update Available: v",
											remoteVersion
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-[var(--btt-card-subtext)]",
										children: "Ready to install"
									})]
								}),
								releaseNotes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-[var(--btt-card-text)] leading-relaxed bg-[var(--btt-bg)]/80 p-2.5 rounded-xl border border-[var(--btt-border)]",
									children: releaseNotes
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: applyUpdate,
									className: "w-full py-2.5 px-4 rounded-xl bg-[var(--btt-accent)] text-black font-bold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleArrowUp, { className: "w-4 h-4" }), "Update Now (Preserves all music)"]
								})
							]
						}),
						updateStatus === "offline" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-2xl bg-[var(--btt-surface)] text-xs text-[var(--btt-card-subtext)] flex items-center gap-2 border border-[var(--btt-border)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Device is currently offline. Connect to internet to verify updates." })]
						}),
						lastCheckedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] text-[var(--btt-card-subtext)] text-right font-mono",
							children: ["Last checked: ", new Date(lastCheckedAt).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "text-xs font-mono font-black uppercase tracking-wider text-[var(--btt-accent)] flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "w-4 h-4 text-[var(--btt-accent)]" }), " Palette Combos"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 rounded-3xl bg-[var(--btt-surface)] backdrop-blur-2xl border border-[var(--btt-border)] space-y-3.5 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-[var(--btt-card-subtext)]",
							children: "Select your active color palette:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[var(--btt-accent)]/15 text-[var(--btt-accent)] font-bold",
							children: settings.paletteCombo || "signature"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: async () => {
									document.documentElement.setAttribute("data-palette", "signature");
									await updateSettings({ paletteCombo: "signature" });
									showToast("Palette switched to Signature (Navy/Gold/Cyan)");
								},
								className: `p-3.5 rounded-2xl border text-left transition flex items-center justify-between ${(settings.paletteCombo || "signature") === "signature" ? "border-[var(--btt-accent)] bg-[var(--btt-accent)]/10 ring-1 ring-[var(--btt-accent)]" : "border-[var(--btt-border)] hover:border-[var(--btt-card-subtext)]/40 bg-[var(--btt-bg)]/40"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-xs text-[var(--btt-card-text)] font-display",
											children: "Signature"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--btt-accent)]/20 text-[var(--btt-accent)] font-semibold",
											children: "DEFAULT"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-[var(--btt-card-subtext)] leading-snug",
										children: "Signature Navy (#070E1A) with Gold (#D4AF37) accents and Cyan (#00E5FF) highlights."
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 shrink-0 ml-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-4 h-4 rounded-full bg-[#070E1A] border border-white/20" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-4 h-4 rounded-full bg-[#D4AF37]" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-4 h-4 rounded-full bg-[#00E5FF]" })
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: async () => {
									document.documentElement.setAttribute("data-palette", "mono");
									await updateSettings({ paletteCombo: "mono" });
									showToast("Palette switched to Mono (Pure Black & White)");
								},
								className: `p-3.5 rounded-2xl border text-left transition flex items-center justify-between ${settings.paletteCombo === "mono" ? "border-[var(--btt-accent)] bg-[var(--btt-accent)]/10 ring-1 ring-[var(--btt-accent)]" : "border-[var(--btt-border)] hover:border-[var(--btt-card-subtext)]/40 bg-[var(--btt-bg)]/40"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-xs text-[var(--btt-card-text)] font-display",
											children: "Mono"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-[var(--btt-card-subtext)] leading-snug",
										children: "Pure black (#000000), crisp white (#FFFFFF), and silver (#E5E7EB) high-contrast minimalist."
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 shrink-0 ml-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-4 h-4 rounded-full bg-black border border-white/30" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-4 h-4 rounded-full bg-white border border-black/30" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-4 h-4 rounded-full bg-neutral-400" })
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: async () => {
									document.documentElement.setAttribute("data-palette", "legacy");
									await updateSettings({ paletteCombo: "legacy" });
									showToast("Palette switched to Legacy (Sand/Forest/Chartreuse)");
								},
								className: `p-3.5 rounded-2xl border text-left transition flex items-center justify-between ${settings.paletteCombo === "legacy" ? "border-[var(--btt-accent)] bg-[var(--btt-accent)]/10 ring-1 ring-[var(--btt-accent)]" : "border-[var(--btt-border)] hover:border-[var(--btt-card-subtext)]/40 bg-[var(--btt-bg)]/40"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-xs text-[var(--btt-card-text)] font-display",
											children: "Legacy"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-500/20 text-[var(--btt-card-subtext)] font-semibold",
											children: "v1.7"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-[var(--btt-card-subtext)] leading-snug",
										children: "v1.7 champagne/sand (#F3EBDD), deep forest (#176B67), and chartreuse (#C8F169)."
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 shrink-0 ml-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-4 h-4 rounded-full bg-[#176B67]" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-4 h-4 rounded-full bg-[#C8F169]" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-4 h-4 rounded-full bg-[#F3EBDD] border border-black/20" })
									]
								})]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "text-xs font-mono font-black uppercase tracking-wider text-[var(--btt-accent)] flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-4 h-4 text-[var(--btt-accent)]" }), " Volume & Lock Screen Controls"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 rounded-3xl bg-[var(--btt-surface)] backdrop-blur-2xl border border-[var(--btt-border)] space-y-4 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm font-bold text-[var(--btt-card-text)] flex items-center gap-1.5",
								children: ["3x Audio Booster", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 text-[10px] font-mono font-bold",
									children: "Disabled"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[var(--btt-card-subtext)] mt-0.5",
								children: "Disabled for background stability on iOS"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => toggleVolumeBooster(),
								className: "px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 opacity-60 cursor-not-allowed bg-[var(--btt-surface)] text-[var(--btt-card-subtext)] border border-[var(--btt-border)]",
								title: "Volume booster is disabled to ensure continuous background playback on iOS",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Disabled" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeControl, { showPresets: true })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 border-t border-[var(--btt-border)] space-y-1.5 text-xs text-[var(--btt-card-subtext)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[var(--btt-accent)] font-bold",
									children: "📱"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-[var(--btt-card-text)]",
									children: "AirPods & Lock Screen:"
								}), " Native iOS lock screen controls with track skip (⏮/⏭), seek, and continuous background audio."] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[var(--btt-accent)] font-bold",
									children: "🎵"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-[var(--btt-card-text)]",
									children: "Direct CoreAudio Output:"
								}), " Web Audio gain routing removed to guarantee uninterrupted playback when phone is locked or backgrounded."] })]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "text-xs font-mono font-black uppercase tracking-wider text-[var(--btt-accent)] flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4 text-[var(--btt-accent)]" }), " Smart Mix & Transitions"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 rounded-3xl bg-[#E8DDC9]/70 dark:bg-[#141815]/80 backdrop-blur-2xl border border-[#292820]/10 dark:border-white/10 space-y-4 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold text-[#292820] dark:text-[#E8E9DD]",
								children: "Btt Smart Mix"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#777267] dark:text-[#92998F]",
								children: "Continuous DJ blending between consecutive songs"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: smartMixConfig.enabled,
								onChange: (e) => updateSmartMixConfig({ enabled: e.target.checked }),
								className: "w-5 h-5 rounded-md accent-[#176B67] dark:accent-[#C8F169] cursor-pointer"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-[#777267] dark:text-[#92998F]",
								children: "Crossfade Duration:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: presets.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => updateSmartMixConfig({ preset: p.id }),
									className: `px-3 py-1.5 rounded-xl text-xs font-semibold transition ${smartMixConfig.preset === p.id ? "bg-[#176B67] text-[#F3EBDD] dark:bg-[#C8F169] dark:text-[#080A09] shadow-sm" : "bg-[#E8DDC9] dark:bg-[#141815] text-[#777267] dark:text-[#92998F] hover:text-[#292820] dark:hover:text-[#E8E9DD] border border-[#292820]/10 dark:border-white/10"}`,
									children: p.label
								}, p.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 border-t border-[#292820]/10 dark:border-white/10 space-y-2.5 text-xs text-[#292820] dark:text-[#E8E9DD]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Trim Dead Silence (Intro/Outro)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: smartMixConfig.trimSilence,
									onChange: (e) => updateSmartMixConfig({ trimSilence: e.target.checked }),
									className: "w-4 h-4 rounded accent-[#176B67] dark:accent-[#C8F169]"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Harmonic Matching (Camelot Keys)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: smartMixConfig.useHarmonicMixing,
									onChange: (e) => updateSmartMixConfig({ useHarmonicMixing: e.target.checked }),
									className: "w-4 h-4 rounded accent-[#176B67] dark:accent-[#C8F169]"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 border-t border-[#292820]/10 dark:border-white/10 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-[#292820] dark:text-[#E8E9DD]",
								children: "Acoustic Library Analysis"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[10px] text-[#777267] dark:text-[#92998F] font-mono",
								children: [
									analyzedCount,
									" of ",
									tracks.length,
									" songs analyzed"
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => batchAnalyzeTracks(),
								disabled: isAnalyzing || analyzedCount === tracks.length,
								className: "px-3 py-1.5 rounded-xl bg-[#176B67] text-[#F3EBDD] dark:bg-[#C8F169] dark:text-[#080A09] disabled:opacity-40 text-xs font-bold transition flex items-center gap-1.5 shadow-sm",
								children: isAnalyzing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Scanning..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Analyze Library" })] })
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "text-xs font-mono font-black uppercase tracking-wider text-[#176B67] dark:text-[#C8F169] flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDrive, { className: "w-4 h-4 text-[#176B67] dark:text-[#C8F169]" }), " Storage & Cache"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 rounded-3xl bg-[#E8DDC9]/70 dark:bg-[#141815]/80 backdrop-blur-2xl border border-[#292820]/10 dark:border-white/10 space-y-4 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-[#777267] dark:text-[#92998F]",
								children: "Audio Storage Used"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xl font-extrabold text-[#292820] dark:text-[#E8E9DD] font-mono mt-0.5",
								children: formatFileSize(storageStats.trackBytes)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-[#777267] dark:text-[#92998F]",
									children: "Total Offline Songs"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xl font-extrabold text-[#292820] dark:text-[#E8E9DD] font-mono mt-0.5",
									children: storageStats.trackCount
								})]
							})]
						}),
						storageStats.quotaBytes > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-[10px] text-[#777267] dark:text-[#92998F] font-mono",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Used: ", formatFileSize(storageStats.usedBytes)] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Available: ", formatFileSize(storageStats.quotaBytes)] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full h-2 rounded-full bg-[#E8DDC9] dark:bg-[#141815] overflow-hidden border border-[#292820]/5 dark:border-white/5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full bg-gradient-to-r from-[#176B67] to-[#C8F169] rounded-full",
									style: { width: `${Math.min(100, Math.max(2, storageStats.usedBytes / storageStats.quotaBytes * 100))}%` }
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-3 border-t border-[#292820]/10 dark:border-white/10 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs font-bold text-[#292820] dark:text-[#E8E9DD] flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3.5 h-3.5 text-[#176B67] dark:text-[#C8F169]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Duplicate Songs Cleaner" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-[#777267] dark:text-[#92998F] mt-0.5",
								children: "Detect redundant song uploads and recover local storage"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleScanDuplicates,
								className: "py-1.5 px-3 rounded-xl border border-[#176B67]/30 dark:border-[#C8F169]/30 bg-[#176B67]/10 dark:bg-[#C8F169]/10 text-[#176B67] dark:text-[#C8F169] hover:bg-[#176B67] hover:text-[#F3EBDD] dark:hover:bg-[#C8F169] dark:hover:text-[#080A09] text-xs font-bold transition flex items-center gap-1 active:scale-95",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Scan Duplicates" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 pt-2 border-t border-[#292820]/10 dark:border-white/10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] font-bold text-[#777267] dark:text-[#92998F] uppercase tracking-wider font-mono",
									children: "Database Backup & Sharing"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleExportBackup(false),
										className: "py-2.5 px-3 rounded-xl bg-[#E8DDC9] dark:bg-[#141815] hover:bg-[#C8F169]/20 text-[#292820] dark:text-[#E8E9DD] border border-[#292820]/10 dark:border-white/10 text-xs font-bold flex items-center justify-center gap-1.5 transition",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5 text-[#176B67] dark:text-[#C8F169]" }), "Export DB (.json)"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => backupFileInputRef.current?.click(),
										className: "py-2.5 px-3 rounded-xl bg-[#E8DDC9] dark:bg-[#141815] hover:bg-[#C8F169]/20 text-[#292820] dark:text-[#E8E9DD] border border-[#292820]/10 dark:border-white/10 text-xs font-bold flex items-center justify-center gap-1.5 transition",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-3.5 h-3.5 text-[#176B67] dark:text-[#C8F169]" }), "Restore DB File"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleExportBackup(true),
									className: "w-full py-2.5 px-3 rounded-xl bg-[#176B67] hover:bg-[#176B67]/90 text-[#F3EBDD] text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm active:scale-98",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "w-3.5 h-3.5 text-[#C8F169]" }), "Export Complete Audio Vault (for sharing)"]
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "text-xs font-mono font-black uppercase tracking-wider text-[#176B67] dark:text-[#C8F169] flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "w-4 h-4 text-[#176B67] dark:text-[#C8F169]" }), " Music Engines & Spotify Integration"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 rounded-3xl bg-[#E8DDC9]/70 dark:bg-[#141815]/80 backdrop-blur-2xl border border-[#292820]/10 dark:border-white/10 space-y-4 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-2xl bg-[#1DB954]/10 border border-[#1DB954]/30 space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2.5 h-2.5 rounded-full bg-[#1DB954] animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-[#1DB954] uppercase tracking-wider font-mono",
										children: "Spotify Search & Playlist Engine: Active"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-2 py-0.5 rounded-full bg-[#1DB954]/20 text-[#1DB954] text-[10px] font-mono font-bold",
									children: "Direct / No Token"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#292820]/80 dark:text-[#E8E9DD]/80 leading-relaxed",
								children: "Available in the Search tab. Resolves public Spotify track, playlist, and album links without requiring personal API keys or developer accounts."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm font-bold text-[#292820] dark:text-[#E8E9DD] flex items-center gap-1.5",
								children: ["Modular X2 Engine", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-2 py-0.5 rounded-full bg-[#C8F169]/20 text-[#176B67] dark:text-[#C8F169] text-[10px] font-mono font-bold",
									children: "Local Cache + Hub Active"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#777267] dark:text-[#92998F] leading-relaxed",
								children: "Prioritized audio resolution: checks your verified local IndexedDB cache first (0ms, 0 network cost), queries your Telegram Hub (inspired by @MusicsHuntersbot), then falls back to Jamendo Open Music, Internet Archive, and Free Music Archive."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setIsBenchmarkModalOpen(true),
								className: "py-2.5 px-3 rounded-2xl bg-[#E8DDC9] dark:bg-[#141815] hover:bg-[#C8F169]/20 border border-[#292820]/10 dark:border-white/10 text-[#292820] dark:text-[#E8E9DD] text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-3.5 h-3.5 text-[#176B67] dark:text-[#C8F169]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Real Track Benchmark" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setIsSpotDLModalOpen(true),
								className: "py-2.5 px-3 rounded-2xl bg-[#E8DDC9] dark:bg-[#141815] hover:bg-[#C8F169]/20 border border-[#292820]/10 dark:border-white/10 text-[#292820] dark:text-[#E8E9DD] text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "w-3.5 h-3.5 text-[#176B67] dark:text-[#C8F169]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "spotDL Evaluation" })]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "text-xs font-mono font-black uppercase tracking-wider text-[#176B67] dark:text-[#C8F169] flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4 text-[#176B67] dark:text-[#C8F169]" }), " Offline & Device Status"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 rounded-3xl bg-[#E8DDC9]/70 dark:bg-[#141815]/80 backdrop-blur-2xl border border-[#292820]/10 dark:border-white/10 space-y-3 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-[#292820] dark:text-[#E8E9DD]",
								children: "iPhone Installation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-[#777267] dark:text-[#92998F]",
								children: isInstalled ? "Running as installed Home Screen PWA" : "Running in browser tab"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setIsInstallModalOpen(true),
							className: "px-3.5 py-1.5 rounded-xl bg-[#E8DDC9] dark:bg-[#141815] hover:bg-[#C8F169]/20 border border-[#292820]/10 dark:border-white/10 text-[#292820] dark:text-[#E8E9DD] text-xs font-bold flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-3.5 h-3.5 text-[#176B67] dark:text-[#C8F169]" }), isInstalled ? "Instructions" : "Install Guide"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2 border-t border-[#292820]/10 dark:border-white/10 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-[#292820] dark:text-[#E8E9DD]",
								children: "Offline Playback Audit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: runOfflineDiagnostic,
								disabled: isTestingOffline,
								className: "px-3 py-1.5 rounded-xl bg-[#176B67] text-[#F3EBDD] dark:bg-[#C8F169] dark:text-[#080A09] text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50",
								children: [isTestingOffline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5" }), "Run Audit"]
							})]
						}), diagnosticResult && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-3 rounded-2xl bg-[#F3EBDD]/70 dark:bg-[#080A09]/70 border border-[#292820]/10 dark:border-white/10 text-[11px] text-[#292820] dark:text-[#E8E9DD] leading-relaxed font-mono",
							children: diagnosticResult
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "space-y-3 pt-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-3xl bg-[#E8DDC9]/70 dark:bg-[#141815]/80 backdrop-blur-2xl border border-red-500/20 dark:border-red-500/30 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-3.5 h-3.5" }), " Reset Local Data"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-[#777267] dark:text-[#92998F]",
							children: "Clear all IndexedDB audio files and playlists."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setIsClearDataModalOpen(true),
						className: "px-3.5 py-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-600 dark:text-red-400 border border-red-500/30 text-xs font-bold transition active:scale-95 shrink-0",
						children: "Clear Data"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center pt-2 pb-6 text-[11px] text-[#777267] dark:text-[#92998F] space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-bold text-[var(--btt-accent)] font-mono",
					children: "btmu by Ahmed"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					APP_NAME,
					" v",
					APP_VERSION,
					" • iOS Edition • Built ",
					BUILD_DATE
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PWAInstallModal, {
				isOpen: isInstallModalOpen,
				onClose: () => setIsInstallModalOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmModal, {
				isOpen: isClearDataModalOpen,
				title: "Clear All Local Music & Data?",
				description: "Are you sure? This will remove all downloaded songs, audio files, playlists, and settings from your device. This cannot be undone.",
				confirmLabel: "Clear Everything",
				isDestructive: true,
				onConfirm: handleClearAll,
				onCancel: () => setIsClearDataModalOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DuplicatesModal, {
				isOpen: isDuplicatesModalOpen,
				onClose: () => setIsDuplicatesModalOpen(false),
				duplicateGroups,
				onDuplicatesRemoved: () => {
					setDuplicateGroups([]);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotDLInfoModal, {
				isOpen: isSpotDLModalOpen,
				onClose: () => setIsSpotDLModalOpen(false),
				bridgeUrl: spotDLBridgeUrl,
				onSaveBridgeUrl: (url) => {
					setSpotDLBridgeUrl(url);
					localStorage.setItem("btt_spotdl_bridge_url", url);
					showToast("Updated spotDL bridge configuration");
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X2BenchmarkModal, {
				isOpen: isBenchmarkModalOpen,
				onClose: () => setIsBenchmarkModalOpen(false),
				settings: {
					matchingThreshold: 70,
					enableJamendo: true,
					enableInternetArchive: true,
					enableFMA: true,
					enableTelegramMatch: true,
					enableSpotDLBridge: !!spotDLBridgeUrl,
					spotDLBridgeUrl,
					spotifyClientId: localStorage.getItem("btt_spotify_client_id") || "",
					spotifyClientSecret: localStorage.getItem("btt_spotify_client_secret") || "",
					requireConfirmationForMedium: true,
					preferLocalCache: true,
					maxRetries: 2
				}
			})
		]
	});
};
export { SettingsScreen };
