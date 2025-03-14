import { computed, signal } from "@angular/core";

export class ReactiveMap<K, V> {
    private readonly _map = new Map<K, V>();
    private readonly _version = signal(0);

    readonly values = computed(() => {
        this._version();
        return [...this._map.values()];
    });

    get(key: K) {
        return this._map.get(key);
    }

    add(key: K, value: V) {
        this._map.set(key, value);
        this.updateVersion();
    }

    addMany(entries: Iterable<[K, V]>) {
        let added = false;
        for (const [key, value] of entries) {
            this._map.set(key, value);
            added = true;
        }

        if (added) {
            this.updateVersion();
        }
    }

    clear() {
        if (this._map.size === 0) return;

        this._map.clear();
        this.updateVersion();
    }

    refresh(entries: Iterable<[K, V]>) {
        this._map.clear();
        for (const [key, value] of entries) {
            this._map.set(key, value);
        }

        this.updateVersion();
    }

    remove(key: K) {
        const deleted = this._map.delete(key);
        if (deleted) {
            this.updateVersion();
        }

        return deleted;
    }

    removeAndGet(key: K) {
        const value = this._map.get(key);
        if (value && this._map.delete(key)) {
            this.updateVersion();
        }

        return value;
    }

    private updateVersion() {
        this._version.update(x => x + 1);
    }
}
