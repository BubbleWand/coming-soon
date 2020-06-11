//Dependency imports

const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const exphbs = require("express-handlebars");
const app = express();


// Middleware & configurations

dotenv.config({ path: ".env" });
hbs = exphbs.create({
  defaultLayout: "main"
});
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Define routes

app.get("/", (req, res) => {
  res.render("index", {
    layout: false // Render the home page without a layout from ./views/layouts/main
  });
});


// Run app

const port = process.env.PORT || 5000;
app.listen(process.env.PORT || 5000, () => {
  console.log(`Bubble coming-soon page running on port ${port}`)
})
