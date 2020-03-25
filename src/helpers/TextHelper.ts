import FinvizService from "../services/FinvizService";
import settings from "../../settings.json";

export default class TextHelper {
    public static async buildAudioUpdateText(): Promise<string> {

        // Generate text for each desired ticker user has defined
        let texts = await Promise.all(
            settings.audioUpdate.tickers.map(async ticker => {
                return await this.buildTickerText(ticker);
            })
        );

        let tickerTexts = Array<string>();
        tickerTexts.push(this.buildHourAndMinutePreamble());
        tickerTexts.push(...texts);
        tickerTexts.push("Have a nice day!");

        return tickerTexts.join(' ');
    }

    public static buildHourAndMinutePreamble(): string {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const minuteToSay = minute === 1 ? "o'clock" : minute.toString();

        let preamble = "It is " + hour.toString() + " " + minuteToSay + ". ";
        if (hour === 9 && minute === 1) {
            preamble +=
                "Good morning, " +
                settings.username +
                ". Premarket trading is open. ";
        } else if (hour === 9 && minute === 30) {
            preamble += "Normal trading hours have begun. ";
        } else if (hour === 16 && minute === 1) {
            preamble += "Normal trading hours have closed. ";
        } else if (hour === 18 && minute === 1) {
            preamble += "After hours trading has just closed. ";
        } else if (hour > 18) {
            preamble += "After hours trading has closed. ";
        }
        return preamble;
    }

    public static async buildTickerText(ticker: string): Promise<string> {
        const tickerData = new FinvizService(ticker);

        // TODO:
        // const tickerData = new ThinkOrSwimService(ticker);

        await tickerData.setMetrics();

        // determine direction to say
        const direction =
            tickerData.metrics.Change &&
                tickerData.metrics.Change.length > 0 &&
                tickerData.metrics.Change[0] === "-"
                ? "down"
                : "up";

        const priceParts = tickerData.metrics.Price.split('.');

        const directionalText =
            ticker +
            " is trading " +
            direction +
            " " +
            tickerData.metrics.Change.slice(
                1,
                tickerData.metrics.Change.length
            ) +
            ", at " +
            priceParts[0] + " dollars and " + priceParts[1] + " cents. ";

        return directionalText + "I repeat, " + directionalText;
    }
}
