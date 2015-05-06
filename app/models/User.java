package models;

/**
 * User_Model: group of user properties, atomic operations
 * Methods list:
 *      constructor: User(Long id, String user_name, String email, String first_name, String password, String last_name, int gender, String user_image_path)
 *      timer:       String currentTime()
 *      creator:     void create(User user)
 *      deleter:     void delete(Long id)
 * Methods as property:
 *      finder:      find = new Finder<Long, User>(Long.class, User.class)
 */

import play.data.validation.Constraints;
import play.db.ebean.Model;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.text.SimpleDateFormat;
import java.util.Date;

@Entity
@Table(name="users")
public class User extends Model {

    @Id
    @Constraints.Min(11)
    public Long id;

    @Constraints.Required
    public String user_name;

    @Constraints.Required
    public String email;

    @Constraints.Required
    public String password;

    public String first_name;
    public String last_name;
    public int gender;
    public String user_image_path;
    public String created_at;

    public User() { }

    // constructor
    public User(Long id, String user_name, String email, String first_name, String password, String last_name, int gender, String user_image_path) {
        this.id = id;
        this.user_name = user_name;
        this.email = email;
        this.password = password;
        this.first_name = first_name;
        this.last_name = last_name;
        this.gender = gender;
        this.user_image_path = user_image_path;
    }

    // finder
    public static Finder<Long, User> find = new Finder<Long, User>(Long.class, User.class);

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
        // save to DB
        user.save();
    }

    // deleter
    public static void delete(Long id) { find.ref(id).delete(); }

    // authenticator
    public static User authenticate(String user_name, String password) {
        System.out.println(user_name + "----" + password);
        return find.where()
                .eq("user_name", user_name)
                .eq("password", password)
                .findUnique();
    }
}

