import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Channel, Status} from '../models/сhannel';

import {updateChannelAction} from './channels-store';
import ItemChannel, {PropItemChannel, ChannelEventType} from './ItemChannel';


interface PropListChannels {
    channels: Channel[];
    filterBy: FilterBy;
    updateChannel: (channel: Channel) => void;
}

type FilterBy = 'offline' | 'online';

function ListChannels(props: PropListChannels) {
    const channels = processFilterChannels(props.channels, props.filterBy);

    const handleChange = (id: string, type: ChannelEventType) => {
        const channel = props.channels.find(item => item.id === id);

        if (!channel)
            return;

        switch (type) {
            case ChannelEventType.favorite:
                props.updateChannel({
                    ...channel,
                    favorite: !channel.favorite
                });
                break;

            case ChannelEventType.notification:
                props.updateChannel({
                    ...channel,
                    notification: !channel.notification
                });
                break;
        }
    }

    const items = 
        channels.map(item =>
            <ItemChannel 
                key={item.id}
                onChange={(id, type) => handleChange(id, type)} 
                {...getPropItemChannel(item, props.filterBy)}
            />
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
                .sort((a, b) => b.viewers - a.viewers)
                .sort((a, b) => Number(b.favorite) - Number(a.favorite));

        case 'offline':
            return channels
                .filter(channel => channel.status === Status.offline)
                .reverse()
                .sort((a, b) => Number(b.favorite) - Number(a.favorite));
    }
}

function getPropItemChannel(channel: Channel, filterBy: FilterBy): PropItemChannel {
    const props: PropItemChannel = {
        id: channel.id,
        link: channel.link,
        title: channel.name,
        logo: channel.logo,
        favorite: channel.favorite,
        notification: channel.notification
    };

    switch (filterBy) {
        case 'online':
            return {
                ...props,
                title: channel.title,
                viewers: String(channel.viewers).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '),
                upTime: calcUpTime(channel.startTimeTs)
            }
    
        case 'offline':
            return props;
    }
}

function calcUpTime(startTimeTs: number): string {
    const z = (num: Number) => (num < 10 ? '0' : '') + num;

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
    (state: Channel[]) => ({
        channels: state ?? []
    }),
    dispatch => ({
        updateChannel: bindActionCreators(updateChannelAction, dispatch)
    })
)(ListChannels);