exports.attrVals = function( linkTo, login ){
	return {
		/*
		 * Attribute Values Index.
		 */
		index : function( req, res ){
			JSONRedis.toJSON( 'attrVals', 'attrVals', 0, function( error, attrVals ){
					attrVals = attrVals ? attrVals : [];
					res.render( 'attrVals/index', { 
					user                   : req.user,
					login                  : login,
					edit                   : false,
					title                  : 'Attribute Values Index',
					attrVals               : attrVals,
					linkTo_attrValsIndex   : linkTo.linkTo(     'attrVals', 'index', null ),
					linkTo_attrValsNew     : linkTo.linkTo(     'attrVals', 'new', null ),
					linkTo_attrValsNewText : linkTo.linkToText( 'attrVals', 'new', null )
				});
			});
		},
		/*
		* Attribute Values Show.
		*/
		show : function( req, res, id ){
			JSONRedis.toJSON( 'attrVals', 'attrVals:' + id, 0, function( error, attrVals ){
				attrVals = [attrVals[id]]
				res.render( 'attrVals/show', {
					user                    : req.user,
					login                   : login,
					edit                    : ( req.user && req.user.roles && req.user.roles.join().indexOf( 'admin' ) > -1 ? true : false ),
					linkTo_attrValsIndex    : linkTo.linkTo(     'attrVals', 'index', null ),
					linkTo_attrValsEdit     : linkTo.linkTo(     'attrVals', 'edit', id ),
					linkTo_attrValsEditText : linkTo.linkToText( 'attrVals', 'edit', id ),
					attrVals                : attrVals,
					title                   : 'Attribute Values'
				 });
			});
		 },
		/*
		 * Attribute Values New.
		 */
		'new' : function( req, res, id ){
			res.render( 'attrVals/new', {
				user      : req.user,
				login     : login,
				linkTo_attrValsIndex : linkTo.linkTo( 'attrVals', 'index', null ),
				form      : {
					action : linkTo.linkTo( 'attrVals', 'create', null ),
					method : 'POST',
					name   : 'newAttrVals',
					submit : linkTo.linkToText( 'attrVals', 'create', null )
				},
				attrVals : {
					cost    : 0,
					score   : 0,
					die     : 0,
					passive : 0
				},
				title : 'New Attribute Values'
			});
		},
		/*
		 * Attribute Values Create.
		 */
		create : function( req, res, redis ){
			function errorFnc( error ){
				if( error ) console.log( error )
			}
			function save( id ){
				redis.sadd( 'attrVals', 'attrVals:' + id, errorFnc );
				redis.sadd( 'attrVals:' + id, 'attrVals:' + id + ':cost',    errorFnc );
				redis.sadd( 'attrVals:' + id, 'attrVals:' + id + ':score',   errorFnc );
				redis.sadd( 'attrVals:' + id, 'attrVals:' + id + ':die',     errorFnc );
				redis.sadd( 'attrVals:' + id, 'attrVals:' + id + ':passive', errorFnc );
				redis.set(  'attrVals:' + id + ':cost',    req.body.cost,    errorFnc );
				redis.set(  'attrVals:' + id + ':score',   req.body.score,   errorFnc );
				redis.set(  'attrVals:' + id + ':die',     req.body.die,     errorFnc );
				redis.set(  'attrVals:' + id + ':passive', req.body.passive, errorFnc );
				res.redirect( '/' + req.params.controller + '/' + id );
			}
			redis.exists( 'attrValsId', function( error, exists ){
				if( !exists ){
					var id = 0;
					redis.set( 'attrValsId', id );
					save( id );
				} else {
					redis.incr( 'attrValsId', function( error, id ){
						save( id );
					});
				}
			});
		},
		/*
		 * Attribute Values Edit.
		 */
 		edit : function( req, res, id ){
			JSONRedis.toJSON( 'attrVals', 'attrVals:' + id, 0, function( error, attrVals ){
				attrVals = attrVals[id];
				res.render( 'attrVals/new', {
					user      : req.user,
					login     : login,
					linkTo_attrValsIndex : linkTo.linkTo( 'attrVals', 'index', null ),
					form      : {
						action : linkTo.linkTo( 'attrVals', 'update', id ),
						method : 'put',
						name   : 'editAttrVals',
						submit : linkTo.linkToText( 'attrVals', 'update', id )
					},
					attrVals : attrVals,
					title : 'Edit Attribute Values'
				});
			});
		},
		/*
		 * Attribute Values Update.
		 */
		update : function( req, res, redis, id ){
			function errorFnc( error ){
				if( error ) console.log( error );
			}
			redis.set( 'attrVals:' + id + ':cost',    req.body.cost,    errorFnc );
			redis.set( 'attrVals:' + id + ':score',   req.body.score,   errorFnc );
			redis.set( 'attrVals:' + id + ':die',     req.body.die,     errorFnc );
			redis.set( 'attrVals:' + id + ':passive', req.body.passive, errorFnc );
			res.redirect( '/' + req.params.controller + '/' + id );
		}
		/*
		 * Attribute Values Destroy.
		 */
	}
}