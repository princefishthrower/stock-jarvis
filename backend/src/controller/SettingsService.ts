import { Path, GET, POST, FormParam, PathParam } from "typescript-rest";
import { Op } from "sequelize";
import Users from "../model/Users";
import IUserSettings from "../../../shared/interfaces/IUserSettings";
import { validateSettingsObject as isValidSettingsObject } from "../helpers/UserSettingsHelper";

@Path("/get-settings/email/:email/token/:token")
export default class SettingsService {
    @GET
    async getSettings(
        @PathParam("email") email: string,
        @PathParam("token") token: string
    ): Promise<string> {
        const user = await Users.findOne({
            where: {
                [Op.and]: {
                    email: {
                        [Op.eq]: email
                    },
                    token: {
                        [Op.eq]: token
                    }
                }
            }
        });
        if (user) {
            return JSON.stringify(user.settings);
        }
        return '';
        
    }

    @POST
    async setSettings(
        @FormParam("email") email: string,
        @FormParam("token") token: string,
        @FormParam("settings") settings: IUserSettings,
    ): Promise<boolean> {
        const user = await Users.findOne({
            where: {
                [Op.and]: {
                    email: {
                        [Op.eq]: email
                    },
                    token: {
                        [Op.eq]: token
                    }
                }
            }
        });
        if (user && isValidSettingsObject(settings)) {
            user.settings = settings;
            await user.save();
        }
        return false;
    }
}
