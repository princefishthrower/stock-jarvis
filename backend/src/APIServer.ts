import express from "express";
import { Server } from "typescript-rest";

const app = express();
Server.loadServices(app, 'controller/*', __dirname);
app.listen(3000, function() {
  console.log('Rest Server listening on port 3000!');
});