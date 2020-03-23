import cron from "node-cron";
import App from "./src/App";
import settings from './settings.json';
import env from './src/env/.env.json';

// The initial bootstrap class
const app = new App();

// Raspberry Pi system timezone is in EST, same as the market

if (env.NODE_ENV === "DEVELOP") {
    app.runAudioUpdate();
} else {
    // “At every nth minute past every hour from 9 through 18 on every day-of-week from Monday through Friday.”
    cron.schedule("*/" + settings.audioUpdate.minuteInterval + " 9-18 * * 1-5", async () => {
        // delay by 1.5 minutes so finviz is updated by then
        setTimeout(() => {
            app.runAudioUpdate();
        }, 90000);    
    });

    // “At every nth minute past every hour from 9 through 18 on every day-of-week from Monday through Friday.”
    cron.schedule("*/" + settings.notificationUpdate.minuteInterval + " 9-18 * * 1-5", async () => {
        app.runNotificationUpdate();
    });
}

