export class StorageManager {
    async localSet<T>(key: string, value: T) {
        return this.setBrowserStorage('local', key, value);
    }

    async localGet<T>(key: string): Promise<T | undefined> {
        return this.getBrowserStorage('local', key);
    }

    async syncSet<T>(key: string, value: T) {
        return this.setBrowserStorage('sync', key, value);
    }

    async syncGet<T>(key: string): Promise<T | undefined> {
        return this.getBrowserStorage('sync', key);
    }

    private getBrowserStorage(type: 'local' | 'sync', key: string): Promise<any> {
        return new Promise(resolve =>
            chrome.storage[type].get([key], result =>
                resolve(
                    Object.keys(result).length > 0 ? result[key] : undefined
                )
            )
        );
    }

    private setBrowserStorage(type: 'local' | 'sync', key: string, value: any): Promise<void> {
        return new Promise(resolve =>
            chrome.storage[type].set({[key]: value}, () => resolve())
        );
    }
}