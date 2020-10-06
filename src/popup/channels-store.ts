import {createStore, Action} from 'redux';

import {Channel} from '../models/сhannel';
import {MessageType} from '../models/message';

import {runtimeMessageStore, sendRuntimeMessageAction} from './runtime-message-store';


const ACTION_SET = 'ACTION_SET';
const ACTION_UPDATE = 'ACTION_UPDATE';

interface ChannelsAction extends Action<string> {
    channels: Channel[];
};

export function setChannelsAction(channels: Channel[]): ChannelsAction {
    return {type: ACTION_SET, channels};
}

export function updateChannelsAction(channels: Channel[]): ChannelsAction {
    runtimeMessageStore.dispatch(
        sendRuntimeMessageAction({
            event: MessageType.updateChannels,
            data: channels
        })
    );
    
    return {type: ACTION_UPDATE, channels};
}

export const channelsStore = createStore(
    (state: Channel[], action: ChannelsAction) => {

        switch (action.type) {
            case ACTION_SET:
                return action.channels;
        
            case ACTION_UPDATE:
                let channel = state.find(channel => channel.id === action.channels[0].id);

                if (channel)
                    channel = Object.assign(channel, action.channels[0]);

                return [...state];
        }
        
        return state;
    }
);