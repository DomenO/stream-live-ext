export interface ShowNotification {
    id: string;
    title: string;
    message: string;
    image: string;
    lockTs?: number;
    onClick?: (id: string) => void;
}