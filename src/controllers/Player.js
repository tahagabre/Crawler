//Player Controller

export default function Player( game, x, y, spriteKey ) {
	Phaser.Sprite.call( this, game, x, y, spriteKey ),
	game.physics.arcade.enable( this ),
	this.body.fixedRotation = true,
	this.body.collideWorldBounds = true,
    game.input.onDown.add( this.move, this ),
	this.anchor = {
		x: 0.5, 
		y: 0.5 
	},
	this.inputEnabled = true,
	this.health = 100,
	this.speed = 200,
	this.stunned = false,
	this.immune = false,
	this.alive = true,
	this.attackEnabled = true,
	this.animations.add( spriteKey ),
	this.animations.play( spriteKey, 10, true ),
	game.add.existing( this )
};

Player.prototype = Object.create( Phaser.Sprite.prototype );

Player.prototype.constructor = Player;

Player.prototype.move = function() { //Update function
	if ( this.inputEnabled ) {
		this.game.physics.arcade.moveToPointer( this, this.speed )
	}
},

Player.prototype.stopSliding = function() { //Update function
	if ( this.body.onWall() || this.body.onFloor() || this.body.onCeiling() ) {
        this.body.velocity.x = 0,
        this.body.velocity.y = 0
    }
},

Player.prototype.knockBack = function() {
	this.inputEnabled = false;
	this.resetStun();
},

Player.prototype.disableAttack = function() {
	this.attackEnabled = false;
	this.resetAttack;
},

Player.prototype.resetAttack = function () {
	this.game.time.events.add( 800, function() { this.attackEnabled = true }, this )
},

Player.prototype.resetStun = function () {
	this.game.time.events.add( 800, function() { this.inputEnabled = true }, this );
},

Player.prototype.checkDeath = function() { //Update function
	if ( this.health <= 0 ) {
		this.destroy();
	}
},

Player.prototype.takeDamage = function( damage ) {
	if ( !this.immune ) {
		this.health -= damage;
		this.immune = true;
		this.game.time.events.add( 1000, function() { this.immune = false; }, this );
	}
},

Player.prototype.attack = function () {

}