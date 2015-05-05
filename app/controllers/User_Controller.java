package controllers;

/**
 * User_Controller: group of several methods for User Management
 * Method list:
 *      Result signup()
 *      Result listAll()
 *      Result deleteUser(Long id)
 *      Result login()
 *      Result authenticate()
 *      String Login.validate()
 */

import models.User;
import play.Logger;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import java.util.List;
import play.libs.Json;

public class User_Controller extends Controller {

    // add new user to DB
    // from page: /signup
    public static Result signup() {
        Form<User> userForm = Form.form(User.class).bindFromRequest();

        if (userForm.hasErrors()) {
            Logger.info("Bad Form = " + userForm);
            return badRequest(views.html.index.render(userForm.toString()));
        } else {
            Logger.info("New Signup User = " + userForm);
            // add new user to DB
            User.create(userForm.get());
        }

        return redirect(controllers.routes.Application.index());
    }

    // search all users from DB
    // to page: /listAllUsers
    public static Result listAll() {
        List<User> users = User.find.orderBy("id").findList(); // alternative: List<User> users = User.find.all();
        return ok(Json.toJson(users));
    }

    // delete user in DB
    // From page: TODO
    public static Result deleteUser(Long id) {
        User.delete(id);
        return redirect(controllers.routes.Application.index());
    }

    // login
    // to page: /login
    public static Result login() {
        return ok(views.html.login.render(Form.form(Login.class)));
    }

    // login authenticate
    // from page: /login
    public static Result authenticate() {
        Form<Login> loginForm = Form.form(Login.class).bindFromRequest();

        if (loginForm.hasErrors()) {
            return badRequest(views.html.login.render(loginForm));
        } else {
            session().clear();
            session("user_name", loginForm.get().user_name);
            System.out.println("session: " + session().get("user_name"));
            return redirect(controllers.routes.Application.index());
        }
    }

    // Login Form
    public static class Login {
        public String user_name;
        public String password;

        // validator
        public String validate() {
            if (User.authenticate(user_name, password) == null) {
                return "Invalid user or password!";
            }
            return null;
        }
    }
}