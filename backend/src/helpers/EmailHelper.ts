import INotificationText from "../interfaces/INotificationText";
const mailjet = require("node-mailjet").connect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE
);

export default class EmailHelper {
    public static async sendNotificationEmail(
        notificationText: INotificationText
    ) {
        const request = mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    From: {
                        Email: "hi@fullstackcraft.com",
                        Name: notificationText.titleText,
                    },
                    To: [
                        {
                            Email: "frewin.christopher@gmail.com",
                            Name: "Chris",
                        },
                    ],
                    TemplateID: 2175037,
                    TemplateLanguage: true,
                    Subject: notificationText.titleText,
                    Variables: {
                        title: notificationText.titleText,
                        message: notificationText.fullText,
                    },
                },
            ],
        });
        request
            .then((result: { body: any }) => {

            })
            .catch((err: { statusCode: any }) => {
                console.log(err.statusCode);
            });
    }
}
