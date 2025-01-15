import express from "express"
import axios from "axios"
import bodyParser from "body-parser";
import lodash from "lodash";
import mongoose from "mongoose";
import 'dotenv/config';

const app = express()
const port = 8080;
let posts = [];

// mongoose.connect("mongodb://127.0.0.1:27017/blog" , {useNewUrlParser: true,
// useUnifiedTopology: true,})
const connection = mongoose.connect(process.env.MONGODB_URL )

const db = mongoose.connection
db.once('open',()=>{
    console.log("connected successfully")
})
const blogschema = new mongoose.Schema({
    link : String , 
    title : String,
    content : String
})

const Blog = mongoose.model('Blog',blogschema)
// const blog1 = new Blog({
//     link : 'https://th.bing.com/th/id/OIP.a5YOm_1N-oe-O025Jw4PTQHaE8?pid=ImgDet&rs=1',
//     title : 'Blog' ,
//     content : 'my first blog Very excited to write this and check it'
// })
// blog1.save();

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    try{
        async function fetchdata(){
            const findele = await Blog.find();
            console.log("data found" , findele)
            res.render('home.ejs',{posts : findele})
        }
        
        fetchdata();
    }catch(e){
        console.log(e);
    }
    
})

app.get("/about",(req,res)=>{
    res.render("about.ejs")
})

app.get("/contact",(req,res)=>{
    res.render("contact.ejs")
})

app.get("/compose",(req,res)=>{
    res.render("compose.ejs")
})


app.post("/publish",(req,res)=>{
    const blog = new Blog({
        link : req.body.image,
        title : req.body.text,
        content : req.body.content
    })
    blog.save();

    res.redirect("/")
})

app.get("/posts/:search",(req,res)=>{
    const reqtitle = lodash.lowerCase(req.params.search)

    try{
        async function fetchdata(){
            const findele = await Blog.find();

            findele.forEach(ele=>{
                var title = lodash.lowerCase(ele.title)
        
                if(reqtitle == title){
                    console.log("Match found !")
                    res.render("post.ejs",{
                        image : ele.link,
                        heading: ele.title,
                        para : ele.content
                    })
                }else{
                    console.log("Match not found!")
                }
            })
        }

        
        fetchdata();
    }catch(e){
        console.log(e);
    }

})

app.post("/delete" , function(req,res){
    console.log(req.body.delpost);
    async function itemdelete(){
      try{
        const deleteitem = req.body.delpost;
        const result = await Blog.findByIdAndRemove(deleteitem);
        if (result) {
          console.log('Document deleted successfully');
        } else {
          console.log('Document not found or not deleted');
        }
        res.redirect("/");
      }
      catch(e){
        console.log(e)
      }
    }
    itemdelete();
    
  })


app.listen(port , ()=>{
    console.log(`Server listening on port ${port}`)
})