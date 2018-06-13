//Player Controller

var inits = {
	speed: 400,
	health: 3,
	proxDiameter: 400,
	doubleTapDiameter: 700,
	shockDiameter: 100
};

export default function Player( game, x, y, spriteKey ) {
	Phaser.Sprite.call( this, game, x, y, spriteKey ),
	this.game.physics.arcade.enable( this ),
	this.body.fixedRotation = true,
	this.body.collideWorldBounds = true,
	this.body.onCollide = new Phaser.Signal()
    this.game.input.onUp.add( this.move, this ),
	this.anchor = {
		x: 0.5, 
		y: 0.5 
	},
	this.inputEnabled = true,
	this.moveEnabled = true,
	this.health = inits.health,
	this.speed = inits.speed,
	this.stunned = false,
	this.immune = false,
	this.alive = true,
	this.tween = null,

	//Circles and Corresponding Gestures
	this.swipeEnabled = true,
	this.holdEnabled = true,
	this.attackEnabled = true,
	this.doubleTapEnabled = true,
	this.proxDiameter = inits.proxDiameter,
	this.doubleTapDiameter = inits.doubleTapDiameter,
	this.shockDiameter = inits.shockDiameter,
	this.proximity = new Phaser.Circle( this.x, this.y, this.proxDiameter ),
	this.doubleTapCircle = new Phaser.Circle( this.x, this.y, this.doubleTapDiameter ),
	this.explosionCircle = new Phaser.Circle( this.x, this.y, this.doubleTapDiameter ),
	this.shockCircle = new Phaser.Circle( this.x, this.y, this.shockDiameter ),
	this.isChanneling = false,
	this.isDashing = false,
	this.isBombing = false,
	this.isShocking = false,

	this.addAnimations(),
	game.add.existing( this )
};

Player.prototype = Object.create( Phaser.Sprite.prototype );

Player.prototype.constructor = Player;

Player.prototype.addAnimations = function() {
	this.animations.add( 'dead', Phaser.Animation.generateFrameNames( 'dead', 1, 8 ), 10, false );
	this.animations.add( 'idle', Phaser.Animation.generateFrameNames( 'idle', 1, 8 ), 10, true );
	this.animations.add( 'hurt', Phaser.Animation.generateFrameNames( 'duck', 1, 6 ), 10, true );
},

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
	if ( this.moveEnabled && !this.isChanneling ) {
		this.animations.play( 'idle' )
		this.game.physics.arcade.moveToPointer( this, this.speed )
	}

	this.updateProximity();
    this.updateDoubleTapCircle();
    this.updateShockCircle();

	this.manageFacing();
},

Player.prototype.manageFacing = function() {
	var activePointer = this.game.input.activePointer //convenience

	if ( activePointer.x < this.x ) {
		this.scale.setTo( -1, 1 );
	}

	else {
		this.scale.setTo( 1, 1 );
	}
},

Player.prototype.stopSliding = function() { //Update function
	if ( this.body.onWall() || this.body.onFloor() || this.body.onCeiling() ) {
        this.body.velocity.x = 0,
        this.body.velocity.y = 0
    }
},

//need an input disabled feature
Player.prototype.resetStun = function () {
	this.speed = -this.speed;
	//this.game.time.events.add( 800, function() { this.speed = -this.speed }, this );
},

Player.prototype.disableAttack = function() {
	this.attackEnabled = false;
	this.resetAttack();
},

Player.prototype.resetAttack = function () {
	this.game.time.events.add( 800, function() { this.attackEnabled = true }, this )
},

Player.prototype.checkDeath = function() { //Update function
	if ( this.health <= 0 ) {
		this.animations.play( 'dead' )
		this.alive = false;
		this.moveEnabled = false;

		this.body.velocity.x = 0;
		this.body.velocity.y = 0;
	}
},

Player.prototype.takeDamage = function( damage ) {
	/*if ( !this.immune ) {
		this.health -= damage;
		this.immune = true;
		this.game.time.events.add( 1000, function() { this.immune = false }, this );
	}*/

	this.animations.play( 'hurt' );

	this.health -= damage;
	
	/*
	console.log( "Player has taken damage:\t", damage )
	console.log( "Player health:\t", this.health )
	*/

},

//useful for blind enemies or alerts
Player.prototype.listenProximity = function() {},

Player.prototype.updateProximity = function() {
	this.proximity.setTo( this.x, this.y, this.proxDiameter );
},

Player.prototype.updateDoubleTapCircle = function() {
	this.doubleTapCircle.setTo( this.x, this.y, this.doubleTapDiameter );
},

Player.prototype.updateShockCircle = function() {
	this.shockCircle.setTo( this.x, this.y, this.shockDiameter );
	
	//TEST
	/*var gfx = this.game.add.graphics( 0,0 )
	gfx.lineStyle( 8, 0xffd900 );
	gfx.arc( this.x, this.y, this.shockDiameter / 2, 0, 90 );*/
},

