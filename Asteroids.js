(function(A){

  A.sample = (A.sample || function(count) {
    sampleArray = [];
    count = count || 1;

    for(var i = 0; i < count; i++){
      sampleArray.push(this[Math.floor(Math.random() * this.length)])
    }

    if (count == 1) {
      return sampleArray[0];
    } else {
      return sampleArray;
    }
  })

  A.normalize = (A.normalize || function() {
    var mag = this.mag();

    return this.map(function(el){return el / mag});
  });

  A.rotate = (A.rotate || function (rads) {
    if (this.length != 2) {
      return false
    }

    var rotatedArr = [];
    rotatedArr.push(Math.cos(rads)*this[0] + Math.sin(rads)*this[1]);
    rotatedArr.push(Math.cos(rads)*this[1] - Math.sin(rads)*this[0]);

    return rotatedArr;
  });

  A.scale = (A.scale || function (mag) {
    return this.map(function(el){return el * mag});
  });

  A.add = (A.add || function (vector) {
    var result = [];

    for (var i = 0; i < vector.length; i++) {
      if (!this[i]) {
        result.push(vector[i])
      } else {
        result.push(this[i] + vector[i])
      }
    }

    return result;

    return result;
  });

  A.subtract = (A.subtract || function (vector) {
    var result = [];

    for (var i = 0; i < vector.length; i++) {
      if (!this[i]) {
        result.push(-vector[i])
      } else {
        result.push(this[i] - vector[i])
      }
    }

    return result;
  });

  A.pow = (A.pow || function (scalar) {
    return this.map(function(el){
      return Math.pow(el, scalar);
    })
  });

  A.mag = (A.mag || function() {
    var squares = this.map(function(el){return el * el});
    var sumOfSquares = squares.reduce(function(sum, el){return sum += el});
    return Math.sqrt(sumOfSquares);
  });

  A.distance = (A.distance || function (vector) {
    if (this.length != vector.length) {
      return false
    }

    var distX = this[0] - vector[0];
    var distY = this[1] - vector[1];

    //dist = sqrt(distX^2 + distY^2)
    return Math.sqrt((distX * distX) + (distY * distY));
  });

  A.remove = (A.remove || function (el) {
    for (var i = 0; i < this.length; i++) {
      if (el === this[i]) {
        this.splice(i, 1);
        return this;
      }
    }

    return false;
  });

  A.uniq = (A.uniq || function() {
    var uniqHash = {};
    var returnArray = [];

    for (var i = 0; i < this.length; i++) {
      if (!uniqHash[this[i]]) {
        uniqHash[this[i]] = true;
        returnArray.push(this[i]);
      }
    }

    return returnArray
  });

  A.nudge = (A.nudge || function() {
    return this.rotate((Math.random() / 8) * [-1, 1].sample());
  });
  
})(Array.prototype);;var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	var Store = global.Store = (global.Store || {});

	Store.inherits = function (child, parent) {
		function Surrogate(){};
		Surrogate.prototype = parent.prototype;
		child.prototype = new Surrogate();
	};

	Store.randomVel = function (radius) {
		var speedX = Math.random() * global.Asteroid.maxSpeed(radius) * [-1, 1].sample();
		var speedY = Math.random() * global.Asteroid.maxSpeed(radius) * [-1, 1].sample();

		return [speedX, speedY];
	};

	Store.randomColor = function() {
		var colorString = "#";

		for (var i = 0; i < 6; i++) {
			colorString += [1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F'].sample();
		}

		return colorString;
	};

	Store.uid = function(num) {
		num = num || 32;

		var arr = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

		var uid = '';

		for (var i = 0; i < num; i++) {
			uid += arr.sample();
		}

		return uid;
	};

	Store.assignOnclickToNodeList = function (nodeList, callback) {
		for (var i = 0; i < nodeList.length; i++) {
			nodeList[i].onclick = callback;
		}
	};

	// Store.randomRGB = function() {
	// 	// will output a string like '123, 231, 111'
	// 	var string = '';

	// 	string += Math.floor(Math.random() * 256);
	// 	string += ', ';
	// 	string += Math.floor(Math.random() * 256);
	// 	string += ', ';
	// 	string += Math.floor(Math.random() * 256);

	// 	return string;
	// }
})(Asteroids);var Asteroids = this.Asteroids = (this.Asteroids || {});

