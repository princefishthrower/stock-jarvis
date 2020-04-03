import { Path, GET, PathParam } from "typescript-rest";

@Path("/hello")
export default class HelloService {
  @Path(":name")
  @GET
  sayHello( @PathParam('name') name: string ): string {
    return "Hello " + name;
  }
}