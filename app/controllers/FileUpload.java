package controllers;

import models.Instructor;
import models.S3File;
import models.User;
import play.db.ebean.Model;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import views.html.profile;

import java.net.MalformedURLException;
import java.util.List;
import java.util.UUID;

public class FileUpload extends Controller {

    public static List<S3File> index() {
        List<S3File> uploads = new Model.Finder(UUID.class, S3File.class).all();
        return uploads;
    }

    public static Result upload() throws MalformedURLException {
        Http.MultipartFormData body = request().body().asMultipartFormData();
        Http.MultipartFormData.FilePart uploadFilePart = body.getFile("upload");
        if (uploadFilePart != null) {
            S3File s3File = new S3File();
            s3File.name = uploadFilePart.getFilename();
            s3File.file = uploadFilePart.getFile();

            s3File.save();

            String email = session().get("email");
            List<User> userList = User.findByEmail.where().eq("email", email).findList();
            User user = userList.get(0);
            user.thumbnail_id = s3File.getUrl().toString();
            System.out.println("Thumbnail_id ====> " + user.thumbnail_id);
            user.save();

            List<Instructor> instructorList = Instructor.findByName.where().eq("name", user.user_name).findList();
            Instructor instructor = new Instructor();
            if (instructorList.size() != 0) {
                instructor = instructorList.get(0);
                instructor.thumbnail_id = s3File.getUrl().toString();
                instructor.save();
            }

            return ok(profile.render(user, instructor));
        }
        else {
            System.out.println("File upload error");
            return badRequest("Profile image upload error");
        }
    }

}