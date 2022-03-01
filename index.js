const express = require("express")
const http = require("http");
const app = express();
const server = http.createServer(app)
const PORT = process.env.PORT || "localhost";
app.use(express.static("public"));
app.use(express.json())
const { v4: uuidv4 } = require("uuid");

const mongoose = require("mongoose");
let MONGO_URI = "mongodb+srv://amathakbari:24l63AQs7kQ8D3hX@my-db.m8xjh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(MONGO_URI);
let db = mongoose.connection;
const kittySchema = new mongoose.Schema();
let credentials = db.collection("credentials2");
let thoughts = db.collection("thoughts");
function send_an_email(receiver, title, body){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'amathakbari@gmail.com',
          pass: 'Sahra253!'
        }
      });
      
      var mailOptions = {
        from: 'amathakbari@gmail.com',
        to: receiver,
        subject: title,
        text: body
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
});

app.get("/create", (req, res) => {
    res.sendFile(__dirname + "/public/create.html")
})

server.listen(3000, PORT, () => {
    console.log("Server Started")
})

mongoose.connection.on("connected", (err) => {
    if (err){
        console.log(err)
    }
    console.log("Connected to database")
})

app.post("/loadposts", (req, res) => {
    thoughts.count(function(err, count){
        if (count === 0){
            res.json({status: "No Posts"})
        }
    })
})

app.post("/send_email", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let code = uuidv4();
    send_an_email(email, "ShowerThoughts Email confirmation Link", `Hello! Click on this link to verify your email: https://localhost:3000/link/${code}`)
})