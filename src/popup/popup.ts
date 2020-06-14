import {Channel, Status} from '../models/сhannel';
import {Tabs, Tab} from './tabs';
import {MessageType} from '../models/message';


export class Popup {
    private templateOfflineChannel = (link: string, logo: string, name: string) => `
        <a class="stream-item" href="${link}" target="_blank">
            <img class="stream-item__logo" src="${logo}" alt="logo" />
            <section class="stream-item__content">
                <span class="stream-item__title">${name}</span>
            </section>
        </a>
    `;

    private templateLiveChannel = (link: string, logo: string, title: string, viewers: string, upTime: string) => `
        <a class="stream-item" href="${link}" target="_blank">
            <img class="stream-item__logo" src="${logo}" alt="logo" />
            <section class="stream-item__content">
                <span class="stream-item__title">${title}</span>
                <section class="stream-item__bottom">
                    <span class="stream-item__viewers">
                        <img class="stream-item__icon" alt="people" src="/assets/people.svg" />
                        ${viewers}
                    </span>
                    <span class="stream-item__up-time">
                        <img class="stream-item__icon" alt="time" src="/assets/time.svg" />
                        ${upTime}
                    </span>
                </section>
            </section>
        </a>
    `;

    private tabs: Tabs;
    private unauth: boolean;

    constructor() {
        this.tabs = new Tabs();

        $(window).on('load', this.onLoad.bind(this));
    }

    unauthorized() {
        this.tabs.offerAuth();
        this.unauth = true;
    }

    authorize() {
        this.tabs.open(Tab.live);
        this.unauth = false;
    }

    error() {
        this.unauth ?
            this.tabs.offerAuth() :
            this.tabs.open(Tab.settings);

        $('.form__error').show();
    }

    listChannels(channels: Channel[]) {
        $('.loading').hide();

        if (this.tabs.currentTab === Tab.offline) {
            this.outputOfflineChannels(channels);

        } else if (this.tabs.currentTab === Tab.live) {
            this.outputLiveChannels(channels);
        }
    }

    private onLoad() {
        this.tabs.open(Tab.live);

        $('.settings__form').submit(e => {
            const value = $('.settings__form .form__input').val();

            if (value) {
                $('.loading').show();
                $('.settings').hide();

                chrome.runtime.sendMessage({
                    event: MessageType.accountLogin,
                    data: value
                });

                $('.settings__form .form__input').val('');
                $('.form__error').hide();
            }

            e.preventDefault();
        })
    }

    private outputOfflineChannels(channels: Channel[]) {
        const filterChannels = channels
            .filter(channel => channel.status === Status.offline)
            .reverse();

        if (filterChannels.length === 0)
            this.outputEmpty();

        filterChannels.forEach(item =>
            $('.list').append(
                this.templateOfflineChannel(item.link, item.logo, item.name)
            )
        );
    }

    private outputLiveChannels(channels: Channel[]) {
        const filterChannels = channels
            .filter(channel => channel.status === Status.live)
            .sort((a, b) => b.viewers - a.viewers);

        if (filterChannels.length === 0)
            this.outputEmpty();

        filterChannels.forEach(item => {
            const date = new Date();
            const upTime = new Date(
                date.getTime() - new Date(item.startTime).getTime() + date.getTimezoneOffset() * 60 * 1000
            )
                .toLocaleTimeString('ru', {
                    hour: 'numeric',
                    minute: '2-digit',
                    second: '2-digit'
                });

            const viewers = String(item.viewers).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');

            $('.list').append(
                this.templateLiveChannel(item.link, item.logo, item.title, viewers, upTime)
            )
        });
    }

    private outputEmpty() {
        $('.list').append(`<section class="stream-item__empty">Empty</section>`);
    }
}