exports.talentGroup = function( linkTo, login ){
	return {
		/*
		 * Talent Group Index.
		 */
		index : function( req, res ){
			JSONRedis.toJSON( 'talentGroup', 'talentGroup', 0, function( error, talentGroup ){
				talentGroup = talentGroup ? talentGroup : [];
				res.render( 'talentGroup/index', { 
					user                      : req.user,
					login                     : login,
					edit                      : false,
					linkTo_talentGroupIndex   : linkTo.linkTo(     'talentGroup', 'index', null ),
					linkTo_talentGroupNew     : linkTo.linkTo(     'talentGroup', 'new', null ),
					linkTo_talentGroupNewText : linkTo.linkToText( 'talentGroup', 'new', null ),
					talentGroup               : talentGroup,
					title                     : 'Talent Group Index'
				});
			});
		},
		/*
		 * Talent Group Show.
		 */
		show : function( req, res, id ){
			JSONRedis.toJSON( 'talentGroup', 'talentGroup:' + id, 0, function( error, talentGroup ){
				talentGroup = [talentGroup[id]];
				res.render( 'talentGroup/show', { 
					user                          : req.user,
					login                         : login,
					edit                          : ( req.user && req.user.roles && req.user.roles.join().indexOf( 'admin' ) > -1 ? true : false ),
					linkTo_talentGroupIndex       : linkTo.linkTo(     'talentGroup', 'index', null ),
					linkTo_talentGroupEdit        : linkTo.linkTo(     'talentGroup', 'edit',    id ),
					linkTo_talentGroupEditText    : linkTo.linkToText( 'talentGroup', 'edit',    id ),
					linkTo_talentGroupDestroy     : linkTo.linkTo(     'talentGroup', 'destroy', id ),
					linkTo_talentGroupDestroyText : linkTo.linkToText( 'talentGroup', 'destroy', id ),
					talentGroup                   : talentGroup,
					title                         : 'Talent Group'
				});
			});
		},
		/*
		 * Talent Group New.
		 */
		'new' : function( req, res ){
			res.render( 'talentGroup/new', {
				user  : req.user,
				login : login,
				linkTo_talentGroupIndex   : linkTo.linkTo(     'talentGroup', 'index', null ),
				form  : {
					action : '/talentGroup',
					method : 'POST',
					name   : 'newTalentGroup',
					submit : 'Create New Talent Group'
				},
				talentGroup : {
					name : ''
				},
				title : 'New Talent Group'
			});
		},
		/*
		 * Talent Group Create.
		 */
		create : function( req, res, redis ){
			function errorFnc( error ){
				if( error ) console.log( error )
			}
			function save( id ){
				redis.sadd( 'talentGroup', 'talentGroup:' + id, errorFnc );
				redis.sadd( 'talentGroup:' + id, 'talentGroup:' + id + ':name', errorFnc );
				redis.set( 'talentGroup:' + id + ':name', req.body.name, errorFnc );
				res.redirect( '/' + req.params.controller + '/' + id );
			}
			redis.exists( 'talentGroupId', function( error, exists ){
				if( !exists ){
					var id = 0;
					redis.set( 'talentGroupId', id );
					save( id );
				} else {
					redis.incr( 'talentGroupId', function( error, id ){
						save( id );
					});
				}
			});
		},
		/*
		 * Talent Group Edit.
		 */
 		edit : function( req, res, id ){
			JSONRedis.toJSON( 'talentGroup', 'talentGroup:' + id, 0, function( error, talentGroup ){
				talentGroup = talentGroup[id]
				res.render( 'talentGroup/new', {
					user      : req.user,
					login     : login,
					linkTo_talentGroupIndex   : linkTo.linkTo(     'talentGroup', 'index', null ),
					form      : {
						action : linkTo.linkTo( 'talentGroup', 'update', id ),
						method : 'put',
						name   : 'editTalentGroup',
						submit : 'Update Talent Group',
					},
					talentGroup : talentGroup,
					title : 'Edit Talent Group'
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
			redis.set( 'talentGroup:' + id + ':name', req.body.name, errorFnc );
			res.redirect( '/' + req.params.controller + '/' + id );
		}
		/*
		 * Talent Group Destroy.
		 */
	}
}