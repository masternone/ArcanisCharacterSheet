exports.attribute = function( linkTo, login ){
	return {
		/*
		 * Attribute Index.
		 */
		index : function( req, res ){
			JSONRedis.toJSON( 'attribute', 'attribute', 0, function( error, attribute ){
					attribute = attribute ? attribute : [];
					res.render( 'attribute/index', { 
					user                    : req.user,
					login                   : login,
					edit                    : false,
					title                   : 'Attribute Index',
					attribute               : attribute,
					linkTo_attributeIndex   : linkTo.linkTo(     'attribute', 'index', null ),
					linkTo_attributeNew     : linkTo.linkTo(     'attribute', 'new', null ),
					linkTo_attributeNewText : linkTo.linkToText( 'attribute', 'new', null )
				});
			});
		},
		/*
		* Attribute Show.
		*/
		show : function( req, res, id ){
			JSONRedis.toJSON( 'attribute', 'attribute:' + id, 0, function( error, attribute ){
				attribute = [attribute[id]]
				res.render( 'attribute/show', {
					user                     : req.user,
					login                    : login,
					edit                     : ( req.user && req.user.roles && req.user.roles.join().indexOf( 'admin' ) > -1 ? true : false ),
					linkTo_attributeIndex   :  linkTo.linkTo(     'attribute', 'index', null ),
					linkTo_attributeEdit     : linkTo.linkTo(     'attribute', 'edit', id ),
					linkTo_attributeEditText : linkTo.linkToText( 'attribute', 'edit', id ),
					attribute                : attribute,
					title                    : 'Attribute'
				 });
			});
		 },
		/*
		 * Attribute New.
		 */
		'new' : function( req, res, id ){
			res.render( 'attribute/new', {
				user      : req.user,
				login     : login,
				linkTo_attributeIndex : linkTo.linkTo( 'attribute', 'index', null ),
				form      : {
					action : linkTo.linkTo( 'attribute', 'create', null ),
					method : 'POST',
					name   : 'newAttribute',
					submit : linkTo.linkToText( 'attribute', 'create', null )
				},
				attribute : {
					abbr : '',
					name : ''
				},
				title : 'New Attribute'
			});
		},
		/*
		 * Attribute Create.
		 */
		create : function( req, res, redis ){
			function errorFnc( error ){
				if( error ) console.log( error )
			}
			function save( id ){
				redis.sadd( 'attribute', 'attribute:' + id, errorFnc );
				redis.sadd( 'attribute:' + id, 'attribute:' + id + ':abbr', errorFnc );
				redis.sadd( 'attribute:' + id, 'attribute:' + id + ':name', errorFnc );
				redis.set( 'attribute:' + id + ':abbr', req.body.abbr, errorFnc );
				redis.set( 'attribute:' + id + ':name', req.body.name, errorFnc );
				res.redirect( '/' + req.params.controller + '/' + id );
			}
			redis.exists( 'attributeId', function( error, exists ){
				if( !exists ){
					var id = 0;
					redis.set( 'attributeId', id );
					save( id );
				} else {
					redis.incr( 'attributeId', function( error, id ){
						save( id );
					});
				}
			});
		},
		/*
		 * Attribute Edit.
		 */
 		edit : function( req, res, id ){
			JSONRedis.toJSON( 'attribute', 'attribute:' + id, 0, function( error, attribute ){
				attribute = attribute[id];
				res.render( 'attribute/new', {
					user      : req.user,
					login     : login,
					linkTo_attributeIndex : linkTo.linkTo( 'attribute', 'index', null ),
					form      : {
						action : linkTo.linkTo( 'attribute', 'update', id ),
						method : 'PUT',
						name   : 'editAttribute',
						submit : linkTo.linkToText( 'attribute', 'update', id )
					},
					attribute : attribute,
					title : 'Edit Attribute'
				});
			});
		},
		/*
		 * Attribute Update.
		 */
		update : function( req, res, redis ){
			function errorFnc( error ){
				if( error ) console.log( error );
			}
			redis.set( 'attribute:' + id + ':abbr', req.body.abbr, errorFnc );
			redis.set( 'attribute:' + id + ':name', req.body.name, errorFnc );
			res.redirect( '/' + req.params.controller + '/' + id );
		}
		/*
		 * Attribute Destroy.
		 */
	}
}