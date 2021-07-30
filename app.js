//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

try{
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect("mongodb+srv://admin-LAN:Pyrlan123@cluster0.i7a1b.mongodb.net/toDoList_DB");
console.log("conectado a la BD");
}catch(e){
  console.log(e.description);
}

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const estoesntaoddao = process.env.NADIESABE;
userSchema.plugin(encrypt, {secret: estoesntaoddao, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){

    res.render("home");
});

app.get("/login", function(req, res){

    res.render("login");
});

app.get("/register", function(req, res){

    res.render("register");
});


app.post("/register", function(req, res){
  const newUser = new User();
  newUser.username = req.body.username;
  newUser.password = req.body.password;

  newUser.save(function(error){
    if(!error){
        res.render("secrets");
    } else {
      console.log(error.description);
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({username: username}, function(error, usuarioEncontrado){
    if(error){
      console.log(error.description);
    }else {
    if(usuarioEncontrado){
      if (usuarioEncontrado.password === password){
        res.render("secrets");
      }
    }else {
      console.log("Usuario no encontrado");
      console.log("usuario: " + username);
      console.log("passwd: " + password);
    }
  }
});

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
