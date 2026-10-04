export interface VisitorStats {
  totalUniqueVisitors: number | null;
  liveVisitors: number;
  isLive: boolean;
  isLoading: boolean;
  isFirebaseConnected: boolean;
  visitorUid?: string;
  error?: string | null;
}

const COUNTER_NAMESPACE = 'ravi003-portfolio-158';
const COUNTER_ACTION = 'view';
const COUNTER_KEY = 'portfolio';

function counterUrl(
  action: string,
  key: string,
  params: Record<string, string> = {}
) {
  const query = new URLSearchParams(params);
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

    onStatsUpdate({
      totalUniqueVisitors: null,
      liveVisitors: 1,
      isLive: true,
      isLoading: true,
      isFirebaseConnected: false,
      error: null,
    });

    await this.registerPageView();
  }

  private async registerPageView(): Promise<void> {
    if (!this.onStatsUpdate || this.requestInFlight) return;

    this.requestInFlight = true;

    try {
      // Every page load/refresh increments the same shared counter by exactly 1.
      // No localStorage, visitor ID, Firebase, or user database is required.
      const result = await readJson(
        counterUrl(COUNTER_ACTION, COUNTER_KEY)
      );

      const total = Number(result?.value);

      this.onStatsUpdate({
        totalUniqueVisitors: Number.isFinite(total) ? total : null,
        liveVisitors: 1,
        isLive: true,
        isLoading: false,
        isFirebaseConnected: false,
        error: null,
      });
    } catch (error) {
      this.onStatsUpdate({
        liveVisitors: 1,
        isLive: false,
        isLoading: false,
        isFirebaseConnected: false,
        error:
          error instanceof Error
            ? error.message
            : 'Visitor counter unavailable',
      });
    } finally {
      this.requestInFlight = false;
    }
  }

  public cleanup(): void {
    this.onStatsUpdate = null;
    this.started = false;
    this.requestInFlight = false;
  }
}

export const visitorTracker = VisitorTrackingService.getInstance();
