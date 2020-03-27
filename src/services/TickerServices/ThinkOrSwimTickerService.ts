import { FinvizMetricNames } from "../../types/FinvizMetricData";
import ITickerService from "../../interfaces/ITickerService";

const fetch = require("node-fetch");

export default class ThinkOrSwimTickerService implements ITickerService {
    public ticker: string;
    public url: string;
    public metrics: Record<FinvizMetricNames, string>;

    constructor(ticker: string) {
        this.ticker = ticker.toUpperCase();
        // TODO: get url from ThinkOrSwim
        this.url = "DEFINE ME";
        this.metrics = { Price: "", Change: "", "P/E": "", EPS: "" };
    }
    public async setMetrics(): Promise<void> {
        await fetch(this.url)
            .then((res: any) => res.text())
            .then((body: string) => {
                // Get tickers we need to fulfill FinvizMetricNames and set them here
                // (Should be a lot easier since its a real API and we don't need to scrape)
            });
    }
}
