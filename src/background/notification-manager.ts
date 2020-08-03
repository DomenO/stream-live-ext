export interface ShowNotification {
    id: string;
    title: string;
    message: string;
    image: string;
}

export class NotificationManager {

    show(param: ShowNotification) {
        chrome.notifications.create(
            param.id,
            {
                type: 'basic',
                title: param.title,
                message: param.message,
                iconUrl: param.image
            }
        );
    }

    addClickEvent(callback: (id: string) => void) {
        chrome.notifications.onClicked.addListener(callback);
    }
}