var LevelScreen = function(game){}
    
LevelScreen.prototype = {
    init: function(){
        console.log("Level Init");
    },

    preload: function(){
        console.log("Level preload");
    },

    create: function(){
        console.log("level create");
        var bg = this.game.add.sprite(0, 0, 'sky');
        bg.tint = 0x525252;
        var level0Button = this.game.add.button(game.world.width/2, game.world.height/2, "play", this.playGame, this);
        level0Button.level = 0;
        level0Button.anchor.setTo(0.5, 0.5);

    },

    playGame: function(button){
        this.game.state.states.Game.currentLevel = button.level;
        this.game.state.start("Game");
    },
    shutdown: function(){
        console.log("Intro game state left");
        
    }
}