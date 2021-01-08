import { FinvizMetricNames } from "../../types/FinvizMetricNames";
import { ThinkOrSwimMetricNames } from "../../types/ThinkOrSwimMetricNames";
import ITickerService from "../../interfaces/ITickerService";

const fetch = require("node-fetch");

export default class ThinkOrSwimTickerService implements ITickerService {
    public ticker: string;
    public url: string;
    public metrics: Record<FinvizMetricNames|ThinkOrSwimMetricNames, string>;
    public static readonly bearerToken = process.env.THINK_OR_SWIM_BEARER_TOKEN

    constructor(ticker: string) {
        this.ticker = ticker.toUpperCase();
        this.url = "https://api.tdameritrade.com/v1/marketdata/quotes?symbol=" + this.ticker;
        this.metrics = { Price: "", Change: "", "P/E": "", EPS: "", regularMarketLastPrice: "", netPercentChangeInDouble: "", peRatio: "" };
    }
    public async setMetrics(): Promise<void> {
        try {
        await fetch(this.url, {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': ThinkOrSwimTickerService.bearerToken,
                'Content-Type': 'application/json'
            }
        })
            .then((res: any) => res.json())
            .then((body: any) => {
                if ('error' in body) {
                    // do something
                } else {
                    const tickerData = body[this.ticker];

                    // TODO: fix! Do this dynamically! (how can we reduce two sources, finviz, and thinkorswim to the same generic type?)
                    this.metrics.regularMarketLastPrice = tickerData.regularMarketLastPrice.toString();
                    this.metrics.netPercentChangeInDouble = tickerData.netPercentChangeInDouble.toString();
                    this.metrics.peRatio = tickerData.peRatio.toString();
                }
            });
        } catch (err) {
            console.log(err);
        }
    }
}
