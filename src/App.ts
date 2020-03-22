import FinvizService from "./services/FinvizService";
import AudioHelper from "./helpers/AudioHelper";
import EmailHelper from "./helpers/EmailHelper";
import settings from "../settings.json";
import INotificationTicker from "./interfaces/INotificationTicker";

export default class App {
    public async runQuarterHourReading(): Promise<void> {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();

        let textToRead =
            "It is " + hour.toString() + " " + minute.toString() + ". ";
        if (hour === 9 && minute === 0) {
            textToRead +=
                "Good morning, " +
                settings.username +
                ". Premarket trading is open. ";
        } else if (hour === 9 && minute === 30) {
            textToRead += "Normal trading hours have begun. ";
        } else if (hour === 16 && minute === 0) {
            textToRead += "Normal trading hours have closed. ";
        } else if (hour === 18 && minute === 0) {
            textToRead += "After hours trading has just closed. ";
        } else if (hour > 18) {
            textToRead += "After hours trading has closed. ";
        }

        // Get finviz SPY data as javascript process
        const tickerData = new FinvizService(settings.audioUpdate.tickers[0]);
        await tickerData.setMetrics();

        // determine direction to say
        const direction =
            tickerData.metrics.Change &&
            tickerData.metrics.Change.length > 0 &&
            tickerData.metrics.Change[0] === "-"
                ? "down"
                : "up";

        textToRead +=
            settings.audioUpdate.tickers[0] +
            " is trading " +
            direction +
            " " +
            tickerData.metrics.Change.slice(
                1,
                tickerData.metrics.Change.length
            ) +
            ", at " +
            tickerData.metrics.Price +
            ". ";

        await AudioHelper.createMP3(textToRead);
        await AudioHelper.emitMP3();
    }

    public async runNotificationCheck() {
        const notificationTickers: Array<INotificationTicker> =
            settings.notificationUpdate.notificationTickers;

        notificationTickers.forEach(async notificationTicker => {
            const tickerData = new FinvizService(notificationTicker.ticker);
            await tickerData.setMetrics();
            const price = parseFloat(tickerData.metrics.Price);

            if (price > notificationTicker.abovePrice) {
                EmailHelper.sendNotificationEmail(
                    notificationTicker.ticker,
                    "above",
                    notificationTicker.abovePrice.toString(),
                    tickerData.metrics.Price,
                    (notificationTicker.aboveMessage = undefined ?? "")
                );
            }
            if (price < notificationTicker.belowPrice) {
                EmailHelper.sendNotificationEmail(
                    notificationTicker.ticker,
                    "below",
                    notificationTicker.belowPrice.toString(),
                    tickerData.metrics.Price,
                    (notificationTicker.belowMessage = undefined ?? "")
                );
            }
        });
    }
}
