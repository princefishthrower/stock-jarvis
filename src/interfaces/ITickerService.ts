import { FinvizMetricNames } from "../types/FinvizMetricData";

export default interface ITickerService {
    ticker: string;
    metrics: Record<FinvizMetricNames, string>;
    setMetrics(): Promise<void>;
}