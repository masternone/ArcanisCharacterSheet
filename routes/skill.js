exports.skill = function( linkTo, login ){
	return {
		/*
		* Skill Index.
		*/
		index : function( req, res ){
			JSONRedis.toJSON( 'skill', 'skill', 0, function( error, skill ){
				if( !skill ){ skill = []; }
				res.render( 'skill/index', {
					user                : req.user,
					login               : login,
					linkTo_skillNew     : linkTo.linkTo(     'skill', 'new', null ),
					linkTo_skillNewText : linkTo.linkToText( 'skill', 'new', null ),
					title               : 'Skill Index',
					skill               : skill
				});
			});
		},
		/*
		* Skill New.
		*/
		'new' : function( req, res ){
			JSONRedis.toJSON( 'attribute', 'attribute', 0, function( error, attribute ){
				if( !attribute ){ attribute = []; }
				JSONRedis.toJSON( 'skillGroup', 'skillGroup', 0, function( error, skillGroup ){
					if( !skillGroup ){ skillGroup = []; }
					res.render( 'skill/new', {
						user  : req.user,
						login : login,
						form  : {
							action : linkTo.linkTo( 'skill', 'create', null ),
							method : 'POST',
							name   : 'newSkill',
							submit : linkTo.linkToText( 'skill', 'create', null )
						},
						attribute : attribute,
						group     : skillGroup,
						skill     : {
							name : 'test skill name'
						},
						title : 'New Skill'
					});
				});
			});
		}
	}
}
