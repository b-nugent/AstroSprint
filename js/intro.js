var IntroScreen = function(game){
    this.loadText = undefined;
    this.levelCount = 0;
}
    
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
        this.game.load.image('level', 'assets/levelicon.png');
        this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        
        // Journey mode background music from: https://www.freeplaymusic.com
        this.game.load.audio('backgroundMusic', 'assets/audio/journey_mode_audio.mp3');
        // Jump sound from: http://soundbible.com/1343-Jump.html
        this.game.load.audio('jumpSound', 'assets/audio/jump_audio.mp3');
        // Wormhole sound from: http://soundbible.com/1639-Power-Up.html
        this.game.load.audio('wormholeSound', 'assets/audio/wormhole_audio.mp3');
        // Star sound from: http://soundbible.com/1744-Shooting-Star.html
        this.game.load.audio('starSound', 'assets/audio/star_audio.mp3');
        // Round complete sound from: http://www.freesound.org/people/Kastenfrosch/sounds/162467/
        this.game.load.audio('completeSound', 'assets/audio/complete_audio.mp3');
        // Button sound from: http://www.freesound.org/people/GameAudio/sounds/220206/ 
        this.game.load.audio('buttonSound', 'assets/audio/button_audio.wav');
        // Blackhole sound from: http://www.freesound.org/people/Andromadax24/sounds/178349/
        this.game.load.audio('blackholeSound', 'assets/audio/blackhole_audio.wav');
        // Oxygen sound from: http://www.freesound.org/people/ThompsonMan/sounds/237245/
        this.game.load.audio('oxygenSound', 'assets/audio/oxygen_audio.wav');
        // Breath sound from: http://www.freesound.org/people/doctorvortex/sounds/190140/
        this.game.load.audio('breathSound', 'assets/audio/breath_audio.wav');
        
        this.backgroundMusic = undefined;
        this.buttonSound = undefined;
        
        if(!localStorage.getItem('accessed'))
        {
            this.populateLevelData();
        }
        else{
            debugger;
        }
        
        for(var i = 0; i < this.levelCount; i++){
            this.game.load.text('level' + i,'levels/level'+i+'.json');
        }
    },

    create: function(){
        console.log("Intro create");
        var bg = this.game.add.sprite(0, 0, 'sky');
        bg.tint = 0x525252;
        var logo = this.game.add.sprite(game.world.width/2, 200, "logo");
        logo.anchor.setTo(0.5,0.5);
        
        // Loading the background music.
        this.backgroundMusic = game.add.audio('backgroundMusic', 1, true);
        this.backgroundMusic.play('', 0, 1, true);
        
        var playButton = this.game.add.button(game.world.width/2, game.world.height - 200, "play", this.playGame, this);
        playButton.anchor.setTo(0.5, 0.5);
        
        this.loadText = game.add.text(-100, -100, 'If you can read this, hi', { font: "900 'Orbitron', sans-serif", fontSize: '12px', fill: '#e2fbb6' });
        /*
        var quitButton = this.game.add.button(game.world.width/2, game.world.height/2 - 100, "quit", this.shutdown, this);
        quitButton.anchor.setTo(0.5, 0.5);
        */
        this.buttonSound = game.add.audio('buttonSound');
        
        
    },

    playGame: function(){
        this.buttonSound.play();
        this.game.state.states.Level.buttonSound = this.buttonSound;
        this.game.state.start("Level");
    },
    shutdown: function(){
        console.log("intro state left");
        
    },
    
    populateLevelData: function(){
        for(var i = 0; i < this.levelCount; i++)
        {
            localStorage.setItem('level'+i+'_starCount', 0);
        }
        
        localStorage.setItem('accessed', true);
    }
}