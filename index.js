var express = require('express');
var fileUpload = require('express-fileupload');
var bodyParser  = require("body-parser");
var xss = require('node-xss').clean;
var fs = require('fs');
var app = express();

// default options
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/upload', function(req, res) {
    var sampleFile;

    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }

    sampleFile = req.files.code;
    console.log("Upload by " + req.body.user.toUpperCase());

    if(req.body.user === 'index' || req.body.user.indexOf('/') > -1) {
      res.status(500).send("ti fa davero?");
    }

    var content = xss(sampleFile.data.toString());

    fs.writeFile(__dirname + '/files/' + req.body.user + '.html', content, function (err) {
      if (err) {
          res.status(500).send(err);
      }
      else {
          res.send('File uploaded for '+ req.body.user +'!');
      }
    });

    // sampleFile.mv(__dirname + '/files/' + req.body.user + '.html', function(err) {
    //     if (err) {
    //         res.status(500).send(err);
    //     }
    //     else {
    //         res.send('File uploaded for '+ req.body.user +'!');
    //     }
    // });
});


app.get('/users', function(req, res) {

  var testFolder = './files/';

  fs.readdir(testFolder, function(err, files) {

        res.json({
          files: files.filter(function(file) {
              return file.indexOf('index') === -1 && file.indexOf('.html') > 0;
            })
        });

  })

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
