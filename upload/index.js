const express = require("express");
const cors = require("cors");
const { initializeUpload, uploadChunk,CompleteUpload } = require("./controllers/s3upload");
const upload = require("multer")();
require("dotenv").config();
const app = express();
const port = process.env.PORT||6001;  

app.use(cors({
    allowedHeaders: ["*"],
    origin: "*"
 }));

  app.use(express.json());


app.post("/init",upload.none(),(req,res)=>{
    initializeUpload(req,res)
})

app.post("/upload",upload.single("chunk") ,(req, res) => {
    uploadChunk(req, res);
});

app.post("/complete",upload.none(),(req,res)=>{
    CompleteUpload(req,res);
;})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});