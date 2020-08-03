import {Channel} from '../models/сhannel';


export abstract class Service {

    abstract async login(id: string): Promise<boolean>;
    abstract async checkLogin(): Promise<boolean>;
    abstract async getCountStreams(): Promise<number>;
    abstract async getChannels(): Promise<Channel[]>;

    updateChannel(channel: Channel) {
        const favorites = this.loadFavoritesLocalStore();
        const notifications = this.loadNotificationsLocalStore();

        channel.favorite ?
            favorites.add(channel.id) :
            favorites.delete(channel.id);

        channel.notification ?
            notifications.add(channel.id) :
            notifications.delete(channel.id);

        this.saveFavoritesLocalStore(favorites);
        this.saveNotificationsLocalStore(notifications);
    }

    protected prepareChannels(channels: Channel[]): Channel[] {
        const favorites = this.loadFavoritesLocalStore();
        const notifications = this.loadNotificationsLocalStore();

        return channels
            .map(channel => ({
                ...channel,
                favorite: favorites.has(channel.id),
                notification: notifications.has(channel.id)
            }));
    }

    private loadFavoritesLocalStore(): Set<string> {
        return new Set(JSON.parse(localStorage.getItem('favorites')) || []);
    }

    private saveFavoritesLocalStore(favorites: Set<string>) {
        localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
    }

    private loadNotificationsLocalStore(): Set<string> {
        return new Set(JSON.parse(localStorage.getItem('notifications')) || []);
    }

    private saveNotificationsLocalStore(notifications: Set<string>) {
        localStorage.setItem('notifications', JSON.stringify(Array.from(notifications)));
    }
}