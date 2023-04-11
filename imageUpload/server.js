'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
//const upload = multer({dest: 'images/'}); //images 폴더에 저장
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb)=>{
            cb(null, 'images/');
        }, 
        filename: (req,file,cb)=>{
            const ext = path.extname(file.originalname);
            const filename = path.basename(file.originalname, ext) + ext;
            cb(null, filename);
        },
    }),
});


const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();


app.get('/', (req, res)=> {
    res.send('Hello world\n');
});


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);


app.use('/user', express.static('uploads'));

//파일 업로드
app.get('/upload', function(req, res){
    res.sendfile("./html/page.html");
})

//업로드된 파일 받기
app.post('/upload', upload.single('userfile'), function(req, res){
    console.log(req.file);

    res.send('Uploaded' + req.file.originalname);
})
