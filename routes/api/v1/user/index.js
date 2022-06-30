var express = require('express');
var rootRouter = express.Router();

//Modüller
var register = require('./modules/register');
var password = require('./modules/password');
var login = require('./modules/login');
var terms = require('./modules/terms');
var privacy = require('./modules/privacy');
var profile = require('./modules/profile');
var list = require('./modules/list');

//Routes
rootRouter.use('/register', register);
rootRouter.use('/password', password);
rootRouter.use('/login', login);
rootRouter.use('/terms', terms);
rootRouter.use('/privacy', privacy);
rootRouter.use('/profile', profile);
rootRouter.use('/list', list);

module.exports = rootRouter;