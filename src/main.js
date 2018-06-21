import 'pixi'
import Phaser from 'phaser'

import BootState from './states/Boot.js'
import InGameState from './states/InGameState.js'
import Level from './managers/level.js'

var game = new Phaser.Game( 1500, 1500, Phaser.AUTO, '');
var bootState = new BootState( game );
var inGameState = new InGameState( game );
var level = new Level( game )

game.state.add( 'BootState', bootState )
game.state.add( 'InGameState', inGameState )
game.state.add( 'level', level )

game.state.start( 'BootState' )