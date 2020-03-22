import PythonHelper from "./helpers/PythonHelper";
import AudioHelper from "./helpers/AudioHelper";
import EmailHelper from "./helpers/EmailHelper";
import settings from "../settings.json";
import INotificationTicker from "./interfaces/INotificationTicker";
import { UpdateType } from "./enums/UpdateType";

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

        // Write SPY data to JSON via python script
        const finvizMetrics = await PythonHelper.getFinvizMetrics(
            UpdateType.AUDIO_UPDATE,
            settings.audioUpdate.tickers[0]
        );

        // determine direction to say
        const direction =
            finvizMetrics.Change &&
            finvizMetrics.Change.length > 0 &&
            finvizMetrics.Change[0] === "-"
                ? "down"
                : "up";

        textToRead +=
            settings.audioUpdate.tickers[0] +
            " is trading " +
            direction +
            " " +
            finvizMetrics.Change.slice(1, finvizMetrics.Change.length) +
            ", at " +
            finvizMetrics.Price +
            ". ";

        await AudioHelper.createMP3(textToRead);
        await AudioHelper.emitMP3();
    }

    public async runNotificationCheck() {
        const notificationTickers: Array<INotificationTicker> =
            settings.notificationUpdate.notificationTickers;

        notificationTickers.forEach(async notificationTicker => {
            const finvizMetrics = await PythonHelper.getFinvizMetrics(
                UpdateType.NOTIFICATION_UPDATE,
                notificationTicker.ticker
            );
            console.log(notificationTicker);
            console.log(finvizMetrics.Price);
            const price = parseFloat(finvizMetrics.Price);
            
            if (price > notificationTicker.abovePrice) {
                EmailHelper.sendNotificationEmail(
                    notificationTicker.ticker,
                    "above",
                    notificationTicker.abovePrice.toString(),
                    finvizMetrics.Price,
                    (notificationTicker.aboveMessage = undefined ?? "")
                );
            }
            if (price < notificationTicker.belowPrice) {
                EmailHelper.sendNotificationEmail(
                    notificationTicker.ticker,
                    "below",
                    notificationTicker.belowPrice.toString(),
                    finvizMetrics.Price,
                    (notificationTicker.belowMessage = undefined ?? "")
                );
            }
        });
    }
}
