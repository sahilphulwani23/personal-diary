//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent =
  "Keeping a diary can be a great way to record your thoughts and stay in touch with yourself. Getting started can be the hardest part! Don't worry too much about making it perfect, just write about whatever is on your mind. Don't let anyone influence what you write in your diary. Do what you want with it.";
const aboutContent =
  "Hello, I'm Sahil Phulwani, a 2nd year student at Indian Institute of Information Technology Bhopal pursuing B.Tech in ECE. I am always ready to learn and explore new things as I find all new things fascinating to me. Also, I believe in Learn and grow in public for motivating others and yourself to do best in the situation.";
const contactContent = "How to reach me :";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/public/", express.static("./public"));

const dotenv = require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

// let posts = [];

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postName", async function (req, res) {
  //read more

  var data;
  data = await Post.findOne({ title: req.params.postName });
  res.render("post", {
    title: data.title,
    content: data.content,
  });
});

app.get("/edit/:postName", async function (req, res) {
  //update

  var data;
  data = await Post.findOne({ title: req.params.postName });
  res.render("update", {
    title: data.title,
    content: data.content,
  });
});

app.post("/edit/:postName", async function (req, res) {
  //update

  var data;
  data = await Post.findOneAndUpdate(
    { title: req.params.postName },
    { $set: { title: req.body.postTitle, content: req.body.postBody } },
    { new: true }
  );

  res.redirect("/");
});

app.get("/delete/:postName", function (req, res) {
  //delete
  Post.findOneAndDelete({ title: req.params.postName }).then(res.redirect("/"));
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
