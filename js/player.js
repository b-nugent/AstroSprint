// Dependencies: 
// Description: singleton object that is a module of app
// properties of the ship and what it needs to know how to do go here

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// the 'ship' object literal is now a property of our 'app' global variable
app.Player = function() {
	function Player() {
		
	};
	
	
	var p = Player.prototype;
	
    p.update()
    {

    }
    
    p.run()
    {

    }
    
    p.jump()
    {
        
    }
    
    p.slam()
    {
        
    }
	
	return Player;
}();