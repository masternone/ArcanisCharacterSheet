var linkTo = require( '../util/linkTo' );

exports.skillGroup = function( linkTo, login ){
	return {
		/*
		 * Skill Group Index.
		 */
		index : function( req, res ){
			JSONRedis.toJSON( 'skillGroup', 'skillGroup', 0, function( error, skillGroup ){
				res.render( 'skillGroup/index', { 
					user                     : req.user,
					login                    : login,
					edit                     : false,
					linkTo_skillGroupIndex   : linkTo.linkTo(     'skillGroup', 'index', null ),
					linkTo_skillGroupNew     : linkTo.linkTo(     'skillGroup', 'new', null ),
					linkTo_skillGroupNewText : linkTo.linkToText( 'skillGroup', 'new', null ),
					skillGroup               : skillGroup,
					title                    : 'Skill Group Index'
				});
			});
		},
		/*
		 * Skill Group New.
		 */
		show : function( req, res, id ){
			JSONRedis.toJSON( 'skillGroup', 'skillGroup:' + id, 0, function( error, skillGroup ){
				skillGroup = [skillGroup[id]];
				res.render( 'skillGroup/show', { 
					user                         : req.user,
					login                        : login,
					edit                         : ( req.user && req.user.roles && req.user.roles.join().indexOf( 'admin' ) > -1 ? true : false ),
					linkTo_skillGroupIndex       : linkTo.linkTo(     'skillGroup', 'index', null ),
					linkTo_skillGroupEdit        : linkTo.linkTo(     'skillGroup', 'edit',    id ),
					linkTo_skillGroupEditText    : linkTo.linkToText( 'skillGroup', 'edit',    id ),
					linkTo_skillGroupDestroy     : linkTo.linkTo(     'skillGroup', 'destroy', id ),
					linkTo_skillGroupDestroyText : linkTo.linkToText( 'skillGroup', 'destroy', id ),
					skillGroup                   : skillGroup,
					title                        : 'Skill Group'
				});
			});
		},
		/*
		 * Skill Group New.
		 */
		'new' : function( req, res ){
			res.render( 'skillGroup/new', {
				user  : req.user,
				login : login,
				linkTo_skillGroupIndex   : linkTo.linkTo(     'skillGroup', 'index', null ),
				form  : {
					action : '/skillGroup',
					method : 'POST',
					name   : 'newSkillGroup',
					submit : 'Create New Skill Group'
				},
				skillGroup : {
					name : ''
				},
				title : 'New Skill Group'
			});
		},
		/*
		 * Skill Group Create.
		 */
		create : function( req, res, redis ){
			function errorFnc( error ){
				if( error ) console.log( error )
			}
			function save( id ){
				redis.sadd( 'skillGroup', 'skillGroup:' + id, errorFnc );
				redis.sadd( 'skillGroup:' + id, 'skillGroup:' + id + ':name', errorFnc );
				redis.set( 'skillGroup:' + id + ':name', req.body.name, errorFnc );
				res.redirect( '/' + req.params.controller + '/' + id );
			}
			redis.exists( 'skillGroupId', function( error, exists ){
				if( !exists ){
					var id = 0;
					redis.set( 'skillGroupId', id );
					save( id );
				} else {
					redis.incr( 'skillGroupId', function( error, id ){
						save( id );
					});
				}
			});
		},
		/*
		 * Skill Group Edit.
		 */
 		edit : function( req, res, id ){
			JSONRedis.toJSON( 'skillGroup', 'skillGroup:' + id, 0, function( error, skillGroup ){
				skillGroup = skillGroup[id]
				res.render( 'skillGroup/new', {
					user      : req.user,
					login     : login,
					linkTo_skillGroupIndex   : linkTo.linkTo(     'skillGroup', 'index', null ),
					form      : {
						action : linkTo.linkTo( 'skillGroup', 'update', id ),
						method : 'put',
						name   : 'editSkillGroup',
						submit : 'Update Skill Group',
					},
					skillGroup : skillGroup,
					title : 'Edit Skill Group'
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
			redis.set( 'skillGroup:' + id + ':name', req.body.name, errorFnc );
			res.redirect( '/' + req.params.controller + '/' + id );
		}
		/*
		 * Skill Group Destroy.
		 */
	}
}