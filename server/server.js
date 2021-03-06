const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const fs = require('fs-extra');
const logFile = path.join(__dirname, '../logs/access.log');

fs.ensureFile(logFile, err => {
    console.log(err) // => null
});

const accessLogStream = fs.createWriteStream(logFile, { flags: 'a' })

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);

// setup the logger
app.use(logger('combined', { stream: accessLogStream }))
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.join(__dirname, '../public')));

// set the view engine to ejs
app.set('view engine', 'ejs')

const https = require('https');

const getInstaData = (path) => {
  let data = ""
  const trailingSlash = path.slice(-1) !== '/' ? '/' : '';
  const url ='https://www.instagram.com' + path + trailingSlash;

  console.log(url);
  return new Promise((resolve, reject) => {
    if (process.env.DATA == 'test') {
      console.log('here');
      const TEST_DATA = {
        description: 'Test description',
        image: '/images/favicon.png'
      }
      resolve(TEST_DATA);
      return
    }
    try {
      https.get(url, (res) => {
        res.on('data', (d) => {
          data += d
        });
        res.on('end', () => {
          let image = '';
          let description = '';
          try {
            image = data.match(new RegExp(/og:image.*content="(.*)"/))[1];
            description = data.match(new RegExp(/og:title.*content="(.*)\/>/))[1];
            console.log(description);
          } catch (e) {
            console.log('missing one of image/description');
          }
          resolve({ image: image, description: description.replace('"', '').replace('“', '').replace("”", '')});
        })
      }).on('error', (e) => {
        console.error(e);
        reject(e);
      })
   }
   catch(error) {
    console.log(error);
    // TODO workout what data to send back
    resolve({ image: "", description: ""});
    }
  })
}

app.get('/api/image-data/*', (req, response) => {
  const path = req.path.match(/image-data(\/.*)/)[1];
  console.log(path);
  getInstaData(path)
  .then((data) => {
    response.send({ data: data})
  })
})

app.get('/p/*', (req, response) => {
  console.log(req.path, "***");
  let data = ""
  const path =  req.path;
  getInstaData(path)
  .then((data) => {
    response.render('home', { data: data})
  })
})

app.get('/', function ( req, res, next ) {
  res.render('main.html')
})
// displays static main.html
app.get('*', function ( req, res, next ) {
  res.redirect('../');
});


app.use(function (req, res, next ) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
  app.use(function ( err, req, res ) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}



app.use(function ( err, req, res ) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.set('port', process.env.PORT || 8001);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
