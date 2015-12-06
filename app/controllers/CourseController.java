package controllers;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.google.common.collect.Lists;
import models.Course;
import play.libs.Json;
import play.mvc.BodyParser;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.coursecreate;

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
        course.save();
        return ok(course.getId() + " " + course.getCourseName());
    }

    public static Result createIndex() {
        return ok(coursecreate.render());
    }

    public static Result getCourse(String courseid) {
        Course course = Course.findById.byId(Long.valueOf(courseid));
        return ok(Json.toJson(course));
    }
}
