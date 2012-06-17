exports.archetype = function( linkTo, login ){
	return {
		/*
		 * Archetype Index.
		 */
		index : function( req, res ){
			JSONRedis.toJSON( 'archetype', 'archetype', 0, function( error, archetype ){
					res.render( 'archetype/index', { 
					user                    : req.user,
					login                   : login,
					title                   : 'archetype index',
					archetype               : archetype,
					linkTo_archetypeNew     : linkTo.linkTo( 'archetype', 'new', null ),
					linkTo_archetypeNewText : linkTo.linkToText( 'archetype', 'new', null )
				});
			});
		},
		/*
		 * Archetype Show.
		 */
		show : function( req, res, id ){
			JSONRedis.toJSON( 'archetype', 'archetype:' + id, 0, function( error, archetype ){
				archetype = [archetype[id]]
				res.render( 'archetype/show', {
					user                     : req.user,
					login                    : login,
					edit                     : ( req.user && req.user.roles && req.user.roles.join().indexOf( 'admin' ) > -1 ? true : false ),
					linkTo_archetypeEdit     : linkTo.linkTo( 'archetype', 'edit', id ),
					linkTo_archetypeEditText : linkTo.linkToText( 'archetype', 'edit', id ),
					archetype                : archetype,
					title                    : 'Archetype'
				 });
			});
		 },
		/*
		 * Archetype New.
		 */
		'new' : function( req, res, id ){
			JSONRedis.toJSON( 'skill', 'skill', 0, function( error, skill ){
				if( !skill ){ skill = []; }
				JSONRedis.toJSON( 'skillGroup', 'skillGroup', 0, function( error, attribute ){
					if( !attribute ){ attribute = []; }
					res.render( 'archetype/new', {
						user      : req.user,
						login     : login,
						form      : {
							action : linkTo.linkTo( 'archetype', 'create', null ),
							method : 'POST',
							name   : 'newArchetype',
							submit : linkTo.linkToText( 'archetype', 'create', null )
						},
						archetype : {
							name    : '',
							skill   : '',
							tallent : ''
						},
						skill      : skill,
						skillGroup : skillGroup,
						title      : 'New Archetype'
					});
				});
			});
		},
		/*
		 * Archetype Create.
		 */
		create : function( req, res, redis ){
			console.log( 'inside archetype create function', req.body );
			/*
			function errorFnc( error ){
				if( error ) console.log( error )
			}
			function save( id ){
				redis.sadd( 'archetype', 'archetype:' + id, errorFnc );
				redis.sadd( 'archetype:' + id, 'archetype:' + id + ':abbr', errorFnc );
				redis.sadd( 'archetype:' + id, 'archetype:' + id + ':name', errorFnc );
				redis.set( 'archetype:' + id + ':abbr', req.body.abbr, errorFnc );
				redis.set( 'archetype:' + id + ':name', req.body.name, errorFnc );
				res.redirect( '/' + req.params.controller + '/' + id );
			}
			redis.exists( 'archetypeId', function( error, exists ){
				if( !exists ){
					var id = 0;
					redis.set( 'archetypeId', id );
					save( id );
				} else {
					redis.incr( 'archetypeId', function( error, id ){
						save( id );
					});
				}
			});
			*/
		},
		/*
		 * Archetype Edit.
		 */
 		edit : function( req, res, id ){
			JSONRedis.toJSON( 'archetype', 'archetype:' + id, 0, function( error, archetype ){
				archetype = [archetype[id]]
				res.render( 'archetype/new', {
					user      : req.user,
					login     : login,
					form      : {
						action : linkTo.linkTo( 'archetype', 'update', null ),
						method : 'PUT',
						name   : 'editArchetype',
						submit : linkTo.linkToText( 'archetype', 'update', null )
					},
					archetype : archetype,
					title : 'Edit Archetype'
				});
			});
		},
		/*
		 * Archetype Update.
		 */
		update : function( req, res, redis ){
			function errorFnc( error ){
				if( error ) console.log( error );
			}
			redis.set( 'archetype:' + id + ':abbr', req.body.abbr, errorFnc );
			redis.set( 'archetype:' + id + ':name', req.body.name, errorFnc );
			res.redirect( '/' + req.params.controller + '/' + id );
		}
		/*
		 * Archetype Destroy.
		 */
	}
}
