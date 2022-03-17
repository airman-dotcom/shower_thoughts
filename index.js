const express = require("express")
const http = require("http");
const app = express();
const server = http.createServer(app)
const PORT = process.env.PORT || "localhost";
app.use(express.static("public"));
app.use(express.json());
var user_reports = [];
const { v4: uuidv4 } = require("uuid");
var nodemailer = require("nodemailer")
const mongoose = require("mongoose");
let MONGO_URI = "mongodb+srv://amathakbari:24l63AQs7kQ8D3hX@my-db.m8xjh.mongodb.net/Shower_thoughts?retryWrites=true&w=majority";
mongoose.connect(MONGO_URI);
let db = mongoose.connection;
const kittySchema = new mongoose.Schema();
let credentials = db.collection("credentials2");
let thoughts = db.collection("thoughts");

function append(array, thing) {
  array.push(thing)
  return array;
}

function send_an_email(receiver, title, body) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'amathakbari@gmail.com',
      pass: 'ArmanMath'
    }
  });

  var mailOptions = {
    from: 'amathakbari@gmail.com',
    to: receiver,
    subject: title,
    text: body
  };

  transporter.sendMail(mailOptions, function (error, info) {
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

app.get("/link/:code", (req, res) => {

  credentials.findOne({ code: req.params.code }, (err, doc) => {
    if (doc == null) {
      res.status(404)
    } else {
      res.sendFile(__dirname + "/public/create.html")
    }
  })
})

app.get("/create", (req, res) => {
  res.sendFile(__dirname + "/public/create.html")
})

app.get("*", (req, res) => {
  res.status(404);

  if (req.accepts("html")) {
    res.sendFile(__dirname + "/public/404.html")
    return;
  }
  if (req.accepts("json")) {
    res.json({ error: "Page Not Found" });
    return;
  }
  res.type("txt").send("Page not Found")
})

server.listen(3000, PORT, () => {
  console.log("Server Started")
})

mongoose.connection.on("connected", (err) => {
  if (err) {
    console.log(err)
  }
  console.log("Connected to database")
})


app.post("/load_posts", (req, res) => {
  thoughts.count(function (err, count) {
    if (count === 0) {
      res.json({ status: false, message: "No Posts" })
    } else {
      let num = count;
      let titles = [];
      let bodies = [];
      let hearts = [];
      let share = [];
      let report = [];
      let user = [];
      let arr = [];
      let nums = [];
      thoughts.find({ poster: { $exists: true } }).toArray(function (err, results) {
        arr = results;
        arr = arr.reverse();
        if (arr.length != 0) {
          for (let x = 0; x < num; x++) {
            titles.push(arr[x].title);
            bodies.push(arr[x].body);
            hearts.push(arr[x].likes);
            share.push(arr[x].shares);
            report.push(arr[x].reports);
            user.push(arr[x].poster);
            nums.push(arr[x].id);
          }
          for (let x = 0; x < num; x++) {
            credentials.findOne({ email: user[x] }, function (err, doc) {
              user_reports.push(doc.reports)

              if (x == num - 1) {
                const data = {
                  n: num,
                  t: titles,
                  b: bodies,
                  h: hearts,
                  s: share,
                  r: report,
                  u: user,
                  u_r: user_reports,
                  nums: nums
                }
                res.json({ status: true, data: data })
              }
            })
          }
        }
      })
    }
  })
})

app.post("/send_email", (req, res) => {
  let email = req.body.email;
  let password = req.body.password
  let code = uuidv4();
  send_an_email(email, "ShowerThoughts Email confirmation Link", `Hello! Click on this link to verify your email: http://localhost:3000/link/${code}`);
  const data = {
    email: email,
    password: password,
    code: code,
    reports: 0,
  };
  credentials.insertOne(data)
})

app.post("/get_email", (req, res) => {
  let code = req.body.code;
  credentials.findOne({ code: code }, (err, doc) => {
    if (doc == null) {
      res.json({ false: null })
    } else {
      res.json({ true: doc.email })
      credentials.updateOne({ code: code }, { $unset: { code: 1 } })
    }
  })
})

app.post("/create_post", (req, res) => {
  let title = req.body.title;
  let body = req.body.body;
  let user = req.body.user;
  const data = {
    title: title,
    body: body,
    poster: user,
    likes: 0,
    reports: 0,
    shares: 0
  };
  thoughts.insertOne(data);
  res.json({ status: true })
})