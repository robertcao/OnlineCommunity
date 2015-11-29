package models;

//CREATE TABLE `courses` (
//        `id` int(11) NOT NULL AUTO_INCREMENT,
//        `course_name` varchar(255) NOT NULL DEFAULT '',
//        `average_rating` float DEFAULT NULL,
//        `create_date` datetime DEFAULT NULL,
//        `start_date` datetime DEFAULT NULL,
//        `end_date` datetime DEFAULT NULL,
//        `category_id` int(11) DEFAULT NULL COMMENT 'associate with course category id',
//        `instructor_user_id` int(11) DEFAULT NULL COMMENT 'associate with instructor user id',
//        `learner_user_id` int(11) DEFAULT NULL COMMENT 'associate with learner user id',
//        `assignment_id` int(11) DEFAULT NULL COMMENT 'associate with assignment id',
//        `test_id` int(11) DEFAULT NULL COMMENT 'associate with test id',
//        PRIMARY KEY (`id`),
//        KEY `user_id` (`instructor_user_id`),
//        KEY `category_id` (`category_id`),
//        KEY `assignment_id` (`assignment_id`),
//        KEY `test_id` (`test_id`),
//        KEY `learner_user_id` (`learner_user_id`)
//        ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import play.data.validation.Constraints;
import play.db.ebean.Model;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "courses")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
public class Course extends Model {
    public static Model.Finder<Long, Course> findById = new Model.Finder<Long, Course>(Long.class, Course.class);
    public static Model.Finder<String, Course> findByName = new Model.Finder<String, Course>(String.class, Course.class);
    @Id
    @Constraints.Min(11)
    private Long id;
    @Constraints.Required
    @Column(name = "course_name")
    private String courseName;
    @Column(name = "average_rating")
    private Float averageRating;
    @Column(name = "create_date")
    @JsonFormat(shape= JsonFormat.Shape.STRING, pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone="PDT")
    private Date createDate;
    @Column(name = "start_date")
    @JsonFormat(shape= JsonFormat.Shape.STRING, pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone="PDT")
    private Date startDate;
    @Column(name = "end_date")
    @JsonFormat(shape= JsonFormat.Shape.STRING, pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone="PDT")
    private Date endDate;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_user_id")
    private User instructor;
    @ManyToMany
    @JoinTable(
            name = "learners",
            joinColumns = {@JoinColumn(name = "course_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "user_id", referencedColumnName = "id")})
    @JsonIgnore
    private List<User> learners;

    public static void create(Course course) {
        course.setCreateDate(new Date());
        course.save();
    }

    public User getInstructor() {
        return instructor;
    }

    public void setInstructor(User instructor) {
        this.instructor = instructor;
    }

    public List<User> getLearners() {
        return learners;
    }

    public void setLearners(List<User> learners) {
        this.learners = learners;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public Float getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Float averageRating) {
        this.averageRating = averageRating;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }
}
