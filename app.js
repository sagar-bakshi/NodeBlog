//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose =  require("mongoose");
const request = require("request");
const route = require("./route");

///connecting to mongoDB
mongoose.connect('mongodb://localhost:27017/blogDB',{useNewUrlParser:true, useUnifiedTopology:true});


//making Schema
postSchema = mongoose.Schema({
  title: String,
  content : String,
  createdAt : {type:Date, default:new Date()}
});

//creating model for schema
Post = mongoose.model("Post",postSchema);

///test POST for blog
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//initializing Express
const app = express();
//setting EJS view engin
app.set('view engine', 'ejs');

app.use("/route",route)

//setting bodyparser for url data
app.use(bodyParser.urlencoded({extended: true}));

//setting css file location
app.use(express.static("public"));


//home page screen with few default blog
app.get("/", function(req, res){

  Post.find({},(err, foundPost)=>{
    if(err){
      console.log(err);
    }else{
      res.render("home", {
        startingContent: homeStartingContent,
        posts: foundPost
        });
    }
  });


});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.get("/news",function (req,res) {
  request(
      {url: "http://newsapi.org/v2/top-headlines?country=in&category=technology&apiKey=e381d0619c5c4205ad2d9c27c7355119",
        json:true
      },(err, response, body)=>{
        res.render("news",{
          newsdata : body.articles
        });

      }
  )
});

app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save();

  res.redirect("/");

});

app.get("/posts/:postId", function(req, res){

// const requestedTitle = _.lowerCase(req.params.postName);
const post_id = req.params.postId;

Post.findOne({_id:post_id},(err, post) => {
  if (err) {
    console.log(err);
  }else{
    res.render("post", {post:post});
  }
});

});

app.get("/post",(req,res)=>{
  Post.find({},(err,posts)=>{
    if (err){
      console.log(err);
    }else {
      console.log(posts);
      res.render("allpost",{posts:posts});
    }
  });
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
