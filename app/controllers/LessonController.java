package controllers;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.google.common.collect.Lists;
import models.Course;
import models.Instructor;
import models.Lesson;
import models.User;
import play.libs.Json;
import play.mvc.BodyParser;
import play.mvc.Controller;
import play.mvc.Result;

import java.util.List;

public class LessonController extends Controller {
    static {
        ObjectMapper mapper = new ObjectMapper();
        mapper.enable(SerializationFeature.INDENT_OUTPUT);
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        Json.setObjectMapper(mapper);
    }


    @BodyParser.Of(BodyParser.Json.class)
    public static Result create() {
        JsonNode json = request().body().asJson();
        System.out.println("received json lesson=" + json.toString());
        Lesson lesson = Json.fromJson(json, Lesson.class);
        lesson.save();
        return ok(Json.toJson(lesson)); //after save it will have id
    }


    public static Result getLessons(Long courseId) {
        List<Lesson> lessons = Lesson.finder.where().eq("course_id", courseId).findList();
        List<JsonNode> jsonNodes = Lists.newArrayList();
        for (Lesson lesson : lessons) {
            jsonNodes.add(Json.toJson(lesson));
        }
        return ok(Json.toJson(jsonNodes));

    }

    public static Result listLessons() {
        List<Lesson> lessons = Lesson.finder.all();
        List<JsonNode> jsonNodes = Lists.newArrayList();
        for (Lesson lesson : lessons) {
            jsonNodes.add(Json.toJson(lesson));
        }
        return ok(Json.toJson(jsonNodes));

    }



}
