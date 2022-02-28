const express = require("express")
const http = require("http");
const app = express();
const server = http.createServer(app)
const PORT = process.env.port || "localhost";
app.use(express.static("public"));
app.use(express.json())

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
});

server.listen(3000, PORT, () => {
    console.log("Server Started")
})