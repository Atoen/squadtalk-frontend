import { computed, signal } from "@angular/core";

export class ReactiveArray<T> {
    private readonly _array: T[] = [];
    private readonly _version = signal(0);

    readonly values = computed(() => {
        this._version();
        return [...this._array];
    });

    get(index: number): T | undefined {
        return this._array[index];
    }

    add(value: T) {
        this._array.push(value);
        this.updateVersion();
    }

    addMany(values: Iterable<T>) {
        const initialLength = this._array.length;
        this._array.push(...values);
        if (this._array.length > initialLength) {
            this.updateVersion();
        }
    }

    insertAt(index: number, value: T) {
        if (index < 0 || index > this._array.length) return;
        this._array.splice(index, 0, value);
        this.updateVersion();
    }

    removeAt(index: number) {
        if (index < 0 || index >= this._array.length) return undefined;
        const removed = this._array.splice(index, 1)[0];
        this.updateVersion();
        return removed;
    }

    remove(value: T) {
        const index = this._array.indexOf(value);
        if (index !== -1) {
            this._array.splice(index, 1);
            this.updateVersion();
            return true;
        }
        return false;
    }

    clear() {
        if (this._array.length === 0) return;
        this._array.length = 0;
        this.updateVersion();
    }

    refresh(values: Iterable<T>) {
        this._array.length = 0;
        this._array.push(...values);
        this.updateVersion();
    }

    private updateVersion() {
        this._version.update(x => x + 1);
    }
}
