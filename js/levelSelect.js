var LevelScreen = function(game){
    this.levelCount = 0;
    this.buttons = undefined;
    this.titles = undefined;
    this.buttonSound = undefined;
}
    
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
        
        this.buttons = game.add.group();
        this.titles = game.add.group();
        
        for(var i = 0; i < this.levelCount; i++)
        {
            var button = this.game.add.button(200 + (100 * i), game.world.height/2, "level", this.playGame, this);
            button.level = i;
            button.anchor.setTo(0.5, 0.5);
            
            var title = game.add.text(button.x + 0.5, button.y + 2, '' + button.level, { font: "900 'Orbitron', sans-serif", fontSize: '32px', fill: '#e2fbb6' });
            title.anchor.setTo(0.5, 0.5);

            this.buttons.add(button);
            this.titles.add(title);
        }

    },

    playGame: function(button){
        this.buttonSound.play();
        this.game.state.states.Game.buttonSound = this.buttonSound;
        this.game.state.states.Game.currentLevel = button.level;
        this.game.state.start("Game");
    },
    shutdown: function(){
        console.log("Intro game state left");
        
    }
}