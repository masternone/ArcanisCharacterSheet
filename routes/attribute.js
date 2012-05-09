var linkTo = require( '../util/linkTo' );

exports.attribute = function( login ){
	return {
		/*
		 * Attribute Index.
		 */
		index : function( req, res ){
			res.render( 'attribute/index', { 
				user  : req.user,
				login : login,
				title : 'attribute index'
			});
		},
		/*
		 * Attribute Show.
		 */
		 show : function( req, res, flash ){
			console.log( 'in attribute show function' );
			res.render( 'attribute/show', {
				user      : req.user,
				login     : login,
				flash     : ( typeof( flash ) == 'string' && flash.length > 0 ? flash : '' ),
				attribute : {
					abbr                     : 'AN',
					id                       : 0,
					name                     : 'test attribute name',
					linkTo_attributeEdit     : linkTo.linkTo( 'attribute', 'edit', 0 ),
					linkTo_attributeEditText : linkTo.linkToText( 'attribute', 'edit', 0 )
				},
				title     : 'Attribute'
			 });
		 },
		/*
		 * Attribute New.
		 */
		'new' : function( req, res, flash ){
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
					abbr : 'AN',
					name : 'test attribute name'
				},
				title : 'new attribute'
			});
		},
		/*
		 * Attribute Create.
		 */
		create : function( req, res, postData ){
			
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