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

app.get('/p/*', (req, response) => {
  console.log(req.path);
  let data = ""
  let rex = new RegExp(/.*display_resources.*/)
  const url ='https://www.instagram.com' + req.path + '/';
  console.log(url);
  https.get(url, (res) => {
        res.on('data', (d) => {
            data += d
        });
        res.on('end', () => {
          const script = data.match(rex)[0]
          const img = JSON.parse(script.match(/.*?({.*);/)[1]).entry_data.PostPage[0].graphql.shortcode_media.display_url
          response.render('home', { data: { title: img}})
        })

  }).on('error', (e) => {
    console.error(e);
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
