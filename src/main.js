import 'pixi'
import Phaser from 'phaser'

import Player from './controllers/Player.js'
import Enemy from './controllers/Enemy.js'
import Gesture from './managers/gesture.js'

var game = new Phaser.Game( 1300, 1000, Phaser.AUTO, '', {
    preload: preload, 
    create: create, 
    update: update,
    render: render
} );

var obstacles,
    map,
    layer,
    LERP = 0.1;

function preload() {
    //player sprite
    game.load.spritesheet( 'idle', '../../assets/sheet_hero_idle.png', 64, 64 );
    //game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //enemy
    game.load.spritesheet( 'enemy', '../../assets/sheet_bat_fly.png', 32, 32 );

    //BG
    game.load.tilemap( 'test', '../../assets/maps/test.json', null, Phaser.Tilemap.TILED_JSON );
    game.load.image( 'tiles', '../../assets/maps/test.png' );
}

function create() {
    //Background
    map = game.add.tilemap( 'test', 8 , 8 );
    map.addTilesetImage( 'testSet', 'tiles' );

    //layer = map.createLayer( 'dark bg' );
    //layer.resizeWorld();
    //layer.wrap = true;

    //Enable Physics on the world
    game.physics.startSystem( Phaser.Physics.ARCADE );
    game.physics.arcade.setBoundsToWorld();

    //Enable game input
    game.inputEnabled = true;

    //create player
    this.game.player = new Player( game, /*FOR TESTING: game.rnd.integerInRange( 0, this.game.width ), game.rnd.integerInRange( 0, this.game.height ),*/this.world.centerX - 200, this.world.centerY + 200, 'idle' );

    //Add and enable touch gestures
    this.game.gestures = new Gesture( this );    

    this.game.gestures.onSwipe.add( this.game.player.swiped, this.game.player ),
    this.game.gestures.onHold.add( this.game.player.held, this.game.player ),
    this.game.gestures.onDoubleTap.add( this.game.player.doubleTapped, this.game.player ),

    //create enemy group, set group children = Enemy
    this.game.enemies = game.add.group();
    this.game.enemies.classType = Enemy;
    this.game.enemies.enableBody = true;

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

    //TEST for enemy w/o group    
    //this.game.enemy = new Enemy( game, game.width / 2, game.height / 2, 'enemy' )

    //follow player
    //STILL BUGGED
    this.game.camera.follow( this.game.player );
    game.renderer.renderSession.roundPixels = true;

    //Obstacle Controller
    //==============================

    //Create group for things that are unpassable
    obstacles = game.add.group();
    obstacles.enableBody = true;
}

function moveEnemies() {
    for ( var i = 0; i < game.enemies.children.length; i++ ) {
        game.enemies.children[ i ].move()
    }
}

function update() {

    this.game.player.checkDeath(),
    this.game.player.stopSliding(),
    moveEnemies(),

    console.log( "update", this.game.player.speed )

    //not functional, need some way to automate this

    this.game.player.updateProximity();
    this.game.player.updateDoubleTapCircle();

    this.game.physics.arcade.collide( this.game.player, this.game.enemies ),

    this.game.gestures.update()
}

//For debug
function render() {}