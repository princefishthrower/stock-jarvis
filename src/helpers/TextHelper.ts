import FinvizTickerService from "../services/TickerServices/FinvizTickerService";
import settings from "../../settings.json";
import { createTickerService } from "../services/TickerServices/utils/Utils";

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

        return tickerTexts.join(" ");
    }

    public static buildHourAndMinutePreamble(): string {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        let minuteToSay;
        if (minute === 0) {
            minuteToSay = "o'clock";
        } else {
            // google wavenet is smart enough here to even read out ex. 'oh 5' when time is :05,
            // but we have to explicitly put the 0 in
            minuteToSay = TextHelper.pad(minute);
        }

        let preamble = "It is " + hour.toString() + " " + minuteToSay + ". ";
        if (hour === 9 && minute === 0) {
            preamble +=
                "Good morning, " +
                settings.username +
                ". Premarket trading is open. ";
        } else if (hour === 9 && minute === 30) {
            preamble += "Normal trading hours have begun. ";
        } else if (hour === 16 && minute === 0) {
            preamble += "Normal trading hours have closed. ";
        } else if (hour === 18 && minute === 0) {
            preamble += "After hours trading has just closed. ";
        } else if (hour > 18) {
            preamble += "After hours trading has closed. ";
        }
        return preamble;
    }

    public static async buildTickerText(ticker: string): Promise<string> {
        let direction, percentage;
        const finvizTickerService = createTickerService(
            FinvizTickerService,
            ticker
        );

        // TODO:
        // const tickerData = createTickerService(ThinkOrSwimService,ticker);

        await finvizTickerService.setMetrics();

        // determine direction and percentage to parse to say
        if (finvizTickerService.metrics.Change[0] === "-") {
            direction = "down";
            percentage = finvizTickerService.metrics.Change.slice(
                1,
                finvizTickerService.metrics.Change.length
            );
        } else {
            direction = "up";
            percentage = finvizTickerService.metrics.Change;
        }

        const priceParts = finvizTickerService.metrics.Price.split(".");

        const directionalText =
            ticker +
            " is trading " +
            direction +
            " " +
            percentage +
            ", at " +
            priceParts[0] +
            " dollars and " +
            priceParts[1] +
            " cents. ";

        return directionalText + "I repeat, " + directionalText;
    }

    private static pad(n: number): string {
        return n < 10 ? "0" + n.toString() : n.toString();
    }
}
