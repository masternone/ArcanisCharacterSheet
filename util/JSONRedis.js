exports.JSONRedis = function( client ){
	var JSONRedis = {

		finalJSON     : {},

		sortFunc : function( a, b ){
			var aSplit = a.split( ':' ),
				bSplit = b.split( ':' );
				if( !isNaN( aSplit[aSplit.length - 1] )){
					aSplit[aSplit.length - 1] = aSplit[aSplit.length - 1] * 1;
					bSplit[bSplit.length - 1] = bSplit[bSplit.length - 1] * 1;
				}
				return aSplit[aSplit.length - 1] == bSplit[bSplit.length - 1] ? 0 : ( aSplit[aSplit.length - 1] > bSplit[bSplit.length - 1] ? 1 : -1 );
		},

		toRedis : function( init, payload, callback ){
			payload = typeof( payload ) == 'string' ? JSON.parse( payload ) : payload;
			for( var i in payload ){
				var newInit = init + ':' + i;
				switch( true ){
					case typeof( i ) == 'string' && typeof( payload[i] ) == 'object':
						JSONRedis.toRedis( newInit, payload[i] );
						client.sadd( init, newInit, callback );
						break;
					case typeof( i ) == 'string' && typeof( payload[i] ) != 'object':
						client.sadd( init, newInit, callback );
						client.set( newInit, payload[i], callback );
						break;
					default:
						console.log( 'No action defined for key of type: %s and value of type: %s', typeof( i ), typeof( payload[i] ));
				}
			}
			if( client.command_queue.length == 0 && typeof( callback ) == 'function' )
				callback( null, true ); 
		},

		toJSONHelper : function( str, ret, pos ){
			var split = str.split( ':' ).slice( pos ),
				currentItem = split[0],
				nextItem = split[1];
			if( split.length > 2 ){
				if( typeof( ret[currentItem] ) == 'undefined' || ret[currentItem] == null ){
					if( !isNaN( nextItem )){
						nextItem = nextItem * 1;
						if( nextItem == 0 ){
							ret[currentItem] = [];
						} else {
							ret[currentItem] = {};
						}
					} else {
						ret[currentItem] = {};
					}
				}
				this.toJSONHelper( str, ret[currentItem], pos + 1 );
			} else {
				ret[currentItem] = nextItem;
			}
		},

		toJSON : function( startingPoint, init, loop, callback ){
			if( isNaN( loop )) loop = 0;
			client.type( init, function( error, type ){
				if( error ) console.log( 'toJSON Error', error );
				switch( type ){
					case 'set':
						client.smembers( init, function( error, members ){
							if( error ) return callback( error );
							members.sort( this.sortFunc );
							//Continue the current loop
							if( typeof( members[loop + 1] ) != 'undefined' )
								JSONRedis.toJSON( startingPoint, init, loop + 1, callback );
							//start a subloop
							JSONRedis.toJSON( startingPoint, members[loop], 0,  callback );
						});
						break;
					case 'string':
						client.get( init, function( error, value ){
							if( error ) return callback( error );
							JSONRedis.toJSONHelper( init + ':' + value, JSONRedis.finalJSON, 0 );
							// Because idle dose not work the way I think it should I am putting this chaeck in here
							if( client.command_queue.length == 0 && typeof( callback ) == 'function' ){
								callback( null, JSONRedis.finalJSON[startingPoint] );
							}
						});
						break;
					case 'none':
						callback( null, null );
						break;
					default:
						console.log( 'No action defined for type %s', type );
				}
			});
		}
	};
	return JSONRedis;
}