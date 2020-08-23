import {ShowNotification} from './show-notification.model';


export class NotificationManager {
    private lockNotifications = new Set<string>();

    show(param: ShowNotification) {
        if (this.lockNotifications.has(param.id)) return;

        if (param.lockTs) {
            this.lockNotifications.add(param.id);
            setTimeout(() => this.lockNotifications.delete(param.id), param.lockTs)
        }

        chrome.notifications.create(
            param.id,
            {
                type: 'basic',
                title: param.title,
                message: param.message,
                iconUrl: param.image
            }
        );

        if (param.onClick && !chrome.notifications.onClicked.hasListener(param.onClick))
            chrome.notifications.onClicked.addListener(param.onClick);
    }
}