import 'pixi'
import Phaser from 'phaser'

import BootState from './states/Boot.js'
import InGameState from './states/InGameState.js'

var game = new Phaser.Game( 800, 600, Phaser.AUTO, '');
var bootState = new BootState( game );
var inGameState = new InGameState( game );

game.state.add( 'BootState', bootState )
game.state.add( 'InGameState', inGameState )

game.state.start( 'BootState' )