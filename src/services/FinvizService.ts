const JSSoup = require("jssoup").default;
const fetch = require("node-fetch");

export default class FinvizTicker {
    public static ticker: string;
    public static url: string;
    public metrics: any;

    private readonly validationToken: string = "We cover only stocks and ETFs listed on NYSE, NASDAQ, and AMEX. International and OTC/PK are not available.";

    constructor(ticker: string) {
        FinvizTicker.ticker = ticker.toUpperCase();
        FinvizTicker.url =
            "http://finviz.com/quote.ashx?t=" + FinvizTicker.ticker;
    }
    public async setMetrics() {

        await fetch(FinvizTicker.url)
            .then((res: any) => res.text())
            .then((body: any) => {
                if (!body.includes(this.validationToken)) {
                    throw new Error(`Stock ticker ${FinvizTicker.ticker} does not exist on the Finviz.`);
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
                        throw new Error("Dude, the Finviz table doesn't have an even number of columns!");
                    }

                    const colTexts = cols.map((col: any) => col.text);

                    const keys = colTexts
                        .filter((colText: any, index: number) => index % 2 === 0)
                        .map((key: any) => key.toString());

                    const values = colTexts
                        .filter((colText: any, index: number) => index % 2 !== 0)
                        .map((value: any) => value.toString());

                    const keyValuePairs = keys.map(function (
                        key: string,
                        index: number
                    ) {
                        return [key, values[index]];
                    });

                    // TODO: Don't know your type here ...
                    // let metrics : { [id: string] : string; } = {};
                    keyValuePairs.forEach((keyValue: string[]) => {
                        this.metrics[keyValue[0]] = keyValue[1];
                    });
                });
            });
    }
}
