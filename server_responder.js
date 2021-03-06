var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store

	var ServerResponder = global.ServerResponder = function (socket, io, gameID, sessions) {
		this.sockets = [socket];
		this.gameID = gameID;
		this.io = io;
		this.sessions = sessions;
		// this.game assigned in server_game.js;
	}

	ServerResponder.prototype.sendAsteroid = function (asteroidOpts) {
		this.broadcast('addAsteroid', asteroidOpts);
	}

	ServerResponder.prototype.addBlackHole = function (bhOpts) {
		this.broadcast('addBlackHole', bhOpts);
	}

	ServerResponder.prototype.fireShip = function (socket, bulletOpts) {
		this.relay(socket, 'fireShip', bulletOpts);
	}

	ServerResponder.prototype.addShip = function (socket, shipOpts) {
		this.relay(socket, 'addShip', shipOpts);
	}

	ServerResponder.prototype.removeBullet = function (bulletOpts) {
		this.broadcast('removeBullet', bulletOpts);
	}

	ServerResponder.prototype.powerShip = function (socket, shipOpts) {
		this.relay(socket, 'powerForeignShip', shipOpts);
	}

	ServerResponder.prototype.turnShip = function (socket, turnOpts) {
		this.relay(socket, 'turnForeignShip', turnOpts);
	}

	ServerResponder.prototype.dampenShip = function (socket, dampenOpts) {
		this.relay(socket, 'dampenForeignShip', dampenOpts);
	}

	ServerResponder.prototype.levelUp = function() {
		this.broadcast('levelUp');
	}

	ServerResponder.prototype.explodeAsteroid = function (asteroidOpts) {
		this.broadcast('explodeAsteroid', asteroidOpts)
	}

	ServerResponder.prototype.pause = function (socket) {
		this.relay(socket, 'pause', {});
	}

	ServerResponder.prototype.sendFullState = function() {
		var fullStateArray = this.game.getFullState();
		var fullStateObject = { fullStateArray: fullStateArray }
		this.broadcast('fullState', fullStateObject);
	}

	ServerResponder.prototype.testSuccess = function() {
		this.broadcast('testSuccess');
	}

	ServerResponder.prototype.requestSessionsStatus = function() {
		this.broadcast('sessionsStatus', this.sessions.keys());
	}

	ServerResponder.prototype.hitShip = function (opts) {
		this.broadcast('foreignHitShip', opts);
	}

	ServerResponder.prototype.handleDestroyedShip = function (shipIDOpt) {
		this.broadcast('destroyedShip', shipIDOpt);
	}

	ServerResponder.prototype.growBlackHole = function (amtOpts) {
		this.broadcast('growBlackHole', amtOpts);
	}


	// private (esque)
	ServerResponder.prototype.broadcast = function (event, object) {
		this.io.sockets.in(this.gameID).emit(event, object);
	}

	ServerResponder.prototype.relay = function (socket, event, object) {
		socket.broadcast.to(this.gameID).emit(event, object);
	}
})(Asteroids)