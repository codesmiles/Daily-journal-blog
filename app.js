//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash"); // lodash
const mongoose = require("mongoose"); // mongoose
const app = express();
const newsLetterSchema = require("./model/schema.js");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// middlware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// GLOBAL ARRY VARIABLE FOR POSTS
// const newPosts = []; OLD WAY

// SET UP MONGOOSE CONNECTION------------------
const url = `mongodb://localhost:27017/clientLocation`;
// connect to mongoose
mongoose.connect(url, function (err) { 
  if (err) { console.log(err); }
  console.log(`Connected to MongoDB`);
});


// --------------------------------------------


// render the eJS home template file
app.get(`/`, function (req, res) {
  res.render("home", {
    startingContent: homeStartingContent,
    posts: newPosts,
  });
});

// about page route
app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

// contact page route
app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

// compose page
app.get("/compose", (req, res) => {
  res.render("compose");
});
app.post("/compose", (req, res) => {
  //creating a js object for the post request
  const post = {
    title: req.body.newTitle,
    content: req.body.newContent,
  };

  // push to new posts
  // newPosts.push(post); THIS IS THE OLD WAY


  // save to mongoDB
  const insertNews = newsLetterSchema.create(post);
  insertNews.save(err,newData => {
    if(err){
      console.log(err)
    }
    res.json({
      success: true,
      messag: "Post saved successfully",
      data: newData,
      statusCode: 200
    })
  });


  res.redirect("/");
});

// routing parameters with spoiles of lodash
app.get("/posts/:postTitle", (req, res) => {
  const requestedTitle = _.lowerCase(req.params.postTitle);

  newPosts.forEach((post) => {
    const storedTitle = _.lowerCase(post.title);
    if (storedTitle === requestedTitle) {
      res.render("post", {
        postTitle: post.title,
        postContent: post.content,
      });
    }
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
