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
        }
    }
);

async function requestStreams() {
    if (await twitch.checkLogin()) {
        const streams = await twitch.getStreams();

        chrome.runtime.sendMessage({
            message : 'outputStreams',
            data: streams
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