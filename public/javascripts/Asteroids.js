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
  
})(Array.prototype);
(function(global) {
	// Warning.  This is a naive approach to inheriting from Array.  The special length properties no longer work correctly.  See http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/ for a more detailed explanation.

	var Vector = global.Vector = function (arr) {
		if (arr && arr.constructor == Array) {
			this.push.apply(this, arr);
		} else {
			this.push.apply(this, arguments);
		}
	}

	// class inheritance //
	var Surrogate = function(){};
	Surrogate.prototype = Array.prototype;
	Vector.prototype = new Surrogate;
	///////////////////////

	Vector.prototype.normalize = function() {
    var mag = this.mag();

    if (mag == 0) {
      return new Vector([0, 0]);
    }
    
    return new Vector(this.map(function(el){return el / mag}));
  };

  Vector.prototype.rotate = function (rads) {
    if (this.length != 2) {
      return false
    }

    var rotatedArr = new Vector;
    rotatedArr.push(Math.cos(rads)*this[0] + Math.sin(rads)*this[1]);
    rotatedArr.push(Math.cos(rads)*this[1] - Math.sin(rads)*this[0]);

    return rotatedArr;
  };

  Vector.prototype.scale = function (mag) {
    return new Vector(this.map(function(el){return el * mag}));
  };

  Vector.prototype.add = function (vector) {
    var result = new Vector;

    for (var i = 0; i < vector.length; i++) {
      if (!this[i]) {
        result.push(vector[i])
      } else {
        result.push(this[i] + vector[i])
      }
    }

    return result;

    return result;
  };

  Vector.prototype.subtract = function (vector) {
    var result = new Vector;

    for (var i = 0; i < vector.length; i++) {
      if (!this[i]) {
        result.push(-vector[i])
      } else {
        result.push(this[i] - vector[i])
      }
    }

    return result;
  };

  Vector.prototype.pow = function (scalar) {
    return this.map(function(el){
      return Math.pow(el, scalar);
    })
  };

  Vector.prototype.mag = function() {
    var squares = this.map(function(el){return el * el});
    var sumOfSquares = squares.reduce(function(sum, el){return sum += el});
    return Math.sqrt(sumOfSquares);
  };

  Vector.prototype.distance = function (vector) {
    if (this.length != vector.length) {
      return false
    }

    var distX = this[0] - vector[0];
    var distY = this[1] - vector[1];

    //dist = sqrt(distX^2 + distY^2)
    return Math.sqrt((distX * distX) + (distY * distY));
  };

  Vector.prototype.nudge = function (maxRadians) {
    // maxRadians is the max radians the vector will be nudged

    var maxRadians = maxRadians || Math.random() * 0.125;

    return this.rotate(Math.random() * (maxRadians / 2) * [-1, 1].sample());
  };

  Vector.prototype.slinky = function (maxDegree) {
    // stretch or shrink a vector at max maxDegree, randomly

    var maxDegree = maxDegree || Math.random() * 1;

    return this.scale(maxDegree + 1);
  };

  Vector.prototype.direction = function (foreignLoc) {
    return foreignLoc.subtract(this).normalize();
  };

  Vector.prototype.influence = function (direction, amount) {
    // direction is a this.length dimensional vector / array

    return this.add(direction.normalize().scale(amount));
  };

  Vector.prototype.gravity = function (location, foreignMass) {
    var G = 0.0000000000667;
    var dist = this.distance(location);
    if (dist == 0) dist = 0.001;
    var g = (G * foreignMass) / Math.pow(dist, 1);
    return this.direction(location).scale(g);
  }

  Vector.prototype.to_a = function() {
    var arr = [];

    for (var i = 0; i < this.length; i++) {
      arr.push(this[i]);
    }

    return arr;
  };
})(this);
var Asteroids = this.Asteroids = (this.Asteroids || {});

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

	Store.nudgers = function (count) {
		var nudgers = new Vector();
		var nudger;

		for (var i = 0; i < count; i++) {
			nudger = (Math.random() * 0.4) + 0.8;
			nudgers.push(nudger);
		}

		return nudgers;
	}

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
})(Asteroids)
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global) {
	var Cookies = global.Cookies = {
		_getCookieObject: function() {
			var kvo = {};
			var kva;

			document.cookie.split(';').forEach(function (kv) {
				kva = kv.split('=');
				kvo[kva[0]] = kva[1];
			})

			return kvo;
		},

		get: function (cookieName) {
			return Cookies._getCookieObject()[cookieName];
		},

		set: function (cookieName, cookieValue) {
			document.cookie = cookieName + "=" + cookieValue;
		}
	}

})(Asteroids);
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function (global){

	var Store = global.Store;

	MovingObject = global.MovingObject = function (pos, vel, radius) {
		this.radius = radius;
		this.pos = new Vector(pos);
		this.vel = new Vector(vel);
		this.id = this.id || Store.uid();
	};

	MovingObject.prototype.move = function() {
		this.pos[0] += this.vel[0];
		this.pos[1] += this.vel[1];
	};

	MovingObject.prototype.gravitate = function (massiveObject) {
		var location = massiveObject.pos;
		this.vel = this.vel.add(this.pos.gravity(location, massiveObject.mass));
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


})(Asteroids);
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function (global){

	var Store = global.Store;

	var Asteroid = global.Asteroid = function (opts) {
		this.color = opts.color || Store.randomColor();
		this.health = opts.radius;
		this.id = opts.id || null;
		this.edgeCount = opts.edgeCount || Asteroid.EDGE_COUNTS.sample();
		this.edgeNudgers = opts.edgeNudgers || Store.nudgers(this.edgeCount);
		this.rotationRate = opts.rotationRate || Math.random() * 0.1 * [-1, 1].sample();
		this.orientation = opts.orientation ? new Vector(opts.orientation) : new Vector([0, 1]);

		MovingObject.call(this, opts.pos, opts.vel, opts.radius);
	};

	Store.inherits(Asteroid, MovingObject);

	Asteroid.MAX_SPEED_MULTIPLIER = 1;
	Asteroid.RADII = [40, 25, 10];
	Asteroid.EDGE_COUNTS = [7, 8, 9, 10, 11, 12, 13, 14, 15];

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
		var id = Store.uid();

		return {pos: pos, vel: vel, radius: radius, color: color, id: id};
	};

	Asteroid.prototype.move = function() {
		// like ruby's 'super' but much less awesome
		this.__proto__.__proto__.move.call(this);

		this.orientation = this.orientation.rotate(this.rotationRate);
	}

	Asteroid.prototype.draw = function (ctx) {
		var toLine;
		ctx.beginPath();
		var start = this.pos.add(this.orientation.rotate(0).scale(this.radius * this.edgeNudgers[0]))
		ctx.moveTo(start[0], start[1]);

		for (var i = 0; i < this.edgeCount; i++) {
			toLine = this.pos.add(this.orientation.rotate(i * 2 * Math.PI / this.edgeCount).scale(this.radius * this.edgeNudgers[i]))

			ctx.lineTo(toLine[0], toLine[1]);
		}

		ctx.fillStyle = this.color;
		ctx.fill();
	}

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
			pos[0] = this.pos[0];
			pos[1] = this.pos[1];

			vel = Store.randomVel(radius);
			// vel = this.vel.nudge(1).slinky();
			color = Store.randomColor();

			var opts = { pos: pos, vel: vel, radius: radius, color: color }
			newAsteroidOpts.push(opts);
		}

		return newAsteroidOpts;
	};

	Asteroid.prototype.getState = function() {
		var state = {
			type: 'asteroid',
			radius: this.radius,
			pos: this.pos.to_a(),
			vel: this.vel.to_a(),
			id: this.id,
			health: this.health,
			color: this.color,
			rotationRate: this.rotationRate,
			edgeNudgers: this.edgeNudgers,
			orientation: this.orientation.to_a(),
			edgeCount: this.edgeCount
		}

		return state;
	}

})(Asteroids);
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global) {
	var GlobalGame = global.GlobalGame = function() {
		this.ships = [];
		this.asteroids = [];
		this.noExplodeAsteroids = [];
		this.bullets = [];
		this.blackHoles = [];
		this.FPS = 30;
		this.repopulationRate = 30;
		this.difficultyRate = 0.6;
		this.level = 1;
		this._counter = 1;
		this.asteroidKills = 1;
	}

	GlobalGame.prototype.clearOOBAsteroids = function() { // substituted for wrap around
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

	GlobalGame.prototype.clearOOBBullets = function() {
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

	GlobalGame.prototype.movingObjects = function() {
		return []
			.concat(this.asteroids)
				.concat(this.ships)
					.concat(this.blackHoles)
						.concat(this.bullets);
	}

	GlobalGame.prototype.nonBulletMovingObjects = function() {
		return []
			.concat(this.asteroids)
				.concat(this.ships)
					.concat(this.blackHoles);
	}

	GlobalGame.prototype.wrapMovingObjects = function (movingObjects) {
		var game = this;

		if (!movingObjects) {
			var movingObjects = this.nonBulletMovingObjects();
		}

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

	GlobalGame.prototype.asteroidCollisionPairs = function() {
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

	GlobalGame.prototype.asteroidCollisions = function() {
		return this.asteroidCollisionPairs().uniq
	};

	GlobalGame.prototype.asteroidBulletCollisions = function() {
		var game = this;
		var collisions = [];

		this.bullets.forEach(function(bullet){
			game.asteroids.forEach(function(asteroid){
				if (bullet.isCollidedWith(asteroid)) {
					collisions.push([asteroid, bullet]);
				}
			})
		})

		return collisions;
	};

	GlobalGame.prototype.collidedBullets = function() {
		var game = this;
		var bullets = [];

		this.bullets.forEach(function(bullet){
			game.asteroids.forEach(function(asteroid){
				if (bullet.isCollidedWith(asteroid)) {
					bullets.push(bullet);
				}
			})
		})

		return bullets;
	};

	GlobalGame.prototype.depopulateNoExplodeAsteroids = function() {
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

	GlobalGame.prototype.repopulateAsteroids = function() {
			this.addAsteroids(5);
	};

	GlobalGame.prototype.modifyDifficulty = function() {
			this.changeAsteroidSpeed(this.difficultyRate);
	};

	GlobalGame.prototype.damageAsteroid = function (asteroid, damage) {
		asteroid.health -= damage;
	};

	GlobalGame.prototype.growBlackHole = function (blackHole, amt) {
		blackHole.grow(amt);
		console.log('growing black hole')
	};

	GlobalGame.prototype.changeAsteroidSpeed = function (amnt) {
		Asteroids.Asteroid.MAX_SPEED_MULTIPLIER += amnt;
	};

	GlobalGame.prototype.handleCollidingAsteroids = function (as1, as2) {
		this.damageAsteroid(as1, as2.radius);
		this.damageAsteroid(as2, as1.radius);
	};

	GlobalGame.prototype.handleAsteroidBulletCollisions = function (as, bullet) {
		this.damageAsteroid(as, bullet.damage);
		this.removeBullet(bullet);
		this.ticAsteroidKills();
	};

	GlobalGame.prototype.handleShipBlackHoleCollisions = function (ship) {
		this.handleDestroyedShip(ship);
	};

	GlobalGame.prototype.handleBulletBlackHoleCollisions = function (bullet) {
		this.removeBullet(bullet);
	};

	GlobalGame.prototype.detectShipBlackHoleCollisions = function() {
		var game = this;

		this.ships.forEach(function (ship) {
			game.blackHoles.forEach(function (bh) {
				if (ship.isCollidedWith(bh)) {
					game.handleShipBlackHoleCollisions(ship);
				}
			})
		})
	};

	GlobalGame.prototype.detectBulletBlackHoleCollisions = function() {
		var game = this;

		this.bullets.forEach(function (bullet) {
			game.blackHoles.forEach(function (bh) {
				if (bullet.isCollidedWith(bh)) {
					game.handleBulletBlackHoleCollisions(bullet);
				}
			})
		})
	};

	GlobalGame.prototype.detectCollidingAsteroids = function() {
		var game = this;

		this.asteroidCollisionPairs().forEach(function(asteroidPair){
			if (game.noExplodeAsteroids.indexOf(asteroidPair[0]) === -1) {
				game.handleCollidingAsteroids(asteroidPair[0], asteroidPair[1]);
			}
		})
	};

	GlobalGame.prototype.detectCollidedShip = function() {
		for (var i = 0; i < this.ships.length; i++) {
			for (var j = 0; j < this.asteroids.length; j++) {
				ship = this.ships[i]; as = this.asteroids[j];

				if (ship.isCollidedWith(as)) {
					this.handleCollidedShip(ship, as);
				}
			}
		}
	};

	GlobalGame.prototype.detectHitAsteroids = function() {
		var game = this;

		this.hitAsteroids().forEach(function(asteroid){
			game.handleHitAsteroid(asteroid);
		})
	};

	GlobalGame.prototype.detectAsteroidBulletCollisions = function() {
		var game = this;

		this.asteroidBulletCollisions().forEach(function(col){
			game.handleAsteroidBulletCollisions(col[0], col[1]);
		})
	};

	GlobalGame.prototype.detectAsteroidBlackHoleCollisions = function() {
		var game = this;

		this.blackHoles.forEach(function (blackHole) {
			game.asteroids.forEach(function (asteroid) {
				if (asteroid.isCollidedWith(blackHole)) {
					game.handleAsteroidBlackHoleCollisions(asteroid, blackHole);
				}
			})
		})
	}

	GlobalGame.prototype.detectBulletHits = function() {
		var game = this;

		this.collidedBullets().forEach(function(bullet){
			game.handleBulletHits(bullet);
		})
	};

	GlobalGame.prototype.detectLevelChangeReady = function() {
		if (this.asteroids.length == 0) {
			this.levelUp();
		}
	};

	GlobalGame.prototype.detectAddBlackHoleReady = function() {
		if (this.asteroidKills % 25 == 0) {
			this.addBlackHole();
			this.ticAsteroidKills();
		}
	};

	GlobalGame.prototype.get = function (objID) {
		var objects = this.movingObjects();
		var matchingObj;

		objects.forEach(function (obj) {
			if (obj.id === objID) {
				matchingObj = obj;
				return
			}
		})

		return matchingObj;
	};

	GlobalGame.prototype.tic = function() {
		this._counter += 1;
	}

	GlobalGame.prototype.ticAsteroidKills = function() {
		this.asteroidKills += 1;
	}

	GlobalGame.prototype.stop = function() {
		clearInterval(this['mainTimer']);
		delete this['mainTimer'];
	};

	GlobalGame.prototype.start = function() {
		var that = this;
		this['mainTimer'] = setInterval(function () {
			that.step();
		}, that.FPS);
	};

})(Asteroids)
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global) {

	var Store = global.Store;

	var ClientGame = global.ClientGame = function (canvasEl) {
		this.canvas = canvasEl;
		this.ctx = canvasEl.getContext("2d");
		this.WIDTH = canvasEl.width;
		this.HEIGHT = canvasEl.height;
		this.exhaustParticles = [];
		this.explodingTexts = [];
		this.dropShadowColor = 'red';

		global.GlobalGame.call(this);
	}

	Store.inherits(ClientGame, global.GlobalGame);

	ClientGame.prototype.addReadout = function() {
		var options = {
			'game': this
		}

		this.readout = new global.Readout(options)
	};

	ClientGame.prototype.addBackground = function() {
		this.background = new global.Background(this);
	};

	ClientGame.prototype.addBlackHole = function (bhOpts) {
		if (!bhOpts) var bhOpts = global.BlackHole.randomBlackHoleValues();
		this.blackHoles.push(new global.BlackHole(bhOpts));
		this.announce('black hole');
	};

	ClientGame.prototype.lost = function() {
		this.stop();
		this.announce('You\'ve lost.', true);
		this.pause = null;
		global.Visuals.restartScreen();
	};

	ClientGame.prototype.starBlackHoleCollisions = function() {
		var game = this;
		var stars = [];

		this.background.stars.forEach(function (star) {
			game.blackHoles.forEach(function (blackHole) {
				if (star.isCollidedWith(blackHole)) {
					stars.push(star);
				}
			})
		})

		return stars;
	};

	ClientGame.prototype.exhaustParticleBlackHoleCollisions = function() {
		var game = this;
		var exhaustParticles = [];

		this.exhaustParticles.forEach(function (ep) {
			game.blackHoles.forEach(function (bh) {
				if (bh.isCollidedWith(ep)) exhaustParticles.push(ep);
			})
		})

		return exhaustParticles;
	};

	ClientGame.prototype.draw = function() {
		var game = this;

		// clear the canvas
		this.ctx.clearRect(0,0,this.WIDTH, this.HEIGHT);

		// background
		this.background.draw(this.ctx);

		// ship exhaust particles
		this.exhaustParticles.forEach(function (ep) {
			ep.draw(game.ctx);
		})

		// bullets
		this.bullets.forEach(function (bullet) {
			bullet.draw(game.ctx);
		})

		// asteroids
		this.asteroids.forEach(function (asteroid) {
			asteroid.draw(game.ctx);
		})

		// ship
		this.ships.forEach(function (ship) {
			ship.draw(game.ctx);
		})

		this.blackHoles.forEach(function (blackHole) {
			blackHole.draw(game.ctx);
		})

		// readout text
		this.readout.draw(this.ctx);

		// exploding texts
		this.explodingTexts.forEach(function (txt) {
			txt.draw(game.ctx);
		})
	};

	ClientGame.prototype.move = function() {
		var game = this;

		this.blackHoles.forEach(function (blackHole) {
			game.movingObjects().forEach(function (object) {
				object.gravitate(blackHole);
			})

			game.background.stars.forEach(function (star) {
				star.gravitate(blackHole);
			})

			game.exhaustParticles.forEach(function (ep) {
				ep.gravitate(blackHole);
			})
		})

		this.asteroids.forEach(function(asteroid){
			asteroid.move();
		});

		this.ships.forEach(function (ship) {
			ship.move();
		})

		this.bullets.forEach(function (bullet) {
			bullet.move();
		});

		this.exhaustParticles.forEach(function (ep) {
			ep.move();
		})

		this.blackHoles.forEach(function (blackHole) {
			blackHole.move();
		})

		this.background.move();
	};

	ClientGame.prototype.announce = function (txt, independentTimer) {
		var independentTimer = independentTimer || false;

		var explodingTextOptions = {
			'game': this,
			'txt': txt,
			'independentTimer': independentTimer
		}

		this.explodingTexts.push(new global.ExplodingText(explodingTextOptions))
	}

	ClientGame.prototype.clearOOBObjects = function() {
		// this.clearOOBAsteroids();
		this.clearOOBBullets();
		this.clearOOBExhaustParticles();
	}

	ClientGame.prototype.clearOOBExhaustParticles = function() {
		var ep;
		var posX;
		var posY;

		for (var i = 0; i < this.exhaustParticles.length; i++) {
			ep = this.exhaustParticles[i];
			posX = ep.pos[0];
			posY = ep.pos[1];

			if (posX < 0 || posY < 0 || posX > this.WIDTH || posY > this.HEIGHT) {
				this.exhaustParticles.splice(i, 1);
			}
		}
	};

	ClientGame.prototype.handleExplodedText = function (txt) {
		this.explodingTexts.remove(txt);
	};

	ClientGame.prototype.handleStarBlackHoleCollisions = function (star) {
		star.die();
	};

	ClientGame.prototype.handleExhaustParticleBlackHoleCollision = function (ep) {
		this.exhaustParticles.remove(ep);
	};

	ClientGame.prototype.detectExplodedTexts = function() {
		var game = this;

		this.explodingTexts.forEach(function(txt){
			if (txt.alpha <= 0) {
				game.handleExplodedText(txt);
			}
		})
	};

	ClientGame.prototype.detectStarBlackHoleCollisions = function() {
		var game = this;

		this.starBlackHoleCollisions().forEach(function (star) {
			game.handleStarBlackHoleCollisions(star);
		})
	};

	ClientGame.prototype.detectExhaustParticleBlackHoleCollisions = function() {
		var game = this;

		this.exhaustParticleBlackHoleCollisions().forEach(function (ep) {
			game.handleExhaustParticleBlackHoleCollision(ep);
		})
	};

})(Asteroids);
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var Game = global.Game = function(canvasEl) {
		this.status = 'n/a';
		this.gameID = 'n/a'

		global.ClientGame.call(this, canvasEl);

		this.initialize();
	};

	Store.inherits(Game, global.ClientGame);

	Game.prototype.addAsteroids = function(numAsteroids) {
		for (var i = 0; i < numAsteroids; i++) {
		  this.asteroids.push(global.Asteroid.randomAsteroid(this.WIDTH, this.HEIGHT));
		}
	};

	Game.prototype.addShip = function() {
		this.ships.push(new global.Ship({pos: [this.WIDTH / 2, this.HEIGHT / 2]}));
	};

	Game.prototype.fireShip = function (ship) {
		this.bullets.push(ship.fire());
	};

	Game.prototype.powerShip = function (ship) {
		ship.power();
		this.exhaustParticles = this.exhaustParticles.concat(ship.releaseExhaust(2));
	};

	Game.prototype.turnShip = function (ship, dir, percentage) {
		ship.turn(dir, percentage);
	};

	Game.prototype.dampenShip = function (ship) {
		ship.dampen();
	}

	Game.prototype.levelUp = function() {
		this.level += 1;
		this.announce('Level ' + this.level);

		this.repopulateAsteroids();
		this.modifyDifficulty();
		this.blackHoles = [];
	};

	Game.prototype.explodeAsteroid = function(asteroid) {
		this.asteroids.remove(asteroid);
		var newAsteroidOpts = asteroid.explode();
		var newAsteroids = newAsteroidOpts.map(function(opts){
			return new global.Asteroid(opts);
		})
		this.noExplodeAsteroids = this.noExplodeAsteroids.concat(newAsteroids);
		this.asteroids = this.asteroids.concat(newAsteroids);
	};

	Game.prototype.removeBullet = function (bullet) {
		this.bullets.remove(bullet);
	};

	Game.prototype.handleCollidedShip = function (ship, asteroid) {
		game.explodeAsteroid(asteroid);
		global.Visuals.hit(game.canvas);
		ship.health -= asteroid.radius;
	};

	Game.prototype.handleAsteroidBlackHoleCollisions = function (as, blackHole) {
		this.damageAsteroid(as, blackHole.radius);
		this.growBlackHole(blackHole, as.radius);
	};

	Game.prototype.handleDestroyedShip = function (ship) {
		this.lost();
	};

	Game.prototype.detectDestroyedShips = function() {
		var game = this;

		this.ships.forEach(function (ship) {
			if (ship.health <= 0) {
				game.handleDestroyedShip(ship);
			}
		})
	}

	Game.prototype.detectDestroyedObjects = function() {
		var game = this;

		this.asteroids.forEach(function (asteroid) {
			if (asteroid.health <= 0) {
				game.explodeAsteroid(asteroid);
			}
		});

		for (var i = 0; i < this.exhaustParticles.length; i++) {
			if (this.exhaustParticles[i].health <= 0) {
				this.exhaustParticles.splice(i, 1);
			}
		}
	};

	Game.prototype.detect = function() {
		this.detectCollidingAsteroids();
		// this.detectHitAsteroids();
		this.detectAsteroidBulletCollisions();
		this.detectCollidedShip();
		this.detectDestroyedShips();
		// this.detectBulletHits();
		this.detectDestroyedObjects();
		this.detectStarBlackHoleCollisions();
		this.detectExplodedTexts();
		this.detectLevelChangeReady();
		this.detectAsteroidBlackHoleCollisions();
		this.detectAddBlackHoleReady();
		this.detectExhaustParticleBlackHoleCollisions();
		this.detectShipBlackHoleCollisions();
		this.detectBulletBlackHoleCollisions();
	};

	Game.prototype.step = function() {
		// this.clearOOBAsteroids();
		this.clearOOBObjects();
		this.depopulateNoExplodeAsteroids();
		this.wrapMovingObjects();
		this.detect();
		this.draw();
		this.move();
		this.tic();
	};

	Game.prototype.pause = function() {
		if (this['mainTimer']) {
			this.stop();
			this.announce('Pause', true);
		} else {
			this.start();
			this.announce('Resume')
		}
	};

	Game.prototype.initialize = function() {
		this.addAsteroids(5);
		this.addShip();
		this.addReadout();
		this.addBackground();
		new global.KeyListener(this);
		this.start();
		this.announce('Welcome!');
	};

})(Asteroids);
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var GameMP = global.GameMP = function(canvasEl) {
		this.sendStateRate = 3;

		global.ClientGame.call(this, canvasEl);
		
		//this.socket assigned in init.js;
		//this.shipID assigned in addShip;
	};

	Store.inherits(GameMP, global.ClientGame);

	// The game will never request asteroids, just get them from the server.
	GameMP.prototype.addAsteroid = function (asteroidOpts) {
		this.asteroids.push(new global.Asteroid(asteroidOpts));
	};

	// Add ship, send info to server
	GameMP.prototype.addShip = function() {
		var ship = new global.Ship({pos: [this.WIDTH / 2, this.HEIGHT / 2]});
		this.shipID = ship.id;
		this.ships.push(ship);

		var shipOpts = ship.getState();

		this.socket.emit('addShip', shipOpts);
	};

	GameMP.prototype.addForeignShip = function (shipOpts) {
		this.ships.push(new global.Ship(shipOpts));

		this.addReadout();
	};

	GameMP.prototype.foreignAddBlackHole = function (bhOpts) {
		this.addBlackHole(bhOpts);
	};

	GameMP.prototype.foreignGrowBlackHole = function (amtOpts) {
		var blackHole = this.get(amtOpts.id);
		console.log('growing the following black hole')
		console.log(blackHole)
		var amt = amtOpts.amt;
		this.growBlackHole(blackHole, amt)
	}

	GameMP.prototype.fireForeignShip = function (bulletOpts) {
		var ship = this.get(bulletOpts.shipID);
		var bullet = ship.fire(bulletOpts);
		this.bullets.push(bullet);
	};

	GameMP.prototype.fireShip = function (ship) {
		var bullet = ship.fire();
		this.bullets.push(bullet);

		var bulletOpts = bullet.getState();

		this.socket.emit('fireShip', bulletOpts)
	}

	GameMP.prototype.powerShip = function (ship) {
		ship.power();
		this.exhaustParticles = this.exhaustParticles.concat(ship.releaseExhaust(2));

		this.socket.emit('powerShip', { shipID: ship.id })
	};

	GameMP.prototype.powerForeignShip = function (shipID) {
		var ship = this.get(shipID);
		ship.power();
		this.exhaustParticles = this.exhaustParticles.concat(ship.releaseExhaust(2));
	}

	GameMP.prototype.turnShip = function (ship, dir, percentage) {
		ship.turn(dir, percentage);

		var opts = {
			shipID: ship.id,
			dir: dir,
			percentage: percentage
		}

		this.socket.emit('turnShip', opts);
	};

	GameMP.prototype.turnForeignShip = function (turnOpts) {
		var ship = this.get(turnOpts.shipID);
		var dir = turnOpts.dir;
		var percentage = turnOpts.percentage;

		ship.turn(dir, percentage);
	}

	GameMP.prototype.dampenShip = function (ship) {
		ship.dampen();

		var opts = {
			shipID: ship.id
		}

		socket.emit('dampenShip', opts);
	}

	GameMP.prototype.dampenForeignShip = function (dampenOpts) {
		var ship = this.get(dampenOpts.shipID);

		ship.dampen();
	}

	GameMP.prototype.removeBullet = function (bullet) {
		this.bullets.remove(bullet);
	};

	GameMP.prototype.foreignRemoveBullet = function (bulletOpts) {
		var id = bulletOpts.id;
		var bullet = this.get(id);
		this.removeBullet(bullet);
	}

	GameMP.prototype.foreignHitShip = function (opts) {
		var ship = this.get(opts.shipID);
		var damage = opts.damage;

		ship.health -= damage;
	}

	GameMP.prototype.foreignDestroyedShip = function (shipIDOpt) {
		var ship = this.get(shipIDOpt.id);

		if (this.shipID === ship.id) {
			this.lost();
		} else {
			this.ships.remove(ship);
			this.announce('+ 40!!');
			this.ships[0].health += 40;
		}
	}

	GameMP.prototype.levelUp = function() {
		this.level += 1;
		this.announce('Level ' + this.level);

		this.blackHoles = [];

		// this.repopulateAsteroids();
		// this.modifyDifficulty();
	};

	GameMP.prototype.explodeAsteroid = function(asteroid) {
		this.asteroids.remove(asteroid);
		// var newAsteroids = asteroid.explode();
		// this.noExplodeAsteroids = this.noExplodeAsteroids.concat(newAsteroids);
		// this.asteroids = this.asteroids.concat(newAsteroids);
	};

	GameMP.prototype.handleCollidedShip = function (ship, asteroid) {
		// game.explodeAsteroid(asteroid);
		global.Visuals.hit(game.canvas);
		ship.health -= asteroid.radius;
	};

	GameMP.prototype.handleBulletHits = function (bullet) {
		this.removeBullet(bullet);
	};

	GameMP.prototype.detectCollidedShip = function() {
		var game = this;

		this.asteroids.forEach(function(as){
			if (game.ships[0].isCollidedWith(as)) {
				game.handleCollidedShip(game.ships[0], as);
			}
		})
	};

	GameMP.prototype.detectDestroyedObjects = function() {
		var game = this;

		// this.asteroids.forEach(function(asteroid){
		// 	if (asteroid.health <= 0) {
		// 		game.explodeAsteroid(asteroid);
		// 	}
		// });

		for (var i = 0; i < this.exhaustParticles.length; i++) {
			if (this.exhaustParticles[i].health <= 0) {
				this.exhaustParticles.splice(i, 1);
			}
		}
	};

	GameMP.prototype.detectSendState = function() {
		if (this._counter % this.sendStateRate == 0) this.sendState();
	}

	GameMP.prototype.detect = function() {
		// this.detectCollidingAsteroids();
		// this.detectHitAsteroids();
		this.detectCollidedShip();
		this.detectBulletHits();
		this.detectDestroyedObjects();
		this.detectExplodedTexts();
		this.detectSendState();
		this.detectStarBlackHoleCollisions();
		// this.detectLevelChangeReady();
		this.detectExhaustParticleBlackHoleCollisions();
	};

	GameMP.prototype.sendState = function() {
		var shipState = this.ships[0].getState();

		this.socket.emit('shipState', shipState);
	};

	GameMP.prototype.clearState = function() {
		this.asteroids = [];
		// this.bullets = [];
		this.ships = [this.ships[0]];
		this.blackHoles = [];
	};

	GameMP.prototype.handleFullState = function (fullStateObject) {
		var game = this;
		var fullStateArray = fullStateObject.fullStateArray;

		this.clearState();

		fullStateArray.forEach(function (stateObj) {
			switch (stateObj.type) {
				case 'asteroid':
					game.handleFullStateAsteroid(stateObj);
					break;
				case 'blackHole':
					game.handleFullStateBlackHole(stateObj);
					break;
				case 'bullet':
					game.handleFullStateBullet(stateObj);
					break;
				case 'ship':
					game.handleFullStateShip(stateObj);
					break;
				case 'level':
					game.handleFullStateLevel(stateObj);
					break;
			}
		})
	}

	GameMP.prototype.handleFullStateAsteroid = function (stateObj) {
		this.asteroids.push(new global.Asteroid(stateObj));
	}

	GameMP.prototype.handleFullStateBlackHole = function (stateObj) {
		this.blackHoles.push(new global.BlackHole(stateObj));
	}

	GameMP.prototype.handleFullStateBullet = function (stateObj) {
		this.bullets.push(new global.Bullet(null, stateObj));
	}

	GameMP.prototype.handleFullStateShip = function (stateObj) {
		var game = this;

		// our own ship must be updated differently to prevent choppiness
		if (stateObj.id != this.shipID) {
			this.ships.push(new global.Ship(stateObj))
		}

		// make sure all ships stay in same order for better drawing
		var localShip = this.ships.shift();
		var shipIDs = this.ships.map( function (ship) {
			return ship.id
		})

		shipIDs.sort();

		this.ships = shipIDs.map( function (shipID) {
			return game.get(shipID);
		})

		this.ships.unshift(localShip);
	}

	GameMP.prototype.handleFullStateLevel = function (stateObj) {
		this.level = stateObj.level;
	}

	GameMP.prototype.tic = function() {
		this._counter += 1;
	}

	GameMP.prototype.step = function() {
		// this.clearOOBAsteroids();
		this.clearOOBObjects();
		// this.depopulateNoExplodeAsteroids();
		this.wrapMovingObjects();
		this.detect();
		this.draw();
		this.move();
		this.tic();
	};

	GameMP.prototype.pause = function() {
		this.foreignPause();

		socket.emit('pause');
	};

	GameMP.prototype.foreignPause = function() {
		if (this['mainTimer']) {
			this.stop();
			this.announce('Pause', true);
		} else {
			this.start();
			this.announce('Resume')
		}
	}

	GameMP.prototype.initialize = function() {
		// this.addAsteroids(5);
		this.addShip();
		this.addReadout();
		this.addBackground();
		new global.KeyListener(this);
		this.start();
	};

})(Asteroids);
var Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var Ship = global.Ship = function (opts) {
		if (!opts) var opts = {};
		var pos = opts.pos || new Vector([100, 100]);
		var vel = opts.vel || new Vector([0, 0]);
		var radius = opts.radius || 20 / 3;
		this.orientation = opts.orientation ? new Vector(opts.orientation) : new Vector([0,-1]);
		this.rotateSpeed = opts.rotateSpeed || 0.25;
		this.impulse = opts.impulse || 0.4;
		this.dampenRate = opts.dampenRate || 0.95;
		this.fireFrequency = opts.fireFrequency || 200;
		this.health = opts.health || 40;
		this.damage = opts.damage || 15;
		this.id = opts.id || null;
		this.borderColor = opts.borderColor || Store.randomColor();
		this.fillColor = opts.fillColor || Store.randomColor();

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

	Ship.prototype.fire = function (bulletOpts) {
		this.recoil();
		return new global.Bullet(this, bulletOpts);
	}

	Ship.prototype.recoil = function() {
		if (this.kineticBullets) {
			this.vel = this.vel.subtract(this.orientation.scale(this.bulletWeight))
		}
	}

	Ship.prototype.draw = function (ctx, pos, or) {
		var height = this.radius * 3;
		var base = 0.3;
		var or = or || this.orientation;

		var start = pos || this.pos;
		var pt1 = start.add(or.scale(height / 1.5));
		var pt2 = pt1.add(or.scale(-height).rotate(base));
		var pt3 = pt1.add(or.scale(-height).rotate(-base));
		var pt4 = pt1;

		ctx.fillStyle = this.fillColor;
		ctx.strokeStyle = this.borderColor;
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

	Ship.prototype.getState = function() {
		var state = {
			type: 'ship',
			radius: this.radius,
			pos: this.pos.to_a(),
			vel: this.vel.to_a(),
			id: this.id,
			orientation: this.orientation.to_a(),
			rotateSpeed: this.rotateSpeed,
			impulse: this.impulse,
			dampenRate: this.dampenRate,
			fireFrequency: this.fireFrequency,
			health: this.health,
			damage: this.damage,
			kineticBullets: this.kineticBullets,
			bulletWeight: this.bulletWeight,
			borderColor: this.borderColor,
			fillColor: this.fillColor
		}

		return state;
	}

})(Asteroids);
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var KeyListener = global.KeyListener = function(game) {
		this.timers = {};
		this.game = game;

		this.listen();
	}

	KeyListener.prototype.listen = function() {
		this.listenUp();
		this.listenDown();
	}

	KeyListener.prototype.listenUp = function() {
		var that = this;

		document.onkeyup = function (event) {
			switch (event.keyCode) {
				case 37:
				case 65:
					clearInterval(that.timers['left']);
					delete that.timers['left'];
					break;
				case 39:
				case 68:
					clearInterval(that.timers['right']);
					delete that.timers['right'];
					break;
				case 38:
				case 87:
					clearInterval(that.timers['move']);
					delete that.timers['move'];
					break;
				case 40:
				case 83:
					clearInterval(that.timers['dampen']);
					delete that.timers['dampen'];
					break;
				case 32:
					clearInterval(that.timers['fire']);
					delete that.timers['fire'];
					break;
			}
		}
	}

	KeyListener.prototype.listenDown = function () {
		var that = this;

		document.onkeydown = function (event) {
			// console.log(event.keyCode)
			switch (event.keyCode) {
				case 65:
				case 37:
					that.setTurnTimer('left');
					break;
				case 39:
				case 68:
					that.setTurnTimer('right');
					break;
				case 38:
				case 87:
					that.setMoveTimer();
					break;
				case 40:
				case 83:
					that.setDampenTimer();
					break;
				case 32:
					that.fire();
					break;
				case 80:
					that.game.pause();
					break;
			}
		}
	};

	KeyListener.prototype.setTurnTimer = function (dir) {
		var that = this;
		if (this.timers[dir]) {
			return
		}

		var percentage = 0;
		this.timers[dir] = setInterval(function(){
			percentage += 0.2;
			if (percentage > 1) { percentage = 1}
			that.game.turnShip(that.game.ships[0], dir, percentage)
		}, that.game.FPS)
	};

	KeyListener.prototype.setMoveTimer = function() {
		var that = this;
		if (this.timers['move']) {
			return
		}

		this.timers['move'] = setInterval(function(){
			that.game.powerShip(that.game.ships[0]);
		}, that.game.FPS)
	}

	KeyListener.prototype.setDampenTimer = function() {
		var that = this;
		if (this.timers['dampen']) {
			return
		}

		this.timers['dampen'] = setInterval(function(){
			that.game.dampenShip(that.game.ships[0]);
		}, that.game.FPS)
	}

	KeyListener.prototype.fire = function() {
		var that = this;
		if (this.timers['fire']) {
			return
		}
		this.game.fireShip(that.game.ships[0]);
		this.timers['fire'] = setInterval(function(){
			that.game.fireShip(that.game.ships[0]);
		}, that.game.ships[0].fireFrequency)
	}

})(Asteroids);
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var Bullet = global.Bullet = function (ship, opts) {
		var opts = opts || {};
		this.ship = ship;
		this.orientation = opts.orientation ? new Vector(opts.orientation) : ship.orientation.scale(1);
		var vel = opts.vel ? new Vector(opts.vel) : ship.vel.add(ship.orientation.scale(10));
		var pos = opts.pos ? new Vector(opts.pos) : ship.pos.scale(1);
		this.color = opts.color || ship.borderColor || 'red';
		this.damage = opts.damage || ship.damage;
		this.id = opts.id || null; // assigned in moving_object.js

		MovingObject.call(this, pos, vel, null)
	}

	Store.inherits(Bullet, MovingObject)

	Bullet.prototype.draw = function (ctx) {
		var start = this.pos;
		var end = this.pos.add(this.orientation.scale(10))

		ctx.beginPath();
		ctx.moveTo(start[0], start[1]);
		ctx.lineTo(end[0], end[1]);
		ctx.lineWidth = 3;
		ctx.strokeStyle = this.color;
		ctx.stroke();
	}

	Bullet.prototype.getState = function() {
		var state = {
			type: 'bullet',
			radius: this.radius,
			pos: this.pos.to_a(),
			vel: this.vel.to_a(),
			id: this.id,
			orientation: this.orientation.to_a(),
			damage: this.damage,
			color: this.color,
			shipID: this.ship.id
		}

		return state;
	}

})(Asteroids);
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global) {
	var Store = global.Store;

	var BlackHole = global.BlackHole = function (opts) {
		var opts = opts ? opts : {};
		var pos = opts.pos ? new Vector(opts.pos) : [100, 100];
		var vel = opts.vel ? new Vector(opts.vel) : Store.randomVel();
		var radius = opts.radius || 50;
		this.mass = opts.mass || 100000000000;
		this.id = opts.id || null;

		MovingObject.call(this, pos, vel, radius);
	}

	Store.inherits(BlackHole, MovingObject);

	BlackHole.randomBlackHoleValues = function() {
		var opts = {
			pos: [100, 100],
			vel: Store.randomVel(),
			radius: 50,
			mass: 100000000000
		}

		return opts;
	};

	BlackHole.prototype.draw = function (ctx) {
		ctx.beginPath();
		ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'black';
		ctx.fill();
	};

	BlackHole.prototype.grow = function (amt) {
		this.radius += amt / 10;
		this.mass += amt * 10;
	};

	BlackHole.prototype.getState = function() {
		var stateObj = {
			type: 'blackHole',
			id: this.id,
			mass: this.mass,
			radius: this.radius,
			vel: this.vel.to_a(),
			pos: this.pos.to_a()
		}

		return stateObj
	}
})(Asteroids);
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	var Visuals = global.Visuals = function () {

	};

	Visuals.hit = function (canvas) {
		canvas.setAttribute('style', 'transition: all 0.1s; box-shadow: inset 0 0 30px 30px red;');
		setTimeout(function(){
			canvas.setAttribute('style', 'transition: all 0.1s');
		}, 100)
	};

	Visuals.restartScreen = function() {
		var that = this;

		var wrapper = document.getElementById('restart-screen-wrapper');
		var el = document.getElementById('restart-screen');

		// make it visible
		wrapper.setAttribute('style', 'display:block;');

		el.onclick = function() {
			window.location = document.URL;
		}
	};

	Visuals.fadeOut = function (domEl, stepValue, callback) {
		var i = 1;

		var interval = setInterval(function(){
			domEl.setAttribute('style', 'opacity:' + i + ';');

			if (i <= 0) {
				clearInterval(interval);
				if (callback) callback();
			}

			i = Math.round((i - stepValue) * 1000) / 1000;
		}, 30)
		
	};

	Visuals.fade = function (domEl, initialValue, finalValue, stepValue, callback) {
		var i = initialValue;

		var interval = setInterval(function () {
			domEl.setAttribute('style', 'opacity:' + i + ';');

			var cond1 = (initialValue < finalValue && i >= finalValue);
			var cond2 = (initialValue > finalValue && i <= finalValue);

			if (cond1 || cond2) {
				clearInterval(interval);
				if (callback) callback();
			}

			i = Math.round((i + stepValue) * 1000) / 1000;
		}, 30)
	}
})(Asteroids)
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var GameStarter = global.GameStarter = function (gameType) {
		this.started = false;
		this.initialize(gameType);
	};

	GameStarter.prototype.initialize = function (gameType) {
		switch (gameType) {
			case 'sp':
				this.startSinglePlayerGame();
				break;
			case 'hmpg':
				this.hostMultiPlayerGame();
				break;
			case 'jmpg':
				this.createRequestScreen();
				// this.joinMultiPlayerGame();
				break;
			case 'jrmpg':
				this.joinRandomMultiPlayerGame();
				break;
		}
	};

	GameStarter.prototype.startSinglePlayerGame = function() {
		var canvas = this.createCanvas();
		var game = new global.Game(canvas);
		window.game = game;
	};

	GameStarter.prototype.notAvailable = function() {
		alert('sorry, not available yet!')
		window.location = document.URL;
	};

	GameStarter.prototype.hostMultiPlayerGame = function() {
		var canvas = this.createCanvas();
		var game = new global.GameMP(canvas);
		window.game = game;
		var socket = io.connect('/');
		window.socket = socket;
		game.socket = socket;

		socket.on('connect', function(){
			if (!this.started) {
				socket.emit('hmpg', { width: game.WIDTH, height: game.HEIGHT });
				Asteroids.SocketListener.startListening(socket, game);
				this.started = true;
				game.initialize();
			}
		})

		socket.on('hmpgResponse', function (data) {
			console.log('successfully created room: ' + data.gameID);
			game.gameID = data.gameID;
		})
	}

	GameStarter.prototype.joinMultiPlayerGame = function (gameID) {
		var canvas = this.createCanvas();
		var game = new global.GameMP(canvas);
		window.game = game;
		var socket = io.connect('/');
		window.socket = socket;
		game.socket = socket;

		socket.on('connect', function() {
			if (!this.started) {
				socket.emit('jmpg', { width: game.WIDTH, height: game.HEIGHT, gameID: gameID })
			}

			socket.on('jmpgSuccess', function() {
				Asteroids.SocketListener.startListening(socket, game);
				this.started = true;
				game.initialize();
			})

			socket.on('jmpgNoGame', function() {
				alert('Sorry, couldn\'t find your game!');
				window.location = document.URL;
			})

			socket.on('jmpgFailure', function() {
				alert("Sorry, something totally bizarre happened!");
				window.location = document.URL;
			})
		})
	};

	GameStarter.prototype.joinRandomMultiPlayerGame = function() {
		var canvas = this.createCanvas();
		var game = new global.GameMP(canvas);
		window.game = game;
		var socket = io.connect('/');
		window.socket = socket;
		game.socket = socket;

		socket.on('connect', function() {
			if (!this.started) {
				socket.emit('jrmpg', { width: game.WIDTH, height: game.HEIGHT });
				Asteroids.SocketListener.startListening(socket, game);
				this.started = true;
				game.initialize();
			}
		})

		socket.on('jrmpgSuccess', function (data) {
			console.log('successfully joined room: ' + data.gameID);
			game.gameID = data.gameID;
		})

		socket.on('jrmpgFailure', function (data) {
			console.log(data.error)
			alert(data.error);
			window.location = document.URL;
		})
	};

	GameStarter.prototype.createCanvas = function() {
		var canvasWrapper = document.createElement('div');
		canvasWrapper.id = 'canvas-wrapper';
		document.body.appendChild(canvasWrapper);

		var canvas = document.createElement("canvas");
		canvas.setAttribute("width", "1000");
		canvas.setAttribute("height", "500");

		canvasWrapper.appendChild(canvas);

		return canvas;
	};

	// GameStarter.prototype.createGame = function (canvas) {
	// 	var game = new global.GameMP(canvas);
	// 	window.game = game;
	// }

	GameStarter.prototype.createRequestScreen = function() {
		var that = this;

		var el = document.getElementById('session-request');
		var form = document.getElementById('session-request-form');
		var textField = document.getElementById('session-request-input');

		// make it invisible but present
		el.setAttribute('style', 'opacity:0; display:block;');

		global.Visuals.fade(el, 0, 1, 0.2);

		form.onsubmit = function(e) {
			e.preventDefault();
			global.Visuals.fade(el, 1, 0, -0.2, function(){
				el.remove();
				that.joinMultiPlayerGame(textField.value);
			});
		}
	}

})(Asteroids)

