
/**
 * Module dependencies.
 */

var express = require( 'express' ),
	routes  = require( './routes/routes' );

var app = module.exports = express.createServer();

// Configuration

app.configure( function(){
	app.set( 'views', __dirname + '/views' );
	app.set( 'view engine', 'ejs' );
	app.use( express.bodyParser());
	app.use( express.methodOverride());
	app.use( express.static( __dirname + '/public' ));
	app.use( app.router );
});

app.configure( 'development', function(){
  app.use( express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure( 'production', function(){
  app.use( express.errorHandler());
});

// Routes

app.get( '/', routes.index );
app.get( '/:controller', function( req, res, next ){
	console.log( 'index', req.params );
	routes[req.params.controller].index( req, res );
});
app.get( '/:controller/:id', function( req, res, next ){ // show
	console.log( 'req.params', req.params );
	if( isNaN( req.params.id ) ) return next();
	routes[req.params.controller].show( req, res, req.params.id );
});
app.get( '/:controller/new', function( req, res, next ){ // new
	routes[req.params.controller]['new']( req, res );
});
app.post( '/:controller', function( req, res, next ){ // create
	// res.write( req.params.controller );
	// res.write(JSON.stringify( req.body ));
	// res.end();
	res.redirect( '/' + req.params.controller + '/0' );
});

app.listen( 3000, function(){
  console.log( "Express server listening on port %d in %s mode", app.address().port, app.settings.env );
});
