//Player Controller

export default function Player( game, x, y, spriteKey ) {
	Phaser.Sprite.call( this, game, x, y, spriteKey ),
	game.physics.arcade.enable( this ),
	this.body.fixedRotation = true,
	this.body.collideWorldBounds = true,
    this.game.input.onUp.add( this.move, this ),
	this.anchor = {
		x: 0.5, 
		y: 0.5 
	},
	this.inputEnabled = true,
	this.moveEnabled = true,
	this.health = 100,
	this.speed = 400,
	this.stunned = false,
	this.immune = false,
	this.alive = true,
	this.tween = null,
	this.swipeEnabled = true,
	this.holdEnabled = true,
	this.attackEnabled = true,
	this.doubleTapEnabled = true,
	this.proxDiameter = 400,
	this.doubleTapDiameter = 700,
	this.proximity = new Phaser.Circle( this.x, this.y, this.proxDiameter ),
	this.doubleTapCircle = new Phaser.Circle( this.x, this.y, this.doubleTapDiameter ),
	this.explosionCircle = new Phaser.Circle( this.x, this.y, this.doubleTapDiameter ),
	this.isDashing = false,
	this.isBombing = false,
	this.animations.add( spriteKey ),
	this.animations.play( spriteKey, 10, true ),
	game.add.existing( this )
};

Player.prototype = Object.create( Phaser.Sprite.prototype );

Player.prototype.constructor = Player;

Player.prototype.getSpeed = function() {
	return this.speed
},

Player.prototype.setSpeed = function( newSpeed ) {
	this.speed = newSpeed
},

Player.prototype.getHealth = function() {
	return this.health
},

Player.prototype.setHealth = function( newHealth ) {
	this.health = newHealth
},

Player.prototype.isAlive = function() {
	return this.alive
},

Player.prototype.move = function() { //Update function
	if ( this.moveEnabled ) {
		this.game.physics.arcade.moveToPointer( this, this.speed )
	}

	this.manageFacing();
},

Player.prototype.stopSliding = function() { //Update function
	if ( this.body.onWall() || this.body.onFloor() || this.body.onCeiling() ) {
        this.body.velocity.x = 0,
        this.body.velocity.y = 0
    }
},

Player.prototype.knockBack = function ( /*maybe we can use collider, have collider point minus enemy point?*/ ) {
	this.speed = -this.speed;
	this.resetStun();
},

Player.prototype.disableAttack = function() {
	this.attackEnabled = false;
	this.resetAttack();
},

Player.prototype.resetAttack = function () {
	this.game.time.events.add( 800, function() { this.attackEnabled = true }, this )
},

//need an input disabled feature
Player.prototype.resetStun = function () {
	this.speed = -this.speed;
	//this.game.time.events.add( 800, function() { this.speed = -this.speed }, this );
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

//useful for blind enemies or alerts
Player.prototype.listenProximity = function() {

},

Player.prototype.resetDoubleTap = function() {
	this.moveEnabled = true;
	this.game.time.events.add( 2000, function() { this.doubleTapEnabled = true }, this );	
},

Player.prototype.updateProximity = function() {
	this.proximity.setTo( this.x, this.y, this.proxDiameter );
},

Player.prototype.updateDoubleTapCircle = function() {
	this.doubleTapCircle.setTo( this.x, this.y, this.doubleTapDiameter );
},

//Gesture Callbacks
Player.prototype.swiped = function() {
	console.log( 'swiped' )
	this.swipeAttack();
},

Player.prototype.held = function() {
	console.log( 'held' )
},

Player.prototype.doubleTapped = function () {
	if ( this.doubleTapCircle.contains( this.game.input.activePointer.x, this.game.input.activePointer.y ) ) {
		console.log( "double tap dispatched" )
		this.bombAttack();
	}
},

//Gesture callback game implementation
Player.prototype.bombAttack = function () {
	for ( var i = 0; i < this.game.enemies.children.length; i++ ) {
		if ( this.doubleTapCircle.contains( this.game.enemies.children[ i ].x, this.game.enemies.children[ i ].y ) ) {
			this.game.enemies.children[ i ].setSpeed( this.game.enemies.children[ i ].getSpeed() * -.5 );
		}
	}
},

Player.prototype.swipeAttack = function () {
	if ( this.swipeEnabled ) {

		var angleToPointer = this.game.physics.arcade.angleToPointer( this );
		this.body.angle = angleToPointer;
		this.speed += 300;

		this.dashTimer = new Phaser.Timer( this.game, true );
		this.dashTimer.add( 4000, this.resetSwipe(), this )
		this.dashTimer.start();
	}
},

//After swipe finishes, reset speed and put cooldown on swipe
Player.prototype.resetSwipe = function() {
	console.log( "Queue knockBack" );
	this.swipeEnabled = false;
	this.speed -= 300;
	console.log( "swipe speed\t", this.speed );
	this.cooldownTimer = new Phaser.Timer( this.game, false );
	this.cooldownTimer.add( 2000, function() { this.swipeEnabled = true }, this );
	this.cooldownTimer.start()
},

Player.prototype.manageFacing = function() {
	if ( this.game.input.activePointer.x < this.x ) {
		this.scale.setTo( -1, 1 );
	}

	else {
		this.scale.setTo( 1, 1 );
	}
}