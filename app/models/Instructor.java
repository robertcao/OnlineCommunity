package models;


import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import play.data.validation.Constraints;
import play.db.ebean.Model;

import javax.persistence.*;
import java.util.List;


@Entity
@Table(name = "instructors")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")

public class Instructor extends Model {
    // finder
    public static Finder<Long, Instructor> find = new Finder<Long, Instructor>(Long.class, Instructor.class);
    public static Finder<String, Instructor> findByName = new Finder<String, Instructor>(String.class, Instructor.class);

    @Id
    @Constraints.Min(11)
    public Long id;
    @Constraints.Required
    public String name;
    @Constraints.Required
    public String school;
    @Constraints.Required
    public String description;
    public int rating;
    public String thumbnail_id;

    public Instructor() {
    }


    public Instructor(Long id, String name, String school, int rating, String thumbnail_id) {
        this.id = id;
        this.name = name;
        this.school = school;
        this.rating = rating;
        this.thumbnail_id = thumbnail_id;
    }
}
