import fs from "fs";
import textToSpeech from "@google-cloud/text-to-speech";
import env from '../env/.env.json';

const getMP3Duration = require('get-mp3-duration')
const spawn = require("child_process").spawn;

export default class AudioHelper {
    public static readonly client = new textToSpeech.TextToSpeechClient();
    public static readonly folderPath = "audio";
    public static readonly mp3FilePath = AudioHelper.folderPath + "/audio.mp3";

    public static async createAndReadMP3(textToRead: string): Promise<void> {
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

        // wait until folder is created and file is completely written
        await fs.promises.mkdir(AudioHelper.folderPath, { recursive: true });
        await fs.promises.writeFile(AudioHelper.mp3FilePath, response.audioContent, "binary");
        const buffer = fs.readFileSync(AudioHelper.mp3FilePath);

        // little buffer for kill time
        const duration = getMP3Duration(buffer) + 3000;

        // then read it out loud!
        const child = spawn(env.OPEN_MP3_COMMAND, [AudioHelper.mp3FilePath]);

        // kill process when done
        setTimeout(function(){
            child.stdin.pause();
            child.kill();
        }, duration);
    }
}
