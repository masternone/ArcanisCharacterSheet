var linkTo = require( '../util/linkTo' );

exports.skillGroup = function( login ){
	return {
		/*
		 * Skill Group Index.
		 */
		index : function( req, res ){
			res.render( 'skillGroup/index', { 
				user                     : req.user,
				login                    : login,
				linkTo_skillGroupNew     : linkTo.linkTo(     'skillGroup', 'new', null ),
				linkTo_skillGroupNewText : linkTo.linkToText( 'skillGroup', 'new', null ),
				title                    : 'skill group index'
			});
		},
		/*
		 * Skill Group New.
		 */
		'show' : function( req, res, id ){
			res.render( 'skillGroup/show', { 
				user                         : req.user,
				login                        : login,
				linkTo_skillGroupEdit        : linkTo.linkTo(     'skillGroup', 'edit',    id ),
				linkTo_skillGroupEditText    : linkTo.linkToText( 'skillGroup', 'edit',    id ),
				linkTo_skillGroupDestroy     : linkTo.linkTo(     'skillGroup', 'destroy', id ),
				linkTo_skillGroupDestroyText : linkTo.linkToText( 'skillGroup', 'destroy', id ),
				name                         : 'Test Skill Group Name',
				title                        : 'skill group'
			});
		},
		/*
		 * Skill Group New.
		 */
		'new' : function( req, res ){
			res.render( 'skillGroup/new', {
				user  : req.user,
				login : login,
				form  : {
					action : '/skillGroup',
					method : 'POST',
					name   : 'newSkillGroup',
					submit : 'Create New Skill Group'
				},
				skillGroup : {
					name : 'test skill Group name'
				},
				title : 'skill group new'
			});
		}
	}
}