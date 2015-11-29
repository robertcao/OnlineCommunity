package controllers;

/**
 * controllers: groups several action methods
 * action: a Java method that processes the request parameters, and produces a result to be sent to the client
 */

import play.libs.Json;
import play.mvc.*;
import views.html.*;

public class Application extends Controller {

    private static final java.util.Map<Integer, String> productMap = new java.util.HashMap<Integer, String>();

    static {
        productMap.put(1, "Keyboard");
        productMap.put(2, "Mouse");
        productMap.put(3, "Monitor");
    }

    public static Result listProducts() {
        return ok(Json.toJson(productMap.values()));
    }

    // Home Page
    public static Result index() {
        return ok(index.render());
    }



}
