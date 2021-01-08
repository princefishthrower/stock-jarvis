
import AudioHelper from "../../helpers/AudioHelper";
import EmailHelper from "../../helpers/EmailHelper";
import TextHelper from "../../helpers/TextHelper";
import IUserSettings from "../../../../shared/interfaces/IUserSettings";
import { sendAllNotifications } from "../../helpers/NotificationHelper";

export default class CronDispatcher {
    public async runAudioUpdate(settings: IUserSettings): Promise<void> {
        const audioUpdateText = await TextHelper.buildAudioUpdateText(settings);
        AudioHelper.createMP3(audioUpdateText);
    }

    public runNotificationUpdate(settings: IUserSettings): void {
        sendAllNotifications(settings);
    }
}
