declare const chrome: {
    runtime: {
        sendMessage: (message: Message) => void,
        onMessage: {
            addListener: (
                fn: (message: Message) => void 
            ) => void;
        }
    },
    browserAction: any;
};

interface Message {
    message: string;
    data?: any;
}