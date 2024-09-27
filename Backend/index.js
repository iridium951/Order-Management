const mongoose = require('mongoose');
const express = require('express');
const validator = require('validator');
const JsonWebToken = require('jsonwebtoken');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

const UserModel = require('./models/user-model.js');
const OrderModel = require('./models/order-model.js');

const dotenv = require('dotenv').config();
const mongoUrl = process.env.MONGO_URL;

const serverPort = 3000;
const SecretPassword = "eyJhbGciOiJIUzI1NiJ9";

async function initMongoose() {
    mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
}

function verifyToken(request, response, next) {
    const header = request.headers['authorization'];
    if (typeof header !== 'undefined') {
        console.log('verify token: ' + header);
        const headerToken = header.split(' ')[1];
        JsonWebToken.verify(headerToken, SecretPassword, function (error, decoded) {
            if (error) {
                return response.sendStatus(403).send('Invalid token: ' + error);
            }
            console.log('decoded token: ' + JSON.stringify(decoded));
            request.token = headerToken;
            request.tokenEmail = decoded.email;
            UserModel.find({ 'EmailAddress': request.tokenEmail }, (error, result) => {
                if (error) {
                    return response.status(403).send('User not found: ' + error);
                }
                const user = result[0];
                if (!user.token.includes(headerToken)) {
                    return response.sendStatus(403).send('Token not found');
                }
                request.tokenUserId = user._id;
                console.log('token UserId: ' + request.tokenUserId);
                request.tokenUser = user;
                next();
            });
        });
    }
    else {
        response.sendStatus(403).send('Invalid authorization');
    }
}

async function initServer() {
    const server = express();
    server.use(express.json());

    // GET all users
    server.get("/users", (request, response) => {
        console.log('get /users');
        UserModel.find((error, result) => {
            if (error) {
                return response.status(500).send(error);
            }
            response.send(result);
        });
    });

    // GET user by id
    server.get("/users/:id", (request, response) => {
        if (request.params.id) {
            console.log('get /users/id: ' + request.params.id);
            UserModel.find({ _id: request.params.id }, (error, result) => {
                if (error) {
                    return response.status(500).send(error);
                }
                if (result.length !== 1) {
                    return response.status(404).send("Data not found " + result.length);
                }
                response.send(result);
            });
        }
        else {
            response.status(500).send("Invalid parameter id");
        }
    });

    // POST user
    server.post("/users", (request, response) => {
        console.log('post /users: ' + JSON.stringify(request.body));
        if (!validator.isEmail(request.body.EmailAddress)) {
            return response.status(403).send("Invalid Email format");
        }
        if (!(validator.isInt(request.body.Age) && request.body.Age > 0)) {
            return response.status(403).send("Invalid Age");
        }
        const user = new UserModel(request.body);
        user.save((error) => {
            if (error) {
                return response.status(500).send(error);
            }
            response.send();
        });
    });

    // POST user login
    server.post("/users/login", (request, response) => {
        console.log('post /users/login: ' + JSON.stringify(request.body));
        if (!request.body.EmailAddress || !request.body.Password) {
            return response.status(403).send("Invalid Email or Password params 007");
        }
        UserModel.find({ 'EmailAddress': request.body.EmailAddress }, (error, result) => {
            if (error) {
                return response.status(403).send("Invalid Email or Password params 008");
            }
            if (result.length !== 1) {
                return response.status(403).send("Invalid Email or Password params 009");
            }
            const user = result[0];

            user.comparePassword(request.body.Password, function (matchError, isMatch) {
                if (matchError) {
                    return response.status(403).send("Invalid Email or Password params 001");
                } else if (!isMatch) {
                    return response.status(403).send("Invalid Email or Password params 002");
                } else {

                    const token = JsonWebToken.sign({ email: request.body.EmailAddress }, SecretPassword);
                    user.token.push(token);
                    UserModel.findByIdAndUpdate(user._id, user, { upsert: true }, (error) => {
                        if (error) {
                            return response.status(500).send(error);
                        }
                        response.send({ 'token': token });
                    });
                }
            })

        });
    });

    // POST user logout
    server.post("/users/logout", verifyToken, (request, response) => {
        console.log('post /users/logout: ' + request.token);
        UserModel.find({ _id: request.tokenUserId }, (error, result) => {
            if (error) {
                return response.status(403).send(error);
            }
            const user = result[0];
            user.token = user.token.filter(t => t !== request.token);
            console.log('Token removed: ' + user.token);
            UserModel.findByIdAndUpdate(user._id, user, { upsert: true }, (error) => {
                if (error) {
                    return response.status(500).send(error);
                }
                response.send('Logout success');
            });
        });
    });

    // PATCH user by id
    server.patch("/users/:id", (request, response) => {
        console.log('patch /users/id: ' + JSON.stringify(request.body));
        if (request.params.id) {
            if (request.body.EmailAddress && !validator.isEmail(request.body.EmailAddress)) {
                return response.status(403).send("Invalid Email format");
            }
            if (request.body.Age && !(validator.isInt(request.body.Age) && request.body.Age > 0)) {
                return response.status(403).send("Invalid Age");
            }
            UserModel.findOneAndUpdate({ _id: request.params.id }, request.body, { upsert: true }, (error) => {
                if (error) {
                    return response.status(500).send(error);
                }
                response.send();
            });
        }
        else {
            response.status(500).send("Invalid parameter UserId");
        }

    });

    // DELETE user by id
    server.delete("/users/:id", (request, response) => {
        if (request.params.id) {
            console.log('delete /users/id: ' + request.params.id);
            UserModel.findOneAndDelete({ _id: request.params.id }, (error, result) => {
                if (error) {
                    return response.status(500).send(error);
                }
                response.send("User deleted: " + result);
            });
        } else {
            response.status(500).send("Invalid parameter id");
        }
    });

    // GET all orders (only visible for user with appropriate token)
    server.get("/orders", verifyToken, (request, response) => {
        console.log('get /orders ' + request.tokenUserId);
        OrderModel.find({ 'User': request.tokenUser }, (error, result) => {
            if (error) {
                return response.status(500).send(error);
            }
            response.send(result);
        });
    });

    // GET order by id (only visible for user with appropriate token)
    server.get("/orders/:id", verifyToken, (request, response) => {
        if (request.params.id) {
            console.log('get /orders/id: ' + request.params.id + ' ' + request.tokenUserId);
            OrderModel.find({ 'User': request.tokenUser, _id: request.params.id }, (error, result) => {
                if (error) {
                    return response.status(500).send(error);
                }
                if (result.length !== 1) {
                    return response.status(404).send("Data not found " + result.length);
                }
                response.send(result);
            });
        }
        else {
            response.status(500).send("Invalid parameter id");
        }
    });

    // POST order (using token)
    server.post("/orders", verifyToken, (request, response) => {
        console.log('post /orders: ' + JSON.stringify(request.body));
        const order = new OrderModel(request.body);
        order.User = request.tokenUser;
        order.save((error) => {
            if (error) {
                return response.status(500).send(error);
            }
            response.send();
        });
    });

    // PATCH order (only usable for user with appropriate token)
    server.patch("/orders/:id", verifyToken, (request, response) => {
        console.log('patch /orders: ' + JSON.stringify(request.body));
        if (request.params.id) {
            OrderModel.findOneAndUpdate({ 'User': request.tokenUser, _id: request.params.id }, request.body, { upsert: true }, (error) => {
                if (error) {
                    return response.status(500).send(error);
                }
                response.send();
            });
        }
        else {
            response.status(500).send("Invalid parameter OrderID");
        }
    });

    // DELETE order by id (only usable for user with appropriate token)
    server.delete("/orders/:id", verifyToken, (request, response) => {
        if (request.params.id) {
            console.log('delete /orders/id: ' + request.params.id);
            OrderModel.findOneAndDelete({ 'User': request.tokenUser, _id: request.params.id }, (error, result) => {
                if (error) {
                    return response.status(500).send(error);
                }
                response.send("Order deleted: " + result);
            });
        } else {
            response.status(500).send("Invalid parameter id");
        }
    });

    server.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))

    server.listen(3000, () => {
        console.log('Server up on port ' + serverPort)
    })

}

