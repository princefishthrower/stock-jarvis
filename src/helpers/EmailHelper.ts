import FinvizTickerService from "../services/TickerServices/FinvizTickerService";
import settings from "../../settings.json";
import INotificationTicker from "../interfaces/INotificationTicker";
import { createTickerService } from '../services/TickerServices/utils/Utils';
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

export default class EmailHelper {
    public static sendAllNotificationEmails() {
        const notificationTickers: Array<INotificationTicker> =
            settings.notificationUpdate.notificationTickers;

        notificationTickers.forEach(async notificationTicker => {
            const finvizTickerService = createTickerService(FinvizTickerService, notificationTicker.ticker);
            await finvizTickerService.setMetrics();
            const price = parseFloat(finvizTickerService.metrics.Price);

            if (price > notificationTicker.abovePrice) {
                this.sendNotificationEmail(
                    notificationTicker.ticker,
                    "above",
                    notificationTicker.abovePrice.toString(),
                    finvizTickerService.metrics.Price,
                    (notificationTicker.aboveMessage = undefined ?? "")
                );
            }
            if (price < notificationTicker.belowPrice) {
                this.sendNotificationEmail(
                    notificationTicker.ticker,
                    "below",
                    notificationTicker.belowPrice.toString(),
                    finvizTickerService.metrics.Price,
                    (notificationTicker.belowMessage = undefined ?? "")
                );
            }
        });
    }

    public static async sendNotificationEmail(
        ticker: string,
        direction: string,
        notificationPrice: string,
        currentPrice: string,
        additionalMessage: string
    ) {
        const accessToken = this.getAccessToken();
        const smtpTransport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "frewin.christopher@gmail.com",
                clientId: process.env.CHRISFREW_IN_OAUTH_2_CLIENT_ID,
                clientSecret: process.env.CHRISFREW_IN_OAUTH_2_CLIENT_SECRET,
                refreshToken: process.env.CHRISFREW_IN_OAUTH_2_REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        const mailOptions = {
            from: "frewin.christopher@gmail.com",
            to: "frewin.christopher@gmail.com",
            subject:
                ticker +
                " is " +
                direction +
                " $" +
                notificationPrice +
                " at $" +
                currentPrice,
            generateTextFromHTML: true,
            html:
                additionalMessage !== ""
                    ? "Your additional message for this price trigger was: " +
                    additionalMessage +
                    "\nThis email was issued by Ye Old Stock Tracker™"
                    : "No additional message tied to this price trigger. This email was issued by Ye Old Stock Tracker™"
        };

        smtpTransport.sendMail(mailOptions, (error: any, response: any) => {
            smtpTransport.close();
        });
    }
    public static getAccessToken() {
        const oauth2Client = new OAuth2(
            process.env.CHRISFREW_IN_OAUTH_2_CLIENT_ID, // ClientID
            process.env.CHRISFREW_IN_OAUTH_2_CLIENT_SECRET, // Client Secret
            "https://developers.google.com/oauthplayground" // Redirect URL
        );
        oauth2Client.setCredentials({
            refresh_token: process.env.CHRISFREW_IN_OAUTH_2_REFRESH_TOKEN
        });
        return oauth2Client.getAccessToken();
    }
}
