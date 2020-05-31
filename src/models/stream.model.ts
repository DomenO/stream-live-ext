export enum Status {
    live, offline
}

export enum Service {
    twitch
}

export interface Stream {
    status: Status;
    service: Service;
    name: string;
    logo: string;
    link: string;
    notification: boolean;
    viewers: number;
}