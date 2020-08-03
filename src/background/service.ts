import {MessageType} from '../models/message';
import {Channel, Status} from '../models/сhannel';

import {Twitch} from './twitch';
import {NotificationManager} from './notification-manager';


export class Service {
    private readonly refreshTimeout = 5 * 60 * 1000;

    private timeout: number;
    private twitch: Twitch;
    private notificationManager: NotificationManager;

    constructor() {
        this.twitch = new Twitch();
        this.notificationManager = new NotificationManager();

        this.notificationManager.addClickEvent(url => chrome.tabs.create({url}));

        this.runRefreshTask();
    }

    async accountLogin(name: string) {
        if (!await this.twitch.login(name))
            return chrome.runtime.sendMessage({event: MessageType.error});

        this.runRefreshTask();

        chrome.runtime.sendMessage({
            event: MessageType.authorize
        });
    }

    async requestChannels() {
        if (!await this.twitch.checkLogin())
            return chrome.runtime.sendMessage({event: MessageType.unauthorized});

        const favorites = this.loadFavoritesLocalStore();
        const notifications = this.loadNotificationsLocalStore();

        const channels = (
                await this.twitch.getChannels()
            ).map(channel => ({
                ...channel,
                favorite: favorites.has(channel.id),
                notification: notifications.has(channel.id)
            }));

        chrome.runtime.sendMessage({
            event: MessageType.listChannels,
            data: channels
        });

        this.runRefreshTask();
    }

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

        this.requestChannels();
    }

    private async runRefreshTask() {
        if (!await this.twitch.checkLogin()) return;

        this.refreshBadge();
        this.checkNotifications();

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.runRefreshTask(), this.refreshTimeout);
    }

    private async refreshBadge() {
        const count = await this.twitch.getCountStreams();

        chrome.browserAction.setBadgeBackgroundColor({color: '#2F343A'});
        chrome.browserAction.setBadgeText({text: count ? String(count) : ''});
    }

    private async checkNotifications() {
        const channels = await this.twitch.getChannels();

        channels
            .filter(channel => {
                channel.notification &&
                channel.status === Status.live &&
                Date.now() - channel.startTimeTs < this.refreshTimeout
            })
            .forEach(channel =>
                this.notificationManager.show({
                    id: channel.link,
                    title: channel.title,
                    message: channel.name + ' is live now!',
                    image: channel.logo
                })
            );
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