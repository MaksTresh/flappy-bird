debug = false;

game = new Phaser.Game(690, 768, Phaser.AUTO, '');

var wBG, hBG;
var wGR, hGR;

var speedGame;
var score, bestScore;

var random;

var loadState = {
	preload: function() {
		game.stage.backgroundColor = '#00c1cc';

		var bestScoreText = game.add.text(game.world.centerX, game.world.centerY, 'LOADING');
    bestScoreText.anchor.set(0.5);
    bestScoreText.align = 'center';
    bestScoreText.font = 'FlappyBird';
    bestScoreText.fontSize = 45;
    bestScoreText.fill = 'white';
    bestScoreText.stroke = 'black';
    bestScoreText.strokeThickness = 5;

		game.load.spritesheet('bird', 'sprites/bird.png', 51, 36);
		game.load.image('bg','sprites/bg.png');
		game.load.image('ground','sprites/ground.png');
		game.load.image('play_btn','sprites/play_btn.png');
		game.load.image('tap_btn','sprites/tap_btn.png');
		game.load.image('tube','sprites/tube.png');

		game.load.physics('physicsData', 'sprites/bird.json');
	},
	create: function() {
		game.physics.startSystem(Phaser.Physics.P2JS);

		score = 0;
		bestScore = 0;
		speedGame = 2;

		wBG = game.cache.getImage('bg').width;
		hBG = game.cache.getImage('bg').height;

		wGR = game.cache.getImage('ground').width;
		hGR = game.cache.getImage('ground').height;

		random = game.rnd;

		game.state.start('menu');
	},
}


/**** BG ****/ 
var spritesBG = [],
oldBG;

function setBG(){
	spritesBG = [];
	for(var i = 0; i < 4; i++) {
		oldBG = game.add.tileSprite(i * wBG, 0, wBG, hBG, 'bg');
		spritesBG.push(oldBG);
	}
}

function moveBG(){
	spritesBG.forEach(function(el){
		el.tilePosition.x -= speedGame/2;
		if(el.tilePosition.x + wBG < 0){
			el.tilePosition.x = oldBG.tilePosition.x + wBG;
			oldBG = el;
		}
	});
}

/**** GROUND ****/
var spritesGR = [],
oldGR;

function setGR(){
	spritesGR = [];
	for(var i = 0; i < 4; i++) {
		oldGR = game.add.tileSprite(i * wGR, game.height - hGR, wGR, hGR, 'ground');
		spritesGR.push(oldGR);
	}
}

function moveGR(){
	spritesGR.forEach(function(el){
		el.tilePosition.x -= speedGame;
		if(el.tilePosition.x + wGR < 0){
			el.tilePosition.x = oldGR.tilePosition.x + wGR;
			oldGR = el;
		}
	});
}

var menuState = {
	setNextState: function() {
		game.state.start('play');
	},
	preload: function() {
		setBG();
		setGR();

		var treshBirdText = game.add.text(game.world.centerX, game.world.centerY-200, 'TRESH BIRD');
    treshBirdText.anchor.set(0.5);
    treshBirdText.align = 'center';
    treshBirdText.font = 'FlappyBird';
    treshBirdText.fontSize = 70;
    treshBirdText.fill = 'white';
    treshBirdText.stroke = 'black';
    treshBirdText.strokeThickness = 7;

    var versionText = game.add.text(game.world.centerX+190, game.world.centerY-150, 'V.1');
    versionText.anchor.set(0.5);
    versionText.align = 'center';
    versionText.font = 'FlappyBird';
    versionText.fontSize = 30;
    versionText.fill = 'white';
    versionText.stroke = 'black';
    versionText.strokeThickness = 5;

		var playBtn = game.add.button(game.world.centerX, game.world.centerY, 'play_btn', this.setNextState, game, 0, 0, 0);
		playBtn.anchor.setTo(0.5, 0.5);
	},
	update: function() {
		moveBG();
		moveGR();
	}
}

var bird;
var tubes;
var oldTube;
var scoreText;

