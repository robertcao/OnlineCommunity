import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import models.Course;
import models.User;
import org.junit.Test;
import play.libs.Json;

import java.util.Date;

import static org.junit.Assert.assertEquals;
import static play.test.Helpers.fakeApplication;
import static play.test.Helpers.running;

public class CourseControllerTest {

    @Test
    public void testListCourses() {

        running(fakeApplication(), new Runnable() {
            public void run() {
//                List<Course> courseList = Course.findById.all();
//                assertThat(courseList).isNotEmpty();
//                assertThat(courseList.get(0).getCourseName()).isEqualToIgnoringCase("Java Spring Hibernate MVC");
//

                Course course = new Course();
                //course.setId(12L);
                course.setCourseName("Java Spring Hibernate MVC");
                User currentUser = new User();
                currentUser.id = 1L;
                currentUser.first_name = "John";
                currentUser.last_name = "Merdock";
                currentUser.email = "John.Merdock@gmail.com";
                currentUser.gender = "male";
                currentUser.password = "123456";

                course.setStartDate(new Date());
                course.setEndDate(new Date());
                course.setInstructor(currentUser);

                ObjectMapper mapper = new ObjectMapper();
                mapper.enable(SerializationFeature.INDENT_OUTPUT);
                mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
                Json.setObjectMapper(mapper);
                JsonNode jsonNode = Json.toJson(course);
                Course deserializeCourse = Json.fromJson(jsonNode, Course.class);
                System.out.println(jsonNode.toString());

                JsonNode jsonNode1 = Json.toJson(deserializeCourse);
                System.out.println(jsonNode1.toString());

                assertEquals(jsonNode.toString(), jsonNode1.toString());

            }
        });




    }

}
