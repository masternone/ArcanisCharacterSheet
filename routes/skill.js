var linkTo = require( '../util/linkTo' );

exports.skill = function( login ){
	return {
		/*
		 * Skill Index.
		 */
		index : function( req, res ){
		  res.render( 'skill/index', { 
				user                : req.user,
				login               : login,
				linkTo_skillNew     : linkTo.linkTo(     'skill', 'new', null ),
				linkTo_skillNewText : linkTo.linkToText( 'skill', 'new', null ),
				title               : 'skill index' 
			});
		},
		/*
		 * Skill New.
		 */
		'new' : function( req, res ){
			res.render( 'skill/new', {
				user  : req.user,
				login : login,
				form  : {
					action : linkTo.linkTo( 'skill', 'create', null ),
					method : 'POST',
					name   : 'newSkill',
					submit : linkTo.linkToText( 'skill', 'create', null )
				},
				attribute : [
					{
						abbr: 'MI',
						name : 'Might'
					}
				],
				group : [
					'physical'
				],
				skill : {
					name : 'test skill name'
				},
				title : 'skill new'
			});
		}
	}
}
