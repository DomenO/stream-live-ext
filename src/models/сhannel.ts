export enum Status {
    live = 'live',
    offline = 'offline'
}

export enum ServiceType {
    twitch = 'twitch'
}

export interface Channel {
    id: string;
    status: Status;
    service: ServiceType;
    name: string;
    logo: string;
    link: string;
    title: string;
    viewers?: number;
    startTimeTs?: number;
    favorite?: boolean;
    notification?: boolean;
}