var GameScreen = function(game)
    {
        this.platforms = undefined;
        this.player = undefined;
        this.planets = undefined;
        this.cursors = undefined;
        this.spaceKey = undefined;
        this.stars = undefined;
        this.wormholes = undefined;
        this.camera = undefined;
        
        this.blackholes = undefined;
        this.enemies = undefined;
        this.asteroids = undefined;
        
        this.numEnemies = undefined;
        this.numPlanets = undefined;
        //this.planetPos = undefined;
        
        var numStars = 0;
        
        //this.totalScore = 0;
        this.numStarsCollected = 0;
        this.scoreText = undefined;
        this.offGround = false;
        this.levels = undefined;
        this.currentLevel = 0;
        this.usingTimer = true; //Are we in timer mode
        this.timer = undefined; //Timer
        this.timeLeft = 0; //Time until oxygen runs out
        this.timeText = undefined;
        
        this.jumpSound = undefined;
        this.starSound = undefined;
        this.completeSound = undefined;
        this.buttonSound = undefined;
        this.wormholeSound = undefined;
        this.blackholeSound = undefined;
        this.oxygenSound = undefined;
        this.breathSound = undefined;
        
        this.mode = "";
    }
    
    GameScreen.prototype = {
        init: function(){
            console.log("Game Screen Init");
            var bg = game.add.tileSprite(0, 0, 800, 450, 'sky');
            bg.scale = new Phaser.Point(.1,.1);
            game.world.setBounds(0, 0, 1600, 900);
            //start the physics system
            game.physics.startSystem(Phaser.Physics.P2JS);
        },
        
        create: function(){
            console.log("Game Screen Create");
            


            
            this.numEnemies = [];
            this.numPlanets = [];
            //this.planetPos = [];
            
            //this.loadLevel(this.levels[this.currentLevel]);
            this.game.add.sprite(0, 0, 'sky');
            this.loadLevel(this.mode+this.currentLevel);
            //this.loadLevel("test");
            this.scoreText = game.add.text(16, 16, 'Stars Collected: 0/' + this.numStars, { font: "900 'Orbitron', sans-serif", fontSize: '24px', fill: '#e2fbb6' });
            this.scoreText.fixedToCamera = true;
            this.cursors = game.input.keyboard.createCursorKeys();
            
            this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
            this.spaceKey.onDown.add(this.handleSpacePress, this);
            game.input.onDown.add(this.handleSpacePress, this);
            this.player.body.onBeginContact.add(this.playerContact, this);
            this.player.body.onEndContact.add(this.playerEndContact, this);
            
            this.jumpSound = game.add.audio('jumpSound', 0.3);
            this.starSound = game.add.audio('starSound');
            this.completeSound = game.add.audio('completeSound');
            
            this.wormholeSound = game.add.audio('wormholeSound');
            this.blackholeSound = game.add.audio('blackholeSound');
            this.oxygenSound = game.add.audio('oxygenSound');
            this.breathSound = game.add.audio('breathSound');
            
            
            
                        
            
        },
        
        update: function(){
            //game.camera.focusOnXY(this.player.body.x - (game.camera.view.width + this.player.body.x)/2, this.player.body.y - (game.camera.view.height + this.player.body.y)/2);
            
            //increment timer
            // Move all of the enemies
            for(var i = 0; i < this.numEnemies.length; i++) {
                this.currentAngle = Math.atan2(this.numEnemies[i].planet.y - this.numEnemies[i].y, this.numEnemies[i].planet.x - this.numEnemies[i].x);
                this.numEnemies[i].body.rotation = this.currentAngle + game.math.degToRad(90) * -1;
                this.enemyMove(this.numEnemies[i], this.currentAngle, 1.0);
                this.applyEnemyGravity(this.numEnemies[0], this.currentAngle);
                
            }
            
            //Planet move, doesnt work for some reason
            /*for(var i = 0; i < this.numPlanets.length; i++){
                var currentPlanet = this.numPlanets[i];
                var moveToX = this.planetPos[i].initX;
                var moveToY = this.planetPos[i].initY;
                var move = false;
                
                //Are we at the starting x
                if(currentPlanet.x == this.planetPos[i].initX && this.planetPos[i].moveToX != undefined){
                    moveToX = this.planetPos[i].moveToX;
                    move = true;
                }
                //Are we at the ending x
                if(currentPlanet.x == this.planetPos[i].moveToX){
                    moveToX = this.planetPos[i].initX;
                    move = true;
                    console.log(moveToX);
                }
                //Are we at the starting y
                if(currentPlanet.y == this.planetPos[i].initY && this.planetPos[i].moveToY != undefined){
                    moveToY = this.planetPos[i].moveToY;
                    move = true;
                }
                //Are we at the ending y
                if(currentPlanet.y == this.planetPos[i].moveToY){
                    moveToY = this.planetPos[i].initY;
                    move = true;
                }
                
                if(move){
                    game.physics.arcade.moveToXY(this.numPlanets[i], moveToX, moveToY);
                }
            }
            */
            // Calculate the angle between the player and the planet
            this.currentAngle = Math.atan2(this.player.targetPlanet.y - this.player.y, this.player.targetPlanet.x - this.player.x);
            this.player.body.rotation = this.currentAngle + game.math.degToRad(90) * -1;
            
            // Check if the player is on the ground or in the air.
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
            
            // Rotate the wormholes.
            this.rotate(this.wormholes, 0.5);
            // Rotate the blackholes.
            if(this.blackholes != undefined)this.rotate(this.blackholes, 1.5);
            
            // If the player runs out of time, the mission fails.
            if(this.usingTimer) {
                if(this.timeLeft <= 0) {
                    this.breathSound.volume = 2.0;
                    this.breathSound.play();
                    this.game.state.states.RoundFailed.buttonSound = this.buttonSound;
                    if(this.usingTimer)this.timer.destroy();
                    this.game.state.start('RoundFailed');
                    this.numStarsCollected = 0;    
                }
            }
           
        },
        
        // Rotates the objects in a given array based on their render angle and a given rotation speed.
        rotate: function(rotators, rotateSpeed) {
            for(var i = 0; i < rotators.children.length; i++) {
                var r = rotators.children[i];
                r.renderAngle += rotateSpeed;
                r.body.angle = r.renderAngle;
            }
        },
        
        //calculate the planet that the player should be attracted to
        calculateTargetPlanet: function(player, planets)
        {
            var targetMagnitude = new Phaser.Point(player.targetPlanet.y - player.y, player.targetPlanet.x - player.x).getMagnitude();
            var closestPlanet = undefined;
            targetMagnitude -= player.targetPlanet.radius;

            for(var i = 0; i < planets.children.length; i++)
            {
                var p = planets.children[i];
                var testMagnitude = new Phaser.Point(p.y - player.y, p.x - player.x).getMagnitude();
                testMagnitude -= p.radius;
                
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
        
        applyEnemyGravity: function(enemy, angle) {
            var strength = 250 + (10000 * enemy.planet.mass);
            enemy.body.force.x += Math.cos(angle) * strength;
            enemy.body.force.y += Math.sin(angle) * strength;
        },
        
        enemyMove: function(enemy, angle) {
            var speed = enemy.runSpeed;
            enemy.animations.play('right');
            enemy.body.force.x += Math.cos(angle + 90) * speed;
            enemy.body.force.y += Math.sin(angle + 90) * speed;
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
        playerContact: function(body, shapeA, shapeB, equation) {
            if(body != null) {
                switch(body.sprite.key) {
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
                            if(this.usingTimer)this.timer.destroy();
                            this.game.state.start('RoundOver');
                            this.numStarsCollected = 0;
                            break;
                        case "enemy":
                            this.game.state.states.RoundFailed.numStarsCollected = this.numStarsCollected;
                            this.game.state.states.RoundFailed.maxStarsCollected = this.stars.length;
                            this.game.state.states.RoundFailed.buttonSound = this.buttonSound;
                            this.game.state.start('RoundFailed');
                            this.numStarsCollected = 0;
                            break;
                        case "blackhole":
                            this.blackholeSound.play();
                            if (!this.player.teleporting) {
                                this.teleportPlayer(body);
                            }
                            break;
                        case "oxygen":
                            this.oxygenSound.play();
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
                            this.player.grounded = false;
                            break;
                        case "blackhole":
                            this.player.body.velocity.x *= 0.1;
                            this.player.body.velocity.y *= 0.1;
                            // Resets the player's forces.
                            this.playerForceReset(this.player);
                            // Looks for the closest planet for the player to land on.
                            this.calculateTargetPlanet(this.player, this.planets);
                            this.player.teleporting = false;
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
            this.scoreText.text = 'Stars Collected: ' + this.numStarsCollected + "/" + this.numStars;
            star.destroy();
        },
        
        
        collectOxygen: function(oxygenTank) {
            // Removes the oxygen tank from the screen
            console.log("tank");
            oxygenTank.sprite.exists = false;
            this.oxygenSound.play();
            // add time to the oxygen timer, increment TBD
            this.timeLeft += 5;
            this.timeText.text = 'Oxygen Left: '+ this.timeLeft;

            oxygenTank.destroy();
        },
        
        teleportPlayer: function(blackhole) {
            this.player.teleporting = true;
            // Makes a temp array containing all possible blackholes.
            var teleportLocation = [];
            for(var i = 0; i < this.blackholes.length; i++) {
                teleportLocation.push(i);
            }
            // Takes out the array value for the blackhole the player entered.
            teleportLocation.splice(blackhole.sprite.identifier, 1);
            // Chooses a random number between 0 and the total amount of blackholes (minus 1).
            var random = Math.floor(Math.random() * teleportLocation.length);
            
            //console.log("Before: " + this.player.targetPlanet.x);
            // The player is reset and positioned at a random blackhole location.
            this.player.reset(this.blackholes.children[teleportLocation[random]].x, this.blackholes.children[teleportLocation[random]].y);
            
            //this.player.targetPlanet = this.blackholes.children[teleportLocation[random]].planet;
            //console.log("After: " + this.player.targetPlanet.x);
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
                this.jumpSound.volume = 0.3;
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
            for(var i = 0; i < planets.length; i++){
                var planet = planets[i];
                var currentPlanet = this.planets.create(planet.x, planet.y, 'planet');
                //do all that planet physics stuff
                //this.planetPos.push({initX: planet.x, initY: planet.y, moveToX: planet.moveToX, moveToY: planet.moveToY});
                game.physics.p2.enable(currentPlanet, false);
                currentPlanet.body.static = true;
                currentPlanet.anchor.setTo(0.5, 0.5);  
                currentPlanet.body.setCircle(92 * planet.scale); 
                currentPlanet.scale = new Phaser.Point(planet.scale, planet.scale);
                currentPlanet.mass = planet.scale;
                currentPlanet.radius = 110 * planet.scale;
                currentPlanet.friction = planet.friction;
                currentPlanet.tint = Math.random() * 0xffffff;
                this.numPlanets.push(currentPlanet);
                /*This is super brokenif(i = 0){
                    var tween = game.add.tween(currentPlanet).to({x:this.planetPos[i].moveToX, y: this.planetPos[i].moveToY}, 1000);
                    tween.start();
                }
                */
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
                    this.player.teleporting = false;
                    this.player.targetPlanet = currentPlanet;
                    this.player.jumpStrength = 17500;
                    this.player.slamStrength = 16000;
                    this.player.runSpeed = 300;
                }
            }

            // Stars
            this.numStars = 0;
            var stars = level.stars;
            this.stars = game.add.group();
            for(var i = 0; i < stars.length; i++){
                var star = stars[i];
                var currentStar = this.stars.create(star.x, star.y, 'star');
                //do all that star physics stuff
                game.physics.p2.enable(currentStar, false);
                currentStar.anchor.setTo(0.5, 0.5);
                currentStar.body.static = false;
                this.numStars++;
            }

            // Wormholes
            var wormholes = level.wormholes;
            this.wormholes = game.add.group();
            for(var i = 0; i < wormholes.length; i++){
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

            // Project 3 Stuff
            // Oxygen Tanks
            var oxygenTanks = level.oxygenTanks;
            this.oxygenTanks = game.add.group();
            if(oxygenTanks){
                for( var i = 0; i < oxygenTanks.length; i++){
                    var oxygenTank = oxygenTanks[i];
                    var currentTank = this.oxygenTanks.create(oxygenTank.x, oxygenTank.y, 'oxygen');
                    // Sets up the oxygen tank physics
                    game.physics.p2.enable(currentTank, false);
                    currentTank.anchor.setTo(0.5, 0.5);
                    currentTank.scale = new Phaser.Point(0.25, 0.25);
                    currentTank.body.setRectangle(60*currentTank.scale.x, 158*currentTank.scale.y);
                    currentTank.body.static = false;  
                }
            }
            // Enemies
            var enemies = level.enemies;
            if(enemies){
             this.enemies = game.add.group();
             for(var i = 0; i < enemies.length; i++){
                 var enemy = enemies[i];
                 //var currentEnemy = this.enemies.create(enemy.x, enemy.y, 'enemy');
                 var currentEnemy = game.add.sprite(enemy.x, enemy.y, 'enemy');
                 currentEnemy.animations.add('right', [0,1,2,3], 10, true);
                 // Sets up the enemy physics
                 game.physics.p2.enable(currentEnemy, false);
                 currentEnemy.scale = new Phaser.Point(enemy.scale, enemy.scale);
                 //currentEnemy.body.setCircle(102 * enemy.scale);
                 currentEnemy.body.collideWorldBounds = true;
                 currentEnemy.body.velocity.x = 1;
                 currentEnemy.anchor.setTo(0.5, 0.5);
                 currentEnemy.runSpeed = 50;
                 currentEnemy.planet = this.numPlanets[enemy.planet];
                 this.numEnemies.push(currentEnemy);
             }
            }
            // Blackholes
            var blackholes = level.blackholes;
            if(blackholes){
                this.blackholes = game.add.group();
                for(var i = 0; i < blackholes.length; i++){
                    var blackhole = blackholes[i];
                    var currentBlackhole = this.blackholes.create(blackhole.x, blackhole.y, 'blackhole');
                    currentBlackhole.identifier = i;
                    // Sets up the blackhole physics
                    game.physics.p2.enable(currentBlackhole, false);
                    currentBlackhole.body.static = true;
                    currentBlackhole.anchor.setTo(0.5, 0.5);
                    currentBlackhole.body.setCircle(79 * blackhole.scale);
                    currentBlackhole.scale = new Phaser.Point(blackhole.scale, blackhole.scale);
                    currentBlackhole.renderAngle = blackhole.renderAngle;
                    currentBlackhole.planet = this.numPlanets[blackhole.planet];
                }
            }
            // Asteroids 
            var asteroids = level.asteroids;
            if(asteroids){
                this.asteroids = game.add.group();
                 for(var i = 0; i < asteroids.length; i++){
                     var asteroid = asteroids[i];
                     var currentAsteroid = this.asteroids.create(asteroid.x, asteroid.y, 'asteroid');
                     // Sets up the asteroid physics
                     game.physics.p2.enable(currentAsteroid, false);
                     currentAsteroid.body.static = true;
                     currentAsteroid.anchor.setTo(0.5, 0.5);
                     currentAsteroid.body.setCircle(100 * asteroid.scale);
                     currentAsteroid.scale = new Phaser.Point(asteroid.scale, asteroid.scale);
                     currentAsteroid.renderAngle = asteroid.renderAngle;
                 }
            }
            //Timer
            var time = level.timer;
            this.usingTimer = false;
            if(time){
                this.timer = game.time.create(false);
                this.timer.loop(1000, this.timerDown, this);
                this.usingTimer = true;
                this.timeLeft = time;
                this.timer.start();
                this.timeText = game.add.text(16, 40, 'Oxygen Left: '+ this.timeLeft, { font: "900 'Orbitron', sans-serif", fontSize: '24px', fill: '#e2fbb6' });
                this.timeText.fixedToCamera = true;
            }
            this.currentAngle = 0;
            
            
            // Set camera parameters
            //game.world.setBounds(0, 0, 800, 600);
            //game.camera.visible = true;
            //game.camera.scale = 0.5;
            //game.camera.focusOnXY(this.player.body.x - (game.camera.view.width + this.player.body.x)/2, this.player.body.y - (game.camera.view.height + this.player.body.y)/2);
            //this.camera = Phaser.camera(this.player.body.x - (game.camera.view.width + this.player.body.x)/2, this.player.body.y - (game.camera.view.height + this.player.body.y)/2, 200, 200);
            
            //game.camera.setSize(300, 300);
            //game.camera.x = this.player.body.x;// - game.camera.view.width/2;
           // game.camera.y = this.player.body.y;// - game.camera.view.height/2;
            
            //game.camera.view = new Phaser.Rectangle(0, 0, 100, 100);
            //game.camera.setSize(200, 200);
            //game.camera.focusOn(this.player);
            game.camera.follow(this.player);
            //this.camera.deadzone = new Phaser.Rectangle(this.camera.x, this.camera.y, 20, 20);

        },
        
        timerDown: function(){
            this.timeLeft--;
            this.timeText.text = 'Oxygen Left: '+ this.timeLeft;
        }
    }