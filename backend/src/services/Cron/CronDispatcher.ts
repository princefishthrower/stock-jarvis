
import AudioHelper from "../../helpers/AudioHelper";
import EmailHelper from "../../helpers/EmailHelper";
import TextHelper from "../../helpers/TextHelper";
import IUserSettings from "../../../../shared/interfaces/IUserSettings";

export default class CronDispatcher {
    public async runAudioUpdate(settings: IUserSettings): Promise<void> {
        const audioUpdateText = await TextHelper.buildAudioUpdateText(settings);
        AudioHelper.createMP3(audioUpdateText);
    }

    public runNotificationUpdate(settings: IUserSettings): void {
        EmailHelper.sendAllNotificationEmails(settings);
    }
}