var playState = {
	setTubes: function() {
		var tube, rndX,	topTube, rndTopRange, rndRange;
		tubes.removeAll();
		for(var i = 1; i < 7; i++){
			if(i % 2 == 1){
				rndX = 400*random.realInRange(0.4,0.8)+i*200;
				rndRange = random.integerInRange(120, 140);
				rndTopRange = random.integerInRange(-500, -200);

				tube = tubes.create(rndX, rndTopRange + 300, 'tube');
				game.physics.p2.enable(tube, false);
				tube.anchor.setTo(0, 0);
				tube.body.offset.x = -tube.width/2;
				tube.body.offset.y = -tube.height/2;
				tube.body.clearShapes();
    		tube.body.loadPolygon('physicsData', 'tube');
    		tube.body.static = true;
				topTube = tube;
			}else{
				tube = tubes.create(rndX, topTube.bottom + rndRange, 'tube');
				game.physics.p2.enable(tube, false);
				tube.anchor.setTo(1, 1);
				tube.body.offset.x = tube.width/2;
				tube.body.offset.y = -tube.height/2;
				tube.body.clearShapes();
    		tube.body.loadPolygon('physicsData', 'tube');
				tube.body.rotation += 180 * Math.PI/180; 
				tube.scale.x = -1;
				tube.body.static = true;
			}
			oldTube = topTube;
		}
	},
	setNewTubes: function() {
		var tube, rndX,	topTube, rndTopRange, rndRange;

		rndX = 400*random.realInRange(0.4,0.8)+oldTube.x+200;
		rndRange = random.integerInRange(115, 140);
		rndTopRange = random.integerInRange(-500, -200);

		tube = tubes.create(rndX, rndTopRange + 300, 'tube');
		game.physics.p2.enable(tube, false);
		tube.anchor.setTo(0, 0);
		tube.body.offset.x = -tube.width/2;
		tube.body.offset.y = -tube.height/2;
		tube.body.clearShapes();
		tube.body.loadPolygon('physicsData', 'tube');
		tube.body.static = true;
		topTube = tube;

		tube = tubes.create(rndX, topTube.bottom + rndRange, 'tube');
		game.physics.p2.enable(tube, false);
		tube.anchor.setTo(1, 1);
		tube.body.offset.x = tube.width/2;
		tube.body.offset.y = -tube.height/2;
		tube.body.clearShapes();
		tube.body.loadPolygon('physicsData', 'tube');		
		tube.body.rotation += 180 * Math.PI/180;
		tube.scale.x = -1;
		tube.body.static = true;
		oldTube = tube;
	},
	setVelBird: function() {
		bird.body.velocity.y = -430;
	},
	checkBirdPos: function() {
		tubes.children.forEach( function(el, index) {
			if(bird.body.x >= el.body.x + 45 && index % 2 == 1 && el.check == null){
				el.check = true;
				tubes.children[index-1].check = true;
				score++;
			}
		});
		if(bird.y < 0) this.hitBird();
		if(bird.y > game.height - hGR ) this.hitBird();
	},
	checkTubesPos: function() {
		setNewTubes = this.setNewTubes;
		tubes.children.forEach( function(el, index) {
			if(el.body.x+100 < 0){
				tubes.remove(el,false,true);
				setNewTubes();
			}
		});
	},
	hitBird: function() {
		game.state.start('end');
	},
	create: function() {
		setBG();

		score = 0;

		tubes = game.add.group();
		this.setTubes();

		bird = game.add.sprite(200, 200, 'bird');
		bird.anchor.setTo(0.5, 0.5);
		bird.animations.add('fly');
    bird.animations.play('fly', 10, true);

    game.physics.p2.enable(bird, false);

    bird.body.clearShapes();
    bird.body.loadPolygon('physicsData', 'bird');

    bird.body.onBeginContact.add(this.hitBird, game);

    scoreText = game.add.text(game.world.centerX, 50, score);
    scoreText.anchor.set(0.5);
    scoreText.align = 'center';
    scoreText.font = 'FlappyBird';
    scoreText.fontSize = 60;
    scoreText.fill = 'white';
    scoreText.stroke = 'black';
    scoreText.strokeThickness = 6;

		game.input.onDown.add(this.setVelBird, game);

		setGR();
	},
	update: function() {
		if (game.input.keyboard.isDown(Phaser.Keyboard.F1)) debug = true;

		moveBG();

		this.checkBirdPos();
		this.checkTubesPos();
		scoreText.text = score;

		//bird move
		bird.body.velocity.y += 20;
		bird.body.rotation = bird.body.velocity.y/15 * Math.PI/180;

		hitBird = this.hitBird;

		tubes.forEach(function(el) {
			game.physics.arcade.overlap(bird, el, hitBird, null, this);
		}, game);

		//tube move
		tubes.addAll('body.x', -speedGame);

		moveGR();
	},
	render: function() {
		if(debug == true){
			game.debug.body(bird);
			tubes.forEach(function(el) {
				game.debug.body(el);
			}, game);
		}
	}
}

var scoreEndText, restartText;

var endState = {
	setNewGame: function(){
		game.state.start('play');
	},
	create: function() {
		setBG();

		if(Cookies.get('bestScore') != undefined){
			if(score > Cookies.get('bestScore')) Cookies.set('bestScore', score, { expires: 7 });
		}else{
			Cookies.set('bestScore', score, { expires: 7 });
		}

		bestScore = Cookies.get('bestScore');

		var scoreEndText = game.add.text(game.world.centerX, game.world.centerY - 200, 'YOUR SCORE: ' + score);
    scoreEndText.anchor.set(0.5);
    scoreEndText.align = 'center';
    scoreEndText.font = 'FlappyBird';
    scoreEndText.fontSize = 60;
    scoreEndText.fill = 'white';
    scoreEndText.stroke = 'black';
    scoreEndText.strokeThickness = 6;

    var bestScoreText = game.add.text(game.world.centerX, game.world.centerY-100, 'BEST SCORE: ' + bestScore);
    bestScoreText.anchor.set(0.5);
    bestScoreText.align = 'center';
    bestScoreText.font = 'FlappyBird';
    bestScoreText.fontSize = 45;
    bestScoreText.fill = 'white';
    bestScoreText.stroke = 'black';
    bestScoreText.strokeThickness = 5;

    var restartText = game.add.text(game.world.centerX, game.world.centerY, 'CLICK ON THE SCREEN TO START A NEW GAME');
    restartText.anchor.set(0.5);
    restartText.align = 'center';
    restartText.font = 'FlappyBird';
    restartText.fontSize = 30;
    restartText.fill = 'white';
    restartText.stroke = 'black';
    restartText.strokeThickness = 5;

    game.input.onDown.addOnce(this.setNewGame, game);

		setGR();
	},
	update: function() {
		moveBG();
		moveGR();
	}
}

game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('end', endState);

game.state.start('load');
