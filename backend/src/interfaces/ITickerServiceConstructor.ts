import ITickerService from "./ITickerService";

export default interface ITickerServiceConstructor {
    new (ticker: string): ITickerService;
}