import {Service} from './service';
import {Message, MessageType} from '../models/message';


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
        }
    }
);