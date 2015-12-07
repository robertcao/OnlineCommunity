package models;

//CREATE TABLE `courses` (
//        `id` int(11) NOT NULL AUTO_INCREMENT,
//        `name` varchar(255) NOT NULL DEFAULT '',
//        `description` tinytext COMMENT 'description of course',
//        `category` varchar(48) DEFAULT NULL COMMENT 'Art + Design, Computer, Finance, Life Skill, Language, Music, Math + Science, Sport',
//        `rating` tinyint(1) DEFAULT NULL COMMENT '1-5',
//        `thumbnail_id` varchar(16) DEFAULT NULL COMMENT 'format: course_img_01',
//        `instructor` varchar(255) DEFAULT NULL COMMENT 'name of instructor',
//        `workload` tinyint(3) DEFAULT NULL COMMENT 'total hours of course',
//        `Language` varchar(20) DEFAULT NULL,
//        `Price` tinyint(4) DEFAULT '0',
//        `create_date` datetime DEFAULT NULL,
//        `start_date` datetime DEFAULT NULL,
//        `end_date` datetime DEFAULT NULL,
//        PRIMARY KEY (`id`)
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
    @Column(name = "name")
    private String courseName;
    @Column(name = "description")
    private String description;
    @Column(name = "category")
    private String category;
    @Column(name = "thumbnail_id")
    private String thumbnail_id;
    @Column(name = "rating")
    private int averageRating;
    @Column(name = "workload")
    private int workload;
    @Column(name = "Language")
    private String language;
    @Column(name = "Price")
    private int price;
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
    @JoinColumn(name = "instructor")
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

    public int getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(int averageRating) {
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getWorkload() { return workload; }

    public void setWorkload(int workload) { this.workload = workload; }

    public int getPrice() { return price; }

    public void setPrice(int price) { this.price = price; }

    public String getThumbnail_id() {
        return thumbnail_id;
    }

    public void setThumbnail_id(String thumbnail_id) {
        this.thumbnail_id = thumbnail_id;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
