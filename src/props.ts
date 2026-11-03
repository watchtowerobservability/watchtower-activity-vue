// The <wt-activity> attribute and event contract shared by the framework wrappers (kept in step with
// @watchtowerobservability/activity-web; duplicated per wrapper so each package stays dependency-free).

/** Props of the activity log. Booleans become present or absent attributes. */
export interface ActivityLogProps {
  /** Viewer session token minted by your backend (`createViewerSession`); never a secret key. */
  session: string;
  /** Your Watchtower API URL (default: the page's origin). */
  baseUrl?: string;
  theme?: 'light' | 'dark' | 'system';
  accent?: string;
  density?: 'compact' | 'comfortable';
  /** Overrides the session's locale claim, for example `de` or `pt-BR`. */
  locale?: string;
  /** Live updates over SSE. */
  live?: boolean;
  /** Show Verify (needs the `verify` capability). */
  verify?: boolean;
  /** First page size: 25, 50 or 100. */
  pageSize?: number;
  /** Where the lazy extras chunk lives. */
  extrasUrl?: string;
  /** Base64 AES-256 key that opens client-side sealed values in the browser. */
  sealKey?: string;
}

const ATTRS: [keyof ActivityLogProps, string][] = [
  ['session', 'session'], ['baseUrl', 'base-url'], ['theme', 'theme'], ['accent', 'accent'], ['density', 'density'],
  ['locale', 'locale'], ['live', 'live'], ['verify', 'verify'], ['pageSize', 'page-size'], ['extrasUrl', 'extras-url'],
  ['sealKey', 'seal-key'],
];

/** Sets the element's attributes from props; unset, false and empty values remove the attribute. */
export function applyProps(el: Element, p: Partial<ActivityLogProps>): void {
  for (const [k, a] of ATTRS) {
    const v = p[k];
    const want = v === undefined || v === null || v === false || v === '' ? null : v === true ? '' : String(v);
    if (want === null) el.removeAttribute(a);
    else if (el.getAttribute(a) !== want) el.setAttribute(a, want);
  }
}

/** DOM events of <wt-activity> (CustomEvent, bubbling and composed). */
export const EVENTS = { open: 'wt-activity-open', load: 'wt-activity-load', error: 'wt-activity-error' } as const;

/** One activity event as the viewer feed returns it. */
export interface ActivityEvent {
  id: string;
  account_id: string;
  action: string;
  occurred_at: string;
  actor?: { id: string; name?: string; email?: string; type?: string };
  [field: string]: unknown;
}
/** `wt-activity-open`: the viewer opened an event's detail. */
export interface ActivityOpenDetail { event: ActivityEvent }
/** `wt-activity-load`: a page of the feed arrived. */
export interface ActivityLoadDetail { count: number; hasMore: boolean }
/** `wt-activity-error`: the feed failed (an expired session is status 401 or 404). */
export interface ActivityErrorDetail { message: string; status?: number }

/** The element's own API. */
export interface WtActivityElement extends HTMLElement { reload(): Promise<void> }
