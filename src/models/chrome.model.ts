declare const chrome: {
    runtime: {
        sendMessage: (message: Message) => void,
        onMessage: {
            addListener: (
                fn: (message: Message) => void 
            ) => void;
        }
    }
};

interface Message {
    message: string;
    data?: any;
}