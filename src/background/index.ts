import {Stream, Status, Service} from '../models/stream.model';


chrome.runtime.onMessage.addListener(
    function(request) {
        switch (request.message) {
            case 'requestStreams':
                requestStreams();
                break;
        }
    }
);

function requestStreams() {
    const clientId = '332vpf76orpamw6yj9jqps6byjgj8n';

    fetch('https://api.twitch.tv/kraken/users?login=replu', {
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': clientId,
        }
    })
        .then(r => r.json())
        .then(r => 
            fetch(`https://api.twitch.tv/kraken/users/${r.users[0]._id}/follows/channels?sortby=login&limit=100`, {
                headers: {
                    'Accept': 'application/vnd.twitchtv.v5+json',
                    'Client-ID': clientId,
                }
            })
        )
        .then(r => r.json())
        .then(r => {
            console.log(r);
            return fetch(`https://api.twitch.tv/kraken/streams/?channel=${r.follows.map(i => i.channel._id).join(',')}&limit=100`, {
                headers: {
                    'Accept': 'application/vnd.twitchtv.v5+json',
                    'Client-ID': clientId,
                }
            })
        })
        .then(r => r.json())
        .then(r => {
            console.log(r);
            chrome.runtime.sendMessage({
                message : 'setStreams',
                data: r.streams.map(item => ({
                    status: Status.live,
                    service: Service.twitch,
                    name: item.channel.display_name,
                    logo: item.channel.logo,
                    viewers: item.viewers,
                    link: item.channel.url,
                    notification: false
                }))
            });
        });
}