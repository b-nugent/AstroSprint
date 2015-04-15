var IntroScreen = function(game){}
    
IntroScreen.prototype = {
    init: function(){
        console.log("Intro Init");
    },

    preload: function(){
        console.log("Intro preload");
        this.game.load.image('play', 'assets/play.png');
        this.game.load.image('next', 'assets/next.png');
        this.game.load.image('menu', 'assets/menu.png');
        this.game.load.image('retry', 'assets/retry.png');
        //this.game.load.image('quit', 'assets/quit.png');
        this.game.load.image('sky', 'assets/sky.png');
        this.game.load.image('wormhole', 'assets/wormhole.png');
        this.game.load.image('star', 'assets/star.png');
        this.game.load.image('darkstar', 'assets/darkstar.png');
        this.game.load.image('planet', 'assets/circle.png');
        this.game.load.image('levelcomplete', 'assets/levelcomplete.png');
        this.game.load.image('bigstar', 'assets/bigstar.png');
        this.game.load.image('logo', 'assets/logo.png');
        this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        this.game.load.text('level0','levels/level0.json');
    },

    create: function(){
        console.log("Intro create");
        var bg = this.game.add.sprite(0, 0, 'sky');
        bg.tint = 0x525252;
        var logo = this.game.add.sprite(game.world.width/2, 200, "logo");
        logo.anchor.setTo(0.5,0.5);
        var playButton = this.game.add.button(game.world.width/2, game.world.height - 200, "play", this.playGame, this);
        playButton.anchor.setTo(0.5, 0.5);
        /*
        var quitButton = this.game.add.button(game.world.width/2, game.world.height/2 - 100, "quit", this.shutdown, this);
        quitButton.anchor.setTo(0.5, 0.5);
        */
    },

    playGame: function(){
        this.game.state.start("Level");
    },
    shutdown: function(){
        console.log("intro state left");
        
    }
}