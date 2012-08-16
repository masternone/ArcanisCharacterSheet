/* *  Project:      Arcanis Character Sheet *  Description:  The way skills are chosen will require additional functionality to be able to creat selections *  Author:       Edward Grant *  License:      MIT -- http://opensource.org/licenses/mit-license.php/ *  Last Updated: August 2012 *  Requirements: jQuery -- http://jquery.com/ *  Thanks:       jQuery Boilerplate -- http://jqueryboilerplate.com/ */;( function( $, window, undefined ){	var pluginName = 'skillAdd',		document = window.document,		defaults = {			target : '#skillAddBefore',			type   : []		};	function Plugin( element, options ){		this.element = $( element );		this.options = $.extend( {}, defaults, options );		this._defaults = defaults;		this._name = pluginName;		this.init( this );	}	Plugin.prototype.init = function( self ){		// on event add a new select for the type		self.element.click( function(){			var level = 0;			// get the count of skills allready added			var skillCount = $( 'p.skillAdd' ).length;			// Add a paragraph to wrap the form fields that define this selection			$( self.options.target ).before( '<p id="skillAdd-' + skillCount + '-' + level + '" class="skillAdd"></p>' );			// Add the typeSelect to the paragraph			self.typeSelect( self, skillCount, level );		});	}	// Level is ued to distinguish level because if you select choose that means	// that you have more than one specfic and/or group you want to choose from	// and will need to use level to distinguish between them.	Plugin.prototype.typeSelect = function( self, skillCount, level ){		$( '#skillAdd-' + skillCount + '-' + level ).append(			'<label for="skillType[' + skillCount + '][' + level + ']" >Type</label>' +			'<select id="skillType-' + skillCount + '-' + level + '" name="skillType[' + skillCount + '][' + level + ']" >'+				'<option value="-1">Select Type</option>' +			'</select>'		);		for( n in self.options.type ){			$( 'select#skillType-' + skillCount + '-' + level ).append(				'<option value="' + n + '">' + self.options.type[n] + '</option>'			);		}		// Add change listner to skillType		$( '#skillType-' + skillCount + '-' + level ).change( function(){			// TODO: remove all previously add options that were added by this event			// add a select based on the choice			switch( self.options.type[$( this ).val()] ){				case 'Group':					self.groupSelect( self, skillCount, level );					break;				default:					console.log( '$( this ).val()', $( this ).val() );					console.log( 'self.options.type[$( this ).val()]', self.options.type[$( this ).val()] );			}		});	}	Plugin.prototype.groupSelect = function( self, skillCount, level ){		console.log( "$( '#skillType-'" + skillCount + "'-'" + level + " )", $( '#skillType-' + skillCount + '-' + level ));		$( '#skillType-' + skillCount + '-' + level ).after(			'<label for="skillGroup[' + skillCount + '][' + level + ']" >Skill Group</label>' +			'<select id="skillGroup-' + skillCount + '-' + level + '" name="skillGroup[' + skillCount + '][' + level + ']" >'+				'<option value="-1">Select Skill Group</option>' +			'</select>'		);		for( n in self.options.skillGroup ){			$( 'select#skillGroup-' + skillCount + '-' + level ).append(				'<option value="' + n + '">' + self.options.skillGroup[n] + '</option>'			);		}	}	$.fn[pluginName] = function( options ){		return this.each(function () {			if(!$.data(this, 'plugin_' + pluginName)) {				$.data(this, 'plugin_' + pluginName, new Plugin( this, options ));			} else if( typeof options === 'string' && options[0] !== '_' && options !== 'init' ){				return this.each( function(){					var instance = $.data( this, 'plugin_' + pluginName );					if( instance instanceof Plugin && typeof instance[options] === 'function' ){						instance[options].apply( instance, Array.prototype.slice.call( args, 1 ));					}				});			}		});	}}( jQuery, window ));