import cron from "node-cron";
import App from "./src/App";
import settings from './settings.json';

// The initial bootstrap class
const app = new App();

// Raspberry Pi system timezone is in EST, same as the market

// “At every nth minute past every hour from 9 through 18 on every day-of-week from Monday through Friday.”
// cron.schedule("*/" + settings.audioUpdate.minuteInterval + " 9-18 * * 1-5", async () => {
//     await app.runQuarterHourReading();
// });

// “At every nth minute past every hour from 9 through 18 on every day-of-week from Monday through Friday.”
// cron.schedule("*/" + settings.notificationUpdate.minuteInterval + " 9-18 * * 1-5", async () => {
//     await app.runNotificationCheck();
// });

cron.schedule("*/10 * * * *", async () => {
    await app.runNotificationCheck();
});
