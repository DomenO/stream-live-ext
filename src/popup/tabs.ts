import {MessageType} from "../models/message";


export enum Tab {
    live,
    offline,
    settings
}

export class Tabs {
    private readonly navigationButtons = new Map<Tab, string>([
        [Tab.live, '.button__live'],
        [Tab.offline, '.button__offline'],
        [Tab.settings, '.button__setting']
    ]);

    currentTab: Tab;

    constructor() {
        $(window).on('load', this.onLoad.bind(this));
    }

    open(tab: Tab) {
        $(this.navigationButtons.get(tab)).click();
    }

    offerAuth() {
        this.open(Tab.settings);

        this.navigationButtons.forEach(selector =>
            $(selector).prop('disabled', true)
        );
    }

    private onLoad() {
        this.navigationButtons.forEach((selector, tab) => this.addEventNavButton(tab, selector));

        $(this.navigationButtons.get(Tab.settings)).on('click', () => {
            $('.settings').show();
            $('.loading').hide();
            $('.form__error').hide();
        });
    }

    private addEventNavButton(tab: Tab, selector: string) {
        $(selector).on('click', (event) => {
            $('.settings').hide();
            $('.list').empty();

            this.navigationButtons.forEach(btnData =>
                $(btnData).prop('disabled', btnData === selector)
            );

            this.currentTab = tab;

            if (tab !== Tab.settings)
                chrome.runtime.sendMessage({
                    event: MessageType.requestChannels
                });
        });
    }
}