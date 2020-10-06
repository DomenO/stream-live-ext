export interface Message {
    event: MessageType;
    data?: any;
}

export enum MessageType {
    accountLogin,
    requestChannels,
    listChannels,
    updateChannels,
    authorize,
    unauthorized,
    error
}