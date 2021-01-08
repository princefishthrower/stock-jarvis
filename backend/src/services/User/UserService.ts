import Users from "../../model/Users";
import { sign } from "../../helpers/TokenHelper";
import { Op } from "sequelize";

export function generateDefaultSettingsWithName(name: string) {
    return {
        name: name,
        audioUpdateSettings: {
            tickers: ["SPY"],
            interval: 30,
        },
        notificationUpdateSettings: {
            tickers: [
                {
                    ticker: "SPY",
                    belowPrice: 200.0,
                    abovePrice: 300.0,
                    aboveMessage: "Wow! SPY is above 300!",
                    belowMessage: "Wow! SPY is below 200!",
                },
            ],
            interval: 15,
        },
    };
}

// type guard against the userSettings - must uphold IUserSettings
export function isValidSettingsObject(settings: any): boolean {
    const meetsSettingsShape =
        settings.name &&
        typeof settings.name === "string" &&
        settings.audioUpdateSettings &&
        typeof settings.audioUpdateSettings === "object" &&
        settings.audioUpdateSettings.tickers &&
        settings.audioUpdateSettings.tickers.length &&
        typeof settings.audioUpdateSettings.tickers === "object" &&
        settings.audioUpdateSettings.interval &&
        typeof settings.audioUpdateSettings.interval === "number" &&
        settings.notificationUpdateSettings &&
        typeof settings.notificationUpdateSettings === "object" &&
        settings.notificationUpdateSettings.tickers &&
        settings.notificationUpdateSettings.tickers.length &&
        typeof settings.notificationUpdateSettings.tickers === "object" &&
        settings.notificationUpdateSettings.tickers &&
        typeof settings.notificationUpdateSettings.tickers === "number";

    // check shape of audio update tickers
    if (settings.audioUpdateSettings.tickers.length > 0) {
        for (const ticker in settings.audioUpdateSettings.tickers) {
            if (typeof ticker !== "string") {
                return false;
            }
        }
    }

    const hasCorrectShape = (ticker: any) =>
        !ticker.ticker ||
        typeof ticker.ticker !== "string" ||
        !ticker.belowPrice ||
        typeof ticker.belowPrice !== "number" ||
        !ticker.abovePrice ||
        typeof ticker.abovePrice !== "number" ||
        !ticker.aboveMessage ||
        typeof ticker.aboveMessage !== "string" ||
        !ticker.belowMessage ||
        typeof ticker.belowMessage !== "string";

    // check shape of notification update tickers
    if (settings.notificationUpdateSettings.tickers.length > 0) {
        if (
            !settings.notificationUpdateSettings.tickers.every(hasCorrectShape)
        ) {
            return false;
        }
    }

    return meetsSettingsShape;
}

export async function createUser(email: string, name: string): Promise<string> {
    const user = await Users.create({
        email: email,
        settings: generateDefaultSettingsWithName(name),
    });
    if (user) {
        // return JSON.stringify(user.settings);
        return sign(user.id);
    }
    // TODO: error handling
    return "";
}

export async function getUser(email: string): Promise<Users | null> {
    return await Users.findOne({
        where: {
            email: {
                [Op.eq]: email,
            },
        },
    });
}
