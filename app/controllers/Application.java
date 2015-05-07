package controllers;

/**
 * controllers: groups several action methods
 * action: a Java method that processes the request parameters, and produces a result to be sent to the client
 */

import play.mvc.*;
import views.html.*;

public class Application extends Controller {

    // Home Page
    public static Result index() {
        return ok(index.render());
    }

//    // Signup Page
//    public static Result signup() {
//        return ok(signup.render());
//    }

}
