import {createStore, Action} from 'redux';

import {Message} from '../models/message';


type MessageAction = Action & Message;

export enum ActionType {
    request,
    response
}

export const runtimeStore = createStore(
    (state: Message, action: MessageAction) => {
        const type = action.type;
        delete action.type;

        if (type === ActionType.request) {
            chrome.runtime.sendMessage(action);
        }

        return action;
    }
);