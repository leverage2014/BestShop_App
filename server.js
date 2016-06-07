var express = require('express');
var app = express();

var mongojs = require('mongojs');

var mailer = require('express-mailer');
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

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

var productDb = mongojs('shoppingApp',['products']);
var userDb = mongojs('shoppingApp',['users']);
var orderDb = mongojs('shoppingApp',['orders']);

var bodyParser = require("body-parser");


// adjust port for Heroku deployment
//app.listen(3000);
app.set('port', (process.env.PORT || 3000));

console.log('server is running');

console.log(__dirname);
app.use(express.static(__dirname));
app.use(bodyParser.json());

app.get('/home/:id', function (req, res){
    var id = req.params.id;

    console.log(id);
    if(id == "100"){
        productDb.products.find(function (err, docs) {
        //    console.log(docs);
            res.json(docs);
        });
    } else {
        productDb.products.find({"category":id}, function (err, docs) {
          //  console.log(docs);
            res.json(docs);
        });
    }
});

app.post('/verifyUser', function (req, res) {
    console.log('enter verifyUser');
    console.log(req.body);
    console.log(isEmptyObject(req.body));
    if(!isEmptyObject(req.body)){
        userDb.users.findOne(req.body, function (err, doc) {
            console.log('findOne in post');
            console.log(doc);
            res.json(doc);
        });
    }
});

app.post('/registUser', function (req, res) {
    
    userDb.users.insert(req.body, function (err, doc) {
       // res.json(doc);
        console.log('enter registUser');
        console.log(doc);
        console.log(err);
        res.json(err);
    });
});

app.post('/checkout', function (req, res) {

    var receivedOrder = req.body;
    console.log("=== received order ====");
    console.log(receivedOrder);

    orderDb.orders.insert(receivedOrder, function (err, doc) {
        console.log('insert error');
        console.log(err);
        console.log(doc);

        var orderId = doc._id;
        console.log(orderId);

        // send confirm emaiL
        app.mailer.send('orderConfirm', {
            to: doc.email,   // REQUIRED. This can be a comma delimited string just like a normal email to field.
            subject: 'Your order '+ orderId +' is confirmed!',   // REQUIRED
            orderId: orderId,
            date: doc.orderDate,
            details: doc.products,// All additional properties are also passed to the template as local variables.
            orderTotal: doc.totalPrice

        }, function (err) {
            if(err){
                console.log(err);
            } else {
                res.json(orderId);
            }
        });

    });

});


var isEmptyObject = function( obj ) {
    for ( var name in obj ) {
        return false;
    }
    return true;
}