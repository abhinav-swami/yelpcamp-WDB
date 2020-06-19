var express 		= require('express'),
    app		    	= express(),
    bodyParser 		= require("body-parser"),
    mongoose 		= require("mongoose"),
	flash 			= require("connect-flash"),
	passport		= require("passport"),
	LocalStrategy	= require("passport-local"),
	methodOverride	= require("method-override"),
    Campground		= require("./models/campground"),
	Comment 		= require("./models/comment"),
	User 			= require("./models/user"),
    seedDB	 		= require("./seeds");
	
//routes
var commentRoutes 		= require("./routes/comments"),
	campgroundRoutes 	= require("./routes/campgrounds"),
	indexRoutes 		= require("./routes/index");
	
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true,  useUnifiedTopology: true});

app.use(bodyParser.urlencoded({ extended:true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();


app.use(require("express-session")({
	secret: "coding decoding data comes here",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds" , campgroundRoutes);
app.use("/campgrounds/:id/comments/",commentRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function (){
	console.log("server is on at PORT 3000")
});