import Phaser from 'phaser'
import WebFont from 'webfontloader'
import config from '../config';

export default class extends Phaser.State {
  init() {
  this.stage.backgroundColor = '#EDEEC9'
  this.fontsReady = false
  this.fontsLoaded = this.fontsLoaded.bind(this)
  }

  preload() {
    if (config.webfonts.length) {
      WebFont.load({
        google: {
          families: config.webfonts
        },
        active: this.fontsLoaded
      })
    }

    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#dddddd', align: 'center' })
    text.anchor.setTo(0.5, 0.5)

    this.load.spritesheet('player', '../../assets/sheet_hero_idle.png', 64, 64);

    this.load.spritesheet('wall', '../../assets/roguelike-cave-pack/Spritesheet/roguelikeDungeon_transparent.png', 16, 16);
  }
}

  /*render() {
    if (config.webfonts.length && this.fontsReady) {
      this.state.start('Splash')
    }
    if (!config.webfonts.length) {
      this.state.start('Splash')
    }
  }*/
