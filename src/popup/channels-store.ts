import {createStore, Action} from 'redux';

import {Channel} from '../models/сhannel';


const ACTION_SET = 'ACTION_SET';
const ACTION_UPDATE = 'ACTION_UPDATE';

interface ChannelsAction extends Action<string> {
    channels: Channel[];
};

export function setChannelsAction(channels: Channel[]): ChannelsAction {
    return {type: ACTION_SET, channels};
}

export function updateChannelAction(channel: Channel): ChannelsAction {
    return {type: ACTION_UPDATE, channels: [channel]};
}

export const channelsStore = createStore(
    (state: Map<string, Channel>, action: ChannelsAction) => {

        switch (action.type) {
            case ACTION_SET:
                return new Map(
                    action.channels.map(channel => (
                        [channel.id, channel]
                    ))
                );
        
            case ACTION_UPDATE:
                return state.set(action.channels[0].id, action.channels[0])
        }
        
        return state;
    }
);