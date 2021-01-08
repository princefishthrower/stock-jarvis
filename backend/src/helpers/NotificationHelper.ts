import INotificationTicker from "../../../shared/interfaces/INotificationTicker";
import IUserSettings from "../../../shared/interfaces/IUserSettings";
import Direction from "../enums/Direction";
import FinvizTickerService from "../services/TickerServices/FinvizTickerService";
import { createTickerService } from "../services/TickerServices/utils/Utils";
import EmailHelper from "./EmailHelper";
import SlackHelper from "./SlackHelper";
import { generateNotificationText } from "./TextUtils";

export function sendAllNotifications(settings: IUserSettings) {
    const notificationTickers: Array<INotificationTicker> =
        settings.notificationUpdateSettings.tickers;

    notificationTickers.forEach(async (notificationTicker) => {
        const finvizTickerService = createTickerService(
            FinvizTickerService,
            notificationTicker.ticker
        );
        await finvizTickerService.setMetrics();
        const price = parseFloat(finvizTickerService.metrics.Price);
        const direction = getDirectionString(price, notificationTicker);
        const notificationText = generateNotificationText({
            ...notificationTicker,
            direction,
            currentPrice: finvizTickerService.metrics.Price,
        });

        // for now we have both an email update and a slack update
        settings.notificationUpdateSettings.emails &&
            EmailHelper.sendNotificationEmail(notificationText);
        settings.notificationUpdateSettings.slackMessages &&
            SlackHelper.sendNotificationSlackMessage(notificationText);
    });
}

function getDirectionString(
    price: number,
    notificationTicker: INotificationTicker
) {
    if (price > notificationTicker.abovePrice) {
        return Direction.ABOVE;
    }
    if (price < notificationTicker.belowPrice) {
        return Direction.BELOW;
    }
    return Direction.BETWEEN;
}
