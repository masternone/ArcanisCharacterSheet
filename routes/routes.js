var linkTo = require( '../util/linkTo' );

var login = {
		linkTo_login      : '/login',
		linkTo_loginText  : 'Login with Google',
		linkTo_logout     : '/logout',
		linkTo_logoutText : 'Logout'
	},
	type = ['Specfic', 'Group', 'Choice'];
	// access:
	//	admin     -- This function is only for admins
	//	author    -- This function is finished and ready for authors
	//	developer -- This function is still in development and may not be ready for authors
	dataAreas = [
		{ name : 'user',       access : 'admin' },
		{ name : 'archetype',  access : 'developer' },
		{ name : 'attribute',  access : 'author' },
		{ name : 'attrVals',   access : 'developer' },
		{ name : 'skill',      access : 'author' },
		{ name : 'skillGroup', access : 'author' }
	];

/*
 * GET root
 */
exports.index = function( req, res ){
	//console.log( 'req.user', req.user );
	var sidebar = [];
	for( n in dataAreas ){
		if( req.user && req.user.roles.join().indexOf( dataAreas[n].access ) > -1 ){
			sidebar.push({
				link   : linkTo.linkTo( dataAreas[n].name, 'index', 0 ),
				text   : linkTo.linkToText( dataAreas[n].name, 'index', 0 )
			});
		}
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
exports.archetype  = require( './archetype'  ).archetype(  linkTo, login, type );
exports.attribute  = require( './attribute'  ).attribute(  linkTo, login );
exports.attrVals   = require( './attrVals'   ).attrVals(   linkTo, login );
exports.skill      = require( './skill'      ).skill(      linkTo, login );
exports.skillGroup = require( './skillGroup' ).skillGroup( linkTo, login );
