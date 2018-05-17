import 'pixi'
import Phaser from 'phaser'

import Player from './controllers/Player.js'
import Enemy from './controllers/Enemy.js'
//import 'hammer-timejs';

var game = new Phaser.Game( 1300, 1000, Phaser.AUTO, '', {
    preload: preload, 
    create: create, 
    update: update,
    render: render
});

var obstacles,
    player,
    map,
    layer,
    LERP = 0.1;

function preload() {
    //player sprite
    game.load.spritesheet( 'idle', '../../assets/sheet_hero_idle.png', 64, 64 );
    //game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //enemy
    game.load.image( 'enemy', '../../assets/ball.png' );

    //BG
    game.load.tilemap( 'test', '../../assets/maps/test.json', null, Phaser.Tilemap.TILED_JSON );
    game.load.image( 'tiles', '../../assets/maps/test.png' );
}

function create() {
    //Background
    map = game.add.tilemap( 'test', 8 , 8 );
    map.addTilesetImage( 'testSet', 'tiles');

    //layer = map.createLayer( 'dark bg' );
    //layer.resizeWorld();
    //layer.wrap = true;

    //Enable Physics on the world
    game.physics.startSystem( Phaser.Physics.ARCADE );
    game.physics.arcade.setBoundsToWorld();

    //Enable game input
    game.inputEnabled = true;

    console.log( this.game.parent );

    /*$( this.game.parent ).hammer().on( 'tap', function( ev ) {
        console.log( ev );
    })*/

    /*this.game.gestures = new Gesture( this.game );
    this.gestures.onTap.add( this.tapped, this );
    this.gestures.onHold.add( this.holded, this );
    this.gestures.onSwipe.add( this.swiped, this );*/

    //create player
    this.game.player = new Player( game, game.rnd.integerInRange( 0, this.game.width ), game.rnd.integerInRange( 0, this.game.height ),/*this.world.centerX - 200, this.world.centerY + 200,*/ 'idle' ); 

    this.game.enemies = game.add.group();
    this.game.enemies.classType = Enemy;
    //COME BACK, push for each
    for ( var i = 0; i <= 2; i++ ) {
        if ( this.game.player.x > this.game.width / 2 && this.game.player.y > this.game.height / 2 ) {
            this.game.enemies.create( game.rnd.integerInRange( 0, this.game.player.x - 200 ), game.rnd.integerInRange( 0, this.game.player.y - 200 ), 'enemy' );
        }

        else if ( this.game.player.x < this.game.width / 2 && this.game.player.y > this.game.height / 2 ) {
            this.game.enemies.create( game.rnd.integerInRange( this.game.player.x + 200, this.game.width ), game.rnd.integerInRange( 0, this.game.player.y - 200), 'enemy' );
        }

        else if ( this.game.player.x > this.game.width / 2 && this.game.player.y < this.game.height / 2 ) {
            this.game.enemies.create( game.rnd.integerInRange( 0, this.game.player.x - 200 ), game.rnd.integerInRange( this.game.player.y, this.game.height ), 'enemy' );
        }

        else {
            this.game.enemies.create( game.rnd.integerInRange( this.game.player.x + 200, this.game.width ), game.rnd.integerInRange( this.game.player.y + 200, this.game.height ), 'enemy' );
        }
    }
    
    //follow player
    this.game.camera.follow( this.game.player );
    game.renderer.renderSession.roundPixels = true;

    //Obstacle Controller
    //==============================

    //Create group for things that are unpassable
    obstacles = game.add.group();
    obstacles.enableBody = true;

    //create wall in obstacles group
    /*
    var wall = obstacles.create( 0, 0, 'wall' );
    wall.body.immovable = true;
    */
}
    
function update() {

    this.game.player.stopSliding(),

    //not functional, need some way to automate this
    this.game.enemies.children[ 0 ].move(),
    this.game.enemies.children[ 1 ].move(),
    this.game.enemies.children[ 2 ].move(),

    this.game.physics.arcade.collide( this.game.player, this.game.enemies ),
    this.game.player.checkDeath()
/*
    this.game.gestures.update()*/
}

//For debug
function render() {}