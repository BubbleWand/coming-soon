//Dependency imports

const dotenv = require("dotenv");
const express = require("express");
const session = require("express-session");
const errorHandler = require("errorhandler");
const bodyParser = require("body-parser");
const path = require("path");
const exphbs = require("express-handlebars");
const app = express();
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const flash = require("express-flash");
const validator = require("email-validator");
const Email = require("./models/Email");


// Middleware & configurations

dotenv.config({ path: ".env" });
hbs = exphbs.create({
  defaultLayout: "main"
});
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
  })
}));


// Connect to MongoDB.

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});


// Define routes

app.get("/", (req, res) => {
  res.render("index", {
    layout: false // Render the home page without a layout from ./views/layouts/main
  });
});

app.post("/", (req, res) => {
  const { email } = req.body;
  if (validator.validate(email)) { // check if email is valid
    Email.findOne({ email }, (err, existingEmail) => { // check if user already subscribed
      if (existingEmail) {
        req.flash("errors", { 
          msg: `<strong>${existingEmail.email}</strong> is already in our database.` 
        });
        res.redirect("/");
      } else { // if not already in db, and if email is valid, add to db.
        new Email({ email }).save((err) => {
          if (err) {
            return req.flash('errors', { msg: `<strong>Error:</strong> There was a problem storing your email in the database. Please try again.`})
          }
          req.flash("success", { 
            msg: `<strong>Subscribed!</strong> You will now receive release updates at <u>${req.body.email}</u>` 
          });
          res.redirect("/");
        });
      }
    });
  } else {
    req.flash("errors", { 
      msg: `Invalid email address` 
    });
    res.redirect("/");
  }
});


// Error Handler.

if (process.env.NODE_ENV === "development") {
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Server error");
  });
}


// Run app

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Bubble coming-soon page running on port ${port}`)
})
