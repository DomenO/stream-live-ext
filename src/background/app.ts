import {MessageType, Message} from '../models/message';
import {Channel, Status} from '../models/сhannel';

import {Twitch} from './services';
import {NotificationManager, ShowNotification} from './notification-manager';


export class App {
    private readonly refreshTimeout = 5 * 60 * 1000;

    private timeout: number;
    private twitch: Twitch;
    private notificationManager: NotificationManager;

    constructor() {
        this.twitch = new Twitch();
        this.notificationManager = new NotificationManager();
    }

    run() {
        chrome.runtime.onMessage.addListener(this.processRuntimeMessage.bind(this));
        this.runRefreshTask();
    }

    private async accountLogin(name: string) {
        if (!await this.twitch.login(name))
            return chrome.runtime.sendMessage({event: MessageType.error});

        this.runRefreshTask();

        chrome.runtime.sendMessage({
            event: MessageType.authorize
        });
    }

    private async requestChannels() {
        if (!await this.twitch.checkLogin())
            return chrome.runtime.sendMessage({event: MessageType.unauthorized});

        chrome.runtime.sendMessage({
            event: MessageType.listChannels,
            data: await this.twitch.getChannels()
        });

        this.runRefreshTask();
    }

    private async updateChannel(channel: Channel) {
        await this.twitch.updateChannel(channel);
        await this.requestChannels();
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
            .filter(channel =>
                channel.notification &&
                channel.status === Status.live &&
                Date.now() - channel.startTimeTs < this.refreshTimeout
            )
            .forEach(channel =>
                this.showNotification(channel)
            )
    }

    private showNotification(channel: Channel) {
        const params: ShowNotification = {
            id: channel.link,
            title: channel.title,
            message: channel.name + ' is live now!',
            image: channel.logo,
            lockTs: this.refreshTimeout,
            onClick: this.onClickNotification
        }

        this.notificationManager.show(params);
    }

    private onClickNotification(url: string) {
        chrome.tabs.create({url});
    }

    private processRuntimeMessage(request: Message) {
        switch (request.event) {
            case MessageType.requestChannels:
                this.requestChannels();
                break;

            case MessageType.accountLogin:
                this.accountLogin(request.data);
                break;

            case MessageType.updateChannel:
                this.updateChannel(request.data);
                break;
        }
    }
}