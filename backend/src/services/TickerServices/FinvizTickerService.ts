import { FinvizMetricNames } from "../../types/FinvizMetricNames";
import ITickerService from "../../interfaces/ITickerService";
import { ThinkOrSwimMetricNames } from "../../types/ThinkOrSwimMetricNames";

const JSSoup = require("jssoup").default;
const fetch = require("node-fetch");

export default class FinvizTickerService implements ITickerService {
    public ticker: string;
    public url: string;
    public metrics: Record<FinvizMetricNames | ThinkOrSwimMetricNames, string>;

    private static readonly noResultsText: string = "No results found for";

    constructor(ticker: string) {
        this.ticker = ticker.toUpperCase();
        this.url = "http://finviz.com/quote.ashx?t=" + this.ticker;
        this.metrics = {
            Price: "",
            Change: "",
            "P/E": "",
            EPS: "",
            regularMarketLastPrice: "",
            netPercentChangeInDouble: "",
            peRatio: ""
        };
    }
    public async setMetrics() {
        await fetch(this.url)
            .then((res: any) => res.text())
            .then((body: string) => {
                if (body.includes(FinvizTickerService.noResultsText)) {
                    throw new Error(
                        `Stock ticker ${this.ticker} could not be found on Finviz.`
                    );
                }

                const soup = new JSSoup(body);
                // Extract the main table with ticker data and create a list of the rows in the table
                const table = soup.find("table", { class: "snapshot-table2" });
                const rows = table.findAll("tr");

                // Loop through the rows and build a dictionary of the elements
                return rows.map((row: any) => {
                    // Extracts the columns of each row
                    const cols = row.findAll("td");

                    // Check if there is an even number of columns (should always be)
                    if (cols.length % 2 == 1) {
                        throw new Error(
                            "Dude, the Finviz table doesn't have an even number of columns!"
                        );
                    }

                    const colTexts = cols.map((col: any) => col.text);

                    const keys = colTexts
                        .filter(
                            (colText: any, index: number) => index % 2 === 0
                        )
                        .map((key: any) => key.toString());

                    const values = colTexts
                        .filter(
                            (colText: any, index: number) => index % 2 !== 0
                        )
                        .map((value: any) => value.toString());

                    const keyValuePairs = keys.map(function(
                        key: FinvizMetricNames,
                        index: number
                    ) {
                        return { key: key, value: values[index] };
                    });

                    keyValuePairs.forEach(
                        (keyValue: {
                            key: FinvizMetricNames;
                            value: string;
                        }) => {
                            this.metrics[keyValue.key] = keyValue.value;
                        }
                    );
                });
            });
    }
}
