//Boot State

var atlasToLoad = {
	player: {
		playerIdle: '../../assets/sheet_hero_idle.png', 
		playerHurt: '../../assets/sheet_hero_hurt.png', 
		playerDead: '../../assets/sheet_hero_dead.png', 
		playerStab: '../../assets/sheet_hero_stab.png'
	},
	enemy: {
		enemyFly: '../../assets/sheet_bat_fly.png',
		enemyHurt: '../../assets/sheet_bat_hurt.png'
	}
};

export default function BootState( game ) {
	Phaser.State.call( this );
	this.game = game;
};

BootState.prototype = Object.create( Phaser.State.prototype );

BootState.prototype.constructor = BootState;

/*BootState.prototype.loadAnims = function() {

	//test
	this.game.load.image( 'test', '../../assets/test.png' );

	//Load player animations
	for ( var key in atlasToLoad.player ) {
		if ( spritesheetsToLoad.player.hasOwnProperty( key ) ) {
			this.game.load.spritesheet( key, spritesheetsToLoad.player[ key ], 64, 64 )
		}
	}

	for ( var key in imagesToLoad.player ) {
		if ( imagesToLoad.player.hasOwnProperty( key ) ) {
			this.game.load.image( key, imagesToLoad.player[ key ], 32, 32 )
		}
	}

	//Load enemy animations
	for ( var key in spritesheetsToLoad.enemy ) {
		if ( spritesheetsToLoad.enemy.hasOwnProperty( key ) ) {
			this.game.load.spritesheet( key, spritesheetsToLoad.enemy[ key ], 31, 30 )
		}
	}
},*/

BootState.prototype.preload = function() {
    //this.loadAnims();

	//test
	this.game.load.image( 'test', '../../assets/test.png' );

    this.game.load.atlas( 'player', '../../assets/atlas/player.png', '../../assets/atlas/player.json' );
    this.game.load.atlas( 'enemy', '../../assets/atlas/enemy.png', '../../assets/atlas/enemy.json' );
},

BootState.prototype.create = function() {

	console.log( "Game Booted Successfully" )
	this.game.state.start( 'level' );
},

BootState.prototype.update = function() {}