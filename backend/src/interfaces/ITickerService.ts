import { FinvizMetricNames } from "../types/FinvizMetricNames";
import { ThinkOrSwimMetricNames } from "../types/ThinkOrSwimMetricNames";

export default interface ITickerService {
    ticker: string;
    metrics: Record<FinvizMetricNames|ThinkOrSwimMetricNames, string>;
    setMetrics(): Promise<void>;
}