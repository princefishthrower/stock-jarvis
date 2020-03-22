import cron from 'node-cron';
import App from './App';

// The initial bootstrap class
const app = new App();

// Pi already runs on EDT
// “At every 15th minute past every hour from 9 through 18 on every day-of-week from Monday through Friday.”
cron.schedule('*/15 9-18 * * 1-5', async () => {
    await app.run();
});

// cron.schedule('* * * * *', async () => {
//     await app.run();
// });
