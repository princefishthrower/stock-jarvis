import cron from "node-cron";
import App from "./src/App";
import settings from './settings.json';
import env from './src/env/.env.json';

// The initial bootstrap class
const app = new App();

// Note that Raspberry Pi system timezone is in EST, same as the market
if (env.NODE_ENV === "DEVELOP") {
    app.runAudioUpdate();
} else {
    // At most once per hour (0 in minute component) OR
    // “At every nth minute past every hour from 9 through 18 on every day-of-week from Monday through Friday.”
    const audioUpdateMinuteInterval = settings.audioUpdate.minuteInterval >= 60 ? "0" : "*/" + settings.audioUpdate.minuteInterval.toString();
    cron.schedule(audioUpdateMinuteInterval + " 9-18 * * 1-5", async () => {
        app.runAudioUpdate();
    });

    // At most once per hour (0 in minute component) OR
    // “At every nth minute past every hour from 9 through 18 on every day-of-week from Monday through Friday.”
    const notificationUpdateMinuteInterval = settings.notificationUpdate.minuteInterval >= 60 ? "0" : "*/" + settings.notificationUpdate.minuteInterval.toString();
    cron.schedule(notificationUpdateMinuteInterval + " 9-18 * * 1-5", async () => {
        app.runNotificationUpdate();
    });
}

