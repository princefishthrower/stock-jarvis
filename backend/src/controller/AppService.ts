import { Path, GET, ContextResponse } from "typescript-rest";
import express from 'express';
import path from "path";

@Path("/")
export default class HelloService {
  @GET
  serveApp( @ContextResponse res: express.Response ): void {
    res.sendFile(path.join(__dirname, '../../../../../frontend/build', 'index.html'));
  }
}