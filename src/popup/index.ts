import {Popup} from './popup';
import {Message, MessageType} from '../models/message';


const popup = new Popup();

chrome.runtime.onMessage.addListener(
    function (request: Message) {
        switch (request.event) {
            case MessageType.listChannels:
                popup.listChannels(request.data);
                break;

            case MessageType.unauthorized:
                popup.unauthorized();
                break;

            case MessageType.authorize:
                popup.authorize();
                break;

            case MessageType.error:
                popup.error();
                break;
        }
    }
);
