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
	this.speed = 200,
	this.stunned = false,
	this.immune = false,
	this.alive = true,
	this.swipeDistance = 50;
	this.attackEnabled = true,
	this.doubleTapEnabled = true,
	this.proxDiameter = 400,
	this.doubleTapDiameter = 50,
	this.proximity = new Phaser.Circle( this.x, this.y, this.proxDiameter ),
	this.doubleTapCircle = new Phaser.Circle( this.x, this.y, this.doubleTapDiameter ),
	this.isSwiping = false,
	this.explosionCircle = this.doubleTapCircle,
	this.animations.add( spriteKey ),
	this.animations.play( spriteKey, 10, true ),
	game.add.existing( this )
};

Player.prototype = Object.create( Phaser.Sprite.prototype );

Player.prototype.constructor = Player;

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

Player.prototype.knockBack = function () {
	this.speed = -this.speed;
	console.log( this.speed );
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
	console.log( this.speed );
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

Player.prototype.listenProximity = function() {

},

Player.prototype.listenDoubleTap = function() {
	if ( this.doubleTapEnabled && this.game.input.activePointer.msSinceLastClick < this.game.input.doubleTapRate && this.proximity.contains( this.game.input.activePointer.x, this.game.input.activePointer.y ) ) {
		console.log( "double Tap" );
		this.moveEnabled = false;
		this.bombAttack();
		this.doubleTapEnabled = false;
	}
	this.resetDoubleTap();
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

/*Player.prototype.swipeAttack = function () {
	console.log( 'swiped!');
	this.isSwiping = true;
	this.moveEnabled = false;
	this.speed = 800

	if ( this.isSwiping ) {
		if ( this.x > this.game.input.activePointer.x && this.y > this.game.input.activePointer.y ) {
			this.body.velocity.x = -this.game.input.activePointer.x,
			this.body.velocity.y = this.game.input.activePointer.y
        }

        else if ( this.x < this.game.input.activePointer.x && this.y > this.game.input.activePointer.y ) {
            this.body.velocity.x = this.game.input.activePointer.x,
			this.body.velocity.y = this.game.input.activePointer.y
        }

        else if ( this.x > this.game.input.activePointer.x && this.y < this.game.input.activePointer.y ) {
            //this.game.enemies.create( game.rnd.integerInRange( 0, this.game.player.x - 200 ), game.rnd.integerInRange( this.game.player.y, this.game.height ), 'enemy' );
        }

        else {
            //this.game.enemies.create( game.rnd.integerInRange( this.game.player.x + 200, this.game.width ), game.rnd.integerInRange( this.game.player.y + 200, this.game.height ), 'enemy' );
        }

        this.manageFacing();

		if ( this.body.onCollide ) { // OR DISTANCE HAS BEEN REACHED ) {
			this.isSwiping = false;
			this.moveEnabled = true;
			this.speed = 200;
			//this.game.enemy.knockBack()
		}
	}
},*/

/*Player.prototype.resetSpeed = function() {
	this.speed = 200;
},*/

Player.prototype.bombAttack = function () {

	for ( var i = 0; i < this.game.enemies.children.length; i++ ) {
		if ( this.explosionCircle.contains( this.game.enemies.children[ i ].x, this.game.enemies.children[ i ].y ) ) {
			this.game.enemies.children[ i ].x += 100
			/*if ( this.game.enemies.children[ i ].x > this.x && this.game.enemies.children[ i ] > this.y ) {
				this.game.enemies.children[ i ].x += 100,
				this.game.enemies.children[ i ].y += 100
			}

			else if ( this.game.enemies.children[ i ].x < this.x && this.game.enemies.children[ i ] > this.y ) {
				this.game.enemies.children[ i ].x -= 100,
				this.game.enemies.children[ i ].y += 100
			}

			else if ( this.game.enemies.children[ i ].x > this.x && this.game.enemies.children[ i ] < this.y ) {
				this.game.enemies.children[ i ].x += 100,
				this.game.enemies.children[ i ].y -= 100
			}

			else {
				this.game.enemies.children[ i ].x -= 100,
				this.game.enemies.children[ i ].y -= 100
			}*/
		}
	}
},

Player.prototype.manageFacing = function() {
	if ( this.game.input.activePointer.x < this.x ) {
		this.scale.setTo( -1, 1 );
	}

	else {
		this.scale.setTo( 1, 1 );
	}
}