window.onload = function() {

	// let's handle that index page
	var bs = document.getElementsByClassName('button');
	Asteroids.Store.assignOnclickToNodeList(bs, 
		function(data){
			// handle what should actually happen

			var lopwerPaneWrapper = document.getElementById('lower-pane-wrapper');
			var footer = document.getElementsByTagName('footer')[0];
			var mainWrapper = document.getElementById('main-wrapper');

			Asteroids.Visuals.fade(footer, 1, 0, -0.3);
			Asteroids.Visuals.fade(lopwerPaneWrapper, 1, 0, -0.1);
			setTimeout(function(){
				Asteroids.Visuals.fade(mainWrapper, 1, 0, -0.2, function(){
					document.getElementById('main-wrapper').remove();

					new Asteroids.GameStarter(data.toElement.id)
				});
			}, 300)
		}
	);
	
}
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	// should report ship's health, points, level
	var Readout = global.Readout = function (options) {
		this.game = options.game;
	};

	Readout.prototype.draw = function (ctx) {
		ctx.font = '15pt "Exo 2", sans-serif';
		ctx.fillStyle = 'white';
		var startHeight = 20;
		var lineHeight = 35;
		var h1 = startHeight + lineHeight;
		var h2 = h1 + lineHeight;
		ctx.fillText('Level:  ' + this.game.level, 20, startHeight);
		ctx.fillText('Status:  ' + this.game.status, 20, h1);
		ctx.fillText('Game:  ' + this.game.gameID, 20, h2);

		for (var i = 0; i < this.game.ships.length; i++) {
			var y = h2 + lineHeight + (i * lineHeight);
			var pos = new Vector([107, y - 5]);
			var or = new Vector([0, -1]);

			ctx.fillStyle = 'white';
			ctx.fillText('Health:        ' + this.game.ships[i].health, 20, y)
			this.game.ships[i].draw(ctx, pos, or)
		}
	};

	///////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////
	// expanding text from the middle of the screen for level changes, announcesments, etc.
	var ExplodingText = global.ExplodingText = function (options) {
		this.game = options.game;
		this.independentTimer = options.independentTimer;
		this.txt = options.txt || 'default text';
		this.size = options.size || 10;
		this.growRate = options.growRate || 10;
		this.alpha = options.alpha || 1;
		this.alphaChangeRate = options.alphaChangeRate || 0.03;

		this.initialize();
	};

	ExplodingText.prototype.initialize = function() {
		var that = this;

		if (this.independentTimer) {
			var timer = setInterval(function(){
				if (that.alpha <= 0) {
					clearInterval(timer);
				} else {
					// that.draw(that.game.ctx);
					that.game.draw();
				}
			}, this.game.FPS)
		}
	};

	ExplodingText.prototype.draw = function(ctx) {
		ctx.fillStyle = 'rgba(255, 255, 255, ' + this.alpha + ')';
		ctx.textAlign = 'center';
		ctx.font = this.size + 'pt "Exo 2", sans-serif';
		var x = this.game.WIDTH / 2;
		var y = (this.game.HEIGHT / 2) + (this.game.HEIGHT / 15);

		ctx.fillText(this.txt, x, y);
		ctx.textAlign = 'left';

		this.size += this.growRate;
		this.alpha -= this.alphaChangeRate;
	};


})(Asteroids);
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var ExhaustParticle = global.ExhaustParticle = function (options) {
		this.ship = options.ship;
		this.pos = this.ship.pos.scale(1);
		this.vel = this.ship.vel.add(this.ship.orientation.scale(-15).nudge(0.15));
		this.radius = options.radius || 10;
		// this.color = ['orange', 'red', 'yellow', 'orange', 'orage'].sample();
		this.RGB = ['226,72,0','204,24,0','134,2,0','255,119,1'].sample();
		this.health = 0.2;
		this.decayRate = 0.01;
	};

	Store.inherits(ExhaustParticle, MovingObject);

	ExhaustParticle.prototype.draw = function (ctx) {
		var x = this.pos[0];
		var y = this.pos[1];

		var radgrad = ctx.createRadialGradient(x,y,0,x,y,this.radius);
	  radgrad.addColorStop(0, 'rgba(' + this.RGB + ',' + this.health + ')');
	  radgrad.addColorStop(1, 'rgba(' + this.RGB + ',0)');
	  
	  // draw shape
	  ctx.fillStyle = radgrad;
		ctx.fillRect(0, 0, 1000, 500);

		if (this.health - this.decayRate <= this.decayRate) {
			this.health = 0
		} else {
			this.health -= this.decayRate;
		}
	};

})(Asteroids);
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	var Background = global.Background = function (game) {
		this.game = game;
		this.numStars = 200;
		this.stars = [];
		this.starOptions = {
			'height': this.game.HEIGHT,
			'width': this.game.WIDTH
		};
		this.initialize();
	}

	Background.prototype.initialize = function () {
		for (var i = 0; i < this.numStars; i++) {
			this.stars.push(new global.Star(this.starOptions))
		}
	};

	Background.prototype.draw = function (ctx) {
		this.stars.forEach(function(star){
			star.draw(ctx);
		})
	};

	Background.prototype.move = function() {
		this.detect();

		this.stars.forEach(function(star){
			star.move();
		})
	}

	Background.prototype.detectOOBStars = function() {
		var bg = this;

		this.stars.forEach(function(star){
			if ( (star.pos[0] + star.radius) < 0) {
				star.die();
			}

			if ( (star.pos[1] + star.radius) < 0) {
				star.die();
			}

			if ( (star.pos[0] - star.radius) > game.WIDTH) {
				star.die();
			}

			if ( (star.pos[1] - star.radius) > game.HEIGHT) {
				star.die();
			}	
		})
	};

	Background.prototype.detectDeadStars = function() {
		var bg = this;

		this.stars.forEach(function (star) {
			if (!star.alive) bg.replaceStar(star);
		})
	};

	Background.prototype.replaceStar = function (star) {
		this.stars.remove(star);
		this.stars.push(new global.Star(this.starOptions))
	}

	Background.prototype.detect = function() {
		this.detectOOBStars();
		this.detectDeadStars();
	}
})(Asteroids);
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var Star = global.Star = function (options) {
		this.height = height = options.height;
		this.width = width = options.width;
		this.radius = options.radius || 1;
		this.vel = options.vel ? new Vector(options.vel) : new Vector(Store.randomVel()).scale(0.02);
		var posi = new Vector([(Math.random() * width), (Math.random() * height)]);
		this.pos = options.pos ? new Vector(options.pos) : posi;
		this.color = ['#8A2C1F', 'blue', 'grey', 'grey', 'grey', 'grey', 'grey'].sample();
		this.alive = true;
	};

	Store.inherits(Star, MovingObject)

	Star.prototype.die = function() {
		this.alive = false;
	}

	Star.prototype.draw = function (ctx) {
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
})(Asteroids);
var Asteroids = this.Asteroids = (this.Asteroids || {});
var SocketListener = Asteroids.SocketListener = {};

