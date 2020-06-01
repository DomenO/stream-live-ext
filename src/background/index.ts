import {Twitch} from './twitch';


const twitch = new Twitch();

refreshBadge();

chrome.runtime.onMessage.addListener(
    function(request) {
        switch (request.message) {
            case 'requestStreams':
                requestList('Streams');
                break;

            case 'requestChannels':
                requestList('Channels');
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

async function requestList(type: 'Streams' | 'Channels') {
    if (await twitch.checkLogin()) {
        
        if (type === 'Streams')
            chrome.runtime.sendMessage({
                message: 'listStreams',
                data: await twitch.getStreams()
            });

        else if (type === 'Channels')
            chrome.runtime.sendMessage({
                message: 'listChannels',
                data: await twitch.getChannels()
            });

    } else 
        chrome.runtime.sendMessage({
            message: 'login'
        });
}

async function refreshBadge() {
    if(!await twitch.checkLogin()) return;
    
    const count = await twitch.getCountStreams();

    if (count > 0) {
        chrome.browserAction.setBadgeBackgroundColor({color: '#2D2D2D'});
        chrome.browserAction.setBadgeText({text: String(count)});
    }

    setTimeout(() => refreshBadge(), 5 * 60 * 1000);
}