//Collision Manager

export default function Collision( game ) {
	this.game = game,

	this.collidedOnSwipe = false,
	this.collidedOnContact = false,

	this.swipeCollide = new Phaser.Signal,
	this.contact = new Phaser.Signal
};

Collision.prototype.update = function() {
	this.updateSwipeCollision( player, enemy );
	this.updateContactCollision( player, enemy );
};

Collision.prototype.updateSwipeCollision = function( player, enemy ) {

};

Collision.prototype.updateContactCollision = function( player, enemy ) {

};