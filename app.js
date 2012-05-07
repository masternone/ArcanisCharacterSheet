
/**
 * Module dependencies.
 */

var express        = require( 'express' ),
	passport       = require( 'passport' ),
	GoogleStrategy = require( 'passport-google-oauth' ).OAuth2Strategy
	routes         = require( './routes/routes' );

console.log( process.env );

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing. However, since this example does not
// have a database of user records, the complete Google profile is
// serialized and deserialized.
passport.serializeUser( function( user, done ){
	console.log( 'user', user );
	console.log( 'done', done );
	done( null, user );
});

passport.deserializeUser( function( obj, done ){
	console.log( 'obj', obj );
	console.log( 'done', done );
	done( null, obj );
});

// Use the GoogleStrategy within Passport.
// Strategies in Passport require a `verify` function, which accept
// credentials (in this case, an accessToken, refreshToken, and Google
// profile), and invoke a callback with a user object.
passport.use(
	new GoogleStrategy({
		clientID     : process.env.GOOGLE_OAuth_Client_ID,
		clientSecret : process.env.GOOGLE_OAuth_Client_Secret,
		callbackURL  : "http://localhost:8888/auth/google/callback"
	},
	function( accessToken, refreshToken, profile, done ){
		// asynchronous verification, for effect...
		process.nextTick( function(){
			// To keep the example simple, the user's Google profile is returned to
			// represent the logged-in user. In a typical application, you would want
			// to associate the Google account with a user record in your database,
			// and return that user instead.
			return done( null, profile );
		});
	}
));

var app = module.exports = express.createServer();

// Configuration
app.configure( function(){
	app.set( 'views', __dirname + '/views' );
	app.set( 'view engine', 'ejs' );
	app.use( express.bodyParser());
	app.use( express.methodOverride());
	app.use( express.session({ secret: 'keyboard cat' })); // this should be moved in to a env var

	// Initialize Passport! Also use passport.session() middleware, to support
	// persistent login sessions (recommended).
	app.use( passport.initialize());
	app.use( passport.session());

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

var port = process.env.PORT || 8888;

app.listen( port, function(){
  console.log( "Express server listening on port %d in %s mode", app.address().port, app.settings.env );
});
