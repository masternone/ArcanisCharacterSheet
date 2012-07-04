exports.skill = function( linkTo, login ){
	return {
		/*
		* Skill Index.
		*/
		index : function( req, res ){
			JSONRedis.toJSON( 'skillGroup', 'skillGroup', 0, function( error, skillGroup ){
				JSONRedis.toJSON( 'attribute', 'attribute', 0, function( error, attribute ){
					JSONRedis.toJSON( 'skill', 'skill', 0, function( error, skill ){
						if( !skill ){ skill = []; }
						res.render( 'skill/index', {
							user                : req.user,
							login               : login,
							edit                : false,
							linkTo_skillIndex   : linkTo.linkTo(     'skill', 'index', null ),
							linkTo_skillNew     : linkTo.linkTo(     'skill', 'new', null ),
							linkTo_skillNewText : linkTo.linkToText( 'skill', 'new', null ),
							skill               : skill,
							attribute           : attribute,
							skillGroup          : skillGroup,
							title               : 'Skill Index'
						});
					});
				});
			});
		},
		/*
		 * Skill Group Show.
		 */
		show : function( req, res, id ){
			JSONRedis.toJSON( 'skillGroup', 'skillGroup', 0, function( error, skillGroup ){
				if( !skillGroup ){ skillGroup = []; }
				JSONRedis.toJSON( 'attribute', 'attribute', 0, function( error, attribute ){
					if( !attribute ){ attribute = []; }
					JSONRedis.toJSON( 'skill', 'skill:' + id, 0, function( error, skill ){
						skill = [skill[id]];
						res.render( 'skill/show', { 
							user                    : req.user,
							login                   : login,
							edit                    : ( req.user && req.user.roles && req.user.roles.join().indexOf( 'admin' ) > -1 ? true : false ),
							linkTo_skillIndex       : linkTo.linkTo(     'skill', 'index', null ),
							linkTo_skillEdit        : linkTo.linkTo(     'skill', 'edit',    id ),
							linkTo_skillEditText    : linkTo.linkToText( 'skill', 'edit',    id ),
							linkTo_skillDestroy     : linkTo.linkTo(     'skill', 'destroy', id ),
							linkTo_skillDestroyText : linkTo.linkToText( 'skill', 'destroy', id ),
							skill                   : skill,
							attribute               : attribute,
							skillGroup              : skillGroup,
							title                   : 'Skill'
						});
					});
				});
			});
		},
		/*
		* Skill New.
		*/
		'new' : function( req, res ){
			JSONRedis.toJSON( 'skillGroup', 'skillGroup', 0, function( error, skillGroup ){
				if( !skillGroup ){ skillGroup = []; }
				JSONRedis.toJSON( 'attribute', 'attribute', 0, function( error, attribute ){
					if( !attribute ){ attribute = []; }
					res.render( 'skill/new', {
						user  : req.user,
						login : login,
						form  : {
							action : linkTo.linkTo( 'skill', 'create', null ),
							method : 'POST',
							name   : 'newSkill',
							submit : 'Create New Skill'
						},
						attribute  : attribute,
						skillGroup : skillGroup,
						skill      : {
							name       : '',
							attribute  : '',
							skillGroup : ''
						},
						title : 'New Skill'
					});
				});
			});
		},
		/*
		 * Skill Create.
		 */
		create : function( req, res, redis ){
			function errorFnc( error ){
				if( error ) console.log( error )
			}
			function save( id ){
				redis.sadd( 'skill', 'skill:' + id, errorFnc );
				redis.sadd( 'skill:' + id, 'skill:' + id + ':name', errorFnc );
				redis.sadd( 'skill:' + id, 'skill:' + id + ':attribute', errorFnc );
				redis.sadd( 'skill:' + id, 'skill:' + id + ':skillGroup', errorFnc );
				redis.set( 'skill:' + id + ':name',       req.body.name, errorFnc );
				redis.set( 'skill:' + id + ':attribute',  req.body.attribute, errorFnc );
				redis.set( 'skill:' + id + ':skillGroup', req.body.skillGroup, errorFnc );
				res.redirect( '/' + req.params.controller + '/' + id );
			}
			redis.exists( 'skillId', function( error, exists ){
				if( !exists ){
					var id = 0;
					redis.set( 'skillId', id );
					save( id );
				} else {
					redis.incr( 'skillId', function( error, id ){
						save( id );
					});
				}
			});
		},
		/*
		 * Skill Group Edit.
		 */
 		edit : function( req, res, id ){
			JSONRedis.toJSON( 'skillGroup', 'skillGroup', 0, function( error, skillGroup ){
				if( !skillGroup ){ skillGroup = []; }
				JSONRedis.toJSON( 'attribute', 'attribute', 0, function( error, attribute ){
					if( !attribute ){ attribute = []; }
					JSONRedis.toJSON( 'skill', 'skill:' + id, 0, function( error, skill ){
						skill = skill[id]
						res.render( 'skill/new', {
							user              : req.user,
							login             : login,
							edit              : ( req.user && req.user.roles && req.user.roles.join().indexOf( 'admin' ) > -1 ? true : false ),
							linkTo_skillIndex : linkTo.linkTo(     'skill', 'index', null ),
							form              : {
								action : linkTo.linkTo( 'skill', 'update', id ),
								method : 'put',
								name   : 'editSkill',
								submit : 'Update Skill'
							},
							attribute  : attribute,
							skillGroup : skillGroup,
							skill      : skill,
							title      : 'Edit Skill'
						});
					});
				});
			});
		},
		/*
		 * Skill Group Update.
		 */
		update : function( req, res, redis, id ){
			function errorFnc( error ){
				if( error ) console.log( error );
			}
			redis.set( 'skill:' + id + ':name',       req.body.name, errorFnc );
			redis.set( 'skill:' + id + ':attribute',  req.body.attribute, errorFnc );
			redis.set( 'skill:' + id + ':skillGroup', req.body.skillGroup, errorFnc );
			res.redirect( '/' + req.params.controller + '/' + id );
		}
		/*
		 * Skill Group Destroy.
		 */
	}
}
