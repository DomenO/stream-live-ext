export enum Status {
    live = 'live',
    replay = 'replay',
    offline = 'offline'
}

export enum ServiceType {
    twitch = 'twitch'
}

export enum ImportType {
    independent,
    account
}

export interface Channel {
    id: string;
    status: Status;
    service: ServiceType;
    name: string;
    logo: string;
    link: string;
    title: string;
    importType: ImportType;
    viewers?: number;
    startTimeTs?: number;
    favorite?: boolean;
    notification?: boolean;
}