(function(global, SocketListener){

	var startListening = SocketListener.startListening = function (socket, game) {
		var debugFlag = true;

		function debug (log) {
			if (debugFlag) console.log(log)
		}

		// init / general stuff
		socket.on('connectionSuccessful', function() {
			console.log('socket connected to server ');
			game.status = 'connected';
		});

		socket.on('disconnect', function() {
			console.log('disconnected from server');
			game.status = 'disconnected';
		})

		socket.on('reconnecting', function() {
			console.log('reconnecting to server...');
			game.status = 'reconnecting...';
		})

		socket.on('connecting', function() {
			console.log('connecting');
			game.status = 'connecting';
		})

		socket.on('reconnect_failed', function() {
			conosole.log('Damn, can\'t reconect to the server!');
			game.status = 'disconnected!  =\'('
		})

		socket.on('testSuccess', function() {
			console.log('test received successfully!')
		});

		socket.on('test', function() {
			console.warn('I receieved test!')
		});

		socket.on('sessionsStatus', function (data) {
			console.log(data)
		});

		socket.on('sessionCreated', function() {
			console.log('session successfully created');
		})

		socket.on('foreignJoin', function() {
			console.log('Another user has joined the room');
		})

		// game stuff
		socket.on('addAsteroid', function (asteroidOpts) {
			debug('received asteroid')
			game.addAsteroid(asteroidOpts);
		})

		socket.on('addBlackHole', function (bhOpts) {
			debug('received black hole');
			game.foreignAddBlackHole(bhOpts);
		})

		socket.on('growBlackHole', function (amtOpts) {
			debug('grow black hole')
			game.foreignGrowBlackHole(amtOpts);
		})

		socket.on('explodeAsteroid', function (asteroidOpts) {
			debug('explodeAsteroid')
			var asteroid = game.get(asteroidOpts.id)

			game.explodeAsteroid(asteroid);
		})

		socket.on('fireShip', function (bulletOpts) {
			debug('firing foreign ship')
			game.fireForeignShip(bulletOpts);
		})

		socket.on('addShip', function (shipOpts) {
			debug('add foreign ship')
			game.addForeignShip(shipOpts);
		})

		socket.on('removeBullet', function (bulletOpts) {
			debug('remove bullet')
			game.foreignRemoveBullet(bulletOpts);
		})

		socket.on('powerForeignShip', function (shipOpts) {
			game.powerForeignShip(shipOpts.shipID);
		})

		socket.on('turnForeignShip', function (turnOpts) {
			game.turnForeignShip(turnOpts);
		})

		socket.on('dampenForeignShip', function (dampenOpts) {
			game.dampenForeignShip(dampenOpts);
		})

		socket.on('foreignHitShip', function (opts) {
			debug('foreignHitShip');
			game.foreignHitShip(opts);
		})

		socket.on('destroyedShip', function (shipIDOpt) {
			debug('destroyedShip');
			game.foreignDestroyedShip(shipIDOpt);
		})

		socket.on('levelUp', function() {
			game.levelUp();
		})

		socket.on('pause', function() {
			game.foreignPause();
		})

		socket.on('fullState', function (fullStateObject) {
			game.handleFullState(fullStateObject);
		})
	};

})(Asteroids, SocketListener)

