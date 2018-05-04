//import PIXI from "expose-loader?PIXI!phaser-ce/build/custom/pixi.js";
//import Phaser from "expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js";

//import BootState from "imports-loader?this=>window!./states/Boot.js"
//import Player from "imports-loader?this=>window!./controllers/Player.js"

import 'pixi'
import Phaser from 'phaser'

//import BootState from './states/Boot.js'
import Player from './controllers/Player.js'

var game = new Phaser.Game(1280, 703, Phaser.AUTO, '', {
    preload: preload, 
    create: create, 
    update: update
});

var obstacles;
var player;

function preload() {
    this.stage.backgroundColor = '#eee',
    this.scale.pageAlignHorizontally = true,
    this.scale.pageAlignVertically = true,
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL,

    game.load.spritesheet( 'idle', '../../assets/sheet_hero_idle.png', 64, 64 ),
    game.load.spritesheet( 'wall', '../../assets/roguelike-cave-pack/Spritesheet/roguelikeDungeon_transparent.png', 16, 16 )
}

function create() {
    //Player Controller
    //===========================
    //Enable Physics on the world
    game.physics.startSystem( Phaser.Physics.ARCADE );
    game.physics.arcade.setBoundsToWorld();

    //Enable input
    game.inputEnabled = true;
    
    //create player
    player = new Player( game, game.world.centerX, game.world.centerY, 'idle' );
    game.add.existing( player ); //<--WILL NOT WORK WITHOUT
    game.physics.arcade.enable( player );
    
    console.log("player is\t", player); //TEST
    console.log("player body is\t", player.body); //TEST
    console.log("player body is enabled\t", player.body.enable); //TEST

    game.camera.follow( player );
    game.input.onDown.add( player.move, this );

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
    /*var hitObstacle = game.physics.arcade.collide( player, obstacles ); //needs to be tested
    if ( hitObstacle ) {
        console.log( "Hit!" );
    }

    var hitBounds = game.physics.arcade.collide( player, game.world.bounds );
    if ( hitBounds ) {
    	console.log( "Bounds!" )
    }*/

}