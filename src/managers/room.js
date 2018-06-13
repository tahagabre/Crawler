//room.js

export default function Room( game, x, y, width, height ) {
	//Phaser.TileSprite.call( this, game, x, y, width, height, key, frame );
	this.game = game;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.isBossRoom = false;
	this.neighbors = {};
	this.doors = [];
}

Room.prototype.checkForNeighbors = function () {

}