import express from "express";
import { Server } from "typescript-rest";
const path = require('path');
const fetch = require("node-fetch");
const cors = require('cors')
const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

// static react build
app.use('/', express.static(path.join(__dirname, '../../../../frontend', 'build')))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../../../../frontend/build', 'index.html'));
});

// Oauth paths
app.get('/client-id', (req, res) => {
  res.send(JSON.stringify({ clientId: process.env.STOCK_JARVIS_OAUTH_CLIENT_ID }))
});

app.get('/stock-jarvis-oauth-callback', handleOAuth2)

async function handleOAuth2(req: express.Request, res: express.Response) {
  const tokenResponse = await fetch(
    `https://www.googleapis.com/oauth2/v4/token`,
    {
      method: 'POST',
      body: JSON.stringify({
        code: req.query.code,
        client_id: process.env.STOCK_JARVIS_OAUTH_CLIENT_ID,
        client_secret: process.env.STOCK_JARVIS_OAUTH_CLIENT_SECRET,
        redirect_uri: 'http://localhost:3000/stock-jarvis-oauth-callback',
        grant_type: 'authorization_code'
      })
    }
  )
  const tokenJson = await tokenResponse.json()
  const userInfo = await getUserInfo(tokenJson.access_token)
  // write token and email to database, they are successfully authorized

  res.redirect(`http://localhost:3000?${Object.keys(userInfo).map(key => `${key}=${encodeURIComponent(userInfo[key])}`).join('&')}`)
}

async function getUserInfo(accessToken: string) {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
  const json = await response.json()
  return json
}

// all API controllers
Server.loadServices(app, 'controller/*', __dirname);

app.listen(3000, function() {
  console.log('Rest Server listening on port 3000!');
});