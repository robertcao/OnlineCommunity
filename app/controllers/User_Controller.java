package controllers;

/**
 * User_Controller: group of several methods for User Management
 * Method list:
 * Result signup()
 * Result listAll()
 * Result deleteUser(Long id)
 * Result login()
 * Result authenticate()
 * String Login.validate()
 */

import com.avaje.ebean.ExpressionList;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import models.Instructor;
import models.User;
import play.Logger;
import play.data.*;
import play.mvc.Controller;
import play.mvc.Result;

import java.util.List;

import play.libs.Json;
import play.mvc.Security;
import views.html.*;




public class User_Controller extends Controller {

    public static User user = new User();
    public static Instructor instructor = new Instructor();

    static {
        ObjectMapper mapper = new ObjectMapper();
        mapper.enable(SerializationFeature.INDENT_OUTPUT);
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        Json.setObjectMapper(mapper);
    }

    // Signup Page
    public static Result signupform() {
        return ok(signup.render());
    }

    // add new user to DB
    // from page: /signup
    public static Result signup() {
        Form<User> userForm = Form.form(User.class).bindFromRequest();

        if (userForm.hasErrors()) {
            Logger.info("Bad Form = " + userForm);
            return badRequest(index.render());
        } else {
            Logger.info("New Signup User = " + userForm);
            // add new user to DB
            User.create(userForm.get());
        }

        return redirect("/");
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
        return redirect("/");
    }

    // login
    // to page: /login
    public static Result login() {
        return ok(login.render(Form.form(Login.class)));
    }

    // login authenticate
    // from page: /login
    public static Result authenticate() {
        Form<Login> loginForm = Form.form(Login.class).bindFromRequest();
        if (loginForm.hasErrors()) {
            System.out.println("failed login due to error=" + loginForm.globalError());
            return badRequest(login.render(loginForm));
        } else {
            session().clear();
            session("email", loginForm.get().email);
            System.out.println("session ====> " + session("email"));

            System.out.println("Query:" + User.findByEmail.where().eq("email", loginForm.get().email));
            List<User> userList = User.findByEmail.where().eq("email", loginForm.get().email).findList();

            System.out.println("User ====> " + userList);

            if (userList != null) {
                user = userList.get(0);

                List<Instructor> instructorList = Instructor.findByName.where().eq("name", user.user_name).findList();
                System.out.println("Instructor ====> " + instructorList);

                if (instructorList.size() != 0)
                    instructor = instructorList.get(0);

                return ok(profile.render(user, instructor));
            } else {
                return redirect("/login");

            }
        }
    }

    @Security.Authenticated(Secured.class)
    public static Result profile() {
        List<User> userList = User.findByEmail.where().eq("email", request().username()).findList();

        if (userList != null) {
            user = userList.get(0);

            List<Instructor> instructorList = Instructor.findByName.where().eq("name", user.user_name).findList();

            if (instructorList.size() != 0)
                instructor = instructorList.get(0);

            return ok(profile.render(user, instructor));
        } else {
            return redirect("/login");

        }
    }

    @Security.Authenticated(Secured.class)
    public static Result course() {
        if (User.find.where().eq("user_name", request().username()) != null) {
            return ok(course.render());
        } else {
            return redirect("/login");
        }
    }

    // logout
    // to page: /logout
    public static Result logout() {
        session().clear();
        user = null;
        instructor = null;

        System.out.println("Session: " + session());
        flash("success", "You have been logged out, redirect to index page.");
        return redirect("/");
    }


    public static Result feedback() {
        return ok(feedback.render());
    }

    public static Result quiz() {
        return ok(quiz.render());
    }

    public static Result teaching() {
        return ok(teaching.render());
    }

    public static Result videotime() {
        return ok(videotime.render());
    }

    /**
     * API JSON response
     * @return
     */
    @Security.Authenticated(Secured.class)
    public static Result currentUser() {
        List<User> users = User.find.where().eq("email", request().username()).findList();
        if (users !=null && !users.isEmpty()){
            return ok(Json.toJson(users.get(0)));//only return the first one
        }else{
            return badRequest("no login user");
        }
    }

    public static Result videohistory() {
        return ok(videohistory.render());
    }

    public static Result learning() {
        return ok(learning.render());
    }

    public static Result getUser(long id) {
        return ok(Json.toJson(User.find.byId(id)));
    }

    public static Result getUserByName(String name) {
        return ok(Json.toJson(User.find.where().eq("user_name", name).findList().get(0)));
    }

    public static Result getInstructor(String name) {
        return ok(Json.toJson(Instructor.find.where().eq("name", name).findList().get(0)));
    }

    @Security.Authenticated(Secured.class)
    public static Result currentInstructor() {
        List<User> users = User.find.where().eq("email", request().username()).findList();
        if (users !=null && !users.isEmpty()) {
            User user = users.get(0);
            return ok(Json.toJson(Instructor.find.where().eq("name", user.user_name).findList().get(0)));
        }else{
            return badRequest("no login user");
        }
    }


    // Login Form
    public static class Login {
        public String email;
        public String password;

        // validator
        public String validate() {
            if (User.authenticate(email, password) == null) {
                return "Invalid user or password!";
            }
            return null;
        }
    }
}