
var login = {
	linkTo_login      : '/login',
	linkTo_loginText  : 'Login with Google',
	linkTo_logout     : '/logout',
	linkTo_logoutText : 'Logout'
}

/*
 * GET root
 */
exports.index = function( req, res ){
	console.log( 'req.user', req.user );
	res.render( 'index', { user : req.user, login : login, title : 'Home' });
};

/*
 * The object that defines the actions for each controller have been moved to a seperate file for each
 * controller.
 */
exports.attribute  = require( './attribute'  ).attribute(  login );
exports.skill      = require( './skill'      ).skill(      login );
exports.skillGroup = require( './skillGroup' ).skillGroup( login );
