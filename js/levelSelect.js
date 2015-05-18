var GAME_MODES = Object.freeze({
  JOURNEY: 0,
  CHALLENGE: 1
});

var LevelScreen = function(game){
    this.journeylevelCount = 0;
    this.challengelevelCount = 0;
    this.buttons = undefined;
    this.titles = undefined;
    this.buttonSound = undefined;
    this.screenText = undefined;
    this.modeButton = undefined;
    this.backgroundMusic = undefined;
    this.mode = GAME_MODES.JOURNEY;
}
    
LevelScreen.prototype = {
    init: function(){
        console.log("Level Init");
    },

    preload: function(){
        console.log("Level preload");
        game.world.setBounds(0, 0, 800, 450);

    },

    create: function(){
        console.log("level create");
        var bg = this.game.add.sprite(0, 0, 'skyLarge');
        bg.tint = 0x525252;
        
        this.screenText = game.add.text(game.world.width/2, 100, 'Level Select', { font: "900 'Orbitron', sans-serif", fontSize: '45px', fill: '#e2fbb6' });
        this.screenText.anchor.setTo(0.5, 0.5);
        this.reload();
    },

    reload: function(){
        this.buttons = game.add.group();
        this.titles = game.add.group();

        this.loadLevels();
        if(this.mode == GAME_MODES.JOURNEY){
            this.modeButton = this.game.add.button(0, 0, "journey", this.switchMode, this);
        }
        if(this.mode == GAME_MODES.CHALLENGE){
             this.modeButton = this.game.add.button(0, 0, "challenge", this.switchMode, this);
        }
    },
    
    playGame: function(button){
        this.buttonSound.play();
        this.game.state.states.Game.buttonSound = this.buttonSound;
        this.game.state.states.Game.currentLevel = button.level;
        this.game.state.start("Game");
    },
    
    switchMode: function(){
        this.buttonSound.play();
        if(this.mode == GAME_MODES.JOURNEY){
            this.mode = GAME_MODES.CHALLENGE;
            this.backgroundMusic.stop();
            this.backgroundMusic = game.add.audio('challengeMusic', 1, true);
            this.backgroundMusic.play('', 0, 1, true);
        }
        else if(this.mode == GAME_MODES.CHALLENGE){
            this.mode = GAME_MODES.JOURNEY;
            this.backgroundMusic.stop();
            this.backgroundMusic = game.add.audio('journeyMusic', 1, true);
            this.backgroundMusic.play('', 0, 1, true);
        }
        this.modeButton.destroy();
        this.buttons.destroy();
        this.titles.destroy();
        this.reload();
    },
    
    shutdown: function(){
        
    },
    loadLevels: function(){
        var levelCount, storageText;
        if(this.mode == GAME_MODES.JOURNEY){
            levelCount = this.journeylevelCount;
            storageText = "journeyLevel";
        }
        if(this.mode == GAME_MODES.CHALLENGE){
            levelCount = this.challengelevelCount;
            storageText = "challengeLevel";
        }
        for(var i = 0; i < levelCount; i++)
        {
            var y = 200;
            
            if(i >= 5 && i < 10 )
            {
                y += 100;
            }
            else if (i >= 10)
            {
                y += 200;
            }
            var button = this.game.add.button(200 + (100 * (i % 5)), y, "level", this.playGame, this);
            button.level = i;
            button.anchor.setTo(0.5, 0.5);
            
            var title = game.add.text(button.x + 0.5, button.y - 2, '' + (button.level + 1), { font: "900 'Orbitron', sans-serif", fontSize: '32px', fill: '#e2fbb6' });
            title.anchor.setTo(0.5, 0.5);

            this.buttons.add(button);
            this.titles.add(title);
            
            var numStars = localStorage.getItem(storageText+i+'_starCount');
                                                
            
            for( var j = 0; j < 3; j++)
            {
                var spacing = 18;
                var scale = 0.65;
                var currentStar = this.buttons.create((button.x - spacing)+(j*spacing), (button.y + 20), 'star');
                if(j >= numStars)
                {
                    currentStar.tint = 0x333000;
                }
                currentStar.anchor.setTo(0.5, 0.5);
                currentStar.scale = new Phaser.Point(scale,scale);
            }
        }
        
        game.state.states.Game.mode = storageText;
        game.state.states.RoundOver.levelCount = levelCount;
        game.state.states.RoundOver.storageText = storageText;
    }
}