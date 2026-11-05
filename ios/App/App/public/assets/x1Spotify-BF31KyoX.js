// src/services/playlistImport/x1Spotify.ts
/**
* Extracts Spotify target (type and ID) from various URL and URI forms:
* - https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=...
* - https://open.spotify.com/intl-fr/playlist/37i9dQZF1DXcBWIGoYBM5M
* - https://open.spotify.com/album/4aawyAB9vmqN3uQ7FjRGTy
* - spotify:playlist:37i9dQZF1DXcBWIGoYBM5M
* - 37i9dQZF1DXcBWIGoYBM5M
*/
function parseSpotifyTarget(input) {
	if (!input) return null;
	const trimmed = input.trim();
	const uriMatch = trimmed.match(/^spotify:(playlist|album|track):([a-zA-Z0-9]+)/);
	if (uriMatch) return {
		type: uriMatch[1],
		id: uriMatch[2]
	};
	const urlMatch = trimmed.match(/open\.spotify\.com\/(?:intl-[a-zA-Z-]+\/)?(playlist|album|track)\/([a-zA-Z0-9]+)/);
	if (urlMatch) return {
		type: urlMatch[1],
		id: urlMatch[2]
	};
	if (/^[a-zA-Z0-9]{22}$/.test(trimmed)) return {
		type: "playlist",
		id: trimmed
	};
	return null;
}
function parseSpotifyPlaylistId(input) {
	const target = parseSpotifyTarget(input);
	return target ? target.id : null;
}
/**
* X1: Resolves Spotify playlist or album metadata without asking the user for API credentials.
* Utilizes the public embed metadata resolver (inspired by Unstream's keyless architecture).
*
* Conforms to exact X1 normalized schema:
* {
*   source: "spotify",
*   playlistTitle: string,
*   tracks: [
*     { title, artists, album, durationMs, isrc, artworkUrl, position }
*   ]
* }
*/
async function fetchSpotifyPlaylist(playlistUrlOrId, config) {
	const target = parseSpotifyTarget(playlistUrlOrId);
	if (!target) throw new Error("Invalid Spotify link. Please paste a valid Spotify playlist or album URL (e.g. https://open.spotify.com/playlist/...)");
	try {
		const res = await fetch(`/api/spotify/playlist?id=${encodeURIComponent(target.id)}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				url: playlistUrlOrId,
				id: target.id,
				clientId: config?.clientId?.trim() || void 0,
				clientSecret: config?.clientSecret?.trim() || void 0
			})
		});
		const data = await res.json().catch(() => ({}));
		if (res.ok && data.tracks && Array.isArray(data.tracks) && data.tracks.length > 0) return {
			source: "spotify",
			playlistTitle: data.playlistTitle || "Spotify Playlist",
			playlistDescription: data.playlistDescription || "",
			playlistCoverUrl: data.playlistCoverUrl || void 0,
			externalUrl: data.externalUrl || `https://open.spotify.com/${target.type}/${target.id}`,
			totalTracks: data.totalTracks || data.tracks.length,
			tracks: data.tracks
		};
		if (data.details || data.error) throw new Error(data.details || data.error);
	} catch (err) {
		if (err instanceof Error && !err.message.includes("Failed to fetch")) throw err;
	}
	try {
		const embedUrl = `https://open.spotify.com/embed/${target.type}/${target.id}`;
		const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(embedUrl)}`;
		const clientRes = await fetch(proxyUrl);
		if (clientRes.ok) {
			const match = (await clientRes.text()).match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
			if (match) {
				const entity = JSON.parse(match[1]).props?.pageProps?.state?.data?.entity;
				if (entity && Array.isArray(entity.trackList) && entity.trackList.length > 0) {
					const playlistTitle = entity.title || entity.name || "Spotify Playlist";
					const coverUrl = entity.visualIdentity?.image?.[entity.visualIdentity.image.length - 1]?.url || entity.coverArt?.sources?.[0]?.url || null;
					const tracks = entity.trackList.map((item, index) => {
						const artists = item.subtitle ? item.subtitle.split(/,\s*|\s*,\s*/).map((a) => a.trim()).filter(Boolean) : ["Unknown Artist"];
						return {
							title: item.title || "Unknown Title",
							artists: artists.length > 0 ? artists : ["Unknown Artist"],
							album: playlistTitle,
							durationMs: typeof item.duration === "number" ? item.duration : 0,
							isrc: null,
							artworkUrl: coverUrl,
							position: index
						};
					});
					return {
						source: "spotify",
						playlistTitle,
						playlistDescription: entity.subtitle || "",
						playlistCoverUrl: coverUrl || void 0,
						externalUrl: `https://open.spotify.com/${target.type}/${target.id}`,
						totalTracks: tracks.length,
						tracks
					};
				}
			}
		}
	} catch {}
	throw new Error("Unable to resolve Spotify playlist. Ensure the playlist is Public and not Private or Deleted on Spotify.");
}
export { parseSpotifyPlaylistId as n, fetchSpotifyPlaylist as t };
