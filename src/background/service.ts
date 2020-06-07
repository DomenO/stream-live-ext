import {Twitch} from './twitch';
import {MessageType} from '../models/message';


export class Service {
    private timeout: number;
    private twitch: Twitch;

    constructor() {
        this.twitch = new Twitch();
        this.refreshBadge();
    }

    async accountLogin(name: string) {
        if (!await this.twitch.login(name))
            return chrome.runtime.sendMessage({event: MessageType.error});

        this.refreshBadge();

        chrome.runtime.sendMessage({
            event: MessageType.authorize
        });
    }

    async requestChannels() {
        if (!await this.twitch.checkLogin())
            return chrome.runtime.sendMessage({event: MessageType.unauthorized});

        chrome.runtime.sendMessage({
            event: MessageType.listChannels,
            data: await this.twitch.getChannels()
        });

        this.refreshBadge();
    }

    private async refreshBadge() {
        if (!await this.twitch.checkLogin()) return;

        const count = await this.twitch.getCountStreams();

        chrome.browserAction.setBadgeBackgroundColor({color: '#2F343A'});
        chrome.browserAction.setBadgeText({text: count ? String(count) : ''});

        clearTimeout(this.timeout);

        this.timeout = setTimeout(() => this.refreshBadge(), 5 * 60 * 1000);
    }
}