import 'pixi'
import 'p2'
import Phaser from 'phaser'

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload, 
    create: create, 
    update: update
});

var player;
var obstacles;

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#eee';

    game.load.spritesheet('player', '../assets/sheet_hero_idle.png', 64, 64);

    game.load.spritesheet('wall', '../assets/roguelike-cave-pack/Spritesheet/roguelikeDungeon_transparent.png', 16, 16);
}

function create() {

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
    if ( hitObstacle ){
        console.log( "Hit!" );
    }

}

function move(){
    console.log("Player Position is \n{ ", player.body.position.x, ", ", player.body.position.y, " }");
    game.camera.follow();
    game.physics.arcade.moveToPointer( player, 500 );
    //console.log("You tapped \n{ ", game.input.x, ", ", game.input.y, " }");
    if ( player.body.position.x == game.input.activePointer.screenX ) {//&& player.body.position.y == game.input.pointer.y ){
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        console.log("Reset!");
    }
}