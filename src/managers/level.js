//level.js

import Room from '../controllers/room.js'

export default function Level( game ) {
	Phaser.State.call( this );
	this.game = game;
	this.roomLocations = [];
	this.roomWidth = [];
	this.roomHeight = [];
	this.rooms = [];

	//this.rooms = this.game.add.group();
	//this.rooms.classType = Room;
	//this.rooms.enableBody = true;

	this.levelCircle = new Phaser.Circle( this.game.width / 2, this.game.height / 2 );
	this.roomPerLevel = 10;
}

Level.prototype.getRandomRadius = function() {
	var levelRadius = this.game.rnd.between( 500, 900 );
	return levelRadius;
},

Level.prototype.createLevelCircle = function() {
	var randomRadius = this.getRandomRadius();
	this.levelCircle.radius = randomRadius;

	var gfx = this.game.add.graphics( 0,0 )
	gfx.lineStyle( 8, 0xffd900 );
	gfx.drawCircle( this.levelCircle.x, this.levelCircle.y, this.levelCircle.radius * 2 );
},

Level.prototype.populateArrays = function () {

	for ( var i = 0; i < this.roomPerLevel; i++ ) {
		this.roomLocations.push( this.levelCircle.random() );
		this.roomWidth.push( 20 * this.game.rnd.between( 5, 40 ) ); //min is 100, max is 800
		this.roomHeight.push( 40 * this.game.rnd.between( 5, 15 ) ); //min is 200, max is 600
	}
},

Level.prototype.createLevel = function() {
	this.createLevelCircle();
	this.populateArrays();

	for ( var i = 0 ; i < this.roomPerLevel; i++ ) {
		var room = new Room( this.game, this.roomLocations[ i ].x, this.roomLocations[ i ].y, this.roomWidth[ i ], this.roomHeight[ i ] );
		this.rooms./*add*/push( room );
	}

	console.log( this.rooms/*.children*/ )
},

Level.prototype.displayLevel = function() {
	
	for ( var i = 0; i < this.rooms./*children.*/length; i++ ) {
		var gfx = this.game.add.graphics( 0, 0 )
		gfx.lineStyle( 15, 0xff00ff );
		gfx.drawRect( this.rooms/*.children*/[ i ].position.x, this.rooms/*.children*/[ i ].position.y, this.rooms/*.children*/[ i ].position.width, this.rooms/*.children*/[ i ].position.height );
	}
},

Level.prototype.recordRoomData = function() {
	var rooms = this.rooms;

	/*for ( var i = 0; i <= )*/
},

Level.prototype.separate = function() {
	//For Convenince sake
	var arcade = this.game.physics.arcade,
		rooms = this.rooms;

	for ( var i = 0; i < rooms.length - 1; i++ ) {
		while ( arcade.intersects( rooms[ i ], rooms[ i + 1 ] ) ) {
			arcade.collide( rooms[ i ], rooms[ i + 1 ] );
		}
	}

	//For testing purposes
	this.displayLevel();
},

Level.prototype.create = function() {
	this.game.physics.arcade.enable( this.rooms );
	this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

	//Gets coordinates and dimensions for Rooms and creates them.
	this.createLevel();

	console.log( "Level State Completed" );
	//this.game.state.start( 'InGameState' );
},

Level.prototype.update = function() {
	//this.separate();
}


/*,
Level.prototype.separate = function() {
	var sepCount = 0,
		it = 0,
		others = -1,
		arcade = this.game.physics.arcade, //convenience
		rooms = this.rooms; //convenience

	while ( sepCount < rooms.length ) {
		it++;
		var pop = rooms.children.slice( rooms.children.length - it );
		
		arcade.collide( pop[ pop.length - 1 ], rooms, function() { return true } );

		if ( !arcade.overlap( pop[ pop.length - 1 ], rooms ) ) {
			sepCount++;
		}

		console.log( "iterations ", it )
		console.log( "there are, ", rooms.children.length, " rooms" );
	}
}
*/
