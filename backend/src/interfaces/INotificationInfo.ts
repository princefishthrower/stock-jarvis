import INotificationTicker from "../../../shared/interfaces/INotificationTicker";
import Direction from "../enums/Direction";

export default interface INotificationInfo extends INotificationTicker {
    currentPrice: string;
    direction: Direction;
}
