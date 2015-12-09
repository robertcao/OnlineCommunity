name := "onlinecommunity"

version := "1.0"

lazy val `onlinecommunity` = (project in file(".")).enablePlugins(PlayJava)

scalaVersion := "2.11.1"

libraryDependencies ++= Seq( javaJdbc , javaEbean , cache , javaWs )

libraryDependencies += "mysql" % "mysql-connector-java" % "5.1.18"

libraryDependencies += "com.amazonaws" % "aws-java-sdk" % "1.7.1"

unmanagedResourceDirectories in Test <+=  baseDirectory ( _ /"target/web/public/test" )
