exports.talent = function( linkTo, login, reqType, benType ){
	return {
		/*
		* Talent Index.
		*/
		index : function( req, res ){
			JSONRedis.toJSON( 'talentGroup', 'talentGroup', 0, function( error, talentGroup ){
				JSONRedis.toJSON( 'attribute', 'attribute', 0, function( error, attribute ){
					JSONRedis.toJSON( 'talent', 'talent', 0, function( error, talent ){
						if( !talent ){ talent = []; }
						res.render( 'talent/index', {
							user                : req.user,
							login               : login,
							edit                : false,
							linkTo_talentIndex   : linkTo.linkTo(     'talent', 'index', null ),
							linkTo_talentNew     : linkTo.linkTo(     'talent', 'new', null ),
							linkTo_talentNewText : linkTo.linkToText( 'talent', 'new', null ),
							talent               : talent,
							attribute           : attribute,
							talentGroup          : talentGroup,
							title               : 'Talent Index'
						});
					});
				});
			});
		},
		/*
		 * Talent Show.
		 */
		show : function( req, res, id ){
			JSONRedis.toJSON( 'talentGroup', 'talentGroup', 0, function( error, talentGroup ){
				if( !talentGroup ){ talentGroup = []; }
				JSONRedis.toJSON( 'attribute', 'attribute', 0, function( error, attribute ){
					if( !attribute ){ attribute = []; }
					JSONRedis.toJSON( 'talent', 'talent:' + id, 0, function( error, talent ){
						talent = [talent[id]];
						res.render( 'talent/show', { 
							user                    : req.user,
							login                   : login,
							edit                    : ( req.user && req.user.roles && req.user.roles.join().indexOf( 'admin' ) > -1 ? true : false ),
							linkTo_talentIndex       : linkTo.linkTo(     'talent', 'index', null ),
							linkTo_talentEdit        : linkTo.linkTo(     'talent', 'edit',    id ),
							linkTo_talentEditText    : linkTo.linkToText( 'talent', 'edit',    id ),
							linkTo_talentDestroy     : linkTo.linkTo(     'talent', 'destroy', id ),
							linkTo_talentDestroyText : linkTo.linkToText( 'talent', 'destroy', id ),
							talent                   : talent,
							attribute               : attribute,
							talentGroup              : talentGroup,
							title                   : 'Talent'
						});
					});
				});
			});
		},
		/*
		* Talent New.
		*/
		'new' : function( req, res ){
			JSONRedis.toJSON( 'talentGroup', 'talentGroup', 0, function( error, talentGroup ){
				if( !talentGroup ){ talentGroup = []; }
				JSONRedis.toJSON( 'attribute', 'attribute', 0, function( error, attribute ){
					if( !attribute ){ attribute = []; }
					res.render( 'talent/new', {
						user  : req.user,
						login : login,
						form  : {
							action : linkTo.linkTo( 'talent', 'create', null ),
							method : 'POST',
							name   : 'newTalent',
							submit : 'Create New Talent'
						},
						attribute  : attribute,
						talentGroup : talentGroup,
						talent      : {
							name       : '',
							attribute  : '',
							talentGroup : ''
						},
						title : 'New Talent'
					});
				});
			});
		},
		/*
		 * Talent Create.
		 */
		create : function( req, res, redis ){
			function errorFnc( error ){
				if( error ) console.log( error )
			}
			function save( id ){
				redis.sadd( 'talent', 'talent:' + id, errorFnc );
				redis.sadd( 'talent:' + id, 'talent:' + id + ':name', errorFnc );
				redis.sadd( 'talent:' + id, 'talent:' + id + ':attribute', errorFnc );
				redis.sadd( 'talent:' + id, 'talent:' + id + ':talentGroup', errorFnc );
				redis.set( 'talent:' + id + ':name',       req.body.name, errorFnc );
				redis.set( 'talent:' + id + ':attribute',  req.body.attribute, errorFnc );
				redis.set( 'talent:' + id + ':talentGroup', req.body.talentGroup, errorFnc );
				res.redirect( '/' + req.params.controller + '/' + id );
			}
			redis.exists( 'talentId', function( error, exists ){
				if( !exists ){
					var id = 0;
					redis.set( 'talentId', id );
					save( id );
				} else {
					redis.incr( 'talentId', function( error, id ){
						save( id );
					});
				}
			});
		},
		/*
		 * Talent Group Edit.
		 */
 		edit : function( req, res, id ){
			JSONRedis.toJSON( 'talentGroup', 'talentGroup', 0, function( error, talentGroup ){
				if( !talentGroup ){ talentGroup = []; }
				JSONRedis.toJSON( 'attribute', 'attribute', 0, function( error, attribute ){
					if( !attribute ){ attribute = []; }
					JSONRedis.toJSON( 'talent', 'talent:' + id, 0, function( error, talent ){
						talent = talent[id]
						res.render( 'talent/new', {
							user              : req.user,
							login             : login,
							edit              : ( req.user && req.user.roles && req.user.roles.join().indexOf( 'admin' ) > -1 ? true : false ),
							linkTo_talentIndex : linkTo.linkTo(     'talent', 'index', null ),
							form              : {
								action : linkTo.linkTo( 'talent', 'update', id ),
								method : 'put',
								name   : 'editTalent',
								submit : 'Update Talent'
							},
							attribute  : attribute,
							talentGroup : talentGroup,
							talent      : talent,
							title      : 'Edit Talent'
						});
					});
				});
			});
		},
		/*
		 * Talent Group Update.
		 */
		update : function( req, res, redis, id ){
			function errorFnc( error ){
				if( error ) console.log( error );
			}
			redis.set( 'talent:' + id + ':name',       req.body.name, errorFnc );
			redis.set( 'talent:' + id + ':attribute',  req.body.attribute, errorFnc );
			redis.set( 'talent:' + id + ':talentGroup', req.body.talentGroup, errorFnc );
			res.redirect( '/' + req.params.controller + '/' + id );
		}
		/*
		 * Talent Destroy.
		 */
	}
}
