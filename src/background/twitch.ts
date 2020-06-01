import {Channel, Status, Service} from "../models/сhannel";

export class Twitch {
    private readonly clientId = '332vpf76orpamw6yj9jqps6byjgj8n';
    private readonly headers = {
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Client-ID': this.clientId,
    }

    private readonly localStoreKeys = {
        userId: Service.twitch + '_user_id',
        streams: Service.twitch + '_live_channels',
        channels: Service.twitch + '_all_channels',
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

            if (json.users.length !== 1)
                return false;

            this.userId = json.users[0]._id;
            this.lastRequest = {};
            
            localStorage.setItem(this.localStoreKeys.userId, this.userId);
            
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async checkLogin(): Promise<boolean> {
        return Promise.resolve(!!this.userId);
    }

    async getCountStreams(): Promise<number> {
        try {
            return (await this.getLiveChannels()).length;
        } catch (err) {
            console.error(err);
            return 0;
        }
    }

    async getChannels(): Promise<Channel[]> {
        try {
            const allChannels = await this.getAllChannels();
            const liveChannels = await this.getLiveChannels();

            return allChannels.map(channel => 
                liveChannels.find(ch => ch.id === channel.id) || channel
            );
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    private async requestAllChannels(): Promise<Channel[]> {
        const limit = 100;
        let offset = 0;
        let channels: Channel[] = [];

        while (offset % limit === 0) {
            const response = await fetch(
                `https://api.twitch.tv/kraken/users/${this.userId}/follows/channels` +
                `?sortby=login` +
                `&offset=${offset}` +
                `&limit=${limit}`, 
            {headers: this.headers});
            const json = await response.json();

            channels = 
            [
                ...channels,
                ...json.follows.map(item => ({
                    id: String(item.channel._id),
                    status: Status.offline,
                    service: Service.twitch,
                    name: item.channel.display_name,
                    logo: item.channel.logo,
                    link: item.channel.url,
                    title: item.channel.status,
                    notification: false,
                    viewers: 0,
                }))
            ];

            offset = channels.length;

            if (channels.length === 0) return [];
        }

        return channels;
    }

    private async getAllChannels(cache: boolean = true): Promise<Channel[]> {
        try {
            const lastRequest = this.lastRequest[this.localStoreKeys.channels];

            if (cache && lastRequest && lastRequest > Date.now() - this.cacheTimeout[this.localStoreKeys.channels] * 1000) {
                return JSON.parse(localStorage.getItem(this.localStoreKeys.channels));
            }

            const channels: Channel[] = await this.requestAllChannels();

            localStorage.setItem(this.localStoreKeys.channels, JSON.stringify(channels));
            this.lastRequest[this.localStoreKeys.channels] = Date.now();

            return channels;
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    private async requestLiveChannels(allChannals: Channel[]): Promise<Channel[]> {
        const limit = 100;
        let offset = 0;
        let channels: Channel[] = [];

        while (offset % limit === 0) {
            const response = await fetch(
                `https://api.twitch.tv/kraken/streams/` +
                `?channel=${allChannals.map(i => i.id).join(',')}` +
                `&offset=${offset}` +
                `&limit=${limit}`, 
            {headers: this.headers});
            const json = await response.json();

            channels = 
            [
                ...channels,
                ...json.streams.map(item => ({
                    id: String(item.channel._id),
                    status: Status.live,
                    service: Service.twitch,
                    name: item.channel.display_name,
                    logo: item.channel.logo,
                    viewers: item.viewers,
                    link: item.channel.url,
                    notification: false,
                    title: item.channel.status
                }))
            ];

            offset = channels.length;

            if (channels.length === 0) return [];
        }

        return channels;
    }


    private async getLiveChannels(cache: boolean = true): Promise<Channel[]> {
        try {
            const lastRequest = this.lastRequest[this.localStoreKeys.streams];

            if (cache && lastRequest && lastRequest > Date.now() - this.cacheTimeout[this.localStoreKeys.streams] * 1000) {
                return JSON.parse(localStorage.getItem(this.localStoreKeys.streams));
            }

            const allChannals = await this.getAllChannels();
            const channels: Channel[] = await this.requestLiveChannels(allChannals);

            localStorage.setItem(this.localStoreKeys.streams, JSON.stringify(channels));
            this.lastRequest[this.localStoreKeys.streams] = Date.now();

            return channels;
        } catch (err) {
            console.error(err);
            return [];
        }
    }
}