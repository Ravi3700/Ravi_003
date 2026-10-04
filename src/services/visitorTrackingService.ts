const COUNTER_API = 'https://counterapi.com/api';
const NAMESPACE = 'ravi003portfolio';
const TOTAL_ACTION = 'view';
const TOTAL_KEY = 'site';
const PRESENCE_ACTION = 'presence';
const PRESENCE_KEY = 'site';
const LIVE_AGGREGATE_ACTION = PRESENCE_ACTION;
const LIVE_AGGREGATE_KEY = PRESENCE_KEY;
const LIVE_WINDOW = '2m';
const POLL_INTERVAL_MS = 10000;
const HEARTBEAT_INTERVAL_MS = 20000;

export interface VisitorStats {
  totalUniqueVisitors: number | null;
  liveVisitors: number;
  isLive: boolean;
  isLoading: boolean;
  isFirebaseConnected: boolean;
  visitorUid?: string;
  error?: string | null;
}

const UNCONFIGURED_STATS: VisitorStats = {
  totalUniqueVisitors: null,
  liveVisitors: 0,
  isLive: false,
  isLoading: false,
  isFirebaseConnected: false,
};

function getVisitorId(): string {
  const storageKey = 'ravi003_visitor_id';
  try {
    const existing = window.localStorage.getItem(storageKey);
    if (existing) return existing;
    const id =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(storageKey, id);
    return id;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

async function counterRequest(
  action: string,
  key: string,
  params: Record<string, string | number | boolean> = {}
): Promise<any> {
  const url = new URL(
    `${COUNTER_API}/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(action)}/${encodeURIComponent(key)}`
  );

  Object.entries(params).forEach(([name, value]) => {
    url.searchParams.set(name, String(value));
  });

  // CounterAPI is accessed through a public GET endpoint. Add a cache-buster
  // so different devices never receive a stale aggregate response from an
  // intermediary cache/CDN.
  url.searchParams.set('_cb', `${Date.now()}-${Math.random().toString(36).slice(2)}`);

  const response = await fetch(url.toString(), {
    method: 'GET',
    cache: 'no-store',
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error(`Counter API request failed: ${response.status}`);
  }

  return response.json();
}

export class VisitorTrackingService {
  private static instance: VisitorTrackingService;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private pollingInterval: ReturnType<typeof setInterval> | null = null;
  private started = false;
  private visitorId: string | null = null;

  public static getInstance(): VisitorTrackingService {
    if (!VisitorTrackingService.instance) {
      VisitorTrackingService.instance = new VisitorTrackingService();
    }
    return VisitorTrackingService.instance;
  }

  public async startTracking(
    onStatsUpdate: (stats: Partial<VisitorStats>) => void
  ): Promise<void> {
    if (this.started) return;
    this.started = true;

    onStatsUpdate({
      ...UNCONFIGURED_STATS,
      isLoading: true,
    });

    if (typeof window === 'undefined') {
      onStatsUpdate({ ...UNCONFIGURED_STATS, isLoading: false });
      return;
    }

    this.visitorId = getVisitorId();

    try {
      // One event per browser/device identity. CounterAPI's unique aggregation
      // prevents refreshes from increasing the unique total for this identity.
      const total = await counterRequest(TOTAL_ACTION, TOTAL_KEY, {
        unique: true,
        userId: this.visitorId,
      });

      onStatsUpdate({
        totalUniqueVisitors: Number(total?.value ?? 0),
        isLive: true,
        isLoading: false,
        isFirebaseConnected: true,
        visitorUid: this.visitorId,
      });
    } catch (error) {
      console.warn('[Visitor Counter] Total counter error:', error);
      onStatsUpdate({
        totalUniqueVisitors: null,
        isLoading: false,
        isFirebaseConnected: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    let presenceConfirmed = false;

    const updatePresence = async () => {
      if (!this.visitorId) return false;
      try {
        await counterRequest(PRESENCE_ACTION, PRESENCE_KEY, {
          userId: this.visitorId,
          behavior: 'view',
          trackOnly: true,
        });
        presenceConfirmed = true;
        return true;
      } catch {
        presenceConfirmed = false;
        return false;
      }
    };

    const readLiveCount = async () => {
      try {
        const live = await counterRequest(LIVE_AGGREGATE_ACTION, LIVE_AGGREGATE_KEY, {
          timeline: LIVE_WINDOW,
          unique: true,
          readOnly: true,
        });

        const apiCount = Math.max(0, Number(live?.value ?? 0));

        onStatsUpdate({
          liveVisitors: apiCount,
          isLive: true,
          isFirebaseConnected: true,
          isLoading: false,
        });
      } catch (error) {
        console.warn('[Visitor Counter] Live counter error:', error);
      }
    };

    await updatePresence();
    await readLiveCount();

    this.heartbeatInterval = setInterval(updatePresence, HEARTBEAT_INTERVAL_MS);
    this.pollingInterval = setInterval(readLiveCount, POLL_INTERVAL_MS);

    const visibilityHandler = () => {
      if (document.visibilityState === 'visible') {
        updatePresence();
        readLiveCount();
      }
    };

    document.addEventListener('visibilitychange', visibilityHandler);

    const originalCleanup = this.cleanup.bind(this);
    this.cleanup = () => {
      document.removeEventListener('visibilitychange', visibilityHandler);
      originalCleanup();
    };
  }

  public cleanup(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.started = false;
  }
}

export const visitorTracker = VisitorTrackingService.getInstance();
