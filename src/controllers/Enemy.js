//Enemy Controller

var KNOCKBACK_MULT = -2,
	FEAR_MULT = -0.5;

export default function Enemy( game, x, y, spriteKey ) {
	Phaser.Sprite.call( this, game, x, y, spriteKey ),
	
	//Physics
	game.physics.arcade.enable( this ),
	this.body.collideWorldBounds = true,
	this.body.fixedRotation = true,
	this.body.bounce.set( 0.3 ),
	this.body.onCollide = new Phaser.Signal(),
	this.anchor = {
		x: 0.5, 
		y: 0.5 
	},
	this.speed = 300,	
	this.alive = true,
	this.gotShocked = false,
	this.fearSpeed = 300,
	this.stunned = false,
	this.attackEnabled = true,
	this.lungeEnabled = true,
	this.moveEnabled = true,
	this.health = 2,

	this.addAnimations(),

	this.getLerp(),

	//Animations
	game.add.existing( this )
};

Enemy.prototype = Object.create( Phaser.Sprite.prototype );

Enemy.prototype.constructor = Enemy;

Enemy.prototype.addAnimations = function() {
	this.animations.add( 'fly', Phaser.Animation.generateFrameNames( 'fly', 1, 4 ), 15, true );
	this.animations.add( 'hurt', Phaser.Animation.generateFrameNames( 'hurt', 1, 2 ), 10, false );
	this.animations.add( 'dead', Phaser.Animation.generateFrameNames( 'dead', 1, 11 ), 10, true );
},

Enemy.prototype.getHealth = function() {
	return this.health
},

Enemy.prototype.isAlive = function() {
	return this.alive
},

Enemy.prototype.getSpeed = function() {
	return this.speed
},

Enemy.prototype.setSpeed = function( newSpeed ) {
	this.speed = newSpeed;
},

Enemy.prototype.getShockStatus = function() {
	return this.gotShocked;
},

Enemy.prototype.setShockStatus = function( gotShocked ) {
	this.gotShocked = gotShocked;
},

Enemy.prototype.move = function() {
	
	var distance = .8/*this.game.rnd.between( .1, .5 )*/,
		lerpX = this.game.math.bezierInterpolation( this.getLerp().x, distance ),
		lerpY = this.game.math.bezierInterpolation( this.getLerp().y, distance ),
		player = this.game.player;

	if ( this.moveEnabled ) {
		this.animations.play( 'fly' );

		this.game.physics.arcade.moveToXY( this, lerpX, lerpY, this.speed );
		//this.game.physics.arcade.moveToXY( this, player.x, player.y, this.speed)
	}

	this.manageFacing();

},

Enemy.prototype.getLerp = function() {

	var player = this.game.player,
		x = [],
		y = [],
		points = {},
		i = 0;

	for ( i; i <= 19; i++ ) {

		var randXPoint = this.game.rnd.between( this.x, this.game.player.x );
		var randYPoint = this.game.rnd.between( this.y, this.game.player.y );	
	
		x.push( randXPoint );
		y.push( randYPoint );
	}

		/*
		lerpX = this.game.math.linearInterpolation( x, distance );
		lerpY = this.game.math.linearInterpolation( y, distance );
		*/

		/*
		lerpX = this.game.math.bezierInterpolation( x, distance );
		lerpY = this.game.math.bezierInterpolation( y, distance );
		*/		
		
		/*
		lerpX = this.game.math.catmullRomInterpolation( x, distance );
		lerpY = this.game.math.catmullRomInterpolation( y, distance );
		*/

	points.x = x;
	points.y = y;
	//console.log( "points:\t", points.x, points.y )
	return points;
	
},

Enemy.prototype.moveEnemies = function() {
    for ( var i = 0; i < this.game.enemies.children.length; i++ ) {
        this.game.enemies.children[ i ].move()
    }
},

Enemy.prototype.attack = function() {
	var player = this.game.player;
	player.takeDamage( 1 );
/*	this.lungeEnabled = false;
	this.moveEnabled = false;*/
	this.speed = 0;
/*	this.body.velocity.x = 0;
	this.body.velocity.y = 0;*/
	player.knockBack();
	//this.resetLunge();
},

Enemy.prototype.takeDamage = function( damage ) {
	this.health -= damage;
	this.animations.play( 'hurt' );
	console.log( "enemy health:\t", this.health )
	console.log( damage, "\ttaken by enemy" )
},

Enemy.prototype.checkDeath = function() {
	if ( this.health <= 0 && this.alive ) {
		this.alive = false;
		this.moveEnabled = false;

		this.body.velocity.x = 0;
		this.body.velocity.y = 0;

		var fade = this.game.add.tween( this ).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 500, 0, false )
		fade.onComplete.add( function() { this.kill(), console.log( "enemy killed" ) }, this );
	}

},

Enemy.prototype.fear = function() {
	this.speed *= FEAR_MULT;
	this.game.time.events.add( 1500, this.resetFear, this )
},

Enemy.prototype.resetFear = function() {
	this.speed /= FEAR_MULT;
},

Enemy.prototype.knocked = function() {
	this.speed *= KNOCKBACK_MULT
	this.game.time.events.add( 500, this.resetKnock, this )
},

Enemy.prototype.resetKnock = function() {
	this.speed /= KNOCKBACK_MULT
},

Enemy.prototype.stun = function() {

},

Enemy.prototype.resetStun = function() {

},

Enemy.prototype.manageFacing = function() {
	var player = this.game.player;
	if ( player.x > this.x ) {
		this.scale.setTo( -1, 1 );
	}

	else {
		this.scale.setTo( 1, 1 );
	}
},

Enemy.prototype.update = function() {
	this.moveEnemies();
	this.checkDeath();
}