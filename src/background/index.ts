import {Twitch} from './twitch';

const twitch = new Twitch();

let timeout: number;

refreshBadge();

chrome.runtime.onMessage.addListener(
    function(request) {
        switch (request.message) {
            case 'requestChannels':
                requestChannels();
                break;

            case 'accountImport':
                accountImport(request.data);
                break;
        }
    }
);

async function accountImport(name: string) {    
    if (await twitch.login(name)) {
        await refreshBadge();
        chrome.runtime.sendMessage({
            message: 'loginSuccessful'
        });

    } else
        chrome.runtime.sendMessage({
            message: 'accountNotFound'
        });
}

async function requestChannels() {
    if (await twitch.checkLogin())
        chrome.runtime.sendMessage({
            message: 'listChannels',
            data: await twitch.getChannels()
        });

    else 
        chrome.runtime.sendMessage({
            message: 'login'
        });
}

async function refreshBadge() {
    if(!await twitch.checkLogin()) return;
    
    const count = await twitch.getCountStreams();

    chrome.browserAction.setBadgeBackgroundColor({color: '#2D2D2D'});
    chrome.browserAction.setBadgeText({text: count ? String(count) : ''});

    clearTimeout(timeout);
    timeout = setTimeout(() => refreshBadge(), 5 * 60 * 1000);
}