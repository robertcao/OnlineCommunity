package controllers;

import play.mvc.Result;

import static play.mvc.Results.ok;
import static play.mvc.Results.redirect;

/**
 * Created by lzhou on 11/1/15.
 */
public class EchoApplication {

    public static Result echo(String message) {
        return ok("Echoing " + message);
    }

    public static Result helloRedirect() {
        return redirect(controllers.routes.EchoApplication.echo("HelloWorldv2"));
    }
    
}
