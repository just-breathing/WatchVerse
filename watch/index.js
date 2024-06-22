const express = require("express");
const { getUrl } = require("./controllers/watch.controller");
const { getAllVideos } = require("./controllers/home.controller");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT||6003;  

app.use(cors({
    allowedHeaders: ["*"],
    origin: "*"
}))

app.get("/", (req, res) => {
    res.sendJson({
        message: "Hello World!",
    });
});

app.get("/all",(req,res)=>{
    getAllVideos(req,res)
})

app.get("/video",(req,res)=>{
    getUrl(req,res)
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});