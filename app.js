const express=require("express");
const mongoose=require("mongoose");
const ejs=require("ejs");
const app=express();
const homeContent="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const aboutContent="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const contactDetails="Venenatis tellus in metus vulputate eu scelerisque felis imperdiet proin. Sed arcu non odio euismod. Sollicitudin nibh sit amet commodo nulla facilisi nullam. Sagittis purus sit amet volutpat consequat mauris nunc congue. Viverra aliquet eget sit amet tellus cras adipiscing enim eu. Vel facilisis volutpat est velit egestas. Pellentesque id nibh tortor id aliquet lectus proin nibh. Erat imperdiet sed euismod nisi. Congue quisque egestas diam in. Sagittis aliquam malesuada bibendum arcu.";

//const posts=[];

mongoose.connect("mongodb://localhost:27017/blogsDB",{useFindAndModify:false,useNewUrlParser:true,useUnifiedTopology:true});

const blogSchema=new mongoose.Schema({
    name:String,
    description:String
});

const Blog=mongoose.model("Blog",blogSchema);

const blog1=new Blog({
name:"Day1",
description:"Default post 1"
})
const blog2=new Blog({
name:"Day 2",
description:"Default post 2"
})

const defaultEntries=[blog1,blog2];


app.set("view-engine",ejs);
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    Blog.find({},function(err,results){
        if(results.length===0){
              Blog.insertMany(defaultEntries,function(err){
                  if(err)console.log(err);
                  else{console.log("success");}
              })
              res.redirect("/");
        }
        else
            res.render("home.ejs",{homeC:homeContent,entries:results});
    })
    
})
app.get("/contacts",function(req,res){
    res.render("contact.ejs",{contactC:contactDetails});
})
app.get("/about",function(req,res){
    res.render("about.ejs",{aboutC:aboutContent});
})

app.get("/compose",function(req,res){
    res.render("compose.ejs");
})

app.get("/posts/:id",function(req,res){
    const blogId=req.params.id
    Blog.findById({_id:blogId},function(err,result){
        if(err)console.log(err);
        else{
            res.render("post.ejs",{post:result});
        }
    })
})

app.post("/delete",function(req,res){
    Blog.findByIdAndDelete({_id:req.body.bId},function(err){
        if(err)console.log(err);
        else{
            res.redirect("/");
        }
    })
})
app.post("/",function(req,res){

    const blog=new Blog({
        name:req.body.Title,
        description:req.body.entry
    })
    blog.save();
    //posts.push(post);
    res.redirect("/");
})

app.listen(3000,function(req,res){
    console.log("Listening on 3000");
})