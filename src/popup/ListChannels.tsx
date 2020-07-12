import * as React from 'react';

import {Channel, Status} from '../models/сhannel';
import {ItemChannel, PropItemChannel} from './ItemChannel';


interface PropListChannels {
    channels: Channel[];
    filterBy: FilterBy;
}

type FilterBy = 'offline' | 'online';

export function ListChannels(props: PropListChannels) {
    const channels = processFilterChannels(props.channels, props.filterBy);

    const items = 
        channels.map(item =>
            <ItemChannel key={item.id} {
                ...getPropItemChannel(item, props.filterBy)
            } />
        );

    const empty = <section className="stream-item__empty">Empty</section>;

    return (
        <main className="list">
            {channels.length > 0 ? items : empty}
        </main>
    );
}

function processFilterChannels(channels: Channel[], filterBy: FilterBy) {
    switch (filterBy) {
        case 'online':
            return channels
                .filter(channel => channel.status === Status.live)
                .sort((a, b) => b.viewers - a.viewers);

        case 'offline':
            return channels
                .filter(channel => channel.status === Status.offline)
                .reverse();
    }
}

function getPropItemChannel(channel: Channel, filterBy: FilterBy): PropItemChannel {
    const props = {
        link: channel.link,
        title: channel.name,
        logo: channel.logo
    };

    switch (filterBy) {
        case 'online':
            return {
                ...props,
                viewers:  String(channel.viewers).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '),
                upTime: calcUpTime(channel.startTime)
            }
    
        case 'offline':
            return props;
    }
}

function calcUpTime(startTime: Date): string {
    const date = new Date();
    const upTime = new Date(
        date.getTime() - new Date(startTime).getTime() + date.getTimezoneOffset() * 60 * 1000
    )
        .toLocaleTimeString('default', {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit'
        });

    return upTime;
}