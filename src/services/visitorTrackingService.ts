export interface VisitorStats {
  totalUniqueVisitors: number | null;
  liveVisitors: number;
  isLive: boolean;
  isLoading: boolean;
  isFirebaseConnected: boolean;
  visitorUid?: string;
  error?: string | null;
}

const COUNTER_NAMESPACE = 'ravi003-portfolio';
const COUNTER_ACTION = 'view';
const COUNTER_KEY = 'portfolio';
const ACTIVE_TIMELINE = '45s';
const HEARTBEAT_MS = 15000;
const STORAGE_KEY = 'ravi003_visitor_id';

function getStableVisitorId(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;

    const id =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

function counterUrl(action: string, key: string, params: Record<string, string> = {}) {
  const query = new URLSearchParams({
    ...params,
    ns: COUNTER_NAMESPACE,
  });
  return `https://counterapi.com/api/${COUNTER_NAMESPACE}/${action}/${key}?${query.toString()}`;
}

async function readJson(url: string): Promise<any> {
  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Counter service returned ${response.status}`);
  }

  return response.json();
}

export class VisitorTrackingService {
  private static instance: VisitorTrackingService;
  private started = false;
  private visitorId: string | null = null;
  private heartbeat: ReturnType<typeof setInterval> | null = null;
  private onStatsUpdate: ((stats: Partial<VisitorStats>) => void) | null = null;
  private requestInFlight = false;

  public static getInstance(): VisitorTrackingService {
    if (!VisitorTrackingService.instance) {
      VisitorTrackingService.instance = new VisitorTrackingService();
    }
    return VisitorTrackingService.instance;
  }

  public async startTracking(
    onStatsUpdate: (stats: Partial<VisitorStats>) => void
  ): Promise<void> {
    if (this.started || typeof window === 'undefined') return;

    this.started = true;
    this.onStatsUpdate = onStatsUpdate;
    this.visitorId = getStableVisitorId();

    onStatsUpdate({
      totalUniqueVisitors: null,
      liveVisitors: 1,
      isLive: true,
      isLoading: true,
      isFirebaseConnected: false,
      visitorUid: this.visitorId,
      error: null,
    });

    await this.sync(true);

    this.heartbeat = setInterval(() => {
      void this.sync(false);
    }, HEARTBEAT_MS);

    document.addEventListener('visibilitychange', this.handleVisibility);
    window.addEventListener('beforeunload', this.handleUnload);
  }

  private async sync(firstLoad: boolean): Promise<void> {
    if (!this.visitorId || !this.onStatsUpdate || this.requestInFlight) return;

    this.requestInFlight = true;

    try {
      const trackParams: Record<string, string> = {
        userId: this.visitorId,
        unique: 'true',
      };

      if (!firstLoad) {
        trackParams.trackOnly = 'true';
      }

      const trackResult = await readJson(
        counterUrl(COUNTER_ACTION, COUNTER_KEY, trackParams)
      );

      const [activeResult, totalResult] = await Promise.all([
        readJson(
          counterUrl('any', 'any', {
            timeline: ACTIVE_TIMELINE,
            unique: 'true',
            readOnly: 'true',
          })
        ),
        firstLoad
          ? Promise.resolve(trackResult)
          : readJson(
              counterUrl(COUNTER_ACTION, COUNTER_KEY, {
                unique: 'true',
                readOnly: 'true',
              })
            ),
      ]);

      const total = Number(totalResult?.value);
      const active = Number(activeResult?.value);

      this.onStatsUpdate({
        totalUniqueVisitors: Number.isFinite(total) ? total : null,
        liveVisitors: Number.isFinite(active) ? Math.max(1, active) : 1,
        isLive: true,
        isLoading: false,
        isFirebaseConnected: false,
        visitorUid: this.visitorId,
        error: null,
      });
    } catch (error) {
      this.onStatsUpdate({
        liveVisitors: 1,
        isLive: false,
        isLoading: false,
        isFirebaseConnected: false,
        error: error instanceof Error ? error.message : 'Visitor counter unavailable',
      });
    } finally {
      this.requestInFlight = false;
    }
  }

  private handleVisibility = () => {
    if (document.visibilityState === 'visible') {
      void this.sync(false);
    }
  };

  private handleUnload = () => {
    // Presence expires automatically after the active timeline.
  };

  public cleanup(): void {
    if (this.heartbeat) {
      clearInterval(this.heartbeat);
      this.heartbeat = null;
    }

    document.removeEventListener('visibilitychange', this.handleVisibility);
    window.removeEventListener('beforeunload', this.handleUnload);

    this.onStatsUpdate = null;
    this.visitorId = null;
    this.started = false;
    this.requestInFlight = false;
  }
}

export const visitorTracker = VisitorTrackingService.getInstance();
