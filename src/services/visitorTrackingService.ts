import {
  doc,
  collection,
  runTransaction,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
  Timestamp,
} from 'firebase/firestore';
import {
  getFirebaseDb,
  getFirebaseAuth,
  ensureAnonymousAuth,
  isFirebaseConfigured,
} from './firebase';

export interface VisitorStats {
  totalUniqueVisitors: number | null;
  liveVisitors: number;
  isLive: boolean;
  isLoading: boolean;
  isFirebaseConnected: boolean;
  visitorUid?: string;
  error?: string | null;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    isAnonymous?: boolean | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const auth = getFirebaseAuth();
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
    },
    operationType,
    path,
  };
  console.warn('[Firestore Visitor Tracking Info]:', JSON.stringify(errInfo));
}

// Unconfigured / offline baseline statistics (no fake numbers)
const UNCONFIGURED_STATS: VisitorStats = {
  totalUniqueVisitors: null,
  liveVisitors: 0,
  isLive: false,
  isLoading: false,
  isFirebaseConnected: false,
};

// Activity threshold for considering a visitor "Live / Online Now" (5 minutes)
const ACTIVE_WINDOW_MS = 5 * 60 * 1000;

export class VisitorTrackingService {
  private static instance: VisitorTrackingService;
  private unsubscribeStats: Unsubscribe | null = null;
  private unsubscribeActiveSessions: Unsubscribe | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private currentVisitorUid: string | null = null;

  public static getInstance(): VisitorTrackingService {
    if (!VisitorTrackingService.instance) {
      VisitorTrackingService.instance = new VisitorTrackingService();
    }
    return VisitorTrackingService.instance;
  }

