package models;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import play.Logger;
import play.db.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.UUID;

@Entity
@Table(name = "s3files")
public class S3File extends Model {

    @Id
    public UUID id;

    private String bucket;

    public String name;

    public String url;

    @Transient
    public File file;


    // S3 Settings
    public static final String AWS_ACCESS_KEY_ID = "AKIAIHLO7VYLULM73TYQ";
    public static final String AWS_SECRET_ACCESS_KEY = "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";
    public static final String AWS_S3_BUCKET = "cmpe295ocbucket";

    public static AmazonS3 amazonS3;


    public URL getUrl() throws MalformedURLException {
        return new URL("https://s3-us-west-2.amazonaws.com/" + bucket + "/" + getActualFileName());
    }

    public void setUrl() throws MalformedURLException {
        this.url = getUrl().toString();
    }

    private String getActualFileName() {
        return id + "/" + name;
    }



    @Override
    public void save() {
        connectToS3();
        if (amazonS3 == null) {
            Logger.error("Could not save because amazonS3 was null");
            throw new RuntimeException("Could not save");
        }
        else {
            this.bucket = AWS_S3_BUCKET;

            super.save(); // assigns an id

            PutObjectRequest putObjectRequest = new PutObjectRequest(bucket, getActualFileName(), file);
            putObjectRequest.withCannedAcl(CannedAccessControlList.PublicRead); // public for all
            amazonS3.putObject(putObjectRequest); // upload file
        }
    }

    @Override
    public void delete() {
        if (amazonS3 == null) {
            System.out.println("Could not delete because amazonS3 was null");
            Logger.error("Could not delete because amazonS3 was null");
            throw new RuntimeException("Could not delete");
        }
        else {
            amazonS3.deleteObject(bucket, getActualFileName());
            super.delete();
        }
    }


    public void connectToS3() {

        if ((AWS_ACCESS_KEY_ID != null) && (AWS_SECRET_ACCESS_KEY != null)) {
            AWSCredentials awsCredentials = new BasicAWSCredentials(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY);
            amazonS3 = new AmazonS3Client(awsCredentials);

            // List Buckets
//            for (Bucket bucket : amazonS3.listBuckets()) {
//                System.out.println("Bucket available ====> " + bucket.getName());
//            }

            Logger.info("Using S3 Bucket: " + AWS_S3_BUCKET);
        }
    }
}
