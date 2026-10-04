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
const HEARTBEAT_ACTION = 'heartbeat';
const ACTIVE_WINDOW = '5m';
const VISITOR_ID_KEY = 'portfolio_visitor_id';

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
      // One persistent anonymous ID per browser/device. CounterAPI uses this
      // ID for unique-user aggregation instead of treating every heartbeat
      // as a new visitor.
      const totalUniqueVisitors = await readCounter(
        apiUrl(TOTAL_ACTION, TOTAL_KEY, {
          unique: true,
          userId: visitorId,
        })
      );

      const sendHeartbeat = async () => {
        try {
          await readCounter(
            apiUrl(HEARTBEAT_ACTION, TOTAL_KEY, {
              userId: visitorId,
            })
          );

          const liveVisitors = await readCounter(
            apiUrl('any', 'any', {
              timeline: ACTIVE_WINDOW,
              unique: true,
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
          console.warn('[Visitor Counter] Heartbeat failed:', error);
          onStatsUpdate({
            totalUniqueVisitors,
            isLive: true,
            isLoading: false,
            visitorUid: visitorId,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      };

      // Register this device immediately, then keep it alive every minute.
      await sendHeartbeat();

      this.heartbeatInterval = setInterval(sendHeartbeat, 60_000);
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
