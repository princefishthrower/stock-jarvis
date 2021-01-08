import FinvizTickerService from "../services/TickerServices/FinvizTickerService";
import ThinkOrSwimTickerService from "../services/TickerServices/ThinkOrSwimTickerService";
import { createTickerService } from "../services/TickerServices/utils/Utils";
import IUserSettings from "../../../shared/interfaces/IUserSettings";
import moment from "moment-timezone";

export default class TextHelper {
    public static async buildAudioUpdateText(
        settings: IUserSettings
    ): Promise<string> {
        // Generate text for each desired ticker user has defined
        let texts = await Promise.all(
            settings.audioUpdateSettings.tickers.map(async (ticker) => {
                return await this.buildTickerText(ticker);
            })
        );

        let tickerTexts = Array<string>();
        tickerTexts.push(this.buildHourAndMinutePreamble(settings));
        tickerTexts.push(...texts);
        tickerTexts.push("Have a nice day!");

        return tickerTexts.join(" ");
    }

    public static buildHourAndMinutePreamble(settings: IUserSettings): string {
        const now = moment()
            .tz("America/New_York")
            .format("ddd.h.mm")
            .split(".");
        const day = now[0];
        const hour = parseInt(now[1]);
        const minute = parseInt(now[2]);

        let minuteToSay;
        if (minute === 0) {
            minuteToSay = "o'clock";
        } else {
            // google wavenet is smart enough here to even read out ex. 'oh 5' when time is :05,
            // but we have to explicitly put the 0 in
            minuteToSay = TextHelper.pad(minute);
        }
        const daySaying = day === "Mon" ? "on Friday. " : "yesterday. ";

        let preamble =
            "Good morning " +
            settings.name +
            "! " +
            "It is " +
            hour.toString() +
            " " +
            minuteToSay +
            " eastern standard time. ";
        if (hour < 9) {
            preamble +=
                "Premarket trading has not yet begun. The following prices reflect those at market close " +
                daySaying;
        } else if (hour === 9 && minute === 0) {
            preamble +=
                "Good morning, " +
                settings.name +
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

        // const thinkOrSwimService = createTickerService(
        //     ThinkOrSwimTickerService,
        //     ticker
        // );
        // thinkOrSwimService.setMetrics();
        //
        // // determine direction and percentage to parse to say
        // if (thinkOrSwimService.metrics.netPercentChangeInDouble[0] === "-") {
        //     direction = "down";
        //     percentage = thinkOrSwimService.metrics.netPercentChangeInDouble.slice(
        //         1,
        //         thinkOrSwimService.metrics.netPercentChangeInDouble.length
        //     );
        // } else {
        //     direction = "up";
        //     percentage = thinkOrSwimService.metrics.netPercentChangeInDouble;
        // }

        // const priceParts = thinkOrSwimService.metrics.regularMarketLastPrice.split(
        //     "."
        // );

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
