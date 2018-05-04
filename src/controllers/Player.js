//Player Controller
//import Phaser from 'phaser';

export default function Player( game, x, y, spriteKey ) {
	Phaser.Sprite.call( this, game, x, y, spriteKey),
	this.anchor.setTo( 0.5 ),
	this.inputEnabled = true,
	this.animations.add( 'idle' ),
	this.animations.play( 'idle', 10, true ), 
	this.alive = true,
	console.log( "this is\t", this ),
	console.log("this' animations class is\t", this.animations)
};

Player.prototype = Object.create( Phaser.Sprite.prototype );

Player.prototype.constructor = Player;

console.log( this );

Player.prototype.addAnim = function( animKey ) {
	this.animations.add( animKey )
},

Player.prototype.playAnim = function( key, speed, loop ) {
	this.animations.play( key, speed, loop )
},

Player.prototype.move = function() {
    console.log( "Player body:\t", this.body ) //TEST returns undefined
}