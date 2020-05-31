import {Channel, Status, Service} from '../models/сhannel';
import {Twitch} from './twitch';


const twitch = new Twitch();

refreshBadge();

chrome.runtime.onMessage.addListener(
    function(request) {
        switch (request.message) {
            case 'requestStreams':
                requestStreams();
                break;
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
    twitch.logout();
    twitch.login(name);
}

async function requestChannels() {
    if (await twitch.checkLogin()) {
        chrome.runtime.sendMessage({
            message : 'listChannels',
            data: await twitch.getChannels()
        });
    } else if(await twitch.login('Replu')) {
        await requestChannels();
        await refreshBadge();
    }
}

async function requestStreams() {
    if (await twitch.checkLogin()) {
        chrome.runtime.sendMessage({
            message : 'listStreams',
            data: await twitch.getStreams()
        });
    } else if(await twitch.login('Replu')) {
        await requestStreams();
        await refreshBadge();
    }
}


async function refreshBadge() {
    if(!await twitch.checkLogin()) return;
    
    const count = await twitch.getCountStreams();

    if (count > 0) {
        chrome.browserAction.setBadgeBackgroundColor({color: '#2d2d2d'});
        chrome.browserAction.setBadgeText({text: String(count)});
    }

    setTimeout(() => refreshBadge(), 5 * 60 * 1000);
}