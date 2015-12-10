package models;

/**
 * User_Model: group of user properties, atomic operations
 * Methods list:
 * constructor: User(Long id, String user_name, String email, String first_name, String password, String last_name, int gender, String user_image_path)
 * timer:       String currentTime()
 * creator:     void create(User user)
 * deleter:     void delete(Long id)
 * Methods as property:
 * finder:      find = new Finder<Long, User>(Long.class, User.class)
 */

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import play.data.validation.Constraints;
import play.db.ebean.Model;

import javax.persistence.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "users")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
public class User extends Model {

    // finder
    public static Finder<Long, User> find = new Finder<Long, User>(Long.class, User.class);
    public static Finder<String, User> findByEmail = new Finder<String, User>(String.class, User.class);

    @Id
    @Constraints.Min(11)
    public Long id;
    @Constraints.Required
    public String user_name;
    @Constraints.Required
    public String email;
    @Constraints.Required
    @JsonIgnore
    public String password;
    public String first_name;
    public String last_name;
    public String gender;
    public String thumbnail_id;
    @JsonIgnore
    public String created_at;
    @ManyToMany
    @JoinTable(
            name = "learners",
            joinColumns = {@JoinColumn(name = "user_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "course_id", referencedColumnName = "id")})
    @JsonIgnore
    private List<Course> learningCourses;
    //@OneToMany(mappedBy = "instructor")
    @JsonIgnore
    private List<Course> teachingCourses;
    public User() {
    }
    public User(Long id, String user_name, String email, String first_name, String password, String last_name, String gender, String thumbnail_id) {
        this.id = id;
        this.user_name = user_name;
        this.email = email;
        this.password = password;
        this.first_name = first_name;
        this.last_name = last_name;
        this.gender = gender;
        this.thumbnail_id = thumbnail_id;
    }

    // timer
    public static String currentTime() {
        Long time = new Date().getTime();
        // set the time format as Datetime in MySQL
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return dateFormat.format(time);
    }

    // creator
    public static void create(User user) {
        // set current time
        user.created_at = currentTime();

        // set default image
        if (user.gender == "female")
            user.thumbnail_id = "female_default.jpg";
        else
            user.thumbnail_id = "male_default.jpg";

        // save to DB
        user.save();
    }

    // deleter
    public static void delete(Long id) {
        find.ref(id).delete();
    }

    // authenticator
    public static User authenticate(String email, String password) {
        System.out.println(email + "----" + password);
        return find.where()
                .eq("email", email)
                .eq("password", password)
                .findUnique();
    }

    public List<Course> getLearningCourses() {
        return learningCourses;
    }

    public void setLearningCourses(List<Course> learningCourses) {
        this.learningCourses = learningCourses;
    }

    public List<Course> getTeachingCourses() {
        return teachingCourses;
    }

    public void setTeachingCourses(List<Course> teachingCourses) {
        this.teachingCourses = teachingCourses;
    }
}

