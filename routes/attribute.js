exports.attribute = function( linkTo, login ){
	return {
		/*
		 * Attribute Index.
		 */
		index : function( req, res ){
			JSONRedis.toJSON( 'attribute', 'attribute', 0, function( error, attribute ){
					res.render( 'attribute/index', { 
					user                    : req.user,
					login                   : login,
					title                   : 'attribute index',
					attribute               : attribute,
					linkTo_attributeNew     : linkTo.linkTo( 'attribute', 'new', 0 ),
					linkTo_attributeNewText : linkTo.linkToText( 'attribute', 'new', 0 )
				});
			});
		},
		/*
		* Attribute Show.
		*/
		show : function( req, res, id ){
			JSONRedis.toJSON( 'attribute', 'attribute:' + id, 0, function( error, attribute ){
				console.log( 'attribute', attribute)
				res.render( 'attribute/show', {
					user      : req.user,
					login     : login,
					flash     : ( typeof( flash ) == 'string' && flash.length > 0 ? flash : '' ),
					attribute : attribute,
					title     : 'Attribute'
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
				flash     : ( typeof( flash ) == 'string' && flash.length > 0 ? flash : '' ),
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
				submit : 'Create Attribute',
				title : 'new attribute'
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
				console.log( 'exists', exists );
				if( !exists ){
					var id = 0;
					redis.set( 'attributeId', id );
					save( id );
				} else {
					redis.incr( 'attributeId', function( error, id ){
						save( id );
					});
				}
			})
		}
		/*
		 * Attribute Edit.
		 */
		/*
		 * Attribute Update.
		 */
		/*
		 * Attribute Destroy.
		 */
	}
}