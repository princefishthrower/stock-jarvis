import cron, { ScheduledTask } from "node-cron";
import CronDispatcher from "./services/Cron/CronDispatcher";
import env from "./env/.env.json";
import Users from "./model/Users";
import { Op } from "sequelize";
import testSettings from "../src/data/example-settings.json";
import AudioHelper from "./helpers/AudioHelper";

// The initial bootstrap class
const cronDispatcher = new CronDispatcher();

// mapping of user ID to scheduled tasks
let cronTasks: Map<number, ScheduledTask[]> = new Map<
    number,
    ScheduledTask[]
>();

if (env.NODE_ENV === "IMMEDIATE") {
    async function runImmediately() {
        // TODO: fix postgres issues (upgrade to 13)
        // const user = await Users.findByPk("1");
        // if (user) {
        //     cronDispatcher.runAudioUpdate(user.settings);
        //     cronDispatcher.runNotificationUpdate(user.settings);
        // }

        cronDispatcher.runAudioUpdate(testSettings);
        cronDispatcher.runNotificationUpdate(testSettings);
    }
    runImmediately();
} else if (env.NODE_ENV === "PI") {
    // “At every nth minute past every hour from 9 through 18 on every day-of-week from Monday through Friday.”

    // test audio update
    cron.schedule("* * * * *", async () => {
        AudioHelper.createAndReadMP3("This is the minute by minute test.");
    });

    // audio update
    const audioUpdateMinuteInterval = testSettings.audioUpdateSettings.interval;
    cron.schedule(audioUpdateMinuteInterval + " 9-18 * * 1-5", async () => {
        cronDispatcher.runAudioUpdate(testSettings);
    });

    // notification update
    const notificationUpdateMinuteInterval = testSettings.notificationUpdateSettings.interval;
    cron.schedule(notificationUpdateMinuteInterval + " 9-18 * * 1-5", async () => {
        cronDispatcher.runNotificationUpdate(testSettings);
    });
} else {
    async function registerAllCrons() {
        const allUsers = await Users.findAll();
        await setUserCrons(allUsers);
    }

    // Memory-safe setting crons for the array of given users
    async function setUserCrons(users: Array<Users>) {
        users.forEach((user) => {
            // At most once per hour (0 in minute component) OR
            // “At every nth minute past every hour from 9 through 18 on every day-of-week from Monday through Friday.”
            const audioUpdateMinuteInterval =
                user.settings.audioUpdateSettings.interval >= 60
                    ? "0"
                    : "*/" +
                      user.settings.audioUpdateSettings.interval.toString();
            const audioUpdateTask = cron.schedule(
                audioUpdateMinuteInterval + " 9-18 * * 1-5",
                async () => {
                    cronDispatcher.runAudioUpdate(user.settings);
                }
            );

            // At most once per hour (0 in minute component) OR
            // “At every nth minute past every hour from 9 through 18 on every day-of-week from Monday through Friday.”
            const notificationUpdateMinuteInterval =
                user.settings.notificationUpdateSettings.interval >= 60
                    ? "0"
                    : "*/" +
                      user.settings.notificationUpdateSettings.interval.toString();
            const notificationUpdateTask = cron.schedule(
                notificationUpdateMinuteInterval + " 9-18 * * 1-5",
                async () => {
                    cronDispatcher.runNotificationUpdate(user.settings);
                }
            );

            // before setting tasks, make sure to destroy any existing tasks for the user
            // this way we prevent any memory overload: every user has their tasks mapped to their IDs
            const scheduledTasks = cronTasks.get(user.id);
            if (scheduledTasks) {
                scheduledTasks.forEach((scheduledTask) => {
                    scheduledTask.destroy();
                });
            }
            cronTasks.set(user.id, [audioUpdateTask, notificationUpdateTask]);
        });
    }

    async function startCronServer() {
        // first register all crons (only fires once on server start or restart)
        await registerAllCrons();

        // every minute, update crons for those users who updated their settings through the web UI
        cron.schedule("* * * * *", async () => {
            const oneMinuteAgoUTC = new Date(Date.now() - 60000).toUTCString();
            const updatedUsers = await Users.findAll({
                where: {
                    updatedAt: {
                        [Op.gte]: oneMinuteAgoUTC,
                    },
                },
            });
            setUserCrons(updatedUsers);
        });
    }

    startCronServer();
}
