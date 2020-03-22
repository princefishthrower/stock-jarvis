export default interface INotificationTicker {
    ticker: string;
    abovePrice: number;
    belowPrice: number;
    belowMessage?: string;
    aboveMessage?: string;
}