(function (global){

	MovingObject = global.MovingObject = function (pos, vel, radius) {
		this.radius = radius;
		this.pos = pos;
		this.vel = vel;
	};

	MovingObject.prototype.move = function() {
		this.pos[0] += this.vel[0]; 
		this.pos[1] += this.vel[1];
	};

	MovingObject.prototype.isCollidedWith = function (otherObject) {
		var otherRadius = otherObject.radius;
		var dist = this.pos.distance(otherObject.pos)

		if((otherRadius + this.radius) > dist){
			return true;
		} else {
			return false;
		}
	};

	// a strange function.  Never gets called.
	MovingObject.prototype.start = function (canvas) {
		var game = this;
		var ctx = canvasEl.getContext("2d");

		window.setInterval(function () {
			as1.move();
			as1.draw(ctx);

		}, 100);
	};


})(Asteroids);;var Asteroids = this.Asteroids = (this.Asteroids || {});

(function (global){

	var Store = global.Store;

	var Asteroid = global.Asteroid = function (opts) {
		this.radius = opts.radius;
		this.color = opts.color || Store.randomColor();
		this.pos = opts.pos;
		this.vel = opts.vel;
		this.health = this.radius;
	};

	Store.inherits(Asteroid, MovingObject);

	Asteroid.MAX_SPEED_MULTIPLIER = 1;
	Asteroid.RADII = [40, 25, 10];

	Asteroid.maxSpeed = function (radius) {
		radius = radius || Asteroid.RADII[0];

		return (Asteroid.MAX_SPEED_MULTIPLIER / 5) * Math.log(radius);
	};

	Asteroid.randomAsteroid = function (dimX, dimY) {
		var vals = Asteroid.randomAsteroidValues(dimX, dimY)

		return new Asteroid(vals);
	};

	Asteroid.randomAsteroidValues = function (dimX, dimY) {
		var radius = Asteroid.RADII[0];

		// could also if ( Math.round(Math.random()) )
		if ( [true, false].sample() ) {
			var posX = Math.random() * dimX;
			var posY = -radius;
		} else {
			var posX = -radius;
			var posY = Math.random() * dimX;
		}

		var vel = Store.randomVel(radius);
		var pos = [posX, posY];
		var color = Store.randomColor();

		return {pos: pos, vel: vel, radius: radius, color: color};
	};

	Asteroid.prototype.draw = function (ctx) {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(
      this.pos[0],
      this.pos[1],
      this.radius,
      0,
      2 * Math.PI,
      false
    );

		ctx.fill();
	};

	Asteroid.prototype.explode = function() {
		// create three new asteroids of size one smaller at pos

		var radius = Asteroid.RADII[Asteroid.RADII.indexOf(this.radius) + 1];

		if (!radius) {
			return [];
		}

		var newAsteroidOpts = [];

		var vel;
		var color;
		for (var i = 0; i < 3; i++) {
			var pos = [];
			pos[0] = this.pos[0]// + [1,2,3].sample() * this.radius;
			pos[1] = this.pos[1]// + [1,2,3].sample() * this.radius;

			vel = Store.randomVel(radius);
			color = Store.randomColor();

			var opts = { pos: pos, vel: vel, radius: radius, color: color }
			newAsteroidOpts.push(opts);
		}

		return newAsteroidOpts;
	};

})(Asteroids);;var Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var Ship = global.Ship = function (pos) {
		var pos = pos;
		var vel = [0, 0];
		var radius = 20 / 3;
		this.orientation = [0,-1];
		this.rotateSpeed = 0.25;
		this.impulse = 0.4;
		this.dampenRate = 0.95;
		this.fireFrequency = 200;
		this.health = 40;
		this.damage = 15;

		this.kineticBullets = true;
		this.bulletWeight = 0.5;

		global.MovingObject.call(this, pos, vel, radius);
	};

	Store.inherits(Ship, MovingObject);

	Ship.prototype.power = function () {
		this.vel = this.vel.add(this.orientation.scale(this.impulse));
	};

	Ship.prototype.releaseExhaust = function (count) {
		var exhaustParticleOptions = {
			'ship': this
		}

		var particles = [];
		if (!count) { var count = 1 }

		for (var i = 0; i < count; i++) {
			particles.push(new global.ExhaustParticle(exhaustParticleOptions));
		}

		return particles;
	};

	Ship.prototype.turn = function (direction, percentage) {
		if (direction === 'left') {
			var mod = 1;
		} else {
			var mod = -1;
		}

		this.orientation = this.orientation.rotate(mod * this.rotateSpeed * percentage); 
	};

	Ship.prototype.dampen = function () {
		var dampenRate = this.dampenRate;

		if (this.vel.mag() < 3) {
			// this.vel = [0, 0];
			dampenRate = 0.5;
			this.vel = this.vel.scale(dampenRate);
		} else {
			dampenRate = this.dampenRate;
			this.vel = this.vel.scale(dampenRate);
		}
	}

	Ship.prototype.fire = function() {
		this.recoil();
		return new global.Bullet(this);
	}

	Ship.prototype.recoil = function() {
		if (this.kineticBullets) {
			this.vel = this.vel.subtract(this.orientation.scale(this.bulletWeight))
		}
	}

	Ship.prototype.draw = function (ctx) {
		var height = this.radius * 3;
		var base = 0.3;
		var or = this.orientation;

		var start = this.pos;
		var pt1 = start.add(or.scale(height / 1.5));
		var pt2 = pt1.add(or.scale(-height).rotate(base));
		var pt3 = pt1.add(or.scale(-height).rotate(-base));
		var pt4 = pt1;

		ctx.fillStyle = 'black';
		ctx.strokeStyle = 'red';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(pt1[0], pt1[1]);
		ctx.lineTo(pt2[0], pt2[1]);
		ctx.lineTo(pt3[0], pt3[1]);
		ctx.lineTo(pt4[0], pt4[1]);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	};

	// Ship.prototype.drawExhaustParticles = function (ctx) {
	// 	this.exhaustParticles.forEach(function(particle){
	// 		particle.draw(ctx);
	// 	})
	// };

})(Asteroids);;var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var ServerGame = global.ServerGame = function(ServerListener, ServerResponder, width, height) {
		this.ServerListener = ServerListener;
		this.ServerResponder = ServerResponder;
		ServerListener.game = this;
		ServerResponder.game = this;
		this.WIDTH = width;
		this.HEIGHT = height;
		this.ships = [];
		this.asteroids = [];
		this.noExplodeAsteroids = [];
		this.bullets = [];
		this.FPS = 30;
		this.repopulationRate = 30;
		this.difficultyRate = 0.6;
		this.level = 1;
		this.initialize();
	};

	ServerGame.prototype.addAsteroids = function (numAsteroids) {
		var asteroidOpts;

		for (var i = 0; i < numAsteroids; i++) {
			asteroidOpts = global.Asteroid.randomAsteroidValues(this.WIDTH, this.HEIGHT);
			this.asteroids.push(new global.Asteroid(asteroidOpts));
			this.ServerResponder.sendAsteroid(asteroidOpts);
		}
	};

	ServerGame.prototype.addShip = function() {
		// this.ship = new global.Ship([this.WIDTH / 2, this.HEIGHT / 2]);

		// will be on a per client joining basis, the ship added will be the client's
	};

	// ServerGame.prototype.addReadout = function() {
	// 	var options = {
	// 		'ship': this.ship,
	// 		'game': this
	// 	}

	// 	this.readout = new global.Readout(options)
	// };

	// ServerGame.prototype.addBackground = function() {
	// 	this.background = new global.Background(this);
	// };

	ServerGame.prototype.fireShip = function (ship) {
		// this.bullets.push(ship.fire());

		// add bullets that are created by the clients
	};

	// ServerGame.prototype.powerShip = function (ship) {
	// 	ship.power();
	// 	this.exhaustParticles = this.exhaustParticles.concat(ship.releaseExhaust(2));
	// };

	// ServerGame.prototype.turnShip = function (ship, dir, percentage) {
	// 	ship.turn(dir, percentage);
	// };

	// ServerGame.prototype.dampenShip = function (ship) {
	// 	ship.dampen();
	// }

	// ServerGame.prototype.draw = function() {
	// 	var game = this;

	// 	// clear the canvas
	// 	this.ctx.clearRect(0,0,this.WIDTH, this.HEIGHT);

	// 	// background
	// 	this.background.draw(this.ctx);

	// 	// ship exhaust particles
	// 	this.exhaustParticles.forEach(function(ep){
	// 		ep.draw(game.ctx);
	// 	})

	// 	// asteroids
	// 	this.asteroids.forEach(function(asteroid){
	// 		asteroid.draw(game.ctx);
	// 	})

	// 	// bullets
	// 	this.bullets.forEach(function(bullet){
	// 		bullet.draw(game.ctx);
	// 	})

	// 	// ship
	// 	this.ship.draw(this.ctx);

	// 	// readout text
	// 	this.readout.draw(this.ctx);

	// 	// exploding texts
	// 	this.explodingTexts.forEach(function(txt){
	// 		txt.draw(game.ctx);
	// 	})
	// };

	ServerGame.prototype.move = function() {
		this.asteroids.forEach(function(asteroid){
			asteroid.move();
		});

		this.ships.forEach(function(ship){
			ship.move();
		});

		this.bullets.forEach(function(bullet){
			bullet.move();
		});

		// this.exhaustParticles.forEach(function(ep){
		// 	ep.move();
		// })

		// this.background.move();
	};

	// ServerGame.prototype.announce = function (txt, independentTimer) {
	// 	var independentTimer = independentTimer || false;

	// 	var explodingTextOptions = {
	// 		'game': this,
	// 		'txt': txt,
	// 		'independentTimer': independentTimer
	// 	}

	// 	this.explodingTexts.push(new global.ExplodingText(explodingTextOptions))
	// }

	ServerGame.prototype.levelUp = function() {
		this.level += 1;
		this.announce('Level ' + this.level);

		this.repopulateAsteroids();
		this.modifyDifficulty();
	};

	ServerGame.prototype.clearOOBObjects = function() {
		// this.clearOOBAsteroids();
		this.clearOOBBullets();
		// this.clearOOBExhaustParticles();
	}

	ServerGame.prototype.clearOOBAsteroids = function() { // substituted for wrap around
		var posX;
		var posY;
		var as;

		for(var i = 0; i < this.asteroids.length; i++){
			as = this.asteroids[i];

			posX = as.pos[0];
			posY = as.pos[1];


			if ((posX - as.RADIUS > this.WIDTH || posX + as.RADIUS < 0) || 
				(posY - as.RADIUS > this.HEIGHT || posY + as.RADIUS < 0)) {
				this.asteroids.splice(i, 1);
				this.addAsteroids(1);
			}
		}
	};

	ServerGame.prototype.clearOOBBullets = function() {
		var bullet;
		var posX;
		var posY;

		for (var i = 0; i < this.bullets.length; i++) {
			bullet = this.bullets[i];
			posX = bullet.pos[0];
			posY = bullet.pos[1];

			if (posX < 0 || posY < 0 || posX > this.WIDTH || posY > this.HEIGHT) {
				this.bullets.splice(i, 1);
			}
		}
	};

	// ServerGame.prototype.clearOOBExhaustParticles = function() {
	// 	var ep;
	// 	var posX;
	// 	var posY;

	// 	for (var i = 0; i < this.exhaustParticles.length; i++) {
	// 		ep = this.exhaustParticles[i];
	// 		posX = ep.pos[0];
	// 		posY = ep.pos[1];

	// 		if (posX < 0 || posY < 0 || posX > this.WIDTH || posY > this.HEIGHT) {
	// 			this.exhaustParticles.splice(i, 1);
	// 		}
	// 	}
	// };

	ServerGame.prototype.wrapMovingObjects = function() {
		var game = this;

		var movingObjects = [];
		movingObjects = movingObjects.concat(game.asteroids).concat(game.ships);

		movingObjects.forEach(function(object){
			if ( (object.pos[0] + object.radius) < 0) {
				object.pos[0] += (game.WIDTH + 2 * object.radius);
			}

			if ( (object.pos[1] + object.radius) < 0) {
				object.pos[1] += (game.HEIGHT + 2 * object.radius);
			}

			if ( (object.pos[0] - object.radius) > game.WIDTH) {
				object.pos[0] -= (game.WIDTH + 2 * object.radius);
			}

			if ( (object.pos[1] - object.radius) > game.HEIGHT) {
				object.pos[1] -= (game.HEIGHT + 2 * object.radius);
			}	
		})
	};

	ServerGame.prototype.asteroidCollisionPairs = function() {
		var collisions = [];

		for (var i = 0; i < this.asteroids.length; i++) {
			for (var j = i + 1; j < this.asteroids.length; j++) {
				if ( this.asteroids[i].isCollidedWith(this.asteroids[j]) ) {
					collisions.push([this.asteroids[i], this.asteroids[j]]);
				}
			}
		}

		return collisions
	};

	ServerGame.prototype.asteroidCollisions = function() {
		return this.asteroidCollisionPairs().uniq
	};

	ServerGame.prototype.asteroidBulletCollisions = function() {
		var game = this;
		var collisions = [];

		this.bullets.forEach(function(bullet){
			game.asteroids.forEach(function(asteroid){
				if (bullet.isCollidedWithAsteroid(asteroid)) {
					collisions.push([asteroid, bullet]);
				}
			})
		})

		return collisions;
	};

	ServerGame.prototype.depopulateNoExplodeAsteroids = function() {
		var game = this;

		this.noExplodeAsteroids.forEach(function(as1){
			var alone = game.noExplodeAsteroids.every(function(as2){
				if (as1 === as2) {
					return true
				}

				return !as1.isCollidedWith(as2);
			})

			if (alone) {
				game.noExplodeAsteroids.remove(as1);
			}
		})
	};

	ServerGame.prototype.explodeAsteroid = function(asteroid) {
		var game = this;

		this.asteroids.remove(asteroid);
		var newAsteroidOpts = asteroid.explode();
		var newAsteroids = newAsteroidOpts.map(function(opts){
			return new global.Asteroid(opts);
		})

		this.noExplodeAsteroids = this.noExplodeAsteroids.concat(newAsteroids);
		this.asteroids = this.asteroids.concat(newAsteroids);

		newAsteroidOpts.forEach(function(opts){
			game.ServerResponder.sendAsteroid(opts);
		})
	};

	ServerGame.prototype.damageAsteroid = function(asteroid, damage) {
		asteroid.health -= damage;
	};

	ServerGame.prototype.removeBullet = function (bullet) {
		this.bullets.remove(bullet);
	};

	ServerGame.prototype.repopulateAsteroids = function() {
			this.addAsteroids(5);
	};

	ServerGame.prototype.modifyDifficulty = function() {
			this.changeAsteroidSpeed(this.difficultyRate);
	};

	ServerGame.prototype.changeAsteroidSpeed = function (amnt) {
		Asteroids.Asteroid.MAX_SPEED_MULTIPLIER += amnt;
	};

	ServerGame.prototype.handleCollidingAsteroids = function (as1, as2) {
		this.damageAsteroid(as1, as2.radius);
		this.damageAsteroid(as2, as1.radius);
	};

	ServerGame.prototype.handleCollidedShip = function (ship, asteroid) {
		game.explodeAsteroid(asteroid);
		global.Visuals.hit(game.canvas);
		ship.health -= asteroid.radius;
	};

	ServerGame.prototype.handleAsteroidBulletCollisions = function (as, bullet) {
		this.damageAsteroid(as, bullet.damage);
		this.removeBullet(bullet);
	};

	// ServerGame.prototype.handleExplodedText = function (txt) {
	// 	this.explodingTexts.remove(txt);
	// };

	ServerGame.prototype.detectCollidingAsteroids = function() {
		var game = this;

		this.asteroidCollisionPairs().forEach(function(asteroidPair){
			if (game.noExplodeAsteroids.indexOf(asteroidPair[0]) === -1) {
				game.handleCollidingAsteroids(asteroidPair[0], asteroidPair[1]);
			}
		})
	};

	ServerGame.prototype.detectHitAsteroids = function() {
		var game = this;

		this.hitAsteroids().forEach(function(asteroid){
			game.handleHitAsteroid(asteroid);
		})
	};

	ServerGame.prototype.detectHitShip = function() {
		var game = this;
		var ship;
		var as;

		for (var i = 0; i < this.ships.length; i++) {
			for (var j = 0; j < this.asteroids.length; j++) {
				ship = this.ships[i]; as = this.asteroids[j];

				if (ship.isCollidedWith(as)) {
					game.handleCollidedShip(ship, as);
				}
			}
		}
	};

	ServerGame.prototype.detectAsteroidBulletCollisions = function() {
		var game = this;

		this.asteroidBulletCollisions().forEach(function(col){
			game.handleAsteroidBulletCollisions(col[0], col[1]);
		})
	};

	ServerGame.prototype.detectBulletHits = function() {
		var game = this;

		this.collidedBullets().forEach(function(bullet){
			game.removeBullet(bullet);
			game.handleBulletHits(bullet);
		})
	};

	ServerGame.prototype.detectDestroyedObjects = function() {
		var game = this;

		this.asteroids.forEach(function(asteroid){
			if (asteroid.health <= 0) {
				game.explodeAsteroid(asteroid);
			}
		});
	};

	// ServerGame.prototype.detectExplodedTexts = function() {
	// 	var game = this;

	// 	this.explodingTexts.forEach(function(txt){
	// 		if (txt.alpha <= 0) {
	// 			game.handleExplodedText(txt);
	// 		}
	// 	})
	// };

	ServerGame.prototype.detectLevelChangeReady = function() {
		if (this.asteroids.length == 0) {
			this.levelUp();
		}
	};

	ServerGame.prototype.detect = function() {
		this.detectCollidingAsteroids();
		this.detectAsteroidBulletCollisions();
		this.detectHitShip();
		this.detectDestroyedObjects();
		// this.detectExplodedTexts();
		this.detectLevelChangeReady();
	};

	ServerGame.prototype.step = function() {
		// this.clearOOBAsteroids();
		this.clearOOBObjects();
		this.depopulateNoExplodeAsteroids();
		this.wrapMovingObjects();
		this.detect();
		// this.draw();
		this.move();
	};

	ServerGame.prototype.pause = function() {
		if (this['mainTimer']) {
			this.stop();
			this.announce('Pause', true);
		} else {
			this.start();
			this.announce('Resume')
		}
	};

	ServerGame.prototype.stop = function() {
		clearInterval(this['mainTimer']);
		delete this['mainTimer'];
	};

	ServerGame.prototype.start = function() {
		var that = this;
		this['mainTimer'] = setInterval(function () {
			that.step();
		}, that.FPS);
	};

	ServerGame.prototype.initialize = function() {
		this.addAsteroids(5);
		this.addShip();
		// this.addReadout();
		// this.addBackground();
		// new global.Listener(this);
		this.start();
	};

})(Asteroids);;var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	var ServerListener = global.ServerListener = function (socket, gameID) {
		this.socket = socket;
		this.gameID = gameID;
		//this.game is assigned in server_game.js
	};

	ServerListener.prototype.eventString = function (event) {
		return event + this.gameID;
	}

	ServerListener.prototype.initialize = function() {
		var eventString;

		eventString = this.eventString('')
		this.socket.on(eventString, function (data) {
			
		})

	};


})(Asteroids);// OK server_game.js holds all the state, server_listener.js listens for client speak, server_responder.js will give the clients what they ask for.  Not totally sure if this file will be necessary, it may be able to be combined into the server_game.  Either way, it'll interact heavily with the server_game.

// Also one thing to remember is that every event is going to have to have the gameID in it.

var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	var ServerResponder = global.ServerResponder = function (socket, gameID) {
		this.socket = socket;
		this.gameID = gameID;
		global.gameID = gameID;
		// this.game assigned in server_game.js;
	}

	ServerResponder.prototype.sendAsteroid = function (asteroidOpts) {
		console.log('sending asteroids down')
		console.log('called with ' + st('addAsteroid'))
		console.log('gameID is ' + this.gameID)
		this.socket.emit(st('addAsteroid'), asteroidOpts);
	}

	var st = function (str) {
		return str + global.gameID;
	}
})(Asteroids);var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	// When initialized, Sessions will act just like a regular hash, but it will have some extra helpers that are designed to satisfy some requirements not met by the regular hash object.  Another way to do this would be to modify the hash prototype, but I'm not sure what kind of effects that may have on the node environment.


	var Sessions = global.Sessions = function() {

	};

	Sessions.prototype.keys = function() {
		var keys = [];

		for (i in this) {
			keys.push(i);
		}

		return keys;
	}
})(Asteroids)
module.exports = Asteroids;