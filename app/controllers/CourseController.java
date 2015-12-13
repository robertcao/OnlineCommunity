package controllers;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.google.common.collect.Lists;
import models.*;
import play.libs.Json;
import play.mvc.BodyParser;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import views.html.category;
import views.html.coursecreate;
import views.html.lessoncreate;

import java.util.List;

public class CourseController extends Controller{


    static {
        ObjectMapper mapper = new ObjectMapper();
        mapper.enable(SerializationFeature.INDENT_OUTPUT);
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);

        Json.setObjectMapper(mapper);
    }

    public static Result listCourses() {
        List<Course> courseList = Course.findById.all();

        List<JsonNode> jsonNodes = Lists.newArrayList();
        for (Course course : courseList) {
            jsonNodes.add(Json.toJson(course));
        }
        return ok(Json.toJson(jsonNodes));
    }




    @BodyParser.Of(BodyParser.Json.class)
    public static Result create() {
        JsonNode json = request().body().asJson();
        System.out.println("received json=" + json.toString());
        Course course = Json.fromJson(json, Course.class);

        //Set default picture
        course.setThumbnail_id("https://s3-us-west-2.amazonaws.com/cmpe295ocbucket/5ae8609a-c66a-450d-8f15-f25f6d25eb7c/course_default.png");
        course.save();

        //need to save instructor here.
        List<Instructor> instructors = Instructor.findByName.where().eq("name", course.getInstructor()).findList();
        if (instructors == null || instructors.isEmpty()) {
            User user = User.find.where().eq("user_name", course.getInstructor()).findList().get(0); //should always find it
            Instructor instructor = new Instructor(null, user.user_name, null, 0, user.thumbnail_id);
            instructor.save();
        }

        return ok(Json.toJson(course));
    }

    public static Result createIndex() {
        return ok(coursecreate.render());
    }

    public static Result getCourse(String courseid) {

        Course course = Course.findById.byId(Long.valueOf(courseid));
        return ok(Json.toJson(course));
    }

    public static Result createLesson() {
        return ok(lessoncreate.render());
    }

    public static Result getCourses(String instructorid) {
        List<Course> courses = Course.findById.where().eq("instructor", instructorid).findList();
        List<JsonNode> jsonNodes = Lists.newArrayList();
        for (Course course : courses) {
            jsonNodes.add(Json.toJson(course));
        }
        return ok(Json.toJson(jsonNodes));
    }

    public static Result getCourseByName(String name) {
        List<Course> courses = Course.findByName.where().like("name", "%" + name +"%").findList();
        List<JsonNode> jsonNodes = Lists.newArrayList();
        for (Course course : courses) {
            jsonNodes.add(Json.toJson(course));
        }
        return ok(Json.toJson(jsonNodes));
    }

    public static Result getCoursesByInstructorId(String id) {
        User instructor = User.find.byId(Long.parseLong(id));
        return getCourses(instructor.user_name);
    }

    public static Result takerCourse(long userid, long courseid) {

        Course course = Course.findById.byId(courseid);
        if (course == null) {
            return badRequest("course not found");
        }
        User user = User.find.byId(userid);
        if (user == null) {
            return badRequest("user not found");
        }

        System.out.println("user=" + Json.toJson(user));
        System.out.println("try to take this course=" + Json.toJson(course));


        List<Learner> learners = Learner.find.where().eq("name", user.user_name).findList();
        for (Learner learner : learners) {
            if (learner.course_id == course.getId()) { //already registered
                System.out.println("already registered");
                return ok(Json.toJson(learner));
            }
        }



        //create new one
        Learner learner = new Learner();
        learner.name = user.user_name;
        learner.course_id = course.getId();
        learner.course_name = course.getCourseName();
        learner.status = 2 ; //current
        learner.thumbnail_id = user.thumbnail_id;
        learner.save();
        return ok(Json.toJson(learner));

    }

    public static Result registeredCourses(long userid) {
        User user = User.find.byId(userid);
        if (user == null) {
            return badRequest("user not found");
        }

        List<JsonNode> jsonNodes = Lists.newArrayList();

        List<Learner> learners = Learner.find.where().eq("name", user.user_name).findList();
        for (Learner learner : learners) {
            jsonNodes.add(Json.toJson(Course.findById.byId(learner.course_id)));
        }
        return ok(Json.toJson(jsonNodes));
    }

    public static Result getCoursesByCategory(String category) {

        List<Course> courses = category.equalsIgnoreCase("All") ? Course.findById.all() :
                Course.findByName.where().like("category", "%" + category +"%").findList();
        List<JsonNode> jsonNodes = Lists.newArrayList();
        for (Course course : courses) {
            jsonNodes.add(Json.toJson(course));
        }
        return ok(Json.toJson(jsonNodes));
    }

    public static Result getCategory() {
        return ok(category.render());
    }
}
