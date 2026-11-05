import { r as __exportAll } from "./rolldown-runtime-DQp2zzRu.js";
// src/services/db.ts
var db_exports = /* @__PURE__ */ __exportAll({
	clearAllData: () => clearAllData,
	deletePlaylist: () => deletePlaylist,
	deleteTrack: () => deleteTrack,
	deleteTracks: () => deleteTracks,
	exportLibraryBackup: () => exportLibraryBackup,
	findVerifiedCachedTrack: () => findVerifiedCachedTrack,
	getAllPlaylists: () => getAllPlaylists,
	getAllTrackAnalyses: () => getAllTrackAnalyses,
	getAllTracks: () => getAllTracks,
	getAudioBlob: () => getAudioBlob,
	getDB: () => getDB,
	getSetting: () => getSetting,
	getStorageEstimate: () => getStorageEstimate,
	getTrack: () => getTrack,
	importLibraryBackup: () => importLibraryBackup,
	isTrackInLibrary: () => isTrackInLibrary,
	normalizeRecordingText: () => normalizeRecordingText,
	savePlaylist: () => savePlaylist,
	saveSetting: () => saveSetting,
	saveTrack: () => saveTrack,
	saveTrackAnalysis: () => saveTrackAnalysis,
	updateTrackMetadata: () => updateTrackMetadata
});
var DB_NAME = "MyMusicDB";
var DB_VERSION = 2;
var dbPromise = null;
function getDB() {
	if (dbPromise) return dbPromise;
	dbPromise = new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);
		request.onupgradeneeded = (event) => {
			const db = event.target.result;
			if (!db.objectStoreNames.contains("tracks")) {
				const trackStore = db.createObjectStore("tracks", { keyPath: "id" });
				trackStore.createIndex("title", "title", { unique: false });
				trackStore.createIndex("artist", "artist", { unique: false });
				trackStore.createIndex("album", "album", { unique: false });
				trackStore.createIndex("downloadDate", "downloadDate", { unique: false });
				trackStore.createIndex("isFavorite", "isFavorite", { unique: false });
				trackStore.createIndex("lastPlayedAt", "lastPlayedAt", { unique: false });
			}
			if (!db.objectStoreNames.contains("audioBlobs")) db.createObjectStore("audioBlobs", { keyPath: "id" });
			if (!db.objectStoreNames.contains("playlists")) {
				const playlistStore = db.createObjectStore("playlists", { keyPath: "id" });
				playlistStore.createIndex("name", "name", { unique: false });
				playlistStore.createIndex("sourceType", "sourceType", { unique: false });
			}
			if (!db.objectStoreNames.contains("settings")) db.createObjectStore("settings", { keyPath: "key" });
			if (!db.objectStoreNames.contains("syncHistory")) db.createObjectStore("syncHistory", { keyPath: "fileIdentifier" });
			if (!db.objectStoreNames.contains("trackAnalysis")) db.createObjectStore("trackAnalysis", { keyPath: "trackId" }).createIndex("analyzedAt", "analyzedAt", { unique: false });
		};
		request.onsuccess = () => {
			const db = request.result;
			db.onclose = () => {
				dbPromise = null;
			};
			db.onversionchange = () => {
				try {
					db.close();
				} catch {}
				dbPromise = null;
			};
			resolve(db);
		};
		request.onerror = () => {
			dbPromise = null;
			reject(request.error || /* @__PURE__ */ new Error("Failed to open IndexedDB"));
		};
		request.onblocked = () => {
			dbPromise = null;
		};
	});
	return dbPromise;
}
async function getAllTracks() {
	const db = await getDB();
	return new Promise((resolve, reject) => {
		const request = db.transaction("tracks", "readonly").objectStore("tracks").getAll();
		request.onsuccess = () => {
			const tracks = request.result || [];
			tracks.sort((a, b) => b.downloadDate - a.downloadDate);
			resolve(tracks);
		};
		request.onerror = () => reject(request.error);
	});
}
async function getTrack(id) {
	const db = await getDB();
	return new Promise((resolve, reject) => {
		const request = db.transaction("tracks", "readonly").objectStore("tracks").get(id);
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}
async function saveTrack(track, audioBlob) {
	const db = await getDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction([
			"tracks",
			"audioBlobs",
			"syncHistory"
		], "readwrite");
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
		tx.onabort = () => reject(/* @__PURE__ */ new Error("Transaction aborted"));
		tx.objectStore("tracks").put(track);
		tx.objectStore("audioBlobs").put({
			id: track.id,
			blob: audioBlob
		});
		const identifier = track.telegramSource?.fileId || track.fileHash || track.fileName;
		if (identifier) tx.objectStore("syncHistory").put({
			fileIdentifier: identifier,
			trackId: track.id,
			savedAt: Date.now()
		});
	});
}
/**
* Normalizes title and artist strings for exact and fuzzy persistent cache matching
*/
function normalizeRecordingText(text) {
	if (!text) return "";
	return text.toLowerCase().replace(/\((?:feat|ft|official|remaster|live|radio|deluxe|version|audio|video|explicit)[^)]*\)/gi, "").replace(/\[(?:feat|ft|official|remaster|live|radio|deluxe|version|audio|video|explicit)[^\]]*\]/gi, "").replace(/\s+(feat\.|ft\.|featuring)\s+.*$/i, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
/**
* Checks existing local library before performing any network request.
* Strictly verifies that the actual audio blob exists in IndexedDB and is readable (size > 1024 bytes).
* Never claims a track is cached unless the audio file is genuinely present and playable.
*/
async function findVerifiedCachedTrack(title, artist, durationMs) {
	const normTitle = normalizeRecordingText(title);
	const normArtist = normalizeRecordingText(artist);
	if (!normTitle) return null;
	const tracks = await getAllTracks();
	const requestedSec = durationMs ? Math.round(durationMs / 1e3) : 0;
	for (const track of tracks) {
		const tTitle = normalizeRecordingText(track.title);
		const tArtist = normalizeRecordingText(track.artist);
		const titleMatch = tTitle === normTitle || normTitle.length > 4 && (tTitle.includes(normTitle) || normTitle.includes(tTitle));
		const artistMatch = !normArtist || tArtist === normArtist || tArtist.includes(normArtist) || normArtist.includes(tArtist);
		if (titleMatch && artistMatch) {
			if (requestedSec > 0 && track.duration > 0) {
				if (Math.abs(track.duration - requestedSec) > 18) continue;
			}
			const blob = await getAudioBlob(track.id);
			if (blob && blob.size > 1024) return {
				track,
				blob
			};
		}
	}
	return null;
}
async function updateTrackMetadata(track) {
	const db = await getDB();
	return new Promise((resolve, reject) => {
		const request = db.transaction("tracks", "readwrite").objectStore("tracks").put(track);
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}
async function deleteTrack(id) {
	const db = await getDB();
	return new Promise((resolve, reject) => {
		const stores = [
			"tracks",
			"audioBlobs",
			"playlists"
		];
		if (db.objectStoreNames.contains("trackAnalysis")) stores.push("trackAnalysis");
		const tx = db.transaction(stores, "readwrite");
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
		tx.objectStore("tracks").delete(id);
		tx.objectStore("audioBlobs").delete(id);
		if (db.objectStoreNames.contains("trackAnalysis")) tx.objectStore("trackAnalysis").delete(id);
		const playlistStore = tx.objectStore("playlists");
		const req = playlistStore.getAll();
		req.onsuccess = () => {
			const playlists = req.result;
			for (const pl of playlists) if (pl.trackIds.includes(id)) {
				pl.trackIds = pl.trackIds.filter((tId) => tId !== id);
				pl.updatedAt = Date.now();
				playlistStore.put(pl);
			}
		};
	});
}
async function deleteTracks(ids) {
	if (ids.length === 0) return;
	const db = await getDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction([
			"tracks",
			"audioBlobs",
			"playlists"
		], "readwrite");
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
		const trackStore = tx.objectStore("tracks");
		const blobStore = tx.objectStore("audioBlobs");
		for (const id of ids) {
			trackStore.delete(id);
			blobStore.delete(id);
		}
		const playlistStore = tx.objectStore("playlists");
		const req = playlistStore.getAll();
		req.onsuccess = () => {
			const playlists = req.result;
			const idSet = new Set(ids);
			for (const pl of playlists) {
				const originalLen = pl.trackIds.length;
				pl.trackIds = pl.trackIds.filter((tId) => !idSet.has(tId));
				if (pl.trackIds.length !== originalLen) {
					pl.updatedAt = Date.now();
					playlistStore.put(pl);
				}
			}
		};
	});
}
async function getAudioBlob(id) {
	const db = await getDB();
	return new Promise((resolve, reject) => {
		const request = db.transaction("audioBlobs", "readonly").objectStore("audioBlobs").get(id);
		request.onsuccess = () => {
			if (request.result && request.result.blob) resolve(request.result.blob);
			else resolve(null);
		};
		request.onerror = () => reject(request.error);
	});
}
async function getAllPlaylists() {
	const db = await getDB();
	return new Promise((resolve, reject) => {
		const request = db.transaction("playlists", "readonly").objectStore("playlists").getAll();
		request.onsuccess = () => {
			const list = request.result || [];
			list.sort((a, b) => b.updatedAt - a.updatedAt);
			resolve(list);
		};
		request.onerror = () => reject(request.error);
	});
}
async function savePlaylist(playlist) {
	const db = await getDB();
	return new Promise((resolve, reject) => {
		const request = db.transaction("playlists", "readwrite").objectStore("playlists").put(playlist);
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}
async function deletePlaylist(id) {
	const db = await getDB();
	return new Promise((resolve, reject) => {
		const request = db.transaction("playlists", "readwrite").objectStore("playlists").delete(id);
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}
async function getSetting(key, defaultValue) {
	const db = await getDB();
	return new Promise((resolve) => {
		try {
			const request = db.transaction("settings", "readonly").objectStore("settings").get(key);
			request.onsuccess = () => {
				if (request.result !== void 0 && request.result.value !== void 0) resolve(request.result.value);
				else resolve(defaultValue);
			};
			request.onerror = () => resolve(defaultValue);
		} catch {
			resolve(defaultValue);
		}
	});
}
async function saveSetting(key, value) {
	const db = await getDB();
	return new Promise((resolve, reject) => {
		const request = db.transaction("settings", "readwrite").objectStore("settings").put({
			key,
			value
		});
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}
async function isTrackInLibrary(fileId, fileUniqueId, fileName) {
	try {
		return (await getAllTracks()).some((t) => {
			if (fileUniqueId && (t.fileHash === fileUniqueId || t.telegramSource?.fileId === fileUniqueId)) return true;
			if (fileId && (t.telegramSource?.fileId === fileId || t.fileHash === fileId)) return true;
			if (fileName && t.fileName === fileName) return true;
			return false;
		});
	} catch {
		return false;
	}
}
async function getStorageEstimate() {
	let quota = 0;
	let usage = 0;
	if (navigator.storage && navigator.storage.estimate) try {
		const estimate = await navigator.storage.estimate();
		quota = estimate.quota || 0;
		usage = estimate.usage || 0;
	} catch {}
	const tracks = await getAllTracks();
	const trackBytes = tracks.reduce((acc, t) => acc + (t.fileSize || 0), 0);
	return {
		quotaBytes: quota,
		usedBytes: Math.max(usage, trackBytes),
		trackCount: tracks.length,
		trackBytes
	};
}
async function exportLibraryBackup(includeAudio = false) {
	const tracks = await getAllTracks();
	const playlists = await getAllPlaylists();
	const analyses = await getAllTrackAnalyses();
	const backup = {
		appName: "Btt Music",
		version: 2,
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		tracks,
		playlists,
		trackAnalyses: analyses
	};
	if (includeAudio) {
		const audioBlobsMap = {};
		for (const track of tracks) {
			const blob = await getAudioBlob(track.id);
			if (blob) {
				const dataUrl = await new Promise((resolve) => {
					const reader = new FileReader();
					reader.onloadend = () => resolve(reader.result);
					reader.readAsDataURL(blob);
				});
				audioBlobsMap[track.id] = dataUrl;
			}
		}
		backup.audioBlobs = audioBlobsMap;
	}
	return JSON.stringify(backup, null, 2);
}
async function importLibraryBackup(backupData) {
	const data = typeof backupData === "string" ? JSON.parse(backupData) : backupData;
	if (!data.tracks || !Array.isArray(data.tracks)) throw new Error("Invalid music database backup: missing tracks array");
	const db = await getDB();
	let tracksRestored = 0;
	let playlistsRestored = 0;
	let audioBlobsRestored = 0;
	for (const track of data.tracks) {
		await updateTrackMetadata(track);
		tracksRestored++;
	}
	if (data.audioBlobs && typeof data.audioBlobs === "object") for (const [trackId, dataUrl] of Object.entries(data.audioBlobs)) try {
		const blob = await (await fetch(dataUrl)).blob();
		await new Promise((resolve, reject) => {
			const req = db.transaction("audioBlobs", "readwrite").objectStore("audioBlobs").put({
				id: trackId,
				blob
			});
			req.onsuccess = () => resolve();
			req.onerror = () => reject(req.error);
		});
		audioBlobsRestored++;
	} catch (err) {
		console.warn("Failed restoring audio blob for track:", trackId, err);
	}
	if (data.playlists && Array.isArray(data.playlists)) for (const pl of data.playlists) {
		await savePlaylist(pl);
		playlistsRestored++;
	}
	if (data.trackAnalyses && typeof data.trackAnalyses === "object") for (const analysis of Object.values(data.trackAnalyses)) await saveTrackAnalysis(analysis);
	return {
		tracksRestored,
		playlistsRestored,
		audioBlobsRestored
	};
}
async function clearAllData() {
	const db = await getDB();
	return new Promise((resolve, reject) => {
		const stores = [
			"tracks",
			"audioBlobs",
			"playlists",
			"settings",
			"syncHistory"
		];
		if (db.objectStoreNames.contains("trackAnalysis")) stores.push("trackAnalysis");
		const tx = db.transaction(stores, "readwrite");
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
		tx.objectStore("tracks").clear();
		tx.objectStore("audioBlobs").clear();
		tx.objectStore("playlists").clear();
		tx.objectStore("settings").clear();
		tx.objectStore("syncHistory").clear();
		if (db.objectStoreNames.contains("trackAnalysis")) tx.objectStore("trackAnalysis").clear();
	});
}
async function getAllTrackAnalyses() {
	const db = await getDB();
	if (!db.objectStoreNames.contains("trackAnalysis")) return {};
	return new Promise((resolve) => {
		try {
			const request = db.transaction("trackAnalysis", "readonly").objectStore("trackAnalysis").getAll();
			request.onsuccess = () => {
				const list = request.result || [];
				const map = {};
				for (const item of list) map[item.trackId] = item;
				resolve(map);
			};
			request.onerror = () => resolve({});
		} catch {
			resolve({});
		}
	});
}
async function saveTrackAnalysis(analysis) {
	const db = await getDB();
	if (!db.objectStoreNames.contains("trackAnalysis")) return;
	return new Promise((resolve, reject) => {
		const request = db.transaction("trackAnalysis", "readwrite").objectStore("trackAnalysis").put(analysis);
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}
export { saveSetting as _, deleteTracks as a, updateTrackMetadata as b, getAllPlaylists as c, getAudioBlob as d, getSetting as f, savePlaylist as g, isTrackInLibrary as h, deleteTrack as i, getAllTrackAnalyses as l, importLibraryBackup as m, db_exports as n, exportLibraryBackup as o, getStorageEstimate as p, deletePlaylist as r, findVerifiedCachedTrack as s, clearAllData as t, getAllTracks as u, saveTrack as v, saveTrackAnalysis as y };
