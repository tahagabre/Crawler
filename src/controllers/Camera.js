//Camera.js
//Not integrating for whatever reason, scrapping for now`


var inits = {
	speed: 100
};

export default function MainCamera( game, id, x, y, width, height ) {
	Phaser.Camera.call( this, game, id, x, y, width, height );
	this.game = game;
	//this.setPosition( x, y );
	//this.setSize( width, height );
	this.bounds = Phaser.Rectangle.clone( this.game.world.bounds );
	this.speed = inits.speed;
	this.follow( this.game.player, Phaser.Camera.FOLLOW_PLATFORMER, 0.1, 0,1 )
	//this.game.renderer.renderSession.roundPixels = true;
	//this.scale.setTo( 1 );
};

MainCamera.prototype = Object.create( Phaser.Camera.prototype );

MainCamera.prototype.constructor = MainCamera;

MainCamera.prototype.zoomTo = function( scale ) {
	var bounds = this.bounds,
		cameraBounds = this.game.camera.bounds;

	cameraBounds.x = bounds.width * ( 1 - scale ) / 2;
	cameraBounds.y = bounds.height * ( 1 - scale ) / 2;
	cameraBounds.width = bounds.width * scale;
	cameraBounds.height = bounds.height * scale;
},

MainCamera.prototype.getSpeed = function() {
	return this.speed
},

MainCamera.prototype.setSpeed = function( newSpeed ) {
	this.speed = newSpeed
},

MainCamera.prototype.move = function() { /*Update function*/ },

MainCamera.prototype.create = function() {},

MainCamera.prototype.update = function() {
	
}