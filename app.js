var express = require('express'),
app = express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
flash = require('connect-flash'),
passport = require('passport'),
LocalStrategy = require('passport-local'),
methodOverride = require('method-override'),
Blog = require('./models/blog'),
Comment = require('./models/comment'),
// router
commentRoutes = require('./routes/comments'),
blogRoutes = require('./routes/blogs'),
indexRoutes = require('./routes/index'),
User = require('./models/user');

// const MONGODB_URI =
// `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-t4jqz.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

// Development DB
// mongoose.connect('mongodb://localhost/ebeta');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// Passport configuration
app.use(require('express-session')( {
  secret: 'There are no men like me; only me',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
  next();
});

app.use('/', indexRoutes);
app.use('/blogs/:id/comments', commentRoutes),
app.use('/blogs', blogRoutes);

// app.listen(process.env.PORT, process.env.IP, () => {
//     console.log('Server started');
// });
mongoose
  .connect('mongodb://rexdb:rexdb123@ds129003.mlab.com:29003/rex_blog')
  .then(result => {
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log(err);
  });

// Development Server
// app.listen(process.env.PORT, process.env.IP, () => {
//   console.log('Server Started');
// })