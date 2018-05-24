//Enemy Controller

export default function Enemy( game, x, y, spriteKey ) {
	Phaser.Sprite.call( this, game, x, y, spriteKey ),
	game.physics.arcade.enable( this ),
	this.body.collideWorldBounds = true,
	this.body.fixedRotation = true,
	this.body.bounce.set( 0.3 ),
	this.anchor = {
		x: 0.5, 
		y: 0.5 
	},
	this.speed = 100,
	this.fearSpeed = 300,
	this.stunned = false,
	this.attackEnabled = true,
	this.lungeEnabled = true,
	this.moveEnabled = true,
	this.health = 25,
	this.body.onCollide = new Phaser.Signal(),
	this.animations.add( spriteKey ),
	this.animations.play( spriteKey, 10, true ),
	this.alive = true,
	game.add.existing( this )
};

Enemy.prototype = Object.create( Phaser.Sprite.prototype );

Enemy.prototype.constructor = Enemy;

Enemy.prototype.move = function() {

	if ( this.moveEnabled ) {
		this.game.physics.arcade.moveToXY( this, this.game.player.x, this.game.player.y, this.speed );
	}

	if ( this.speed < 400 && this.lungeEnabled ) {
		this.game.time.events.add( 1000, this.lunge, this );
	}

	this.manageFacing();

},

Enemy.prototype.lunge = function() {
	while ( this.speed < 400 && this.lungeEnabled ) {
		this.speed = this.speed + 10;
	}

	this.body.onCollide.add( this.attack, this );
},

Enemy.prototype.attack = function() {
	this.game.player.takeDamage( 20 );
	this.lungeEnabled = false;
	this.moveEnabled = false;
	this.speed = 0;
	this.body.velocity.x = 0;
	this.body.velocity.y = 0;
	this.game.player.knockBack();
	this.resetLunge();
},

Enemy.prototype.resetLunge = function () {
	this.game.time.events.add( 2000, function() { this.lungeEnabled = true, this.moveEnabled = true, this.speed = 100 }, this )
},

//disabling movement is WIP, does not work here
/*Enemy.prototype.knockBack = function () {
	//this.moveEnabled = false;
	this.speed = -this.speed;
	this.resetStun()
},*/

//disabling movement is WIP, does not work here
/*Enemy.prototype.resetStun = function() {
	this.speed = -this.speed;
	//this.game.time.events.add( 2000, function() { this.moveEnabled = true }, this )
},*/

Enemy.prototype.manageFacing = function() {
	if ( this.game.player.x > this.x ) {
		this.scale.setTo( -1, 1 );
	}

	else {
		this.scale.setTo( 1, 1 );
	}
}