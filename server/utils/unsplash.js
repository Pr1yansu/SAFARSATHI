const _fetch = typeof fetch === "function" ? fetch : (...args) => import('node-fetch').then(({default: f}) => f(...args));

/**
 * Search Unsplash for landscape travel images and return an array of URLs.
 * Requires process.env.UNSPLASH_ACCESS_KEY.
 * @param {object} opts
 * @param {string} opts.query
 * @param {number} [opts.perPage=30]
 * @returns {Promise<string[]>}
 */
async function searchUnsplashImages({ query, perPage = 30 } = {}) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    return [];
  }

  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query || "travel resort hotel");
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("content_filter", "high");
  url.searchParams.set("per_page", String(perPage));

  const res = await _fetch(url.toString(), {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
      "Accept-Version": "v1",
    },
  });
  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  if (!data || !Array.isArray(data.results)) return [];
  // Prefer regular size; fallbacks included
  return data.results
    .map((p) => (p && p.urls && (p.urls.regular || p.urls.full || p.urls.small)) || null)
    .filter(Boolean);
}

module.exports = { searchUnsplashImages };
