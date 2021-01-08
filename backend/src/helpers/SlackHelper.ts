import fetch from "node-fetch";
import INotificationText from "../interfaces/INotificationText";

export default class SlackHelper {
    public static sendNotificationSlackMessage(
        notificationText: INotificationText
    ) {
        fetch(process.env.FULL_STACK_CRAFT_STOCK_BOT_WEBHOOK_URL || "", {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                text: notificationText.fullText,
            }),
        });
    }
}
