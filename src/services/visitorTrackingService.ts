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
const ACTIVE_WINDOW = '5m';

const emptyStats = (): VisitorStats => ({
  totalUniqueVisitors: null,
  liveVisitors: 0,
  isLive: false,
  isLoading: false,
  isFirebaseConnected: false,
  error: null,
});

type CounterResponse = {
  value?: number;
  abv?: string;
};

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

export class VisitorTrackingService {
  private static instance: VisitorTrackingService;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  public static getInstance(): VisitorTrackingService {
    if (!VisitorTrackingService.instance) {
      VisitorTrackingService.instance = new VisitorTrackingService();
    }
    return VisitorTrackingService.instance;
  }

  /**
   * GitHub Pages is static, so the visitor counter must not depend on the
   * Express server or missing Firebase build secrets.
   *
   * CounterAPI provides a public HTTPS counter endpoint. Its unique=true
   * mode deduplicates visitors using an anonymous generated user hash.
   * The active counter uses a read-only 5-minute timeline.
   */
  public async startTracking(
    onStatsUpdate: (stats: Partial<VisitorStats>) => void
  ): Promise<void> {
    onStatsUpdate({
      ...emptyStats(),
      isLoading: true,
    });

    try {
      const totalUrl =
        `${COUNTER_API_BASE}/${encodeURIComponent(COUNTER_NAMESPACE)}/${TOTAL_ACTION}/${TOTAL_KEY}?unique=true`;

      // This request records the current visit and returns the deduplicated total.
      const totalUniqueVisitors = await readCounter(totalUrl);

      onStatsUpdate({
        totalUniqueVisitors,
        isLive: true,
        isLoading: false,
        isFirebaseConnected: false,
        error: null,
      });

      // Read-only rolling window: visitors seen in the last 5 minutes.
      try {
        const activeUrl =
          `${COUNTER_API_BASE}/${encodeURIComponent(COUNTER_NAMESPACE)}/any/any?timeline=${ACTIVE_WINDOW}`;
        const liveVisitors = await readCounter(activeUrl);

        onStatsUpdate({
          liveVisitors: Math.max(1, liveVisitors),
          isLive: true,
          isLoading: false,
          error: null,
        });
      } catch (activeError) {
        console.warn('[Visitor Counter] Active visitor read failed:', activeError);
        // Total visitor counting remains valid even if the optional live-presence
        // query is temporarily unavailable.
        onStatsUpdate({
          liveVisitors: 1,
          isLive: true,
          isLoading: false,
        });
      }

      // Refresh the live-presence number periodically while the page remains open.
      this.heartbeatInterval = setInterval(async () => {
        try {
          const activeUrl =
            `${COUNTER_API_BASE}/${encodeURIComponent(COUNTER_NAMESPACE)}/any/any?timeline=${ACTIVE_WINDOW}`;
          const liveVisitors = await readCounter(activeUrl);
          onStatsUpdate({
            liveVisitors: Math.max(1, liveVisitors),
            isLive: true,
          });
        } catch {
          // Keep the last known active count during transient network failures.
        }
      }, 60_000);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn('[Visitor Counter] Initialization failed:', message);

      onStatsUpdate({
        ...emptyStats(),
        isLoading: false,
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