//Gesture Callbacks

//Swipe + knockbacks, not functional at the moment
/*Player.prototype.swiped = function() {
	console.log( 'swiped' )
	this.swipeAttack();
},

Player.prototype.swipeAttack = function () {
	if ( this.swipeEnabled ) {

		this.swipeEnabled = false;
		this.isDashing = true;

		var angleToPointer = this.game.physics.arcade.angleToPointer( this );
		this.body.angle = angleToPointer;
		this.speed += 300;

		this.knockBack();

		this.resetSwipe()
	}
},

Player.prototype.knockBack = function () {
	var collidedOnDash;

	//This option will knock back all children, even if only one was hit
	
	this.body.onCollide.add( 
		function() {
			console.log( "detected collision" )
			for ( var i = 0; i < this.game.enemies.children.length; i++ ) {
				var currentEnemy = this.game.enemies.children[ i ]; //Convenience 
				console.log( "Player is dashing?\t", this.isDashing ); 
				if ( this.isDashing ) {
					console.log( "enemy\t", i )
					currentEnemy.knocked();
					currentEnemy.takeDamage( 5 );
				} 
			} 
		}, 
	this )
	

	//This option will only knock back the first child ( index 0 ), even if it wasn't hit
	for ( var i = 0; i < this.game.enemies.children.length; i++ ) {
		var currentEnemy = this.game.enemies.children[ i ]
		if ( this.isDashing ) {
			this.body.onCollide.add( 
				function() {
					console.log( "collision detected with\t", currentEnemy, " ", i )
					currentEnemy.knocked();
					currentEnemy.takeDamage( 5 );
					this.isDashing = false;
			
				}, 
			this )
		}
	} 
},

//After swipe finishes, reset speed and put cooldown on swipe
Player.prototype.resetSwipe = function() {
	this.game.time.events.add( 
		4000, //param 1 
		function() { //param 2
			console.log( "reset swipe" ),
			this.isDashing = false, 
			this.speed = inits.speed, 
			console.log( "swipe speed\t", this.speed ), 
			this.swipeEnabled = true; 

		}, 
		this //param 3
	)
},*/

Player.prototype.held = function() {
	console.log( 'held' );
	this.isShocking = true;
	this.isChanneling = true;
	this.channel();
},

Player.prototype.channel = function() {
	if ( this.isChanneling && this.isShocking ) {
		this.body.velocity.x = 0;
		this.body.velocity.y = 0;

/*		console.log( "I'm not moving!" );
    	console.log( "shock x y:\t", this.shockCircle.x, this.shockCircle.y );
    	console.log( "player x y:\t", this.x, this.y );*/

		this.shockAttack();
	}
},

Player.prototype.shockAttack = function() {
	//need to play with these
	if ( this.shockCircle.diameter < 400 ) {
		this.shockCircle.diameter += 10;
/*		console.log( "shock circle diameter:\t", this.shockCircle.diameter )*/

		for ( var i = 0; i < this.game.enemies.children.length; i++ ) {
			var currentEnemy = this.game.enemies.children[ i ]
			
			if ( this.shockCircle.contains( currentEnemy.x, currentEnemy.y ) ) {
				currentEnemy.getShocked = true;
				/*console.log( currentEnemy.getShocked );*/

				if ( currentEnemy.getShocked ) {
					currentEnemy.takeDamage( 1 );
				}

				currentEnemy.getShocked = false;

			}
		}
	
		this.takeDamage( .5 );
	}

	else {
		this.holdReset()
	}
},

Player.prototype.holdReset = function() {
	this.isShocking = false;
	this.shockCircle.diameter = inits.shockDiameter;
	this.isChanneling = false;
},

Player.prototype.doubleTapped = function () {
	if ( this.doubleTapCircle.contains( this.game.input.activePointer.x, this.game.input.activePointer.y ) && this.doubleTapEnabled ) {
		console.log( "double tap dispatched" )
		this.doubleTapEnabled = false;
		this.bombAttack();
	}
},

//Gesture callback game implementation
Player.prototype.bombAttack = function () {
	for ( var i = 0; i < this.game.enemies.children.length; i++ ) {
		var currentEnemy = this.game.enemies.children[ i ]
		if ( this.doubleTapCircle.contains( currentEnemy.x, currentEnemy.y ) ) {
			currentEnemy.fear();
		}
	}
	this.resetDoubleTap();
},

Player.prototype.resetDoubleTap = function() {
	this.game.time.events.add( 2000, function() { console.log( "DT reset" ), this.doubleTapEnabled = true }, this );	
},

/*
Player.prototype.end = function() {
	var endText = this.game.add.bitmapText( this.game.width / 2, this.game.height / 2, 'arcade', 'Game Over', 16 );
},
*/

Player.prototype.update = function() {
	this.checkDeath();
	this.stopSliding();

	if ( this.isShocking ) {
		this.shockAttack();
	}
	
}