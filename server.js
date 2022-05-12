const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors")

const PASSWORD = "123456"; // Needs to be the same as the in the discord bot

const app = express();
const fs = require("fs");

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    fs.exists("data.json", (exists) => {
        if (!exists) return res.status(404).send({ message: "File not found" });
        fs.readFile("data.json", (err, data) => {
            if (err) return res.status(500).send({ message: "Error reading the file" });
            res.send(JSON.parse(data));
        });
    });
});

app.post("/", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send({ message: "No Authorization header found" });
    const pwd = Buffer.from(authHeader, "base64").toString();
    if (pwd !== PASSWORD) return res.status(403).send("Wrong password");
    const data = JSON.stringify(req.body);
    fs.writeFile("data.json", data, (err) => {
        if (err) return res.status(500).send({ message: "Error creating the file" });
        res.send(data);
    });
});

const server = app.listen(process.env.PORT || 80, () => {
    console.log("You can access the server at http://localhost:%s", server.address().port);
});