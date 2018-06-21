//room.js

export default function Room( game, x, y, width, height ) {
	this.game = game;
	this.position = {
		x : x,
		y : y
	};
	this.width = width;
	this.height = height;
	this.game.physics.arcade.enable( this );
	this.isBossRoom = false;
	this.neighbors = {};
	this.doors = [];
}

Room.prototype.checkForNeighbors = function () {

}