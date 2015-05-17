var RoundFailedScreen = function(game){
}
    
RoundFailedScreen.prototype = {
    init: function(){
        console.log("RoundOver Init");
        var numStarsCollected = 0;
        var maxStarsCollected = 0;
        var scoreStars = 0;
        var statusText = undefined;
        var stars;
        var buttonSound = undefined;
    },

    preload: function(){
        console.log("RoundOver preload");
        this.game.load.image('play', 'assets/play.png');
        game.world.setBounds(0, 0, 800, 450);

    },

    create: function(){
        console.log("RoundOver create");
        var bg = this.game.add.sprite(0, 0, 'skyLarge');
        bg.tint = 0x525252;
        var complete = this.game.add.sprite(game.world.width/2, 150, "levelfailed");
        complete.anchor.setTo(0.5, 0.5);
        
        var retryButton = this.game.add.button(300, game.world.height - 150, "retry", this.retryRound, this);
        retryButton.anchor.setTo(0.5, 0.5);
        var levelSelectButton = this.game.add.button(500, game.world.height - 150, "menu", this.levelSelect, this);
        levelSelectButton.anchor.setTo(0.5, 0.5);
    },

    retryRound: function(){
        this.buttonSound.play();
        this.numStarsCollected = 0;
        this.game.state.start("Game");
    },
    
    levelSelect: function(){
        this.buttonSound.play();
        this.numStarsCollected = 0;
        this.game.state.start("Level");
    }
}