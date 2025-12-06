# HLS Proxy Setup Guide

## Installation

```bash
npm install hls.js
```

**Note:** If you're on Node <18 and your environment doesn't have global `fetch`, install:

```bash
npm install node-fetch
```

Then uncomment the import in `pages/api/proxy.ts`.

## Files Created

1. **`pages/api/proxy.ts`** - Next.js Pages Router API route that proxies HLS playlists and segments
2. **`components/SimpleHlsPlayer.tsx`** - React component that uses hls.js for HLS playback
3. **`pages/example-hls.tsx`** - Example usage page

## Usage

### Basic Usage

```tsx
import SimpleHlsPlayer from "../components/SimpleHlsPlayer";

export default function MyPage() {
	const remote = "https://example.com/playlist.m3u8";
	const proxied = `/api/proxy?url=${encodeURIComponent(remote)}`;

	return (
		<div style={{ width: 800, height: 450 }}>
			<SimpleHlsPlayer src={proxied} />
		</div>
	);
}
```

### How It Works

1. **Proxy Route** (`/api/proxy?url=...`):

   - Fetches the remote HLS playlist or segment
   - If it's a playlist (`.m3u8`), rewrites all segment URIs to go through the proxy
   - Streams segments directly to the browser
   - Handles CORS headers automatically

2. **Player Component**:
   - Dynamically imports `hls.js` for browsers that don't support native HLS
   - Falls back to native playback on Safari
   - Handles errors gracefully

## Security Notes

### ⚠️ Important: Host Whitelist

The proxy includes a **host whitelist** to prevent it from being used as an open proxy. By default, only these hosts are allowed:

- `amagi.tv`
- `playouts.now.amagi.tv`
- `s3.amazonaws.com`

### To Modify the Whitelist

Edit `pages/api/proxy.ts` and update the `HOST_WHITELIST` array:

```typescript
const HOST_WHITELIST = [
	"amagi.tv",
	"playouts.now.amagi.tv",
	"your-allowed-domain.com",
	// Add more as needed
];
```

### To Disable Whitelist (Development Only)

**⚠️ WARNING: Only do this in development!**

Comment out the whitelist check in `pages/api/proxy.ts`:

```typescript
// if (!isHostAllowed(target)) {
//   console.warn("Blocked proxy target (not in whitelist):", target);
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.status(403).send("Target host not allowed");
//   return;
// }
```

### Production Recommendations

1. **Always use HTTPS** - Serve your Next.js app over HTTPS
2. **Enable host whitelist** - Never disable the whitelist in production
3. **Add rate limiting** - Consider adding rate limiting to prevent abuse
4. **Cache playlists** - Consider caching `.m3u8` playlists (but not segments) to reduce load
5. **Monitor usage** - Log proxy requests to detect abuse

## Troubleshooting

### Video not loading?

1. Check browser console for errors
2. Check server logs for proxy errors
3. Verify the remote URL is accessible
4. Ensure the host is in the whitelist
5. Check Network tab to see if proxy requests are succeeding

### CORS errors?

The proxy should handle CORS automatically. If you see CORS errors:

- Verify the proxy route is working (`/api/proxy?url=...`)
- Check that `Access-Control-Allow-Origin: *` is being set

### Playlist not rewriting?

- Verify the `content-type` header includes `application/vnd.apple.mpegurl`
- Check that the URL ends with `.m3u8`
- Look for errors in server logs

## Example URLs

```typescript
// Direct m3u8 URL
const url1 = "https://example.com/playlist.m3u8";

// Proxied URL
const proxied1 = `/api/proxy?url=${encodeURIComponent(url1)}`;

// Using in component
<SimpleHlsPlayer src={proxied1} />;
```

