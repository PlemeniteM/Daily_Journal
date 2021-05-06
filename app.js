const express=require("express");
const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");
const ejs=require("ejs");
const passport=require("passport");
const localPassport=require("passport-local");
const session=require("express-session");
const flash=require("connect-flash");
const app=express();
const homeContent="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const aboutContent="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const contactDetails="Venenatis tellus in metus vulputate eu scelerisque felis imperdiet proin. Sed arcu non odio euismod. Sollicitudin nibh sit amet commodo nulla facilisi nullam. Sagittis purus sit amet volutpat consequat mauris nunc congue. Viverra aliquet eget sit amet tellus cras adipiscing enim eu. Vel facilisis volutpat est velit egestas. Pellentesque id nibh tortor id aliquet lectus proin nibh. Erat imperdiet sed euismod nisi. Congue quisque egestas diam in. Sagittis aliquam malesuada bibendum arcu.";

//const posts=[];

mongoose.connect("mongodb://localhost:27017/Dailyjournal",{useNewUrlParser: true,
useCreateIndex: true,
useUnifiedTopology: true,
useFindAndModify: false});

const blogSchema=new mongoose.Schema({
    name:String,
    description:String
});

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
});

userSchema.plugin(passportLocalMongoose);

const User=mongoose.model("User",userSchema);

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
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.set("view-engine",ejs);


app.use(session(sessionConfig));
app.use(flash());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
passport.use(new localPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get('/register',function(req,res){
    res.render('register.ejs');
})


app.post('/register', async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser,err=>{
            if (err) return next(err);
            req.flash('success', 'Welcome to DailyJournal!');
            res.redirect('/');
        })
        
    } catch (e) {
        req.flash('error',e.message);
        res.redirect('/register');
    }
})

app.get('/login',function(req,res){
   res.render("login.ejs");
})

app.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),function(req,res){
    req.flash('success', 'welcome back!');
    const redirectUrl=req.session.returnTo||'/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})




app.get('/logout',function(req,res){
    req.logOut();
    res.redirect("/");
})













app.get("/",function(req,res){
    Blog.find({},function(err,results){
        if(results.length===0){
            Blog.insertMany(defaultEntries,function(err){
                if(err)console.log(err);
                else{console.log("success");}
            })
            console.log(req.user);
            res.redirect("/");
      }
      else
          res.render("home.ejs",{homeC:homeContent,entries:results});
    })
})


app.get("/contacts",function(req,res){
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        res.redirect('/login');
    }
    else
    res.render("contact.ejs",{contactC:contactDetails});
})


app.get("/about",function(req,res){
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        res.redirect('/login');
    }
    else
    res.render("about.ejs",{aboutC:aboutContent});
})


app.get("/compose",function(req,res){
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        res.redirect('/login');
    }
    else
    res.render("compose.ejs");
})



app.get("/posts/:id",function(req,res){
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        res.redirect('/login');
    }
    else{
        const blogId=req.params.id
        Blog.findById({_id:blogId},function(err,result){
            if(err)console.log(err);
            else{
                res.render("post.ejs",{post:result});
            }
        })
    }
    
})


app.post("/delete",function(req,res){
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        res.redirect('/login');
    }
    else{
        Blog.findByIdAndDelete({_id:req.body.bId},function(err){
            if(err)console.log(err);
            else{
                res.redirect("/");
            }
        })
    }
    
})


app.post("/",function(req,res){
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        res.redirect('/login');
    }
    else{
        const blog=new Blog({
            name:req.body.Title,
            description:req.body.entry
        })
        blog.save();
        res.redirect("/");
    }
    
})


app.listen(3000,function(req,res){
    console.log("Listening on 3000");
})