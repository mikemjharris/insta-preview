const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.join(__dirname, '../public')));

// set the view engine to ejs
app.set('view engine', 'ejs')

const https = require('https');

const TEST_DATA = {
  description: 'Test description',
  image: '/images/favicon.png'
}

app.get('/api/image-data/*', (req, response) => {
  const path = req.path.match(/image-data\/(.*)/)[1];
  console.log(path);
  let data = ""
  const url ='https://www.instagram.com/' + path + '/';
  console.log(url);
  response.send( { data: TEST_DATA});
  return
  try {
    https.get(url, (res) => {
          res.on('data', (d) => {
              data += d
          });
          res.on('end', () => {
              const image = data.match(new RegExp(/og:image.*content="(.*)"/))[1];
              const description = data.match(new RegExp(/og:title.*content="(.*)"/))[1];
              response.send( { data: { image: image, description: description}})
          })

    }).on('error', (e) => {
      console.error(e);
    })
   }
   catch(error) {
    console.log(error);
    response.send( { data: { image: "", description: ""}});
  }

})

app.get('/p/*', (req, response) => {
  console.log(req.path, "***");
  let data = ""
  const url ='https://www.instagram.com' + req.path + '/';
  try {
    https.get(url, (res) => {
          res.on('data', (d) => {
              data += d
          });
          res.on('end', () => {
            try {
              const image = data.match(new RegExp(/og:image.*content="(.*)"/))[1];
              const description = data.match(new RegExp(/og:title.*content="(.*)"/))[1];
              response.render('home', { data: { image: image, description: description}})
            }
            catch(error) {
              console.log(error);
              response.render('home', { data: { image: "", description: ""}});
            }
          })

    }).on('error', (e) => {
      console.error(e);
    })
    } catch(eror) {
      console.log(error);
      response.render('home', { data: { image: "", description: ""}});
    }

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
