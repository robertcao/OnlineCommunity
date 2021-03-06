# Online Community
A Web application built on Play Framework.

### Prerequisites:
  1. Play Framework: <https://www.playframework.com/documentation/2.3.x/Installing>
  2. MySQL Database: configutation is in *application.conf*
  3. IDE with Play Framework Plugin 2.0+

### Architectures*:
* app: *Application sources*  
--assets: *Compiled asset sources*  
--controllers: *Application controllers*  
--models: *Application business model, mapping to tables (entities) in database.*  
--views: *Html pages*  

* conf: *Configurations files*  
--application.conf: *Main configuration file, database connection, debug, log*  
--routes: *Routes definition, pages, RESTful*  

* project: *sbt configuration files*  
--build.properties: *Marker for sbt project*  
--plugins.sbt: *sbt plugins including the declaration for Play itself* 

* public: *Public assets*  
--stylesheets: *CSS files*  
--javascripts: *Javascript files*  
--images: *Image files*
 
* build.sbt: *Application build script*


####*Reference: 
<https://www.playframework.com/documentation/2.3.x/Anatomy>
