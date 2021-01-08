import INotificationTicker from './INotificationTicker';

// This is the shape of our JSON type in our table.
// The user defined settings object is always validated against this interface before being saved to db
export default interface IUserSettings {
    name: string;
    audioUpdateSettings: {
        tickers: Array<string>;
        interval: number;
    }
    notificationUpdateSettings: {
        tickers: Array<INotificationTicker>;
        interval: number;
        emails: boolean;
        slackMessages: boolean;
    }
}
