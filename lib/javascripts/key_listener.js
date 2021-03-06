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