import { OfflineSyncQueueItem } from '../types';
import { cryptoStorage } from './cryptoStorage';

const QUEUE_KEY = 'offline_queue';
const AUTO_SYNC_KEY = 'bisa_auto_sync_enabled';

class SyncService {
  private isOnlineStatus: boolean = true;
  private listeners: ((online: boolean, pendingCount: number, autoSync: boolean) => void)[] = [];
  private simulatedOffline: boolean = false;
  private autoSync: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isOnlineStatus = navigator.onLine;
      const savedAutoSync = cryptoStorage.loadEncrypted<boolean | null>(AUTO_SYNC_KEY, null);
      if (savedAutoSync !== null) {
        this.autoSync = savedAutoSync;
      }
      window.addEventListener('online', () => this.handleNetworkChange(true));
      window.addEventListener('offline', () => this.handleNetworkChange(false));
    }
  }

  public subscribe(fn: (online: boolean, pendingCount: number, autoSync: boolean) => void) {
    this.listeners.push(fn);
    fn(this.isOnline(), this.getPendingCount(), this.isAutoSyncEnabled());
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private notify() {
    const online = this.isOnline();
    const count = this.getPendingCount();
    const auto = this.isAutoSyncEnabled();
    this.listeners.forEach(fn => fn(online, count, auto));
  }

  public isAutoSyncEnabled(): boolean {
    return this.autoSync;
  }

  public setAutoSyncEnabled(enabled: boolean) {
    this.autoSync = enabled;
    cryptoStorage.saveEncrypted(AUTO_SYNC_KEY, enabled);
    this.notify();
    if (enabled && this.isOnline()) {
      this.triggerCloudSync();
    }
  }

  public isOnline(): boolean {
    if (this.simulatedOffline) return false;
    return this.isOnlineStatus;
  }

  public setSimulatedOffline(offline: boolean) {
    this.simulatedOffline = offline;
    this.notify();
    if (!offline && this.autoSync) {
      this.triggerCloudSync();
    }
  }

  public isSimulationActive(): boolean {
    return this.simulatedOffline;
  }

  private handleNetworkChange(online: boolean) {
    this.isOnlineStatus = online;
    this.notify();
    if (online && !this.simulatedOffline && this.autoSync) {
      this.triggerCloudSync();
    }
  }

  public getPendingQueue(): OfflineSyncQueueItem[] {
    return cryptoStorage.loadEncrypted<OfflineSyncQueueItem[]>(QUEUE_KEY, []);
  }

  public getPendingCount(): number {
    return this.getPendingQueue().filter(i => i.status === 'pending').length;
  }

  public enqueue(entity: OfflineSyncQueueItem['entity'], data: any): void {
    const queue = this.getPendingQueue();
    const item: OfflineSyncQueueItem = {
      id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      entity,
      data,
      timestamp: new Date().toLocaleTimeString('id-ID'),
      status: this.isOnline() && this.autoSync ? 'synced' : 'pending'
    };

    queue.push(item);
    cryptoStorage.saveEncrypted(QUEUE_KEY, queue);
    this.notify();

    if (this.isOnline() && this.autoSync) {
      this.triggerCloudSync();
    }
  }

  public triggerCloudSync(): Promise<{ syncedCount: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const queue = this.getPendingQueue();
        const pendingItems = queue.filter(q => q.status === 'pending');
        const count = pendingItems.length;

        // Mark all as synced
        const updated = queue.map(q => ({ ...q, status: 'synced' as const }));
        cryptoStorage.saveEncrypted(QUEUE_KEY, updated);
        this.notify();
        resolve({ syncedCount: count });
      }, 800);
    });
  }
}

export const syncService = new SyncService();
