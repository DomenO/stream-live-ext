import {Channel, Status} from '../models/сhannel';


enum Tab {
    live = 'live',
    offline = 'offline',
    settings = 'settings'
}
interface NavButton {
    selector: string;
    tab: Tab;
}

const navigationButtons: NavButton[] = [
    {selector: '.button__live', tab: Tab.live},
    {selector: '.button__offline', tab: Tab.offline},
    {selector: '.button__setting', tab: Tab.settings}
];

let currentTab: Tab;

chrome.runtime.onMessage.addListener(
    function(request) {
        switch (request.message) {
            case 'listChannels':
                listChannels(request.data);
                break;

            case 'login':
                $(navigationButtons[2].selector).click();
                break;

            case 'loginSuccessful':
                $(navigationButtons[0].selector).click();
                break;

            case 'accountNotFound':
                $(navigationButtons[2].selector).click();
                $('.form__error').show();
                break;
        }
    }
);

$(window).on('load', () => {
    navigationButtons.forEach(button => addEventButton(button));
    $(navigationButtons[0].selector).click();

    $(navigationButtons[2].selector).on('click', () => {
        $('.settings').show();
        $('.loading').hide();
        $('.form__error').hide();
    });

    $('.settings__form').submit(e => {
        $('.loading').show();
        $('.settings').hide();

        chrome.runtime.sendMessage({
            message: 'accountImport',
            data: $('.settings__form .form__input').val()
        });

        $('.settings__form .form__input').val('');
        $('.form__error').hide();

        e.preventDefault();
    })
});

function addEventButton(button: NavButton) {
    $(button.selector).on('click', () => {
        $('.list').empty();
        $('.settings').hide();
        $('.loading').show();

        navigationButtons.forEach(btn =>
            $(btn.selector).prop('disabled', btn.selector === button.selector)
        );

        currentTab = button.tab;

        if (button.tab !== Tab.settings)
            chrome.runtime.sendMessage({message: 'requestChannels'});
    });
}

function listChannels(channels: Channel[]) {
    $('.loading').hide();

    let filterChannels: Channel[] = [];

    if (currentTab === Tab.offline) {
        filterChannels = channels.filter(channel => channel.status === Status.offline);

        filterChannels.forEach(item => {
            $('.list').append(`
            <a class="stream-item" href="${item.link}" target="_blank">
                <img class="stream-item__logo" src="${item.logo}" alt="Logo" />
                <section class="stream-item__content">
                    <span class="stream-item__title">${item.name}</span>
                </section>
            </a>
            `);
        });

    } else if (currentTab === Tab.live) {
        filterChannels = channels.filter(channel => channel.status === Status.live);

        filterChannels.forEach(item => {
            $('.list').append(`
            <a class="stream-item" href="${item.link}" target="_blank">
                <img class="stream-item__logo" src="${item.logo}" alt="Logo" />
                <section class="stream-item__content">
                    <span class="stream-item__title">${item.title}</span>
                    <span class="stream-item__viewers">
                        <svg class="stream-item__icon" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="red"><g><rect fill="none" height="24" width="24"/></g><g><g/><g><g><path d="M16.67,13.13C18.04,14.06,19,15.32,19,17v3h4v-3 C23,14.82,19.43,13.53,16.67,13.13z" fill-rule="evenodd"/></g><g><circle cx="9" cy="8" fill-rule="evenodd" r="4"/></g><g><path d="M15,12c2.21,0,4-1.79,4-4c0-2.21-1.79-4-4-4c-0.47,0-0.91,0.1-1.33,0.24 C14.5,5.27,15,6.58,15,8s-0.5,2.73-1.33,3.76C14.09,11.9,14.53,12,15,12z" fill-rule="evenodd"/></g><g><path d="M9,13c-2.67,0-8,1.34-8,4v3h16v-3C17,14.34,11.67,13,9,13z" fill-rule="evenodd"/></g></g></g></svg>
                        ${String(item.viewers).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')}
                    </span>
                </section>
            </a>
            `);
        });
    }

    if (filterChannels.length === 0)
        $('.list').append(`<section class="stream-item__empty">Empty</section>`);
}