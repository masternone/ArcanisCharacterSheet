
/**
 * Module dependencies.
 */

var express        = require( 'express' ),
	passport       = require( 'passport' ),
	GoogleStrategy = require( 'passport-google-oauth' ).OAuth2Strategy
	redis          = require( 'redis-url' ).connect(),
	routes         = require( './routes/routes' )
	models         = require( './models/models' ),
	JSONRedis      = require( './util/JSONRedis' ).JSONRedis( redis );

// console.log( process.env );

passport.serializeUser( function( user, done ){
	// console.log( 'user', user );
	// console.log( 'done', done );
	done( null, user );
});

passport.deserializeUser( function( obj, done ){
	// console.log( 'obj', obj );
	// console.log( 'done', done );
	done( null, obj );
});

passport.use(
	new GoogleStrategy({
		clientID     : process.env.GOOGLE_OAuth_Client_ID,
		clientSecret : process.env.GOOGLE_OAuth_Client_Secret,
		callbackURL  : "http://localhost:8888/auth/google/callback"
	},
	function( accessToken, refreshToken, profile, done ){
		process.nextTick( function(){
			JSONRedis.toJSON( 'user', 'user:' + profile.id, 0, function( error, fromRedis ){
				if( error ){ console.log( error ); return error; }
				//console.log( 'fromRedis', fromRedis );
				var user = {};
				if( fromRedis ){
					return done( null, fromRedis[profile.id] );
				} else {
					user[profile.id] = { 
						displayName : profile.displayName,
						email       : profile.emails[0].value,
						roles       : ['user']
					}
					switch( profile.emails[0].value ){
						case 'themasternone@gmail.com':
							user[profile.id].roles.push( 'admin' );
					}
					JSONRedis.toRedis( 'user', user, function(){
						return done( null, user[profile.id] );
					});
				}
			});
		});
	}
));

redis.on( 'error', function( error ) {
	console.log( 'Error', error.toString() );
	if( error.toString().indexOf( 'ECONNREFUSED' ) > -1 ){
		redis.end();
	}
});

redis.on( 'idle', function() {
	console.log( 'inside idle' );
	console.log( 'arguments', arguments );
	console.log( 'ret', ret );
});

var app = module.exports = express.createServer();

// Configuration
app.configure( function(){
	app.set( 'views', __dirname + '/views' );
	app.set( 'view engine', 'ejs' );
	app.use( express.logger());
	app.use( express.cookieParser());
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
/* start user block maybe needs to be moved to seperate file */
app.get( '/account', isAuth, function( req, res ){
	res.render( 'account', { user: req.user });
});
app.get(
	'/login',
	passport.authenticate(
		'google', {
			scope: [
				'https://www.googleapis.com/auth/userinfo.profile',
				'https://www.googleapis.com/auth/userinfo.email'
			]
		}
	),
	function(req, res){
		// The request will be redirected to Google for authentication, so this
		// function will not be called.
	}
);
app.get(
	'/auth/google/callback',
	passport.authenticate( 'google', { failureRedirect: 'back' }),
	function( req, res ){
		res.redirect( 'back' );
	}
);
app.get( '/logout', function( req, res ){
	req.logout();
	res.redirect( '/' );
});
/* end user block */

app.get( '/', routes.index );
app.get( '/:controller', isAdminReq, function( req, res, next ){
	//console.log( 'index', req.params );
	routes[req.params.controller].index( req, res );
});
app.get( '/:controller/:id', isAdminReq, function( req, res, next ){ // show
	//console.log( 'req.params', req.params );
	if( isNaN( req.params.id ) ) return next();
	routes[req.params.controller].show( req, res, req.params.id );
});
app.get( '/:controller/new', isAdminReq, function( req, res, next ){ // new
	routes[req.params.controller]['new']( req, res );
});
app.post( '/:controller', isAdminReq,  function( req, res, next ){ // create
	routes[req.params.controller]['create']( req, res, redis );
});
app.get( '/:controller/edit/:id', isAdminReq, function( req, res, next ){ // edit
	routes[req.params.controller]['edit']( req, res, req.params.id );
});
app.put( '/:controller/:id', isAdminReq,  function( req, res, next ){ // update
	routes[req.params.controller]['update']( req, res, redis, req.params.id );
});

var port = process.env.PORT || 8888,
	host = process.env.HOST || 'localhost';

app.listen( port, function(){
  console.log( "Express server listening on port %d in %s mode", app.address().port, app.settings.env );
});

//helper methods should be moved externaily
// Simple route middleware to ensure user is authenticated.
// Use this route middleware on any resource that needs to be protected. If
// the request is authenticated (typically via a persistent login session),
// the request will proceed. Otherwise, the user will be redirected to the
// login page.
function isAuth( req, res, next ) {
	console.log( 'in is auth' );
	if ( req.isAuthenticated()) { return next(); }
	res.redirect( '/login' );
}
function isAdminReq( req, res, next ){
	//console.log( 'inside isAdminReq' );
	switch( req.params.controller ){
		case 'attribute':
		case 'skill':
		case 'skillGroup':
			if( req.user && req.user.roles && req.user.roles.join().indexOf( 'admin' ) > -1 ){
				//console.log( 'is admin' );
				next();
			} else {
				res.redirect( '/', 403 ); // TODO change this to a more robust 403 page cont display
			}
			break;
		default:
			return next();
	}
}


function load(req, res, next) {
	var controller = req.params.controller,
		id         = req.params.id;
	JSONRedis.toJSON( controller, controller + ':' + id, 0, function( error, fromRedis ){
		if( error ) return next( new Error( 'Failed to load ' + controller + ':' + id ));
		//console.log( fromRedis );
		
	});
}