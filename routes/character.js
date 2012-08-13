exports.character = function( linkTo, login ){
	return {
		/*
		 * Character Index.
		 */
		index : function( req, res ){
			JSONRedis.toJSON( 'character', 'character', 0, function( error, character ){
					character = character ? character : [];
					res.render( 'character/index', { 
					user                    : req.user,
					login                   : login,
					edit                    : false,
					title                   : 'character index',
					character               : character,
					linkTo_characterNew     : linkTo.linkTo( 'character', 'new', null ),
					linkTo_characterNewText : linkTo.linkToText( 'character', 'new', null )
				});
			});
		},
		/*
		* Character Show.
		*/
		show : function( req, res, id ){
			JSONRedis.toJSON( 'character', 'character:' + id, 0, function( error, character ){
				character = [character[id]]
				res.render( 'character/show', {
					user                     : req.user,
					login                    : login,
					edit                     : ( req.user && req.user.roles && req.user.roles.join().indexOf( 'admin' ) > -1 ? true : false ),
					linkTo_characterEdit     : linkTo.linkTo( 'character', 'edit', id ),
					linkTo_characterEditText : linkTo.linkToText( 'character', 'edit', id ),
					character                : character,
					title                    : 'Character'
				 });
			});
		 },
		/*
		 * Character New.
		 */
		'new' : function( req, res, id ){
			JSONRedis.toJSON( 'attribute', 'attribute', 0, function( error, attribute ){
				if( !attribute ){ attribute = []; }
				console.log( 'attribute', attribute );
				res.render( 'character/new', {
					user      : req.user,
					login     : login,
					form      : {
						action : linkTo.linkTo( 'character', 'create', null ),
						method : 'POST',
						name   : 'newCharacter',
						submit : linkTo.linkToText( 'character', 'create', null )
					},
					character : {
						name      : '',
						attribute : attribute
					},
					title : 'New Character'
				});
			});
		},
		/*
		 * Character Create.
		 */
		create : function( req, res, redis ){
			function errorFnc( error ){
				if( error ) console.log( error )
			}
			function save( id ){
				redis.sadd( 'character', 'character:' + id, errorFnc );
				redis.sadd( 'character:' + id, 'character:' + id + ':abbr', errorFnc );
				redis.sadd( 'character:' + id, 'character:' + id + ':name', errorFnc );
				redis.set( 'character:' + id + ':abbr', req.body.abbr, errorFnc );
				redis.set( 'character:' + id + ':name', req.body.name, errorFnc );
				res.redirect( '/' + req.params.controller + '/' + id );
			}
			redis.exists( 'characterId', function( error, exists ){
				if( !exists ){
					var id = 0;
					redis.set( 'characterId', id );
					save( id );
				} else {
					redis.incr( 'characterId', function( error, id ){
						save( id );
					});
				}
			});
		},
		/*
		 * Character Edit.
		 */
 		edit : function( req, res, id ){
			JSONRedis.toJSON( 'character', 'character:' + id, 0, function( error, character ){
				character = character[id];
				res.render( 'character/new', {
					user      : req.user,
					login     : login,
					form      : {
						action : linkTo.linkTo( 'character', 'update', id ),
						method : 'PUT',
						name   : 'editCharacter',
						submit : linkTo.linkToText( 'character', 'update', id )
					},
					character : character,
					title : 'Edit Character'
				});
			});
		},
		/*
		 * Character Update.
		 */
		update : function( req, res, redis ){
			function errorFnc( error ){
				if( error ) console.log( error );
			}
			redis.set( 'character:' + id + ':abbr', req.body.abbr, errorFnc );
			redis.set( 'character:' + id + ':name', req.body.name, errorFnc );
			res.redirect( '/' + req.params.controller + '/' + id );
		}
		/*
		 * Character Destroy.
		 */
	}
}