  /**
   * Initializes visitor tracking:
   * 1. Authenticates anonymously (or retrieves existing persistent token)
   * 2. Runs an atomic Firestore transaction to count new unique visitors only
   * 3. Sets up active session presence heartbeat
   * 4. Listens for real-time global statistics and active visitor updates
   */
  public async startTracking(
    onStatsUpdate: (stats: Partial<VisitorStats>) => void
  ): Promise<void> {
    if (!isFirebaseConfigured()) {
      onStatsUpdate({
        ...UNCONFIGURED_STATS,
        isLoading: false,
        isFirebaseConnected: false,
      });
      return;
    }

    try {
      const db = getFirebaseDb();
      if (!db) {
        onStatsUpdate({ ...UNCONFIGURED_STATS, isLoading: false, isFirebaseConnected: false });
        return;
      }

      // Step 1: Ensure persistent anonymous visitor authentication
      const user = await ensureAnonymousAuth();
      if (!user) {
        onStatsUpdate({ ...UNCONFIGURED_STATS, isLoading: false, isFirebaseConnected: false });
        return;
      }

      const uid = user.uid;
      this.currentVisitorUid = uid;

      // Step 2: Atomic deduplication via Firestore Transaction
      const visitorRef = doc(db, 'visitors', uid);
      const statsRef = doc(db, 'stats', 'portfolio');
      const sessionRef = doc(db, 'active_sessions', uid);

      try {
        await runTransaction(db, async (transaction) => {
          const visitorDoc = await transaction.get(visitorRef);
          const statsDoc = await transaction.get(statsRef);

          if (!visitorDoc.exists()) {
            // GENUINELY NEW VISITOR:
            // 1. Create visitor record
            transaction.set(visitorRef, {
              uid,
              firstVisitAt: serverTimestamp(),
              lastVisitAt: serverTimestamp(),
              lastSeenAt: serverTimestamp(),
            });

            // 2. Increment global total unique visitors count atomically
            if (statsDoc.exists()) {
              const currentTotal = statsDoc.data()?.totalUniqueVisitors || 0;
              transaction.update(statsRef, {
                totalUniqueVisitors: currentTotal + 1,
                lastUpdatedAt: serverTimestamp(),
              });
            } else {
              // Initial bootstrap if stats doc does not exist
              transaction.set(statsRef, {
                totalUniqueVisitors: 1,
                lastUpdatedAt: serverTimestamp(),
              });
            }
          } else {
            // RETURNING VISITOR OR REFRESH:
            // Update last visit timestamp, DO NOT increment totalUniqueVisitors
            transaction.update(visitorRef, {
              lastVisitAt: serverTimestamp(),
              lastSeenAt: serverTimestamp(),
            });
          }
        });
      } catch (txError) {
        handleFirestoreError(txError, OperationType.WRITE, 'visitors/stats transaction');
      }

      // Step 3: Register active session presence
      try {
        await setDoc(
          sessionRef,
          {
            uid,
            lastSeenAt: serverTimestamp(),
            joinedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (sessionError) {
        handleFirestoreError(sessionError, OperationType.WRITE, `active_sessions/${uid}`);
      }

      // Step 4: Setup periodic heartbeat (every 60 seconds)
      this.heartbeatInterval = setInterval(async () => {
        try {
          if (this.currentVisitorUid && db) {
            const currentSessionRef = doc(db, 'active_sessions', this.currentVisitorUid);
            await setDoc(
              currentSessionRef,
              {
                lastSeenAt: serverTimestamp(),
              },
              { merge: true }
            );
          }
        } catch (hbError) {
          // Silent heartbeat catch
        }
      }, 60000);

      // Setup window unload cleanup
      if (typeof window !== 'undefined') {
        const cleanupSession = () => {
          if (this.currentVisitorUid && db) {
            try {
              const currentSessionRef = doc(db, 'active_sessions', this.currentVisitorUid);
              deleteDoc(currentSessionRef).catch(() => {});
            } catch (e) {}
          }
        };
        window.addEventListener('beforeunload', cleanupSession);
      }

      // Step 5: Real-time listener for global portfolio stats
      this.unsubscribeStats = onSnapshot(
        statsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            onStatsUpdate({
              totalUniqueVisitors: data?.totalUniqueVisitors ?? 1,
              isLive: true,
              isLoading: false,
              isFirebaseConnected: true,
              visitorUid: uid,
            });
          } else {
            onStatsUpdate({
              totalUniqueVisitors: 1,
              isLive: true,
              isLoading: false,
              isFirebaseConnected: true,
              visitorUid: uid,
            });
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'stats/portfolio');
          onStatsUpdate({
            ...UNCONFIGURED_STATS,
            isLoading: false,
            isFirebaseConnected: false,
            error: error.message,
          });
        }
      );

      // Step 6: Real-time listener for active sessions to compute live online count
      const activeSessionsCol = collection(db, 'active_sessions');
      this.unsubscribeActiveSessions = onSnapshot(
        activeSessionsCol,
        (snapshot) => {
          const now = Date.now();
          let activeCount = 0;

          snapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            if (data?.lastSeenAt) {
              let timestampMs = 0;
              if (data.lastSeenAt instanceof Timestamp) {
                timestampMs = data.lastSeenAt.toMillis();
              } else if (typeof data.lastSeenAt?.toDate === 'function') {
                timestampMs = data.lastSeenAt.toDate().getTime();
              } else if (typeof data.lastSeenAt === 'number') {
                timestampMs = data.lastSeenAt;
              }

              // Count if active within the last 5 minutes
              if (now - timestampMs <= ACTIVE_WINDOW_MS) {
                activeCount++;
              }
            } else {
              activeCount++;
            }
          });

          // Ensure at least 1 when active visitor is connected
          onStatsUpdate({
            liveVisitors: Math.max(1, activeCount),
          });
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'active_sessions');
        }
      );
    } catch (globalError) {
      console.warn('[VisitorTrackingService] Initialization fallback:', globalError);
      onStatsUpdate({
        ...UNCONFIGURED_STATS,
        isLoading: false,
        isFirebaseConnected: false,
      });
    }
  }

  public cleanup(): void {
    if (this.unsubscribeStats) {
      this.unsubscribeStats();
      this.unsubscribeStats = null;
    }
    if (this.unsubscribeActiveSessions) {
      this.unsubscribeActiveSessions();
      this.unsubscribeActiveSessions = null;
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}

export const visitorTracker = VisitorTrackingService.getInstance();
