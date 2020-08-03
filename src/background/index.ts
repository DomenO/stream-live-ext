import {Message, MessageType} from '../models/message';

import {App} from './app';


const app = new App();

chrome.runtime.onMessage.addListener(
    function (request: Message) {
        switch (request.event) {
            case MessageType.requestChannels:
                app.requestChannels();
                break;

            case MessageType.accountLogin:
                app.accountLogin(request.data);
                break;

            case MessageType.updateChannel:
                app.updateChannel(request.data);
                break;
        }
    }
);