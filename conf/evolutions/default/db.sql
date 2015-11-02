# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.6.22)
# Database: onlinecommunitydb
# Generation Time: 2015-05-05 04:12:09 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table courses
# ------------------------------------------------------------

DROP TABLE IF EXISTS `courses`;

CREATE TABLE `courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_name` varchar(255) NOT NULL DEFAULT '',
  `average_rating` float DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL COMMENT 'associate with course category id',
  `instructor_user_id` int(11) DEFAULT NULL COMMENT 'associate with instructor user id',
  `learner_user_id` int(11) DEFAULT NULL COMMENT 'associate with learner user id',
  `assignment_id` int(11) DEFAULT NULL COMMENT 'associate with assignment id',
  `test_id` int(11) DEFAULT NULL COMMENT 'associate with test id',
  PRIMARY KEY (`id`),
  KEY `user_id` (`instructor_user_id`),
  KEY `category_id` (`category_id`),
  KEY `assignment_id` (`assignment_id`),
  KEY `test_id` (`test_id`),
  KEY `learner_user_id` (`learner_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;

INSERT INTO `courses` (`id`, `course_name`, `average_rating`, `create_date`, `start_date`, `end_date`, `category_id`, `instructor_user_id`, `learner_user_id`, `assignment_id`, `test_id`)
VALUES
	(1,'Java Programing',4.5,'2015-04-20 00:00:00',NULL,NULL,NULL,1,NULL,NULL,NULL),
	(2,'Java Programing',4.5,'2015-04-20 00:00:00',NULL,NULL,NULL,NULL,2,NULL,NULL),
	(3,'Java Programing',4.5,'2015-04-20 00:00:00',NULL,NULL,NULL,NULL,3,NULL,NULL),
	(4,'Java Programing',4.5,'2015-04-20 00:00:00',NULL,NULL,NULL,NULL,4,NULL,NULL);

/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table instructors
# ------------------------------------------------------------

DROP TABLE IF EXISTS `instructors`;

CREATE TABLE `instructors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_id` int(11) DEFAULT NULL COMMENT 'associate with course id',
  `user_id` int(11) DEFAULT NULL COMMENT 'associate with user id',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `course_id` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table learners
# ------------------------------------------------------------

DROP TABLE IF EXISTS `learners`;

CREATE TABLE `learners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_id` int(11) DEFAULT NULL COMMENT 'associate with course id',
  `user_id` int(11) DEFAULT NULL COMMENT 'associate with user id',
  `assignment_final_score` int(3) DEFAULT NULL,
  `test_final_score` int(11) DEFAULT NULL,
  `feedback` varchar(512) DEFAULT NULL COMMENT 'learner feedback for this course',
  `evaluate_score` tinyint(1) DEFAULT NULL COMMENT 'learner evaluation for this course',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `course_id` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) NOT NULL DEFAULT '',
  `email` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(20) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `gender` int(1) DEFAULT NULL COMMENT 'male-0; female-1',
  `user_image_path` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;

INSERT INTO `user` (`id`, `user_name`, `email`, `password`, `first_name`, `last_name`, `gender`, `user_image_path`, `created_at`)
VALUES
	(1,'test0501','test0501@gmail.com',NULL,'test','test',0,NULL,NULL),
	(2,'test050102','test050102@gmail.com',NULL,'test','test050102',1,NULL,NULL),
	(3,'test050103','test050103@gmail.com',NULL,'test','test050103',1,NULL,NULL),
	(4,'test050104','test050104@gmail.com',NULL,'test','test050104',0,NULL,NULL),
	(5,'ddcc','ddcc@gmail.com',NULL,'dd','cc',0,NULL,NULL),
	(6,'nv','nv@gmail.com',NULL,'n','v',0,NULL,NULL),
	(7,'nvnv','nvnv@gmail.com',NULL,'nn','vv',0,NULL,'2015-05-04 13:36:35'),
	(8,'ppss','ppss@gmail.com','ppsspp','pp','ss',0,NULL,'2015-05-04 13:40:28'),
	(9,'female','woman@gmal.com','nnnnnn','Fem','Ale',0,NULL,'2015-05-04 13:42:25'),
	(10,'male','male@gmail.com','man','Ma','El',0,NULL,'2015-05-04 13:48:18'),
	(11,'test050401','050401@gmail.com','050401','test','050401',0,NULL,'2015-05-04 14:00:51'),
	(12,'test050402','050402@gmail.com','050402','test','050402',0,NULL,'2015-05-04 14:01:44'),
	(13,'test050403','050403@gmail.com','050403','test','050403',0,NULL,'2015-05-04 14:02:43'),
	(14,'test050404','050401@gmail.co4','050404','test','050404',1,NULL,'2015-05-04 14:07:16'),
	(15,'test050405','050405@gmail.com','050405','test','050405',0,NULL,'2015-05-04 14:32:34'),
	(16,'test050406','050406@gmail.com','050406','test','050406',0,NULL,'2015-05-04 15:56:21'),
	(17,'test050407','050407@gmail.com','050407','test','050407',1,NULL,'2015-05-04 17:26:42');

/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

