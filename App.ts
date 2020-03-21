import fs from "fs";
import util from "util";
import textToSpeech from "@google-cloud/text-to-speech";
import env from './env/.env.json';

const spawn = require("child_process").spawn;

export default class App {
  public static readonly ticker = "SPY";
  public static readonly client = new textToSpeech.TextToSpeechClient();
  public static readonly mp3FilePath = "audio/audio.mp3";

  public async run(): Promise<void> {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    let textToRead =
      "It is " + hour.toString() + " " + minute.toString() + ". ";
    if (hour === 9 && minute === 0) {
      textToRead += "Good morning, Chris. Premarket trading is open. ";
    } else if (hour === 9 && minute === 30) {
      textToRead += "Normal trading hours have begun. ";
    } else if (hour === 16 && minute === 0) {
      textToRead += "Normal trading hours have closed. ";
    } else if (hour === 18 && minute === 0) {
      textToRead += "After hours trading has just closed. ";
    } else if (hour > 18) {
      textToRead += "After hours trading has closed. ";
    }

    // Write SPY data to JSON via python script
    await this.getFinvizData(App.ticker);

    // now data is written - read it
    const data = fs.readFileSync("data/metrics.json");
    const spyData = JSON.parse(data.toString());

    // determine direction to say
    const direction =
      spyData.Change && spyData.Change.length > 0 && spyData.Change[0] === "-"
        ? "down"
        : "up";

    textToRead +=
      App.ticker +
      " is trading " +
      direction +
      " " +
      spyData.Change.slice(1, spyData.Change.length) +
      ", at " +
      spyData.Price +
      ". ";

    await this.createMP3(textToRead);
    await this.emitMP3();
  }
  public async getFinvizData(ticker: string): Promise<void> {
    const pythonProcess = spawn("python3", [
      "python/getTickerMetrics.py",
      ticker
    ]);
    return new Promise((resolve, reject) => {
      pythonProcess.stdout.on("data", (data: any) => {
        resolve();
      });
      pythonProcess.stderr.on("data", (data: any) => {
        reject();
      });
    });
  }
  public async createMP3(textToRead: string): Promise<void> {
    const request = {
      input: { text: textToRead },
      voice: {
        languageCode: "en-GB",
        name: "en-GB-Wavenet-C",
        ssmlGender: 2 // 2 = FEMALE
      },
      audioConfig: { audioEncoding: 2 } // 2 = MP3
    };

    const [response] = await App.client.synthesizeSpeech(request);

    const writeFile = util.promisify(fs.writeFile);

    await writeFile(App.mp3FilePath, response.audioContent, "binary");
  }
  public async emitMP3() {
    spawn(env.MP3_COMMAND, [App.mp3FilePath]);
  }
}
