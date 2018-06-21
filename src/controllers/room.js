//room.js

export default function Room( game, x, y, width, height, key ) {
	Phaser.TileSprite.call( this, game, x, y, width, height, key );
	this.game.physics.arcade.enable( this );
	this.isBossRoom = false;
	this.neighbors = {};
	this.doors = [];
}

Room.prototype.checkForNeighbors = function () {

}