import {createStore, Action} from 'redux';

import {Message} from '../models/message';


const ACTION_REQUEST = 'ACTION_REQUEST';
const ACTION_RESPONSE = 'ACTION_RESPONSE';

interface RuntimeMessageAction extends Action<string> {
    message: Message;
};

export function sendRuntimeMessage(message: Message): RuntimeMessageAction {
    return {type: ACTION_REQUEST, message};
}

export function getRuntimeMessage(message: Message): RuntimeMessageAction {
    return {type: ACTION_RESPONSE, message};
}

export const runtimeMessageStore = createStore(
    (state: Message, action: RuntimeMessageAction) => {

        if (action.type === ACTION_REQUEST) {
            chrome.runtime.sendMessage(action.message);
        }

        return action.message;
    }
);