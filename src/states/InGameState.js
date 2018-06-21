//InGameState.js

import Level from '../managers/level.js'
import Player from '../controllers/Player.js'
import Enemy from '../controllers/Enemy.js'
import Gesture from '../managers/gesture.js'
import MainCamera from '../controllers/Camera.js'

var obstacles,
    map,
    layer;

export default function InGameState( game ) {
  Phaser.State.call( this );
  this.game = game;
}

InGameState.prototype = Object.create( Phaser.State.prototype );

InGameState.prototype.constructor = InGameState;

InGameState.prototype.preload = function() {},

InGameState.prototype.create = function() {

    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //Enable Physics on the world
    this.game.physics.startSystem( Phaser.Physics.ARCADE );

    //Camera
    this.game.world.setBounds( 0, 0, 1600, 1600 );

    this.game.physics.arcade.setBoundsToWorld();

    //Enable game input
    this.game.inputEnabled = true;

    //create player
    this.game.player = new Player( this.game, this.game.world.centerX, this.game.world.centerY + 400, 'player' );
    this.game.test = new Enemy( this.game, this.game.player.x, this.game.player.y, 'enemy' );

    //Add and enable touch gestures
    this.game.gestures = new Gesture( this.game );    

    //this.game.gestures.onSwipe.add( this.game.player.swiped, this.game.player ),
    this.game.gestures.onHold.add( this.game.player.held, this.game.player ),
    this.game.gestures.onDoubleTap.add( this.game.player.doubleTapped, this.game.player ),

    //create enemy group, set group children = Enemy
    this.game.enemies = this.game.add.group();
    this.game.enemies.classType = Enemy;
    this.game.enemies.enableBody = true;

    //COME BACK, push for each
    for ( var i = 0; i <= 2; i++ ) {
        if ( this.game.player.x > this.game.width / 2 && this.game.player.y > this.game.height / 2 ) {
            this.game.enemies.create( this.game.rnd.integerInRange( 0, this.game.player.x - 200 ), this.game.rnd.integerInRange( 0, this.game.player.y - 200 ), 'enemy' );
        }

        else if ( this.game.player.x < this.game.width / 2 && this.game.player.y > this.game.height / 2 ) {
            this.game.enemies.create( this.game.rnd.integerInRange( this.game.player.x + 200, this.game.width ), this.game.rnd.integerInRange( 0, this.game.player.y - 200), 'enemy' );
        }

        else if ( this.game.player.x > this.game.width / 2 && this.game.player.y < this.game.height / 2 ) {
            this.game.enemies.create( this.game.rnd.integerInRange( 0, this.game.player.x - 200 ), game.rnd.integerInRange( this.game.player.y, this.game.height ), 'enemy' );
        }

        else {
            this.game.enemies.create( this.game.rnd.integerInRange( this.game.player.x + 200, this.game.width ), this.game.rnd.integerInRange( this.game.player.y + 200, this.game.height ), 'enemy' );
        }
    }

    //Obstacle Controller
    //==============================

    //Create group for things that are unpassable
    obstacles = this.game.add.group();
    obstacles.enableBody = true;

    console.log( "InGameState Successfully Loaded" )
},

InGameState.prototype.placeRooms = function() {
  //Access this.game.rooms object and place rooms based on dimensions, coords, doors, chests, enemies, etc.
},

InGameState.prototype.update = function() {
    this.game.camera.x = this.game.player.x - 400,
    this.game.camera.y = this.game.player.y - 300,
    this.game.gestures.update(),
    
    this.game.physics.arcade.collide( this.game.player, this.game.enemies )

},

InGameState.prototype.render = function() {
  this.game.debug.cameraInfo( this.game.camera, 32, 32 )
}