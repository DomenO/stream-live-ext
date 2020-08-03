export enum Status {
    live = 'live',
    offline = 'offline'
}

export enum Service {
    twitch = 'twitch'
}

export interface Channel {
    id: string;
    status: Status;
    service: Service;
    name: string;
    logo: string;
    link: string;
    title: string;
    viewers?: number;
    startTimeTs?: number;
    favorite?: boolean;
    notification?: boolean;
}