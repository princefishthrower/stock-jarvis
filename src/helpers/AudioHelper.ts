import fs from "fs";
import util from "util";
import textToSpeech from "@google-cloud/text-to-speech";
import env from '../env/.env.json';

const spawn = require("child_process").spawn;

export default class AudioHelper {
    public static readonly client = new textToSpeech.TextToSpeechClient();
    public static readonly mp3FilePath = "audio/audio.mp3";

    public static async createMP3(textToRead: string): Promise<void> {
        const request = {
          input: { text: textToRead },
          voice: {
            languageCode: "en-GB",
            name: "en-GB-Wavenet-C",
            ssmlGender: 2 // 2 = FEMALE
          },
          audioConfig: { audioEncoding: 2 } // 2 = MP3
        };
    
        const [response] = await AudioHelper.client.synthesizeSpeech(request);
    
        const writeFile = util.promisify(fs.writeFile);
    
        // wait until file is completely written
        await writeFile(AudioHelper.mp3FilePath, response.audioContent, "binary");

        // then read it!
        spawn(env.MP3_COMMAND, [AudioHelper.mp3FilePath]);
      }
}