initMongoose();
initServer();



//
/* 
Sources used: 
Praktikum 1

https://mongodb.github.io/node-mongodb-native/4.13/
https://www.w3schools.com/nodejs/nodejs_mongodb_insert.asp
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose;
https://mongoosejs.com/docs/models.html;
https://www.digitalocean.com/community/tutorials/use-expressjs-to-get-url-and-post-parameters;
https://mongoosejs.com/docs/tutorials/findoneandupdate.html; 
https://www.npmjs.com/package/validator; 
https://mongoosejs.com/docs/validation.html;
https://github.com/typestack/class-validator/issues/10
https://www.npmjs.com/package/express-jsdoc-swagger

Praktikum 2

https://www.npmjs.com/package/jsonwebtoken
https://medium.com/@reddy.nie11/authenticate-node-api-with-json-web-token-72f665df6b4c
https://itnext.io/auth-with-nodejs-express-mongoose-and-jwt-577aa3f2f707
https://medium.com/ms-club-of-sliit/jwt-bearer-token-authentication-for-express-js-5e95bf4dead0
https://mongoosejs.com/docs/guide.html#methods
https://mongoosejs.com/docs/schematypes.html
https://stackoverflow.com/questions/9792927/javascript-array-search-and-remove-string
https://www.freecodecamp.org/news/how-to-insert-an-element-into-an-array-in-javascript/
https://www.w3schools.com/jsref/jsref_includes_array.asp
https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

Praktikum 3

https://www.npmjs.com/package/bcrypt
https://www.tabnine.com/code/javascript/functions/mongoose/Model/comparePassword
https://coderrocketfuel.com/article/store-passwords-in-mongodb-with-node-js-mongoose-and-bcrypt
https://mongoosejs.com/docs/populate.html
https://mstream.hm.edu/static/mh_default_org/api/61c519aa-c178-4ef9-869e-9189d04ffff7/a8049690-1bcb-4473-91b6-1d69fd5ce4f7/concat.mp4
*/