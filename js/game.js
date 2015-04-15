var GameScreen = function(game)
    {
        this.platforms = undefined;
        this.player = undefined;
        this.planets = undefined;
        this.cursors = undefined;
        this.spaceKey = undefined;
        this.stars = undefined;
        this.wormholes = undefined;
        this.totalScore = 0;
        this.roundScore = 0;
        this.scoreText = undefined;
        this.offGround = false;
        this.levels = undefined;
        this.currentLevel = 0;
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
            
            this.cursors = game.input.keyboard.createCursorKeys();
            
            this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
            this.spaceKey.onDown.add(this.handleSpacePress, this);


            this.player.body.onBeginContact.add(this.playerContact, this);
            this.player.body.onEndContact.add(this.playerEndContact, this);
            
            
        },
        
        update: function(){
            //this.playerForceReset(this.player);
            
            //calculate the angle between the player and the planet
            this.currentAngle = Math.atan2(this.player.targetPlanet.y - this.player.y, this.player.targetPlanet.x - this.player.x);
            this.player.body.rotation = this.currentAngle + game.math.degToRad(90) * -1;

            if(this.player.grounded)
            {
                //move player
                this.playerMove(this.player, this.currentAngle);
                

                //allow player jump if they are touching the ground
                /*if(!this.player.jumped && spaceJustDown)
                {
                    this.playerJump(this.player, this.currentAngle);
                    //this.player.grounded = false;
                     this.player.jumped = true;
                }*/
                //this.player.grounded = true;
            }
            if(this.player.jumped){
                this.calculateTargetPlanet(this.player, this.planets);
            }


            //calculate gravity
            var strength = 500;
            this.applyGravity(this.player, this.currentAngle, strength);

            //allow the player to fall if not grounded
            /*if(spaceJustDown && this.player.jumped)
            {
                this.playerFall(this.player, angle);
            } */  
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
        applyGravity: function(player, angle, strength){
            player.body.force.x += Math.cos(angle) * strength;
            player.body.force.y += Math.sin(angle) * strength;
        },
    
        //move the player
        playerMove: function(player, angle)
        {
            var speed = player.runSpeed;
            
            player.animations.play('left');
            player.body.force.x += Math.cos(angle + 90) * speed;
            player.body.force.y += Math.sin(angle + 90) * speed;

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
                            //currentState = GAME_STATE_ROUND_OVER;
                            this.game.state.start('Level');
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
            star.destroy();
        },


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
                
                //Planets
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
                
                //Stars
				var stars = level.stars;
                this.stars = game.add.group();
				for( var i = 0; i < stars.length; i++){
					var star = stars[i];
                    var currentStar = this.stars.create(star.x, star.y, 'star');
				    //do all that star physics stuff
                    game.physics.p2.enable(currentStar, false);
                    currentStar.anchor.setTo(0.5, 0.5);
                    
				}
                
                //Wormhole
                var wormholes = level.wormholes;
                this.wormholes = game.add.group();
				for( var i = 0; i < wormholes.length; i++){
					var wormhole = wormholes[i];
                    var currentWormhole = this.wormholes.create(wormhole.x, wormhole.y, 'wormhole');
				    //do all that wormhole physics stuff
                    game.physics.p2.enable(currentWormhole, false);
                    currentWormhole.body.static = true;
                    currentWormhole.body.setCircle(45); 
                    currentWormhole.anchor.setTo(0.5, 0.5);
                    
				}
            
                this.currentAngle = 0;
			}

    }