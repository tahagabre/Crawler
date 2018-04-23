import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'

var game = new Phaser.Game(600, 600, Phaser.AUTO, '', {
    preload: preload, 
    create: create, 
    update: update
});

var player;
var obstacles;

function preload() {
    /*game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#eee';*/

    /*game.load.spritesheet('player', '../assets/sheet_hero_idle.png', 64, 64);

    game.load.spritesheet('wall', '../assets/roguelike-cave-pack/Spritesheet/roguelikeDungeon_transparent.png', 16, 16);*/
}

function create() {

	console.log( game.world.bounds );
    //Player Controller
    //===========================
    //Enable Physics on the world
    game.physics.startSystem( Phaser.Physics.ARCADE );
    //Enable input
    game.inputEnabled = true;

    //Create instance of player
    //player = new Player("Wok");
    //wall = new Wall(100, 100);

    //Create sprite, animation and play
    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    player.collideWorldBounds = true;

    //Set the center of the player as reference to position
    player.anchor.x = 0.5;
    player.anchor.y = 0.5;
    
    var idle = player.animations.add( 'idle' );
    player.animations.play('idle', 10, true);

    game.camera.follow( player );

    //Enable player's physics
    game.physics.arcade.enable(player);

    //Move player toward taps
    game.input.onDown.add( move, this );

    //Obstacle Controller
    //==============================

    //Create group for things that are unpassable
    obstacles = game.add.group();
    obstacles.enableBody = true;

    //create wall in obstacles group
    var wall = obstacles.create( 10, 10, 'wall' );
    wall.body.immovable = true;
}
    
function update() {
    var hitObstacle = game.physics.arcade.collide(player, obstacles); //needs to be tested
    if ( hitObstacle ) {
        console.log( "Hit!" );
    }

    var hitBounds = game.physics.arcade.collide(player, game.world.bounds);
    if ( hitBounds ) {
    	console.log( "Bounds!" )
    }

}
//perhaps change acceleration to -.25?
function move(){
    //console.log("Player Position is \n{ ", player.body.position.x, ", ", player.body.position.y, " }");
    game.camera.follow();
	game.physics.arcade.moveToPointer( player, 500 );
	//console.log("Player acceleration is \n{ ", player.body.acceleration.x, ", ", player.body.acceleration.y, " }")
	//console.log("Player velocity is \n{ ", player.body.velocity.x, ", ", player.body.velocity.y, " }")
	console.log(game.input.x, game.input.y);
}