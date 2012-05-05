/*
 * GET root
 */

exports.index = function( req, res ){
  res.render( 'index', { title : 'Express' });
};

/*
 * The object that defines the actions for each controller have been moved to a seperate file for each
 * controller.
 */
exports.attribute  = require( './attribute'  ).attribute;
exports.skill      = require( './skill'      ).skill;
exports.skillGroup = require( './skillGroup' ).skillGroup;
