// Utility functions for the ticker services
import ITickerServiceConstructor from '../../../interfaces/ITickerServiceConstructor';
import ITickerService from '../../../interfaces/ITickerService';

export function createTickerService(TickerServiceConstructor: ITickerServiceConstructor, ticker: string): ITickerService {
    return new TickerServiceConstructor(ticker);
}