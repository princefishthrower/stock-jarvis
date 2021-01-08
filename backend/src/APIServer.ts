import express from "express";
import { Server } from "typescript-rest";
const path = require('path');
const cors = require('cors')
const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

// Use static assets from react build
app.use('/', express.static(path.join(__dirname, '../../../../frontend', 'build')));

// all API controllers
Server.loadServices(app, 'controller/*', __dirname);

app.listen(3000, function() {
  console.log('Rest Server listening on port 3000!');
});