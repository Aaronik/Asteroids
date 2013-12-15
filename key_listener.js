var Asteroids = this.Asteroids;

(function(global){
	var timers = {};
	var fps = 30;
	var fireFrequency = 200;

	var keypressListeners = global.keypressListeners = function() {
		listenUp();
		listenDown();
	}

	var listenUp = function() {
		document.onkeyup = function (event) {
			switch (event.keyCode) {
				case 37:
				case 65:
					clearInterval(timers['left']);
					delete timers['left'];
					break;
				case 39:
				case 68:
					clearInterval(timers['right']);
					delete timers['right'];
					break;
				case 38:
				case 87:
					clearInterval(timers['move']);
					delete timers['move'];
					break;
				case 40:
				case 83:
					clearInterval(timers['dampen']);
					delete timers['dampen'];
					break;
				case 32:
					clearInterval(timers['fire']);
					delete timers['fire'];
					break;
			}
		}
	}

	var listenDown = function () {
		document.onkeydown = function (event) {
			console.log(event.keyCode)
			switch (event.keyCode) {
				case 65:
				case 37:
					setTurnTimer('left');
					break;
				case 39:
				case 68:
					setTurnTimer('right');
					break;
				case 38:
				case 87:
					setMoveTimer();
					break;
				case 40:
				case 83:
					setDampenTimer();
					break;
				case 32:
					fire();
					break;
			}
		}
	};

	var setTurnTimer = function (dir) {
		if (timers[dir]) {
			return
		}

		timers[dir] = setInterval(function(){
			window.game.ship.turn(dir)
		}, fps)
	};

	var setMoveTimer = function() {
		if (timers['move']) {
			return
		}

		timers['move'] = setInterval(function(){
			window.game.ship.power();
		}, fps)
	}

	var setDampenTimer = function() {
		if (timers['dampen']) {
			return
		}

		timers['dampen'] = setInterval(function(){
			window.game.ship.dampen();
		}, fps)
	}

	var fire = function() {
		if (timers['fire']) {
			return
		}
		window.game.fire();
		timers['fire'] = setInterval(function(){
			window.game.fire();
		}, fireFrequency)
	}
})(Asteroids);