package models;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import play.data.validation.Constraints;
import play.db.ebean.Model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

//CREATE TABLE `lessons` (
//        `id` int(11) NOT NULL AUTO_INCREMENT,
//        `sequence_id` int(11) DEFAULT NULL COMMENT 'sequence in course',
//        `course_id` int(11) DEFAULT NULL,
//        `topic` varchar(255) DEFAULT NULL,
//        `description` tinytext,
//        `course_name` varchar(255) DEFAULT NULL,
//        `available_time` timestamp NULL DEFAULT NULL,
//        `instructor_name` int(11) DEFAULT NULL,
//        `status` tinyint(1) DEFAULT NULL COMMENT '1-3: 1: past, 2: current, 3: past',
//        PRIMARY KEY (`id`)
//        ) ENGINE=InnoDB AUTO_INCREMENT=10002 DEFAULT CHARSET=utf8;
//        SELECT * FROM cmpe295ocdb.lessons;
@Entity
@Table(name = "lessons")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
public class Lesson extends Model {
    public static Model.Finder<Long, Lesson> finder = new Model.Finder<Long, Lesson>(Long.class, Lesson.class);

    @Id
    @Constraints.Min(11)
    private Long id;
    @Column(name="sequence_id")
    private int sequence_id;

    @Column(name="topic")
    private String topic;

    @Column(name = "course_name")
    private String course_name;

    @Column(name = "description")
    private String description;

    @Column(name = "available_time")
    @JsonFormat(shape= JsonFormat.Shape.STRING, pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone="PDT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date available_time;

    @Column(name = "instructor_name")
    private String instructor_name;

    @Column(name= "status")
    private int status;

    @Column(name= "course_id")
    private Long course_id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getSequence_id() {
        return sequence_id;
    }

    public void setSequence_id(int sequence_id) {
        this.sequence_id = sequence_id;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getCourse_name() {
        return course_name;
    }

    public void setCourse_name(String course_name) {
        this.course_name = course_name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getAvailable_time() {
        return available_time;
    }

    public void setAvailable_time(Date available_time) {
        this.available_time = available_time;
    }

    public String getInstructor_name() {
        return instructor_name;
    }

    public void setInstructor_name(String instructor_name) {
        this.instructor_name = instructor_name;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public Long getCourse_id() {
        return course_id;
    }

    public void setCourse_id(Long course_id) {
        this.course_id = course_id;
    }
}