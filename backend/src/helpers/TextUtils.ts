import Direction from "../enums/Direction";
import INotificationInfo from "../interfaces/INotificationInfo";
import INotificationText from "../interfaces/INotificationText";

export function generateNotificationText(
    notificationInfo: INotificationInfo
): INotificationText {
    const texts = getTexts(notificationInfo);
    const withAdditional = `Your additional message for this price trigger was: ${texts.additionalMessage}`;
    const withoutAdditional =
        "No additional message was written for this price trigger.";
    const final = "This email was issued by Ye Old Stock Tracker™";
    const fullText = `${texts.titleText}\n${
        notificationInfo.direction === "above" || notificationInfo.direction === "below"
            ? withAdditional
            : withoutAdditional
    }\n${final}`;
    return {
        titleText: texts.titleText,
        fullText,
    };
}

function getTexts(notificationInfo: INotificationInfo) {
    switch (notificationInfo.direction) {
        case Direction.BETWEEN:
            return {
                titleText:
                    notificationInfo.ticker +
                    " is " +
                    notificationInfo.direction +
                    " $" +
                    notificationInfo.belowPrice +
                    " and $" +
                    notificationInfo.abovePrice +
                    " at $" +
                    notificationInfo.currentPrice +
                    "!",
                additionalMessage: "",
            };
        case Direction.ABOVE:
            return {
                titleText:
                    notificationInfo.ticker +
                    " is " +
                    notificationInfo.direction +
                    " $" +
                    notificationInfo.abovePrice +
                    " at $" +
                    notificationInfo.currentPrice +
                    "!",
                additionalMessage: notificationInfo.aboveMessage,
            };
        case Direction.BELOW:
            return {
                titleText:
                    notificationInfo.ticker +
                    " is " +
                    notificationInfo.direction +
                    " $" +
                    notificationInfo.belowPrice +
                    " at $" +
                    notificationInfo.currentPrice +
                    "!",
                additionalMessage: notificationInfo.belowMessage,
            };
        default:
            return {titleText: notificationInfo.ticker + "status is unknown.", additionalMessage: ""};
    }
}
