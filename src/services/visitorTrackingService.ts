export interface VisitorStats {
  totalUniqueVisitors: number | null;
  liveVisitors: number;
  isLive: boolean;
  isLoading: boolean;
  isFirebaseConnected: boolean;
  visitorUid?: string;
  error?: string | null;
}

const COUNTER_API_BASE = 'https://counterapi.com/api';
const COUNTER_NAMESPACE = 'ravi3700.github.io-Ravi_003';
const TOTAL_ACTION = 'view';
const TOTAL_KEY = 'portfolio';

// IMPORTANT: presence is deliberately a separate action. We count presence
// events (not CounterAPI's unique-user hash) because unique aggregation can
// collapse multiple devices behind the same network/user hash.
const PRESENCE_ACTION = 'portfolioPresence';
const ACTIVE_WINDOW = '5m';
const PRESENCE_INTERVAL = 4 * 60_000;
const PRESENCE_LOCK_TTL = 2 * 60_000;
const VISITOR_ID_KEY = 'portfolio_visitor_id';
const PRESENCE_LOCK_KEY = 'portfolio_presence_owner';

type CounterResponse = {
  value?: number;
  abv?: string;
};

function getVisitorId(): string {
  try {
    const existing = window.localStorage.getItem(VISITOR_ID_KEY);
    if (existing) return existing;

    const id =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    window.localStorage.setItem(VISITOR_ID_KEY, id);
    return id;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

function ownsPresenceLock(visitorId: string): boolean {
  try {
    const now = Date.now();
    const current = window.localStorage.getItem(PRESENCE_LOCK_KEY);

    if (current) {
      const [owner, timestamp] = current.split('|');
      const lockTime = Number(timestamp);

      if (owner !== visitorId && Number.isFinite(lockTime) && now - lockTime < PRESENCE_LOCK_TTL) {
        return false;
      }
    }

    window.localStorage.setItem(PRESENCE_LOCK_KEY, `${visitorId}|${now}`);
    return true;
  } catch {
    return true;
  }
}

async function readCounter(url: string): Promise<number> {
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Counter API returned HTTP ${response.status}`);
  }

  const data = (await response.json()) as CounterResponse;

  if (typeof data.value !== 'number') {
    throw new Error('Counter API returned an invalid value');
  }

  return data.value;
}

function apiUrl(
  action: string,
  key: string,
  params: Record<string, string | boolean> = {}
): string {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([name, value]) => {
    search.set(name, String(value));
  });

  return `${COUNTER_API_BASE}/${encodeURIComponent(COUNTER_NAMESPACE)}/${encodeURIComponent(action)}/${encodeURIComponent(key)}?${search.toString()}`;
}

export class VisitorTrackingService {
  private static instance: VisitorTrackingService;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  public static getInstance(): VisitorTrackingService {
    if (!VisitorTrackingService.instance) {
      VisitorTrackingService.instance = new VisitorTrackingService();
    }
    return VisitorTrackingService.instance;
  }

  public async startTracking(
    onStatsUpdate: (stats: Partial<VisitorStats>) => void
  ): Promise<void> {
    this.cleanup();

    onStatsUpdate({
      totalUniqueVisitors: null,
      liveVisitors: 0,
      isLive: false,
      isLoading: true,
      isFirebaseConnected: false,
      error: null,
    });

    const visitorId = getVisitorId();

    try {
      const totalUniqueVisitors = await readCounter(
        apiUrl(TOTAL_ACTION, TOTAL_KEY, {
          unique: true,
          userId: visitorId,
        })
      );

      const sendPresence = async () => {
        if (!ownsPresenceLock(visitorId)) {
          return;
        }

        try {
          // One presence event per active browser/device every 4 minutes.
          // The 5-minute aggregation window therefore contributes ~1 event
          // per active device instead of collapsing devices by IP/user hash.
          await readCounter(
            apiUrl(PRESENCE_ACTION, TOTAL_KEY, {
              userId: visitorId,
            })
          );

          const liveVisitors = await readCounter(
            apiUrl(PRESENCE_ACTION, 'any', {
              timeline: ACTIVE_WINDOW,
              unique: false,
            })
          );

          onStatsUpdate({
            totalUniqueVisitors,
            liveVisitors,
            isLive: true,
            isLoading: false,
            isFirebaseConnected: false,
            visitorUid: visitorId,
            error: null,
          });
        } catch (error) {
          console.warn('[Visitor Counter] Presence update failed:', error);
          onStatsUpdate({
            totalUniqueVisitors,
            liveVisitors: 0,
            isLive: false,
            isLoading: false,
            visitorUid: visitorId,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      };

      await sendPresence();
      this.heartbeatInterval = setInterval(sendPresence, PRESENCE_INTERVAL);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn('[Visitor Counter] Initialization failed:', message);

      onStatsUpdate({
        totalUniqueVisitors: null,
        liveVisitors: 0,
        isLive: false,
        isLoading: false,
        isFirebaseConnected: false,
        visitorUid: visitorId,
        error: message,
      });
    }
  }

  public cleanup(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}

export const visitorTracker = VisitorTrackingService.getInstance();
