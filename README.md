# *BestShop* ShoppingApp by MEAN stack

## Overview
This application is a web-application built with MEAN stack (MongoDB, Express, Angular and Nodejs).

* The Angular 1.x and Bootstrap are used for front-end development;
* Express and Nodejs are used to compile the server;
* MongoDB is used to store the data (such as users' info and order's details).

## Prerequisites

### Git

- A good place to learn about setting up git is [here][git-github]
- Git [home][git-home] (download, documentation)

### Node.js and Tools

- Get [Node.js][node-download].
- Install the tool dependencies (`npm install`)

### MongoDB

- Get [MongoDB][mongo-download].
- Install and setup MongoDB in your machine.

## Application Directory Layout

````
css/              --> css files
  display.css     --> default stylesheet 
framework/        --> libraries and framworks used in the app
images/           --> image files (such as logo and products images)
index.html        --> app layout file (the main html template file of the app)
js/               --> javascript files
  app.js          --> the main application module
  controllers.js  --> application controllers
tmpls/             --> angular ui view partials (partial html templates) used by ui-View
views/
  orderConfirm.jade  --> email template with the view engine of Jade
server.js         --> server
package.json      --> configuration information
Procfile          --> For Heroku
 
````
     
     
## Details about the application
### Main features:
#### Front-end:
* User login/user register with verification
* Products display with category selection
* Route in different views with [ui-route][ui-route]

#### Back-end:
* Data retrieve from and insert into database
* Send email with [express-mailer][express-mailer]


## Development with the application
The following docs describe how you can test and develop further this application.


### Installing dependencies

The application relies upon various node.js tools.  You can install these by running:

```
npm install
```

### Setting up the MongoDB
- Create a database named `shoppingApp`
- In the database, create three collections `products`, `users`, and `orders`
- Sample Data of the collections:
- (1) `products`
````
{
	"_id" : ObjectId("574cc9774614ce6550e58368"),
	"id" : "1001",
	"label" : "iphone 6s",
	"category" : "0",
	"description" : "The newest iphone model",
	"price" : "599.99",
	"thumbnail" : "iphone.png"
}
````

- (2) `users`
````
{
	"_id" : ObjectId("574cd2a04614ce6550e5836b"),
	"name" : "Tom",
	"email" : "tom@test.com",
	"password" : "12345"
}
````

- (3) `orders`
````
{
	"_id" : ObjectId("574ddb48ef783ecd44c983d0"),
	"orderDate" : "2016-5-31",
	"username" : "Jerry",
	"email" : "jerry@test2.com",
	"products" : [
		{
			"productId" : "1002",
			"label" : "iphone pro",
			"price" : "799.99",
			"quantity" : 3
		}
	],
	"totalPrice" : 2397
}
````


### Changing email setting in `server.js``
- Chang the email setting in the following code:

````
mailer.extend(app, {
    from: '*****@gmail.com',     // --> set your email address here
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: '*****@gmail.com',  //--> set your email address here
        pass: '******'           // --> set your corresponding password here
    }
});

````


### Running the app during development

- Run `server.js` as the server
- navigate your browser to `http://localhost:3000` to see the app running in your browser.


## Contact

For any suggestions and bugs about the project please contact [Me][my-email].


[git-home]: http://git-scm.com
[git-github]: http://help.github.com/set-up-git-redirect
[mongo-download]:https://www.mongodb.com/download-center?jmp=nav#community
[node-download]: http://nodejs.org/download/
[ui-route]: https://angular-ui.github.io/ui-router/
[express-mailer]: https://github.com/RGBboy/express-mailer
[my-email]: myletter428@gmail.comBestShop-ShoppingApp

