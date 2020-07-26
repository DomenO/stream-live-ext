import * as React from 'react';
import {connect} from 'react-redux';

import {Channel, Status} from '../models/сhannel';

import ItemChannel, {PropItemChannel} from './ItemChannel';


interface PropListChannels {
    channels: Channel[];
    filterBy: FilterBy;
}

type FilterBy = 'offline' | 'online';

function ListChannels(props: PropListChannels) {
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
                title: channel.title,
                viewers:  String(channel.viewers).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '),
                upTime: calcUpTime(channel.startTime)
            }
    
        case 'offline':
            return props;
    }
}

function calcUpTime(startTime: Date): string {
    const z = (num: Number) => (num < 10 ? '0' : '') + num;

    const startTimeTs = new Date(startTime).getTime();
    const currentTs = new Date(new Date().toUTCString()).getTime();
    const upTime = new Date(currentTs - startTimeTs).getTime();

    let seconds = Math.floor(upTime / 1000);
    let minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    let hour = Math.floor(minute / 60);
    minute = minute % 60;

    return `${z(hour)}:${z(minute)}:${z(seconds)}`;
}

export default connect(
    (state: Map<string, Channel>) => ({
        channels: state ? Array.from(state.values()) : []
    })
)(ListChannels);