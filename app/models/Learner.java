package models;


import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import play.data.validation.Constraints;
import play.db.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;


//
//CREATE TABLE `learners` (
//        `id` int(11) NOT NULL AUTO_INCREMENT,
//        `name` varchar(255) DEFAULT NULL,
//        `thumbnail_id` varchar(255) DEFAULT NULL COMMENT 'format: user_img_01',
//        `course_id` int(11) DEFAULT NULL,
//        `course_name` varchar(255) DEFAULT NULL,
//        `instructor_name` varchar(255) DEFAULT NULL,
//        `status` tinyint(1) DEFAULT NULL COMMENT '1-3: 1: past, 2: current, 3: past',
//        PRIMARY KEY (`id`)
//        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;


@Entity
@Table(name = "learners")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")

public class Learner extends Model {
    // finder
    public static Finder<Long, Learner> find = new Finder<Long, Learner>(Long.class, Learner.class);
    public static Finder<String, Learner> findByName = new Finder<String, Learner>(String.class, Learner.class);

    @Id
    @Constraints.Min(11)
    public Long id;
    @Constraints.Required
    public String name;
    @Constraints.Required
    public Long course_id;
    @Constraints.Required
    public String course_name;
    public int status;
    public String thumbnail_id;

    public Learner() {
    }

    public Learner(Long id, String name, Long course_id, String course_name, int status, String thumbnail_id) {
        this.id = id;
        this.name = name;
        this.course_id = course_id;
        this.course_name = course_name;
        this.status = status;
        this.thumbnail_id = thumbnail_id;
    }
}
