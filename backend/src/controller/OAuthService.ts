import {
    Path,
    GET,
    PathParam,
    ContextResponse,
    QueryParam,
} from "typescript-rest";
import { createUser, getUser } from "../services/User/UserService";
import express from "express";
import fetch from "node-fetch";
import { sign } from "../helpers/TokenHelper";

// Oauth paths controller
export default class HelloService {
    @Path("/client-id")
    @GET
    getClientId(): string {
        return JSON.stringify({
            clientId: process.env.STOCK_JARVIS_OAUTH_CLIENT_ID,
        });
    }

    @Path("/stock-jarvis-oauth-callback")
    @GET
    async getOAuthData(
        @QueryParam("code") code: string,
        @ContextResponse res: express.Response
    ): Promise<void> {
        const accessToken = await getAccessToken(code);
        console.log(accessToken);
        const userInfo = await getUserInfo(accessToken);
        console.log(JSON.stringify(userInfo));
        const user = await getUser(userInfo.email);
        let token;
        if (user) {
            token = await sign(user.id);
        } else {
            token = await createUser(userInfo.email, userInfo.name);
        }
        const now = new Date();
        const days = 7;
        const expires = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        res.cookie("token", token, { expires: expires });
        res.redirect(`http://localhost:3000`)
    }
}

async function getAccessToken(code: string): Promise<string> {
    const tokenResponse = await fetch(
        `https://www.googleapis.com/oauth2/v4/token`,
        {
            method: "POST",
            body: JSON.stringify({
                code: code,
                client_id: process.env.STOCK_JARVIS_OAUTH_CLIENT_ID,
                client_secret: process.env.STOCK_JARVIS_OAUTH_CLIENT_SECRET,
                redirect_uri:
                    "http://localhost:3000/stock-jarvis-oauth-callback",
                grant_type: "authorization_code",
            }),
        }
    );
    const tokenJson = await tokenResponse.json();

    console.log(tokenJson);
    // TODO: error handling if this fails!
    return tokenJson.access_token;
}

async function getUserInfo(accessToken: string): Promise<any> {
    const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
    const json = await response.json();
    return json;
}
