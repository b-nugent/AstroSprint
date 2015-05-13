var LevelScreen = function(game){
    this.levelCount = 0;
    this.buttons = undefined;
    this.titles = undefined;
    this.buttonSound = undefined;
    this.screenText = undefined;
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
        var bg = this.game.add.sprite(0, 0, 'sky');
        bg.tint = 0x525252;
        
        this.screenText = game.add.text(game.world.width/2, 100, 'Level Select', { font: "900 'Orbitron', sans-serif", fontSize: '45px', fill: '#e2fbb6' });
        this.screenText.anchor.setTo(0.5, 0.5);
        
        this.buttons = game.add.group();
        this.titles = game.add.group();
        
        for(var i = 0; i < this.levelCount; i++)
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
            
            var numStars = localStorage.getItem('level'+i+'_starCount');
                                                
            
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

    },

    playGame: function(button){
        this.buttonSound.play();
        this.game.state.states.Game.buttonSound = this.buttonSound;
        this.game.state.states.Game.currentLevel = button.level;
        this.game.state.start("Game");
    },
    shutdown: function(){
        
    }
}