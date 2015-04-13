var GameScreen = function(game)
    {
        this.platforms = undefined;
        this.player = undefined;
        this.planets = undefined;
        this.cursors = undefined;
        this.stars = undefined;
        this.wormholes = undefined;
        this.totalScore = 0;
        this.roundScore = 0;
        this.scoreText = undefined;
        this.offGround = false;
    }
    
    GameScreen.prototype = {
        init: function(){
            console.log("Game Screen Init");
            //start the physics system
            game.physics.startSystem(Phaser.Physics.P2JS);
        },
        
        create: function(){
            console.log("Game Screen Create");
            
            
            //add planets
            this.planets = game.add.group();

            var planet1 = this.planets.create(game.world.width/2, game.world.height/2, 'planet');
            game.physics.p2.enable(planet1, false);
            planet1.body.static = true;
            planet1.anchor.setTo(0.5, 0.5);  
            planet1.body.setCircle(92); 

            var planet2 = this.planets.create(600, 150, 'planet');
            game.physics.p2.enable(planet2, false);
            planet2.body.static = true;
            planet2.anchor.setTo(0.5, 0.5);  
            planet2.body.setCircle(48);
            planet2.scale = new Phaser.Point(0.5, 0.5);

            //player
            this.player = game.add.sprite(planet1.x, planet1.y - (planet1.width / 2 + 9), 'dude');
            this.player.animations.add('left', [0,1,2,3], 10, true);
            this.player.animations.add('right', [5,6,7,8], 10, true);
            game.physics.p2.enable(this.player, false);
            this.player.body.collideWorldBounds = true;
            this.player.body.velocity.x = 1;
            this.player.anchor.setTo(0.5, 0.5);
            this.player.grounded = false;
            this.player.targetPlanet = planet1;
            this.player.jumpStrength = 10000;
            this.player.slamStrength = 5000;
            this.player.runSpeed = 300;


            this.cursors = game.input.keyboard.createCursorKeys();

            //add a group of stars to the game
            this.stars = game.add.group();
            var star1 = this.stars.create(500, 250, 'star');
            game.physics.p2.enable(star1, false);
            star1.anchor.setTo(0.5, 0.5);  
            var star2 = this.stars.create(planet1.x, planet1.y + (planet1.width / 2) + 90, 'star');
            game.physics.p2.enable(star2, false);
            star2.anchor.setTo(0.5, 0.5);  
            var star3 = this.stars.create(planet2.x + (planet2.width / 2), planet2.y - (planet2.width / 2), 'star');
            game.physics.p2.enable(star3, false);
            star3.anchor.setTo(0.5, 0.5);

            // Create and setup the wormhole
            this.wormholes = game.add.group();
            var wormhole = this.wormholes.create(200, 175, 'wormhole');
            game.physics.p2.enable(wormhole, false);
            wormhole.anchor.setTo(0.5, 0.5);


            this.player.body.onBeginContact.add(this.playerContact, this);
            this.player.body.onEndContact.add(this.playerEndContact, this);
            
            
        },
        
        update: function(){
            this.playerForceReset(this.player);

            //calculate the angle between the player and the planet
            var angle = Math.atan2(this.player.targetPlanet.y - this.player.y, this.player.targetPlanet.x - this.player.x);
            this.player.body.rotation = angle + game.math.degToRad(90) * -1;

            if(this.player.grounded)
            {
                //move player
                this.playerMove(this.player, angle);

                //allow player jump if they are touching the ground
                if(this.cursors.up.isDown)
                {
                    this.playerJump(this.player, angle);
                    this.player.grounded = false;
                }
            }
            else{
                this.calculateTargetPlanet(this.player, this.planets);
            }


            //calculate gravity
            var strength = 500;
            this.applyGravity(this.player, angle, strength);

            //allow the player to fall if not grounded
            if(this.cursors.down.isDown && !this.player.grounded)
            {
                this.playerFall(this.player, angle);
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
            var speed = player.jumpStrength;
        
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
                            this.setGrounded();
                            break;
                        case "star":
                            this.collectStar(body);
                            break;
                        case "wormhole":
                            //collideWormhole(wormhole);
                            //currentState = GAME_STATE_ROUND_OVER;
                            this.game.state.start('Intro');
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
                            this.setGrounded();
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
    }