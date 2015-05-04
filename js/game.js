var GameScreen = function(game)
    {
        this.platforms = undefined;
        this.player = undefined;
        this.planets = undefined;
        this.cursors = undefined;
        this.spaceKey = undefined;
        this.stars = undefined;
        this.wormholes = undefined;
        //this.totalScore = 0;
        this.numStarsCollected = 0;
        this.scoreText = undefined;
        this.offGround = false;
        this.levels = undefined;
        this.currentLevel = 0;
        
        this.jumpSound = undefined;
        this.starSound = undefined;
        this.completeSound = undefined;
        this.buttonSound = undefined;
        this.wormholeSound = undefined;
        this.blackholeSound = undefined;
        this.oxygenSound = undefined;
        this.breathSound = undefined;
    }
    
    GameScreen.prototype = {
        init: function(){
            console.log("Game Screen Init");
            //start the physics system
            game.physics.startSystem(Phaser.Physics.P2JS);
        },
        
        create: function(){
            console.log("Game Screen Create");
            
            
            //this.loadLevel(this.levels[this.currentLevel]);
            this.game.add.sprite(0, 0, 'sky');
            this.loadLevel("level"+this.currentLevel);
            //this.loadLevel("test");
            this.scoreText = game.add.text(16, 16, 'Stars Collected: 0', { font: "900 'Orbitron', sans-serif", fontSize: '24px', fill: '#e2fbb6' });
            this.cursors = game.input.keyboard.createCursorKeys();
            
            this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
            this.spaceKey.onDown.add(this.handleSpacePress, this);


            this.player.body.onBeginContact.add(this.playerContact, this);
            this.player.body.onEndContact.add(this.playerEndContact, this);
            
            this.jumpSound = game.add.audio('jumpSound');
            this.starSound = game.add.audio('starSound');
            this.completeSound = game.add.audio('completeSound');
            
            this.wormholeSound = game.add.audio('wormholeSound');
            this.blackholeSound = game.add.audio('blackholeSound');
            this.oxygenSound = game.add.audio('oxygenSound');
            this.breathSound = game.add.audio('breathSound');
            
        },
        
        update: function(){
            //this.playerForceReset(this.player);
            
            //calculate the angle between the player and the planet
            this.currentAngle = Math.atan2(this.player.targetPlanet.y - this.player.y, this.player.targetPlanet.x - this.player.x);
            this.player.body.rotation = this.currentAngle + game.math.degToRad(90) * -1;

            if(this.player.grounded)
            {
                //move player
                //this.playerMove(this.player, this.currentAngle, 1/this.player.targetPlanet.friction); //friction movement
                this.playerMove(this.player, this.currentAngle, 1.0);
            }
            if(this.player.jumped){
                this.calculateTargetPlanet(this.player, this.planets);
            }


            //calculate gravity
            this.applyGravity(this.player, this.currentAngle);
            
            //rotate the wormholes
            for(var i = 0; i < this.wormholes.children.length; i++)
            {
                var w = this.wormholes.children[i];
                w.renderAngle+= 0.5;
                w.body.angle = w.renderAngle;
            }
            

           
        },
        
        //calculate the planet that the player should be attracted to
        calculateTargetPlanet: function(player, planets)
        {
            var targetMagnitude = new Phaser.Point(player.targetPlanet.y - player.y, player.targetPlanet.x - player.x).getMagnitude();
            var closestPlanet = undefined;

            for(var i = 0; i < planets.children.length; i++)
            {
                var p = planets.children[i];
                var testMagnitude = new Phaser.Point(p.y - player.y, p.x - player.x).getMagnitude();

                if(testMagnitude < targetMagnitude)
                {
                    closestPlanet = p;
                }
            }

            if(closestPlanet != undefined)
            {
                player.targetPlanet = closestPlanet;
            }
        },
        
        //apply gravity to the center of a planet
        applyGravity: function(player, angle){
            var strength = 250 + (250 * player.targetPlanet.mass);
            player.body.force.x += Math.cos(angle) * strength;
            player.body.force.y += Math.sin(angle) * strength;
        },
    
        //move the player
        playerMove: function(player, angle, multiplier)
        {
            var speed = player.runSpeed;
            
            player.animations.play('left');
            player.body.force.x += Math.cos(angle + 90) * (speed * multiplier);
            player.body.force.y += Math.sin(angle + 90) * (speed * multiplier);

            /*if(player.body.angularVelocity < 0)
            {
                player.animations.play('left');
                player.body.force.x += Math.cos(angle + 90) * speed;
                player.body.force.y += Math.sin(angle + 90) * speed;
            }
            else
            {
                player.animations.play('right');
                player.body.force.x += Math.cos(angle + 90) * speed;
                player.body.force.y += Math.sin(angle + 90) * speed;
            }*/
        },
        
        playerJump: function(player, angle){
            console.log("Jump");
            var speed = player.jumpStrength;
            player.jumped = true;
        
            if (angle > 0){
                if(angle > game.math.degToRad(90)) {
                    // Quadrant II, sin is positive
                    player.body.force.x += Math.abs(Math.cos(angle) * speed);
                    player.body.force.y += Math.abs(Math.sin(angle) * speed) * -1;
                } else {
                    // Quadrant I, both are positve
                    player.body.force.x += Math.abs(Math.cos(angle * -1) * speed) * -1;
                    player.body.force.y += Math.abs(Math.sin(angle * -1) * speed) * -1;
                }
            } else {
                if (angle > game.math.degToRad(-90)) {
                    // Quadrant III, neither are positive
                    player.body.force.x += Math.abs(Math.cos(angle) * speed) * -1;
                    player.body.force.y += Math.abs(Math.sin(angle) * speed);
                } else {
                    // Quadrant IV, cos is positive
                    player.body.force.x += Math.abs(Math.cos(angle * -1) * speed);
                    player.body.force.y += Math.abs(Math.sin(angle * -1) * speed);
                }
            }
        },
        
         playerFall: function(player, angle) {
            var speed = player.slamStrength;
            
            player.body.force.x += Math.cos(angle) * speed;
            player.body.force.y += Math.sin(angle) * speed;
        },

        //reset the forces on the player to 0
        playerForceReset: function (player) {
            player.body.force.x = 0;
            player.body.force.y = 0;
        },
        
        //logic for collision detection
        playerContact: function(body, shapeA, shapeB, equation)
        {
            if(body != null)
            {
                switch(body.sprite.key){
                        case "planet":
                            //this.setGrounded();
                            this.player.grounded = true;
                            this.player.jumped = false;
                            break;
                        case "star":
                            this.collectStar(body);
                            this.player.jumped = true;
                            break;
                        case "wormhole":
                            //collideWormhole(wormhole);
                            this.wormholeSound.play();
                            this.game.state.states.RoundOver.numStarsCollected = this.numStarsCollected;
                            this.game.state.states.RoundOver.maxStarsCollected = this.stars.length;
                            this.game.state.states.RoundOver.lastLevel = this.currentLevel;
                            this.game.state.states.RoundOver.buttonSound = this.buttonSound;
                            this.game.state.start('RoundOver');
                            this.numStarsCollected = 0;
                            break;
                        case "enemy":
                            break;
                        case "blackhole":
                            this.teleportPlayer(body);
                            break;
                        case "oxygenTank":
                            this.collectOxygen(body);
                            break;
                }
            }
        },
        playerEndContact: function (body, shapeA, shapeB, equation)
        {
            if(body != null && body.sprite != null)
            {
                switch(body.sprite.key){
                        case "planet":
                            //this.setGrounded();
                            this.player.grounded = false;
                            break;
                }
            }
        },

        collectStar: function(star)
        {
            //removes the star from the screen
            //star.alive = false;
            star.sprite.exists = false;
            this.starSound.play();
            this.numStarsCollected++;
            this.scoreText.text = 'Stars Collected: ' + this.numStarsCollected;
            star.destroy();
        },
        
        /*
        collectOxygen: function(oxygenTank) {
            // Removes the oxygen tank from the screen
            oxygenTank.sprite.exists = false;
            this.oxygenSound.play();
            // add time to the oxygen timer, increment TBD
            // this.timer += 5;
            oxygenTank.destroy();
        },
        
        teleportPlayer: function(blackhole) {
            // Move player's current position to a random blackhole's position, other than the current one.
        },
        */


        setGrounded: function()
        {
            this.player.grounded = !this.player.grounded;
        },
        
        handleSpacePress: function()
        {
            if(!this.player.jumped)
            {
                //console.log(game.math.radToDeg(this.currentAngle));
                this.playerJump(this.player, this.currentAngle);
                this.player.jumped = true;
                this.jumpSound.play();
            }
            else
            {
                this.playerFall(this.player, this.currentAngle);
            }
            
            /*switch(this.player.jumped){
                    case true:
                        this.playerFall(this.player, this.angle);
                        break;
                    case false:
                        this.playerJump(this.player, this.currentAngle);
                        //this.player.grounded = false;
                        this.player.jumped = true;
                        break;
            }*/
        },
        
         //JSON Loading for levels
        loadLevel: function(levelNum){
				// JSON.parse() converts a string to JSON.
 				var myJSON = JSON.parse(game.cache.getText(levelNum));
 				
 				var level = myJSON.level;
                
                // Planets
                var planets = level.planets;
                this.planets = game.add.group();
				for( var i = 0; i < planets.length; i++){
					var planet = planets[i];
                    var currentPlanet = this.planets.create(planet.x, planet.y, 'planet');
				    //do all that planet physics stuff
                    game.physics.p2.enable(currentPlanet, false);
                    currentPlanet.body.static = true;
                    currentPlanet.anchor.setTo(0.5, 0.5);  
                    currentPlanet.body.setCircle(92 * planet.scale); 
                    currentPlanet.scale = new Phaser.Point(planet.scale, planet.scale);
                    currentPlanet.mass = planet.scale;
                    currentPlanet.friction = planet.friction;
                    currentPlanet.tint = Math.random() * 0xffffff;
                    //currentPlanet.tint = (1/currentPlanet.friction) * 0xffffff;
                    if(i == 0){
                         //This is where we should put the player based on the first planet
                        this.player = game.add.sprite(currentPlanet.x, currentPlanet.y - (currentPlanet.width / 2 + 9), 'dude');
                        this.player.animations.add('left', [0,1,2,3], 10, true);
                        this.player.animations.add('right', [5,6,7,8], 10, true);
                        game.physics.p2.enable(this.player, false);
                        this.player.body.collideWorldBounds = true;
                        this.player.body.velocity.x = 1;
                        this.player.anchor.setTo(0.5, 0.5);
                        this.player.grounded = false;
                        this.player.jumped = true;
                        this.player.targetPlanet = currentPlanet;
                        this.player.jumpStrength = 17500;
                        this.player.slamStrength = 16000;
                        this.player.runSpeed = 300;
                    }
				}
                
                // Stars
				var stars = level.stars;
                this.stars = game.add.group();
				for( var i = 0; i < stars.length; i++){
					var star = stars[i];
                    var currentStar = this.stars.create(star.x, star.y, 'star');
				    //do all that star physics stuff
                    game.physics.p2.enable(currentStar, false);
                    currentStar.anchor.setTo(0.5, 0.5);
                    currentStar.body.static = false;  
				}
                
                // Wormholes
                var wormholes = level.wormholes;
                this.wormholes = game.add.group();
				for( var i = 0; i < wormholes.length; i++){
					var wormhole = wormholes[i];
                    var currentWormhole = this.wormholes.create(wormhole.x, wormhole.y, 'wormhole');
				    //do all that wormhole physics stuff
                    game.physics.p2.enable(currentWormhole, false);
                    currentWormhole.body.static = true;
                    currentWormhole.anchor.setTo(0.5, 0.5);
                    currentWormhole.body.setCircle(22 * wormhole.scale);
                    currentWormhole.scale = new Phaser.Point(wormhole.scale, wormhole.scale);
                    currentWormhole.renderAngle = wormhole.renderAngle;
				}
                
                /* Project 3 Stuff
                
                // Oxygen Tanks
				var oxygenTanks = level.oxygenTanks;
                this.oxygenTanks = game.add.group();
				for( var i = 0; i < oxygenTanks.length; i++){
					var oxygenTank = oxygenTanks[i];
                    var currentTank = this.oxygenTanks.create(oxygenTank.x, oxygenTank.y, 'oxygenTank');
				    // Sets up the oxygen tank physics
                    game.physics.p2.enable(currentTank, false);
                    currentTank.anchor.setTo(0.5, 0.5);
                    currentTank.body.static = false;  
				}
                
                // Blackholes
                var blackholes = level.blackholes;
                this.blackholes = game.add.group();
				for( var i = 0; i < blackholes.length; i++){
					var blackhole = blackholes[i];
                    var currentBlackhole = this.blackholes.create(blackhole.x, blackhole.y, 'blackhole');
				    // Sets up the blackhole physics
                    game.physics.p2.enable(currentBlackhole, false);
                    currentBlackhole.body.static = true;
                    currentBlackhole.anchor.setTo(0.5, 0.5);
                    currentBlackhole.body.setCircle(22 * blackhole.scale);
                    currentBlackhole.scale = new Phaser.Point(blackhole.scale, blackhole.scale);
                    currentBlackhole.renderAngle = blackhole.renderAngle;
				}
            
                // Asteroids 
                var asteroids = level.asteroids;
                this.asteroids = game.add.group();
				for( var i = 0; i < asteroids.length; i++){
					var asteroid = asteroids[i];
                    var currentAsteroid = this.asteroids.create(asteroid.x, asteroid.y, 'asteroid');
				    // Sets up the asteroid physics
                    game.physics.p2.enable(currentAsteroid, false);
                    currentAsteroid.body.static = true;
                    currentAsteroid.anchor.setTo(0.5, 0.5);
                    currentAsteroid.body.setCircle(11 * asteroid.scale);
                    currentAsteroid.scale = new Phaser.Point(asteroid.scale, asteroid.scale);
                    currentAsteroid.renderAngle = asteroid.renderAngle;
				}
            
                */
            
                this.currentAngle = 0;
			}

    }