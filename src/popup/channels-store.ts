import {createStore, Action} from 'redux';

import {Channel} from '../models/сhannel';


const ACTION_SET = 'ACTION_SET';
const ACTION_UPDATE = 'ACTION_UPDATE';

interface ChannelsAction extends Action<string> {
    channels: Channel[];
};

export function setChannelsAction(channels: Channel[]): ChannelsAction {
    const favorites = loadFavoritesLocalStore();

    return {
        type: ACTION_SET,
        channels: channels.map(channel => ({
            ...channel,
            favorite: favorites.has(channel.id)
        }))
    };
}

export function updateChannelAction(channel: Channel): ChannelsAction {
    const favorites = loadFavoritesLocalStore();
    
    channel.favorite ?
        favorites.add(channel.id) :
        favorites.delete(channel.id);

    saveFavoritesLocalStore(favorites);

    return {type: ACTION_UPDATE, channels: [channel]};
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

function loadFavoritesLocalStore(): Set<string> {
    return new Set(JSON.parse(localStorage.getItem('favorites')) || []);
}

function saveFavoritesLocalStore(favorites: Set<string>) {
    localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
}
