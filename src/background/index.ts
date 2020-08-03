import {Message, MessageType} from '../models/message';

import {Service} from './service';


const service = new Service();

chrome.runtime.onMessage.addListener(
    function (request: Message) {
        switch (request.event) {
            case MessageType.requestChannels:
                service.requestChannels();
                break;

            case MessageType.accountLogin:
                service.accountLogin(request.data);
                break;

            case MessageType.updateChannel:
                service.updateChannel(request.data);
                break;
        }
    }
);