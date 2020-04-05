import { Path, GET, POST, FormParam, CookieParam } from "typescript-rest";
import { Op } from "sequelize";
import Users from "../model/Users";
import IUserSettings from "../../../shared/interfaces/IUserSettings";
import { isValidSettingsObject } from "../services/User/UserService";
import { decode } from "../helpers/TokenHelper";

export default class SettingsService {
    @Path("/get-settings")
    @GET
    async getSettings(
        @CookieParam("token") token: string
    ): Promise<string> {
        const id = decode(token);
        const user = await Users.findOne({
            where: {
                id: {
                    [Op.eq]: id,
                },
            },
        });
        if (user) {
            return JSON.stringify(user.settings);
        }
        return "";
    }

    @Path("/set-settings")
    @POST
    async setSettings(
        @FormParam("settings") settings: IUserSettings,
        @CookieParam("token") token: string
    ): Promise<boolean> {
        const id = decode(token);
        const user = await Users.findOne({
            where: {
                id: {
                    [Op.eq]: id,
                },
            },
        });
        if (user && isValidSettingsObject(settings)) {
            user.settings = settings;
            await user.save();
            return true;
        }
        return false;
    }
}
