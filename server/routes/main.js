module.exports = function ( app ) {

  app.get('/html', function( req, res ) {
    res.render('main.html');
  });

};
