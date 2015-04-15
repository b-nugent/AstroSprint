var RoundOverScreen = function(game){}
    
RoundOverScreen.prototype = {
    init: function(){
        console.log("RoundOver Init");
        var numStarsCollected = 0;
        var statusText = undefined;
    },

    preload: function(){
        console.log("RoundOver preload");
        this.game.load.image('play', 'assets/play.png');
        this.statusText = game.add.text(game.world.width/2, game.world.height/2, 'You collected ' + this.numStarsCollected + ' stars this round!', { 
            fontSize: '32px', fill: '#FFCC00' 
        });
        this.statusText.anchor.setTo(0.5, 0.5);
        //this.game.load.image('retry', 'assets/retry.png');
        //this.game.load.image('next', 'assets/next.png');
        //this.game.load.image('levels', 'assets/levelSelect.png');
        
    },

    create: function(){
        console.log("RoundOver create");
        var bg = this.game.add.sprite(0, 0, 'sky');
        bg.tint = 0x525252;
        var complete = this.game.add.sprite(game.world.width/2, 200, "levelcomplete");
        complete.anchor.setTo(0.5, 0.5);
        var retryButton = this.game.add.button(150, game.world.height - 200, "retry", this.retryRound, this);
        retryButton.anchor.setTo(0.5, 0.5);
        var nextButton = this.game.add.button(400, game.world.height - 200, "next", this.nextRound, this);
        nextButton.anchor.setTo(0.5, 0.5);
        var levelSelectButton = this.game.add.button(650, game.world.height - 200, "menu", this.levelSelect, this);
        levelSelectButton.anchor.setTo(0.5, 0.5);
        /*
        var quitButton = this.game.add.button(game.world.width/2, game.world.height/2 - 100, "quit", this.shutdown, this);
        quitButton.anchor.setTo(0.5, 0.5);
        */
    },

    retryRound: function(){
        this.numStarsCollected = 0;
        this.game.state.start("Game");
    },
    nextRound: function(){
        this.game.state.states.Game.currentLevel++;
        this.numStarsCollected = 0;
        this.game.state.start("Game");
    },
    levelSelect: function(){
        this.numStarsCollected = 0;
        this.game.state.start("Level");
    }
}