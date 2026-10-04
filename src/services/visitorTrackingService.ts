export interface VisitorStats {
  totalUniqueVisitors: number | null;
  liveVisitors: number;
  isLive: boolean;
  isLoading: boolean;
  isFirebaseConnected: boolean;
  visitorUid?: string;
  error?: string | null;
}

const STORAGE_KEY = 'ravi003_visitor_id';
const COUNT_KEY = 'ravi003_unique_count';
const CHANNEL_NAME = 'ravi003_visitor_presence';
const HEARTBEAT_MS = 10000;
const ACTIVE_WINDOW_MS = 30000;

type PresenceMessage = {
  type: 'heartbeat' | 'goodbye';
  id: string;
  at: number;
};

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

function getStoredUniqueCount(): number {
  try {
    const value = Number(localStorage.getItem(COUNT_KEY));
    return Number.isFinite(value) && value >= 1 ? Math.floor(value) : 0;
  } catch {
    return 0;
  }
}

function registerThisBrowserOnce(): number {
  const existing = getStoredUniqueCount();
  if (existing > 0) return existing;

  // This browser/device is being seen for the first time.
  // Refreshing later uses the same persistent ID and never increments again.
  const firstCount = 1;
  try {
    localStorage.setItem(COUNT_KEY, String(firstCount));
  } catch {}
  return firstCount;
}

export class VisitorTrackingService {
  private static instance: VisitorTrackingService;
  private started = false;
  private visitorId: string | null = null;
  private channel: BroadcastChannel | null = null;
  private heartbeat: ReturnType<typeof setInterval> | null = null;
  private peers = new Map<string, number>();
  private visibilityHandler: (() => void) | null = null;

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

    const id = getStableVisitorId();
    this.visitorId = id;

    const total = registerThisBrowserOnce();

    onStatsUpdate({
      totalUniqueVisitors: total,
      liveVisitors: 1,
      isLive: true,
      isLoading: false,
      isFirebaseConnected: false,
      visitorUid: id,
      error: null,
    });

    // BroadcastChannel coordinates tabs/windows of this browser/device.
    // It deliberately does not pretend to provide cross-device global presence.
    if ('BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(CHANNEL_NAME);

      this.channel.onmessage = (event: MessageEvent<PresenceMessage>) => {
        const message = event.data;
        if (!message || message.id === this.visitorId) return;

        if (message.type === 'heartbeat') {
          this.peers.set(message.id, message.at);
          this.publishLiveCount(onStatsUpdate);
        } else if (message.type === 'goodbye') {
          this.peers.delete(message.id);
          this.publishLiveCount(onStatsUpdate);
        }
      };
    }

    const sendHeartbeat = () => {
      const now = Date.now();

      // Remove peers that have not been heard from recently.
      for (const [peerId, lastSeen] of this.peers) {
        if (now - lastSeen > ACTIVE_WINDOW_MS) {
          this.peers.delete(peerId);
        }
      }

      const message: PresenceMessage = {
        type: 'heartbeat',
        id,
        at: now,
      };

      try {
        this.channel?.postMessage(message);
      } catch {}

      this.publishLiveCount(onStatsUpdate);
    };

    sendHeartbeat();
    this.heartbeat = setInterval(sendHeartbeat, HEARTBEAT_MS);

    this.visibilityHandler = () => {
      if (document.visibilityState === 'visible') {
        sendHeartbeat();
      }
    };

    document.addEventListener('visibilitychange', this.visibilityHandler);

    window.addEventListener('beforeunload', this.handleUnload);
  }

  private publishLiveCount(onStatsUpdate: (stats: Partial<VisitorStats>) => void) {
    // The current page is always considered active while it is open.
    // Therefore the displayed value never incorrectly becomes 0.
    const live = Math.max(1, this.peers.size + 1);

    onStatsUpdate({
      liveVisitors: live,
      isLive: true,
      isLoading: false,
      isFirebaseConnected: false,
      error: null,
    });
  }

  private handleUnload = () => {
    if (!this.visitorId) return;

    try {
      this.channel?.postMessage({
        type: 'goodbye',
        id: this.visitorId,
        at: Date.now(),
      } satisfies PresenceMessage);
    } catch {}
  };

  public cleanup(): void {
    if (this.heartbeat) {
      clearInterval(this.heartbeat);
      this.heartbeat = null;
    }

    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }

    window.removeEventListener('beforeunload', this.handleUnload);

    try {
      if (this.visitorId) {
        this.channel?.postMessage({
          type: 'goodbye',
          id: this.visitorId,
          at: Date.now(),
        } satisfies PresenceMessage);
      }
      this.channel?.close();
    } catch {}

    this.channel = null;
    this.peers.clear();
    this.started = false;
  }
}

export const visitorTracker = VisitorTrackingService.getInstance();
