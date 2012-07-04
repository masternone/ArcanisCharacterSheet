function ucFirst( str ){
    return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
}

exports.linkTo = function( controller, action, id ){
	switch( action ){
		case 'index':
			return '/' + controller;
		case 'show':
			return '/' + controller + '/' + id;
		case 'new':
			return '/' + controller + '/new';
		case 'create':
			return '/' + controller;
		case 'edit':
			return '/' + controller + '/edit/' + id;
		case 'update':
			return '/' + controller + '/' + id;
		case 'destroy':
			return '/' + controller + '/' + id;
		default:
			console.log( 'Unknow action %s called on controller %s with id %s', action, controller, id )
			return 'unknown';
	}
}
exports.linkToText = function( controller, action, id ){
	switch( action ){
		case 'index':
			return 'List ' + ucFirst( controller );
		case 'show':
			return 'Show';
		case 'new':
			return 'New ' + ucFirst( controller );
		case 'create':
			return 'Create';
		case 'edit':
			return 'Edit'
		case 'update':
			return 'Update';
		case 'destroy':
			return 'Delete';
		default:
			console.log( 'Unknow action %s called on controller %s with id %s', action, controller, id )
			return 'unknown';
	}
}
