import {Channel} from '../../models/сhannel';

import {StorageManager} from '../managers/storage';


export abstract class Service {
    private readonly favoritesKeyStore = 'favorites';
    private readonly notificationsKeyStore = 'notifications';

    protected storageManager: StorageManager;

    constructor() {
        this.storageManager = new StorageManager();
    }

    abstract async login(id: string): Promise<boolean>;
    abstract async checkLogin(): Promise<boolean>;
    abstract async getCountStreams(): Promise<number>;
    abstract async getChannels(): Promise<Channel[]>;

    async updateChannels(channels: Channel[]) {
        const favorites = await this.loadFavoritesLocalStore();
        const notifications = await this.loadNotificationsLocalStore();

        channels.forEach(channel => {
            channel.favorite ?
                favorites.add(channel.id) :
                favorites.delete(channel.id);

            channel.notification ?
                notifications.add(channel.id) :
                notifications.delete(channel.id);
        });

        await this.saveFavoritesLocalStore(favorites);
        await this.saveNotificationsLocalStore(notifications);
    }

    protected async prepareChannels(channels: Channel[]): Promise<Channel[]> {
        const favorites = await this.loadFavoritesLocalStore();
        const notifications = await this.loadNotificationsLocalStore();

        return channels
            .map(channel => ({
                ...channel,
                favorite: favorites.has(channel.id),
                notification: notifications.has(channel.id)
            }));
    }

    private async loadFavoritesLocalStore(): Promise<Set<string>> {
        const data: string[] = await this.storageManager.syncGet(this.favoritesKeyStore);
        return new Set(data || []);
    }

    private async saveFavoritesLocalStore(favorites: Set<string>) {
        const data = Array.from(favorites);
        await this.storageManager.syncSet(this.favoritesKeyStore, data);
    }

    private async loadNotificationsLocalStore(): Promise<Set<string>> {
        const data: string[] = await this.storageManager.syncGet(this.notificationsKeyStore);
        return new Set(data || []);
    }

    private async saveNotificationsLocalStore(notifications: Set<string>) {
        const data = Array.from(notifications);
        await this.storageManager.syncSet(this.notificationsKeyStore, data);
    }
}