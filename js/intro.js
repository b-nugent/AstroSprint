var IntroScreen = function(game){
    this.loadText = undefined;
    this.journeylevelCount = 0;
    this.challengelevelCount = 0;
}
    
IntroScreen.prototype = {
    init: function(){
        console.log("Intro Init");
    },

    preload: function(){
        //  This sets a limit on the up-scale
        game.scale.maxWidth = 1200;
        game.scale.maxHeight = 675;

        //  Then we tell Phaser that we want it to scale up to whatever the browser can             handle, but to do it proportionally
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.setScreenSize();
        //game.stage.scale.pageAlignHorizontally = true;
       // game.stage.scale.pageAlignVeritcally = true;
        //game.stage.scale.refresh();
        console.log("Intro preload");
        this.game.load.image('play', 'assets/play.png');
        this.game.load.image('next', 'assets/next.png');
        this.game.load.image('menu', 'assets/menu.png');
        this.game.load.image('retry', 'assets/retry.png');
        //this.game.load.image('quit', 'assets/quit.png');
        this.game.load.image('sky', 'assets/sky.png');
        this.game.load.image('skyLarge', 'assets/sky2.png');
        this.game.load.image('wormhole', 'assets/wormhole.png');
        this.game.load.image('star', 'assets/star.png');
        this.game.load.image('darkstar', 'assets/darkstar.png');
        this.game.load.image('planet', 'assets/circle.png');
        this.game.load.image('levelcomplete', 'assets/levelcomplete.png');
        this.game.load.image('levelfailed', 'assets/levelfailed.png');
        this.game.load.image('bigstar', 'assets/bigstar.png');
        this.game.load.image('logo', 'assets/logo.png');
        this.game.load.image('level', 'assets/levelicon.png');
        this.game.load.image('journey', 'assets/journey.png');
        this.game.load.image('challenge', 'assets/challenge.png');
        this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        
        this.game.load.spritesheet('enemy', 'assets/enemy.png', 33.5, 39, 4);
        this.game.load.image('asteroid', 'assets/asteroid.png');
        this.game.load.image('oxygen', 'assets/o2tank.png');
        this.game.load.image('blackhole', 'assets/teleporter.png');
        
        // Journey mode background music from: https://www.freeplaymusic.com
        this.game.load.audio('journeyMusic', 'assets/audio/journey_mode_audio.mp3');
        // Challenge mode background music from: https://www.freeplaymusic.com
        this.game.load.audio('challengeMusic', 'assets/audio/challenge_mode_audio.mp3');
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
            //debugger;
        }
        
        for(var i = 0; i < this.journeylevelCount; i++){
            this.game.load.text('journeyLevel' + i,'levels/journey/level'+i+'.json');
        }
        
        for(var i = 0; i < this.challengelevelCount; i++){
            this.game.load.text('challengeLevel' + i,'levels/challenge/level'+i+'.json');
        }
    },

    create: function(){
        console.log("Intro create");
        var bg = this.game.add.sprite(0, 0, 'skyLarge');
        bg.scale = new Phaser.Point(0.5, 0.5);
        bg.tint = 0x525252;
        var logo = this.game.add.sprite(game.world.width/2, 200, "logo");
        logo.anchor.setTo(0.5,0.5);
        
        // Loading the background music.
        this.backgroundMusic = game.add.audio('journeyMusic', 1, true);
        this.backgroundMusic.play('', 0, 1, true);
        
        var playButton = this.game.add.button(game.world.width/2, game.world.height - 150, "play", this.playGame, this);
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
        this.game.state.states.Level.backgroundMusic = this.backgroundMusic;
        this.game.state.start("Level");
        this.backgroundMusic.pause();
    },
    shutdown: function(){
        console.log("intro state left");
        
    },
    
    populateLevelData: function(){
        for(var i = 0; i < this.journeylevelCount; i++)
        {
            localStorage.setItem('journeyLevel'+i+'_starCount', 0);
        }
        
        for(var i = 0; i < this.challengelevelCount; i++)
        {
            localStorage.setItem('challengeLevel'+i+'_starCount', 0);
        }
        
        localStorage.setItem('accessed', true);
    }
}