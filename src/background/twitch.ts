import {Channel, Status, Service} from "../models/сhannel";

export class Twitch {
    private readonly clientId = '332vpf76orpamw6yj9jqps6byjgj8n';
    private readonly headers = {
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Client-ID': this.clientId,
    }

    private readonly localStoreKeys = {
        userId: Service.twitch + '_user_id',
        streams: Service.twitch + '_streams',
        channels: Service.twitch + '_channels',
    }

    private lastRequest: {[K: string]: number} = {};
    private cacheTimeout: {[K: string]: number} = {};
    private userId?: string;

    constructor() {
        this.userId = localStorage.getItem(this.localStoreKeys.userId) || undefined;

        this.cacheTimeout[this.localStoreKeys.channels] = 1 * 60 * 60;
        this.cacheTimeout[this.localStoreKeys.streams] = 5 * 60;
    }

    async login(userName: string): Promise<boolean> {
        try {
            const response = await fetch(`https://api.twitch.tv/kraken/users?login=${userName.toLowerCase()}`, {
                headers: this.headers
            });
            const json = await response.json();

            this.userId = json.users[0]._id;
            
            localStorage.setItem(this.localStoreKeys.userId, this.userId);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async logout() {
        this.userId = undefined;
        localStorage.removeItem(this.localStoreKeys.userId);
    }

    async checkLogin(): Promise<boolean> {
        return Promise.resolve(!!this.userId);
    }

    async getStreams(cache: boolean = true): Promise<Channel[]> {
        try {
            const lastRequest = this.lastRequest[this.localStoreKeys.streams];

            if (cache && lastRequest && lastRequest > Date.now() - this.cacheTimeout[this.localStoreKeys.streams] * 1000) {
                return JSON.parse(localStorage.getItem(this.localStoreKeys.streams));
            }

            const channals = await this.getChannels();

            const response = await fetch(`https://api.twitch.tv/kraken/streams/?channel=${channals.map(i => i.id).join(',')}&limit=100`, {
                headers: this.headers
            });
            const json = await response.json();

            const streams: Channel[] = json.streams.map(item => ({
                id: String(item.channel._id),
                status: Status.live,
                service: Service.twitch,
                name: item.channel.display_name,
                logo: item.channel.logo,
                viewers: item.viewers,
                link: item.channel.url,
                notification: false,
                title: item.channel.status
            }));

            localStorage.setItem(this.localStoreKeys.streams, JSON.stringify(streams));
            this.lastRequest[this.localStoreKeys.streams] = Date.now();

            return streams;
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    async getChannels(cache: boolean = true): Promise<Channel[]> {
        try {
            const lastRequest = this.lastRequest[this.localStoreKeys.channels];

            if (cache && lastRequest && lastRequest > Date.now() - this.cacheTimeout[this.localStoreKeys.channels] * 1000) {
                return JSON.parse(localStorage.getItem(this.localStoreKeys.channels));
            }

            const response = await fetch(`https://api.twitch.tv/kraken/users/${this.userId}/follows/channels?sortby=login&limit=100`, {
                headers: this.headers
            });
            const json = await response.json();

            const channals: Channel[] = json.follows.map(item => ({
                id: String(item.channel._id),
                status: Status.offline,
                service: Service.twitch,
                name: item.channel.display_name,
                logo: item.channel.logo,
                link: item.channel.url,
                title: item.channel.status,
                notification: false,
                viewers: 0,
            }));

            localStorage.setItem(this.localStoreKeys.channels, JSON.stringify(channals));
            this.lastRequest[this.localStoreKeys.channels] = Date.now();

            return channals;
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    async getCountStreams(): Promise<number> {
        try {
            return (await this.getStreams()).length;
        } catch (err) {
            console.error(err);
            return 0;
        }
    }
}