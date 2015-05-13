var RoundOverScreen = function(game){
    this.levelCount = 0;
    this.lastLevel = 0;
}
    
RoundOverScreen.prototype = {
    init: function(){
        console.log("RoundOver Init");
        var numStarsCollected = 0;
        var maxStarsCollected = 0;
        var scoreStars = 0;
        var statusText = undefined;
        var stars = undefined;
        var buttonSound = undefined;
    },

    preload: function(){
        console.log("RoundOver preload");
        /*
        this.game.load.image('play', 'assets/play.png');
        
        this.statusText = game.add.text(game.world.width/2, game.world.height/2, 'You collected ' + this.numStarsCollected + ' stars this round!', { 
            fontSize: '32px', fill: '#FFCC00' 
        });
        this.statusText.anchor.setTo(0.5, 0.5);
        this.game.load.image('retry', 'assets/retry.png');
        this.game.load.image('next', 'assets/next.png');
        this.game.load.image('levels', 'assets/menu.png');
        */
    },

    create: function(){
        console.log("RoundOver create");
        var bg = this.game.add.sprite(0, 0, 'sky');
        bg.tint = 0x525252;
        var complete = this.game.add.sprite(game.world.width/2, 200, "levelcomplete");
        complete.anchor.setTo(0.5, 0.5);
        if(this.lastLevel == this.levelCount-1)
        {
            var retryButton = this.game.add.button(300, game.world.height - 200, "retry", this.retryRound, this);
            retryButton.anchor.setTo(0.5, 0.5);
            var levelSelectButton = this.game.add.button(500, game.world.height - 200, "menu", this.levelSelect, this);
            levelSelectButton.anchor.setTo(0.5, 0.5);
        }
        else{
            var retryButton = this.game.add.button(200, game.world.height - 200, "retry", this.retryRound, this);
            retryButton.anchor.setTo(0.5, 0.5);
            var nextButton = this.game.add.button(400, game.world.height - 200, "next", this.nextRound, this);
            nextButton.anchor.setTo(0.5, 0.5);
            var levelSelectButton = this.game.add.button(600, game.world.height - 200, "menu", this.levelSelect, this);
            levelSelectButton.anchor.setTo(0.5, 0.5);
        }

        this.stars = this.game.add.group();
        var scorePercent = this.numStarsCollected/this.maxStarsCollected;
        console.log(scorePercent);
        for(var i = 0; i < 3; i++){
            var currentStar = this.stars.create(((game.world.width-188)/2)+(i*94), 255, 'bigstar');
            switch(i){
                case 0:
                    if(scorePercent < .333)
                        currentStar.tint = 0x333000;
                    break;
                case 1:
                    if(scorePercent < .666)
                        currentStar.tint = 0x333000;
                    break;
                case 2:
                    if(scorePercent < 1)
                        currentStar.tint = 0x333000;
                    break;
                default:
                    break;
            }
            currentStar.anchor.setTo(0.5, 0.5);
            
        }
        
        
        //local storage check
        var localStarsCollected = localStorage.getItem('level'+this.lastLevel+'_starCount');
        if(this.numStarsCollected > localStarsCollected)
        {
            localStorage.setItem('level'+this.lastLevel+'_starCount', this.numStarsCollected);
        }
    },

    retryRound: function(){
        this.buttonSound.play();
        this.numStarsCollected = 0;
        this.game.state.start("Game");
    },
    
    nextRound: function(){
        this.buttonSound.play();
        this.game.state.states.Game.currentLevel++;
        this.numStarsCollected = 0;
        this.game.state.start("Game");
    },
    
    levelSelect: function(){
        this.buttonSound.play();
        this.numStarsCollected = 0;
        this.game.state.start("Level");
    }
}