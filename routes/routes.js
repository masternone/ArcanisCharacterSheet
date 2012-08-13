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
	//console.log( 'req.user', req.user );
	var sidebar = [];
	for( n in dataAreas ){
		sidebar.push({
			link : linkTo.linkTo( dataAreas[n], 'index', 0 ),
			text : linkTo.linkToText( dataAreas[n], 'index', 0 )
		});
	}
	//console.log( 'sidebar', sidebar );
	JSONRedis.toJSON( 'character', 'character', 0, function( error, character ){
		character = character ? character : [];
		//TODO: limit characters to currently loged in user
		res.render( './home/index', {
			user                    : req.user,
			login                   : login,
			title                   : 'Home',
			sidebar                 : sidebar,
			character               : character,
			linkTo_characterNew     : linkTo.linkTo( 'character', 'new', null ),
			linkTo_characterNewText : linkTo.linkToText( 'character', 'new', null )
		});
	});
};

/*
 * The object that defines the actions for each controller have been moved to a seperate file for each
 * controller.
 */
exports.character  = require( './character'  ).character(  linkTo, login );
exports.attribute  = require( './attribute'  ).attribute(  linkTo, login );
exports.skill      = require( './skill'      ).skill(      linkTo, login );
exports.skillGroup = require( './skillGroup' ).skillGroup( linkTo, login );
