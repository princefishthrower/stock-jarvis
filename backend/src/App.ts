
import AudioHelper from "./helpers/AudioHelper";
import EmailHelper from "./helpers/EmailHelper";
import TextHelper from "./helpers/TextHelper";

export default class App {
    public async runAudioUpdate(): Promise<void> {
        const audioUpdateText = await TextHelper.buildAudioUpdateText();
        AudioHelper.createMP3(audioUpdateText);
    }

    public runNotificationUpdate(): void {
        EmailHelper.sendAllNotificationEmails();
    }
}
