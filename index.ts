import cron from 'node-cron';
import App from './App';

// The initial bootstrap class
const app = new App();

// Pi already runs at EDT
// “At every minute past every hour from 9 through 18 on every day-of-week from Monday through Friday.”
// cron.schedule('* 9-18 * * 1-5', async () => {
//     await app.run();
// });

cron.schedule('* * * * *', async () => {
    await app.run();
});
