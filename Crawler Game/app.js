var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload, 
	create: create, 
    update: update
});
   
var player;

function preload() {
    game.load.image('player', 'assets/ball.png');
	console.log("create Finished");
}

function create() {
	player = game.add.sprite(500, 1000, 'player');

}   
function update() {}

alert("works")