import { Path, POST, FormParam } from "typescript-rest";
import Users from "../model/Users";
import { generateDefaultSettings } from '../helpers/UserSettingsHelper';

@Path("/get-settings/email/:email/token/:token")
export default class UserService {
    @POST
    async createUser(
        @FormParam("email") email: string,
        @FormParam("name") name: string,
        @FormParam("token") token: string
    ): Promise<string> {
        const user = await Users.create({
            email: email,
            token: token,
            settings: generateDefaultSettings(name)
        });
        if (user) {
            return JSON.stringify(user.settings);
        }
        return "";
    }
}
