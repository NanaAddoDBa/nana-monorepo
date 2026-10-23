/**
 * Removes referral tags from the browser's entry URL without modifying route
 * parameters used by the rental flow.
 */
const clickIdentifiers = new Set([
  "fbclid",
  "gclid",
  "dclid",
  "gbraid",
  "wbraid",
  "msclkid",
  "ttclid",
  "twclid",
  "li_fat_id",
  "mc_cid",
  "mc_eid",
]);

function isTrackingParameter(key: string): boolean {
  const normalized = key.toLowerCase();
  return normalized.startsWith("utm_") || clickIdentifiers.has(normalized);
}

function removeTrackingParameters(params: URLSearchParams): boolean {
  let removed = false;

  for (const key of [...params.keys()]) {
    if (isTrackingParameter(key)) {
      params.delete(key);
      removed = true;
    }
  }

  return removed;
}

export function cleanInboundUrl(href: string): string {
  let url: URL;

  try {
    url = new URL(href);
  } catch {
    return href;
  }

  let updated = false;
  const outerParams = new URLSearchParams(url.search);

  if (removeTrackingParameters(outerParams)) {
    url.search = outerParams.toString();
    updated = true;
  }

  // HashRouter stores route-specific query parameters after #/...
  const fragment = url.hash.slice(1);
  const queryStart = fragment.indexOf("?");

  if (fragment.startsWith("/") && queryStart !== -1) {
    const route = fragment.slice(0, queryStart);
    const routeParams = new URLSearchParams(fragment.slice(queryStart + 1));

    if (removeTrackingParameters(routeParams)) {
      const remaining = routeParams.toString();
      url.hash = "#" + route + (remaining ? "?" + remaining : "");
      updated = true;
    }
  }

  return updated ? url.href : href;
}
