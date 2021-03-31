const express=require("express");
const ejs=require("ejs");
const app=express();
const homeContent="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const aboutContent="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const contactDetails="Venenatis tellus in metus vulputate eu scelerisque felis imperdiet proin. Sed arcu non odio euismod. Sollicitudin nibh sit amet commodo nulla facilisi nullam. Sagittis purus sit amet volutpat consequat mauris nunc congue. Viverra aliquet eget sit amet tellus cras adipiscing enim eu. Vel facilisis volutpat est velit egestas. Pellentesque id nibh tortor id aliquet lectus proin nibh. Erat imperdiet sed euismod nisi. Congue quisque egestas diam in. Sagittis aliquam malesuada bibendum arcu.";

const posts=[];
app.set("view-engine",ejs);
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.render("home.ejs",{homeC:homeContent,entries:posts});
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
    for(entry of posts){
        if(entry.title.replace(' ','-').toLowerCase()===req.params.id){
            res.render("post.ejs",{post:entry});
        }
    }
    
})

app.post("/",function(req,res){
    const post={
        title:req.body.Title,
        description:req.body.entry
    }
    posts.push(post);
    res.redirect("/");
})

app.listen(3000,function(req,res){
    console.log("Listening on 3000");
})