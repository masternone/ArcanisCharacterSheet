var linkTo = require( '../util/linkTo' );

var login = {
	linkTo_login      : '/login',
	linkTo_loginText  : 'Login with Google',
	linkTo_logout     : '/logout',
	linkTo_logoutText : 'Logout'
}
var dataAreas = ['archetype','attribute', 'skill', 'skillGroup'];

/*
 * GET root
 */
exports.index = function( req, res ){
	console.log( 'req.user', req.user );
	var sidebar = [];
	for( n in dataAreas ){
		sidebar.push({
			link : linkTo.linkTo( dataAreas[n], 'index', 0 ),
			text : linkTo.linkToText( dataAreas[n], 'index', 0 )
		});
	}
	console.log( 'sidebar', sidebar );
	res.render( 'index', { user : req.user, login : login, title : 'Home', sidebar : sidebar });
};

/*
 * The object that defines the actions for each controller have been moved to a seperate file for each
 * controller.
 */
exports.archetype  = require( './archetype'  ).archetype(  linkTo, login );
exports.attribute  = require( './attribute'  ).attribute(  linkTo, login );
exports.skill      = require( './skill'      ).skill(      linkTo, login );
exports.skillGroup = require( './skillGroup' ).skillGroup( linkTo, login );
