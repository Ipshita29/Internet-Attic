/** Returns a normalized http(s) URL string, or null when the input is not acceptable. */
export function normalizeUrl(input) {
  let value = String(input || '').trim();
  if (!value || /\s/.test(value)) return null;
  if (!/^https?:\/\//i.test(value)) {
    // reject any other scheme (javascript:, data:, ftp:, mailto: ...) rather than guessing
    if (/^[a-z][a-z0-9+.-]*:(?!\d)/i.test(value)) return null;
    value = `https://${value}`;
  }
  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    const host = url.hostname;
    if (host !== 'localhost' && !/^[^.]+(\.[^.]+)+$/.test(host)) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./i, '');
  } catch {
    return '';
  }
}

/** Key used to detect duplicates: ignores protocol, www, hash and trailing slash. */
export function urlKey(url) {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/\/+$/, '');
    return `${u.hostname.replace(/^www\./i, '').toLowerCase()}${path}${u.search}`;
  } catch {
    return String(url).toLowerCase();
  }
}

function humanize(segment) {
  let text = segment;
  try {
    text = decodeURIComponent(segment);
  } catch {
    /* keep raw segment */
  }
  text = text.replace(/\.(html?|php|aspx?)$/i, '').replace(/[-_+]+/g, ' ').trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
}

function prettyDomain(domain) {
  const root = domain.split('.').slice(0, -1).join('.') || domain;
  return root.charAt(0).toUpperCase() + root.slice(1);
}

/** Suggests a readable title from the URL alone; metadata cannot be fetched from the browser. */
export function suggestTitle(url) {
  try {
    const u = new URL(url);
    const domain = getDomain(url);
    const parts = u.pathname.split('/').filter(Boolean);
    if (/github\.com$/i.test(domain) && parts.length >= 2) return `${parts[0]}/${parts[1]}`;
    const last = parts[parts.length - 1];
    if (last && !/^\d+$/.test(last)) {
      const title = humanize(last);
      if (title.length > 3) return `${title} (${prettyDomain(domain)})`;
    }
    return prettyDomain(domain);
  } catch {
    return '';
  }
}

export function guessType(url) {
  const domain = getDomain(url).toLowerCase();
  if (/(^|\.)github\.com$|(^|\.)gitlab\.com$/.test(domain)) return 'github';
  if (/youtube\.com$|youtu\.be$|vimeo\.com$|twitch\.tv$/.test(domain)) return 'video';
  if (/dribbble\.com|behance\.net|pinterest\.|are\.na|awwwards\.com|mobbin\.com|siteinspire\.com|savee\.it/.test(domain))
    return 'design';
  if (/medium\.com|substack\.com|dev\.to|blog\.|css-tricks\.com|smashingmagazine\.com|nngroup\.com/.test(domain))
    return 'article';
  return 'website';
}

/** Opens an external link without leaking window.opener. */
export function openExternal(url) {
  const safe = normalizeUrl(url);
  if (!safe) return false;
  const win = window.open(safe, '_blank', 'noopener,noreferrer');
  if (win) win.opener = null;
  return true;
}
