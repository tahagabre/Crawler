//level.js

import Room from './room.js'

export default function LevelManager( game ) {
	this.game = game;
	this.roomLocations = [];
	this.roomWidth = [];
	this.roomHeight = [];
	this.rooms = [];
	//this.rooms = this.game.add.group();
	//this.rooms.classType = Room;
	this.rooms.enableBody = true;
	this.levelCircle = new Phaser.Circle( this.game.world.centerX, this.game.world.centerY );
	this.roomPerLevel = 10;
}

LevelManager.prototype.getRandomRadius = function() {
	var levelRadius = this.game.rnd.between( 50, 100 );
	return levelRadius;
},

LevelManager.prototype.createLevelCircle = function() {
	var randomRadius = this.getRandomRadius();
	this.levelCircle.radius = randomRadius;
},

LevelManager.prototype.populateArrays = function () {

	for ( var i = 0; i < this.roomPerLevel; i++ ) {
		this.roomLocations.push( this.levelCircle.random() );
		this.roomWidth.push( 20 * this.game.rnd.between( 5, 40 ) ); //min is 100, max is 800
		this.roomHeight.push( 40 * this.game.rnd.between( 5, 15 ) ); //min is 200, max is 600
	}
},

LevelManager.prototype.createLevel = function() {
	this.createLevelCircle();
	this.populateArrays();
	console.log( this.roomLocations );
	console.log( this.roomWidth );
	console.log( this.roomHeight );
	for ( var i = 0 ; i < this.roomPerLevel; i++ ) {
		var room = new Room( this.game, this.roomLocations[ i ].x, this.roomLocations[ i ].y, this.roomWidth[ i ], this.roomHeight[ i ] );
		this.rooms.push( room );

		var gfx = this.game.add.graphics( room.x, room.y )
		gfx.lineStyle( 15, 0xff00ff, 1 );
		gfx.drawRect( room.x, room.y, room.width, room.height );
		/*this.rooms.create( this.roomLocations[ i ].x, this.roomLocations[ i ].y );
		this.rooms.children[ i ].width = this.roomWidth[ i ];
		this.rooms.children[ i ].height = this.roomHeight[ i ];

		var gfx = this.game.add.graphics( this.rooms.children[ i ].x, this.rooms.children[ i ].y );
		gfx.lineStyle( 15, 0xff00ff, 1 );
		gfx.drawRect( this.rooms.children[ i ].x, this.rooms.children[ i ].y, this.rooms.children[ i ].width, this.rooms.children[ i ].height );*/

	}
}